import { Token, TokenType } from "./tokenize";

type ContextType = "obj" | "arr" | "other";
type Context = {
  type: ContextType;
  value?: any;
  children: {
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

  let is = (type: TokenType) => {
    let res = tokens[pointer].type === type;
    if (res) pointer++;
    return res;
  };

  let take = (type: TokenType): Token["content"] => {
    if (tokens[pointer].type !== type) {
      throw new Error(`Expected ${type}, get ${tokens[pointer].type}`);
    }
    pointer++;
    return tokens[pointer - 1].content;
  };

  let createChild = (key?: string) => {
    let newChild: { key?: string; value: Context | null } = {
      key,
      value: null
    };
    setContext = c => {
      newChild.value = c;
    };
    return newChild;
  };

  let analyzeObj = (context: Context) => {
    let step = () => {
      let key = take("string");
      take("colon");
      context.children.push(createChild(key));
      analyzeValue();
    };

    if (is("curly-right")) {
      return;
    }

    step();

    while (is("comma")) {
      step();
    }

    take("curly-right");
  };

  let analyzeArr = (context: Context) => {
    let step = () => {
      context.children.push(createChild());
      analyzeValue();
    };

    if (is("bracket-right")) {
      return;
    }

    step();

    while (is("comma")) {
      step();
    }

    take("bracket-right");
  };

  let analyzeValue = () => {
    if (is("curly-left")) {
      let newContext: Context = { type: "obj", children: [] };
      setContext(newContext);
      analyzeObj(newContext);
    } else if (is("bracket-left")) {
      let newContext: Context = { type: "arr", children: [] };
      setContext(newContext);
      analyzeArr(newContext);
    } else if (
      is("null") ||
      is("true") ||
      is("false") ||
      is("number") ||
      is("string")
    ) {
      let value: any;
      switch (tokens[pointer - 1].type) {
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
          value = tokens[pointer - 1].content;
      }
      setContext({ type: "other", value, children: [] });
    } else {
      throw new Error(`Unexpected token: ${tokens[pointer].type}`);
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
