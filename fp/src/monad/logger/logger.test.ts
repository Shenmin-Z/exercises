import { Logger, runLogger } from "./logger";

test("logger", () => {
  let simple = Logger.of(true);
  expect(runLogger(simple)).toEqual([true, []]);

  expect(runLogger(Logger.record("hi mom!").seq(Logger.of(3.1337)))).toEqual([
    3.1337,
    ["hi mom!"]
  ]);
});
