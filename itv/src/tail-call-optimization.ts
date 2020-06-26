let guard = (n: number) => {
  if (parseInt(n + "") !== n) throw new Error("input has to be integer");
  if (n < 1) throw new Error("has to be greater than 1");
};

export let factorial = (n: number): number => {
  guard(n);
  if (n === 1) return 1;
  return n * factorial(n - 1);
};

export let TCO_factorial = (n: number): number => {
  guard(n);
  let _factorial = (n: number, reduce: number): number => {
    if (n === 0) return reduce;
    return _factorial(n - 1, n * reduce);
  };
  return _factorial(n - 1, n);
};

export let async_factorial = (
  n: number,
  cb: (error: any, a: number | null) => void
) => {
  let _async_factorial = (
    n: number,
    _cb: (error: any, a: number | null) => void
  ) => {
    guard(n);
    if (n === 1) {
      _cb(null, 1);
    } else {
      process.nextTick(() => {
        _async_factorial(n - 1, res => {
          try {
            _cb(null, n * res);
          } catch (e) {
            process.nextTick(() => {
              cb(e, null);
            });
          }
        });
      });
    }
  };
  return _async_factorial(n, cb);
};

export let TCO_async_factorial = (n: number, cb: (a: number) => void) => {
  guard(n);
  let _factorial = (n: number, reduce: number) => {
    if (n === 0) {
      cb(reduce);
    } else {
      process.nextTick(() => {
        _factorial(n - 1, n * reduce);
      });
    }
  };

  _factorial(n - 1, n);
};
