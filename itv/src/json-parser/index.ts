import { tokenize } from "./tokenize";
import { analyze, toJSON } from "./analyze";

export let JSONParse = (s: string) => {
  let tokens = tokenize(s);
  let context = analyze(tokens);
  let json = toJSON(context);
  return json;
};

let tests = [
  "aaa",
  true,
  false,
  null,
  ["bb", 888],
  [[[[[[[[[{ a: { a: { a: { a: { a: {} } } } } }]]]]]]]]],
  {},
  { a: [] },
  {
    a: 123,
    b: [
      true,
      {
        b0: { b1: { b2: { b3: [null, ["haha"]] } }, c: [[{}], 233, { o: {} }] }
      }
    ]
  }
];

tests.forEach(i => {
  let test = JSON.stringify(i, null, 2);
  console.log(JSON.stringify(JSONParse(test), null, 2));
});
