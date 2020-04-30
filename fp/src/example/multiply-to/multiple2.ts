import { List, createList, ofList } from "../../monad";
import { range } from "../../utils";

type Guarded = {
  <T>(c: boolean): (xs: List<T>) => List<T>;
};

let guarded: Guarded = c => xs => (c ? xs : ofList());

type Pair = [number, number];

export let multiple2 = (target: number): Pair[] => {
  let ls = (start: number) => createList(range(start, target));

  return ls(1)
    .bind(x =>
      ls(x).bind(y => guarded(x * y === target)(ofList([x, y])) as List<Pair>)
    )
    .exec();
};
