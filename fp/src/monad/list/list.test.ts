import { createList, ofList } from "./list";

test("List Monad", () => {
  let xs = createList([1, 2]);
  let ys = createList("bar");
  expect(xs.chain(x => ys.chain(y => ofList([x, y]))).exec()).toEqual([
    [1, "b"],
    [1, "a"],
    [1, "r"],
    [2, "b"],
    [2, "a"],
    [2, "r"]
  ]);
});
