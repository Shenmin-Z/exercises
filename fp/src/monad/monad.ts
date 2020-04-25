export abstract class Monad<A> {
  abstract chain<B>(f: (a: A) => Monad<B>): Monad<B>;
  seq<B>(b: Monad<B>): Monad<B> {
    return seq<A, B>(this)(b);
  }
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
