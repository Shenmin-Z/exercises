import { Monad } from "../monad";

type InternalType = "Just" | "Nothing";

export class Maybe<T extends unknown> extends Monad<T> {
  constructor(type: "Just", data: T);
  constructor(type: "Nothing");
  constructor(private type: InternalType, private data?: T) {
    super();
  }

  chain<U>(fn: (a: T) => Maybe<U>): Maybe<U> {
    if (this.type === "Just") {
      return fn(this.data as T);
    } else {
      return this as Maybe<U>;
    }
  }

  seq<B>(b: Maybe<B>): Maybe<B> {
    if (this.type === "Just") {
      return b;
    } else {
      return this as Maybe<B>;
    }
  }

  of<U>(d: U) {
    return new Maybe<U>("Just", d);
  }

  maybe<U>(def: U, f: (a: T) => U): U {
    if (this.type === "Just") {
      return f(this.data as T);
    } else {
      return def;
    }
  }
}
