import { Logger, runLogger, ofLogger } from "./logger";

test("logger", () => {
  let simple = ofLogger(true);
  expect(runLogger(simple)).toEqual([true, []]);

  expect(runLogger(Logger.record("hi mom!").seq(ofLogger(3.1337)))).toEqual([
    3.1337,
    ["hi mom!"]
  ]);
});
