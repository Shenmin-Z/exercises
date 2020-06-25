let curry = (fn: Function) => {
  let args: any[] = [];
  let sub = (p1: any) => {
    args.push(p1);
    if (args.length === fn.length) {
      return fn.apply(null, args);
    } else {
      return sub;
    }
  };
  return sub;
};

let test1 = (a: number, b: number, c: number, d: number, e: number) => {
  return a + ((b - c) * d) / e;
};

console.log(test1(4, 3, 9, 5, 9));
console.log(curry(test1)(4)(3)(9)(5)(9));
