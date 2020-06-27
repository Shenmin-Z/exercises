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

  let _tokenize = (_input: string): void => {
    let trimmed = _input.replace(
      /^[\t\r\n\s]*([^\t\r\n\s]|([^\t\r\n\s].*[^\t\r\n\s]))[\t\r\n\s]*$/g,
      (_, p) => p
    );

    if (trimmed === "") return;

    let match = (pattern: string, type: TokenType, getContent = false) => {
      if (RegExp(`^${pattern}`, "u").test(trimmed)) {
        let content = RegExp(`^${pattern}`, "u").exec(trimmed)?.[0];
        if (content === undefined) {
          throw new Error(`Failed to match ${type}`);
        }
        if (getContent) {
          if (type === "string") {
            result.push({
              type,
              content: content.substring(1, content.length - 1) // remove ""
            });
          } else {
            result.push({ type, content });
          }
        } else {
          result.push({ type });
        }
        _tokenize(trimmed.substring(content.length || 1));
        return true;
      } else {
        return false;
      }
    };

    function* matches() {
      yield match("true", "true");
      yield match("false", "false");
      yield match("null", "null");
      yield match("\\{", "curly-left");
      yield match("\\}", "curly-right");
      yield match("\\[", "bracket-left");
      yield match("\\]", "bracket-right");
      yield match(",", "comma");
      yield match(":", "colon");
      yield match(isNUMBER, "number", true);
      yield match(isSTRING, "string", true);
      throw new Error(`Invalid token at ${_input}`);
    }
    for (let m of matches()) {
      if (m) return;
    }
  };

  _tokenize(input);
  return result;
};
