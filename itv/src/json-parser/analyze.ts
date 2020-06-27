import { Token } from "./tokenize";

type ContextType = "obj" | "arr" | "other";
type Context = {
  type: ContextType;
  value?: any;
  children?: {
    key?: string;
    value: Context | null;
  }[];
};

export let analyze = (tokens: Token[]): Context => {
  let rootContext = null;
  let pointer = 0;
  let setContext: (c: Context) => void = c => {
    rootContext = c;
  };

  let analyzeObj = (context: Context) => {
    let step = () => {
      let key = tokens?.[pointer];
      if (key?.type !== "string") {
        throw new Error(`Expected string, get ${key.content}`);
      }
      pointer++;
      if (tokens?.[pointer]?.type !== "colon") {
        throw new Error(`Expected :, get ${tokens[pointer].content}`);
      }
      pointer++;
      let newChild: { key?: string; value: Context | null } = {
        key: key.content,
        value: null
      };
      setContext = c => {
        newChild.value = c;
      };
      if (context.children === undefined) context.children = [];
      context.children.push(newChild);
      analyzeValue();
    };

    if (tokens[pointer]?.type === "curly-right") {
      pointer++;
      return;
    }

    step();

    while (tokens?.[pointer]?.type === "comma") {
      pointer++;
      step();
    }

    if (tokens?.[pointer]?.type !== "curly-right") {
      throw new Error(`Expected }, get ${tokens?.[pointer]?.type}`);
    }
    pointer++;
  };

  let analyzeArr = (context: Context) => {
    let step = () => {
      let newChild: { key?: string; value: Context | null } = {
        value: null
      };
      setContext = c => {
        newChild.value = c;
      };
      if (context.children === undefined) context.children = [];
      context.children.push(newChild);
      analyzeValue();
    };

    if (tokens[pointer]?.type === "bracket-right") {
      pointer++;
      return;
    }

    step();

    while (tokens?.[pointer]?.type === "comma") {
      pointer++;
      step();
    }

    if (tokens?.[pointer]?.type !== "bracket-right") {
      throw new Error(`Expected ], get ${tokens?.[pointer]?.type}`);
    }
    pointer++;
  };

  let analyzeValue = () => {
    let current = tokens[pointer];
    pointer++;
    if (current.type === "curly-left") {
      let newContext: Context = { type: "obj", children: [] };
      setContext(newContext);
      analyzeObj(newContext);
    } else if (current.type === "bracket-left") {
      let newContext: Context = { type: "arr", children: [] };
      setContext(newContext);
      analyzeArr(newContext);
    } else if (
      current.type === "null" ||
      current.type === "true" ||
      current.type === "false" ||
      current.type === "number" ||
      current.type === "string"
    ) {
      let value: any;
      switch (current.type) {
        case "null":
          value = null;
          break;
        case "true":
          value = true;
          break;
        case "false":
          value = false;
          break;
        default:
          value = current.content;
      }
      setContext({ type: "other", value });
    } else {
      throw new Error(`Unexpected token: ${current.type}`);
    }
  };

  analyzeValue();
  return (rootContext as unknown) as Context;
};

export let toJSON = (context: Context): any => {
  if (context.type === "other") return context.value;
  if (context.type === "obj") {
    let tmp: any = {};
    for (let c of context.children || []) {
      if (c.key === undefined || c.value === null) {
        throw new Error(`Context ${c} is invalid.`);
      } else {
        tmp[c.key] = toJSON(c.value);
      }
    }
    return tmp;
  }
  if (context.type === "arr") {
    return context.children?.map(i => toJSON(i.value as Context));
  }
};
