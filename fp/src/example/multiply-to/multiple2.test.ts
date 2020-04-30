import { multiple2 } from "./multiple2";

test("multiple2", () => {
  expect(multiple2(8)).toEqual([
    [1, 8],
    [2, 4]
  ]);
  expect(multiple2(100)).toEqual([
    [1, 100],
    [2, 50],
    [4, 25],
    [5, 20],
    [10, 10]
  ]);
  expect(multiple2(891)).toEqual([
    [1, 891],
    [3, 297],
    [9, 99],
    [11, 81],
    [27, 33]
  ]);
});
