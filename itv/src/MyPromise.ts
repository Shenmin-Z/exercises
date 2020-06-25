export class MyPromise<T, U = any> {
  onResolve: ((a: T) => any) | null;
  onReject: ((a: U) => any) | null;

  constructor(fn: (res: (a: T) => void, rej: (e: U) => void) => void) {
    this.onResolve = null;
    this.onReject = null;
    fn(
      resolved => {
        process.nextTick(() => {
          if (this.onResolve !== null) {
            this.onResolve(resolved);
          }
        });
      },
      rejected => {
        process.nextTick(() => {
          if (this.onReject !== null) {
            this.onReject(rejected);
          }
        });
      }
    );
  }

  then<V, W = any>(
    onResolve: (a: T) => V,
    onReject?: (a: U) => W
  ): MyPromise<V, W> {
    return new MyPromise((res, rej) => {
      this.onResolve = a => {
        res(onResolve(a));
      };
      this.onReject = a => {
        if (onReject) {
          rej(onReject(a));
        }
      };
    });
  }

  static resolve<X>(x: X) {
    return new MyPromise(res => {
      res(x);
    });
  }
}
