import { isNUMBER, isSTRING } from "./isXX";

type TokenType =
  | "string"
  | "number"
  | "true"
  | "false"
  | "null"
  | "curly-left"
  | "curly-right"
  | "bracket-left"
  | "bracket-right"
  | "comma"
  | "colon";

export type Token = {
  type: TokenType;
  content?: string;
};

export let tokenize = (input: string): Token[] => {
  let result: Token[] = [];
  let pointer = 0;

  let match = (
    pattern: string,
    type: TokenType,
    getContent = false
  ) => (): Token | null => {
    let regex = RegExp(`^[\\t\\r\\n\\s]*(${pattern})`, "u");
    if (regex.test(input.substring(pointer))) {
      let [whole, content] = regex.exec(
        input.substring(pointer)
      ) as RegExpExecArray;
      if (content === undefined) {
        throw new Error(`Failed to match ${type}`);
      }
      pointer += whole.length;
      if (getContent) {
        if (type === "string") {
          return {
            type,
            content: content.substring(1, content.length - 1) // remove ""
          };
        } else {
          return { type, content };
        }
      } else {
        return { type };
      }
    } else {
      return null;
    }
  };

  let matches = [
    match("true", "true"),
    match("false", "false"),
    match("null", "null"),
    match("\\{", "curly-left"),
    match("\\}", "curly-right"),
    match("\\[", "bracket-left"),
    match("\\]", "bracket-right"),
    match(",", "comma"),
    match(":", "colon"),
    match(isNUMBER, "number", true),
    match(isSTRING, "string", true)
  ];

  while (pointer < input.length) {
    let tmp: Token | null = null;
    for (let m of matches) {
      let res = m();
      if (res !== null) {
        tmp = res;
        break;
      }
    }
    if (tmp === null) {
      throw new Error(`Invalid input at index: ${pointer}`);
    } else {
      result.push(tmp);
    }
  }

  return result;
};
