import { g2r, globToRegex } from "./g2r";
import { runLogger } from "../../monad";

test("g2r", () => {
  expect(runLogger(g2r(""))).toEqual(["^$", []]);
  expect(runLogger(g2r("abc"))).toEqual(["^abc$", []]);

  expect(runLogger(g2r("?"))).toEqual(["^.$", ["any"]]);
  expect(runLogger(g2r("a?"))).toEqual(["^a.$", ["any"]]);
  expect(runLogger(g2r("a?b"))).toEqual(["^a.b$", ["any"]]);

  expect(runLogger(g2r("*"))).toEqual(["^.*$", ["kleene start"]]);
  expect(runLogger(g2r("?*"))).toEqual(["^..*$", ["any", "kleene start"]]);

  expect(() => runLogger(g2r("["))).toThrowError(/unterminated/);

  expect(runLogger(g2r("[abc]"))).toEqual(["^[abc]$", ["character class"]]);
  expect(runLogger(g2r("0[abc]1"))).toEqual(["^0[abc]1$", ["character class"]]);

  expect(runLogger(g2r("[!abc]"))).toEqual([
    "^[^abc]$",
    ["character class, negative"]
  ]);
  expect(runLogger(g2r("0[!abc]1"))).toEqual([
    "^0[^abc]1$",
    ["character class, negative"]
  ]);

  expect(runLogger(g2r("a(bc)"))).toEqual([
    "^a\\(bc\\)$",
    ["escape", "escape"]
  ]);

  expect(globToRegex("f??.c").test("foo.c")).toEqual(true);
  expect(globToRegex("f??.cpp").test("foo.c")).toEqual(false);
  expect(globToRegex("t[ea]s*").test("test.c")).toEqual(true);
  expect(globToRegex("t[ea]s*").test("taste.txt")).toEqual(true);
});
