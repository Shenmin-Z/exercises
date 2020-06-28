import { isNUMBER, isSTRING, isWS } from "./isXX";

export type TokenType =
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
  content: string;
};

export let tokenize = (input: string): Token[] => {
  let result: Token[] = [];
  let pointer = 0;

  let match = (regexString: string, type: TokenType) => (): Token | null => {
    let regex = RegExp(`^${isWS}*(${regexString})`, "u");
    if (regex.test(input.substring(pointer))) {
      let [whole, content] = regex.exec(
        input.substring(pointer)
      ) as RegExpExecArray;
      if (content === undefined) {
        throw new Error(`Failed to match ${type}`);
      }
      pointer += whole.length;
      if (type === "string") {
        // remove wrapping ""
        content = content.substring(1, content.length - 1);
      }
      return { type, content };
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
    match(isNUMBER, "number"),
    match(isSTRING, "string")
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
