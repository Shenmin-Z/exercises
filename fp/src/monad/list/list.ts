import { Monad } from "../monad";

export class List<T> extends Monad<T> {
  private data: T[];

  private constructor(data: T[]) {
    super();
    this.data = data;
  }

  bind<U>(fn: (a: T) => List<U>): List<U> {
    let tmp: U[] = [];
    for (let i of this.data.map(fn)) {
      tmp = tmp.concat(i.data);
    }
    return new List(tmp);
  }

  seq<B>(b: List<B>): List<B> {
    return super.seq(b) as List<B>;
  }

  exec() {
    return this.data;
  }

  of<U>(d?: U): List<U> {
    return new List<U>(d === undefined ? [] : [d]);
  }

  ofAdapted(d: string): List<string>;
  ofAdapted<U>(d: U[]): List<U>;
  ofAdapted<U>(d: U[] | string): List<U | string> {
    if (typeof d === "string") {
      return new List<string>(Array.from(d));
    } else {
      return new List<U>(d);
    }
  }
}

export let ofList = List.prototype.of;
export let createList = List.prototype.ofAdapted;
