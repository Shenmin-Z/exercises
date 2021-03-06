const ignore = (c: string) => c === "\r" || c === "\n";
const ignore2 = (c: string) => c === "\r" || c === "\n" || c === " ";
const ignore3 = (c: string) => {
  let i = 0,
    j = c.length - 1;
  while (ignore2(c.charAt(i))) i++;
  while (ignore2(c.charAt(j))) j--;
  if (i > j) return "";
  return c.substring(i, j + 1);
};

// Not real compiler token : (
// O(n)
export function toTokens(raw: string): string[] {
  let insideTag = false,
    buf = "";
  const res = [];
  for (let i = 0; i < raw.length; i++) {
    const c = raw.charAt(i);
    if (c === "<") {
      buf = ignore3(buf);
      if (buf) res.push(buf);
      buf = "";
      insideTag = true;
    } else if (c === ">") {
      res.push(`<${ignore3(buf)}>`);
      buf = "";
      insideTag = false;
    } else if (insideTag) {
      if (ignore(c)) continue;
      if (c === " " && buf.endsWith(" ")) continue;
      if (c === " " && buf === "") continue;
      buf += c;
    } else {
      buf += c;
      if (i === raw.length - 1) {
        buf = ignore3(buf);
        if (buf) res.push(buf);
      }
    }
  }
  return res;
}

interface ITag {
  type: "left" | "right" | "selfClosing";
  name: string;
  attributes?: {
    [attr: string]: string | boolean | number;
  };
}

const digits = /^\d+$/;
const alpha_dash_num = /^[a-zA-Z\-\d]+$/;

export function toTag(raw: string): ITag {
  if (raw.charAt(0) !== "<" || raw.charAt(raw.length - 1) !== ">") {
    error(`Malformed tag! ${raw}`);
  }

  const tmp = raw
    .substring(1, raw.length - 1)
    .split(" ")
    .filter(Boolean);

  if (tmp.length === 0) {
    error(`Empty tag! ${raw}`);
  }

  const res = {
    get name() {
      return this._name;
    },
    set name(n: string) {
      if (!alpha_dash_num.test(n)) {
        error("Invalid name: " + n);
      }
      this._name = n;
    },
  } as ITag;
  Object.defineProperty(res, "_name", { enumerable: false, writable: true });

  if (tmp[0].startsWith("/")) {
    res.type = "right";
    res.name = tmp[0].substring(1);
    return res;
  } else if (tmp[tmp.length - 1] === "/") {
    res.type = "selfClosing";
    tmp.pop();
  } else {
    res.type = "left";
  }

  tmp.forEach((s, i) => {
    if (i === 0) {
      res.name = s;
    } else {
      if (s.includes("=")) {
        let key: string, value: string | number;
        [key, value] = s.split("=");
        if (value.startsWith('"') && value.endsWith('"')) {
          value = value.substring(1, value.length - 1);
        }
        if (value.startsWith("'") && value.endsWith("'")) {
          value = value.substring(1, value.length - 1);
        }
        if (digits.test(value)) {
          value = parseInt(value);
        }
        if (!res.attributes) {
          res.attributes = { [key]: value };
        } else {
          res.attributes[key] = value;
        }
      } else {
        if (!res.attributes) {
          res.attributes = { [s]: true };
        } else {
          res.attributes[s] = true;
        }
      }
    }
  });

  return res;
}

interface INode {
  name: string | symbol;
  attributes?: {
    [attr: string]: string | boolean | number;
  };
  children?: (INode | string)[];
}

export function parseHtml(raw: string): (INode | string)[] {
  const tags = toTokens(raw).map(i => (i.startsWith("<") ? toTag(i) : i));
  let stack: (INode | ITag | string)[] = [];
  let openingTagCount = 0;
  for (let tag of tags) {
    if (typeof tag === "string") {
      stack.push(tag);
    } else if (tag.type === "left") {
      stack.push(tag);
      openingTagCount++;
    } else if (tag.type === "selfClosing") {
      stack.push({
        name: tag.name,
        attributes: tag.attributes,
      });
    } else if (tag.type === "right") {
      let lastTagIndex = stack.length - 1;
      while (lastTagIndex >= 0 && !stack[lastTagIndex]["type"]) lastTagIndex--;
      if (lastTagIndex < 0) error(`No matching opening tag for: ${tag.name}`);
      const newStack = stack.slice(0, lastTagIndex);
      const prevTag = stack[lastTagIndex] as ITag;
      if (prevTag.name !== tag.name)
        error(
          `Mismatch tag: ` +
            `opening tag => ${prevTag.name}, closing tag => ${tag.name}`,
        );
      const children = stack.slice(lastTagIndex + 1);
      const node = {
        name: prevTag.name,
        attributes: prevTag.attributes,
        children,
      };
      newStack.push(node);
      stack = newStack;
      openingTagCount--;
    }
  }
  if (openingTagCount > 0) error("Invalid html, tag(s) not closed");
  return stack;
}

function error(msg: string) {
  const errorMsg = msg || "Invalid html!";
  throw new Error(errorMsg);
}
