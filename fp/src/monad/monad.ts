export abstract class Monad<A> {
  abstract chain<B>(f: (a: A) => Monad<B>): Monad<B>;
  seq<B>(b: Monad<B>): Monad<B> {
    return seq<A, B>(this)(b);
  }
  abstract of<B>(b: B): Monad<B>;
}

export type Chain = {
  <A, B>(a: Monad<A>): (f: (a: A) => Monad<B>) => Monad<B>;
};

export let chain: Chain = a => f => a.chain(f);

// >>=
export type Seq = {
  <A, B>(a: Monad<A>): (b: Monad<B>) => Monad<B>;
};

// >>
export let seq: Seq = <A, B>(a: Monad<A>) => (b: Monad<B>) =>
  chain(a)(_ => b) as Monad<B>;

// return
export type Of = {
  <A>(a: A): Monad<A>;
};

export let liftM = <A, B>(f: (a: A) => B) => (a: Monad<A>) =>
  a.chain(i => a.of(f(i)));

export let liftM2 = <A, B, C>(f: (a: A) => (b: B) => C) => (a: Monad<A>) => (
  b: Monad<B>
) => a.chain(i => b.chain(j => a.of(f(i)(j))));
