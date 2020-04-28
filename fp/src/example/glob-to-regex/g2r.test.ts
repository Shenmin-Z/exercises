import { g2r } from "./g2r";
import { runLogger } from "../../monad";

test("g2r", () => {
  expect(runLogger(g2r("abc"))).toEqual(["^abc$", []]);
});
