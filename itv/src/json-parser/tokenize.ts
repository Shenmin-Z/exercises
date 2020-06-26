import { isNUMBER, isSTRING } from "./isXX";

type Token =
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

let tokenize = (input: string): { type: Token; content?: string }[] => {
  let result: { type: Token; content?: string }[] = [];
  let _tokenize = (_input: string): void => {
    console.log("input", _input);
    let trimmed = _input.replace(
      /^[\t\r\n\s]*([^\t\r\n\s].*[^\t\r\n\s])[\t\r\n\s]*$/g,
      (_, p) => p
    );
    console.log("trimmed", trimmed);
    if (trimmed === "") return;
    let skip = false;
    let match = (pattern: string, type: Token) => {
      if (new RegExp(`^${pattern}`).test(trimmed)) {
        result.push({ type });
        console.log(pattern);
        _tokenize(trimmed.replace(new RegExp(`^${pattern}(.*)`), (_, p) => p));
        skip = true;
      }
    };
    match("true", "true");
    if (skip) return;
    match("false", "false");
    if (skip) return;
    match("null", "null");
    if (skip) return;
    match("\\{", "curly-left");
    if (skip) return;
    match("\\}", "curly-right");
    if (skip) return;
    match("\\[", "bracket-left");
    if (skip) return;
    match("\\]", "bracket-right");
    if (skip) return;
    match(",", "comma");
    if (skip) return;
    match(":", "colon");
    if (skip) return;
  };
  _tokenize(input);
  return result;
};

let input = process.argv[2];
let aa = tokenize(input);
console.log(aa);
