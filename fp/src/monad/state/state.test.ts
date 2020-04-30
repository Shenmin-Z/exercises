import { State, ofState, get, put } from "./state";

type Stack = number[];
type StackState = State<Stack, number | null>;

let stackEqual = (a: Stack, b: Stack) =>
  a.length === b.length && a.every((i, idx) => i === b[idx]);

let pop: StackState = ofState(xs => [xs[0], xs.slice(1)]);
let push: (a: number) => StackState = a => ofState(xs => [null, [a, ...xs]]);

let stackManip = push(3).bind(_ => pop.bind(_ => pop));

let stackyStack: State<any, Stack> = (get as State<any, Stack>).bind(stackNow =>
  stackEqual(stackNow, [1, 2, 3]) ? put([8, 3, 1]) : put([9, 2, 1])
);

test("state", () => {
  expect(stackManip.runState([5, 8, 2, 1])).toEqual([5, [8, 2, 1]]);
  expect(stackyStack.runState([1, 2, 3])).toEqual([null, [8, 3, 1]]);
  expect(stackyStack.runState([2, 3])).toEqual([null, [9, 2, 1]]);
});
