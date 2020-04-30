export abstract class Monad<A> {
  abstract bind<B>(f: (a: A) => Monad<B>): Monad<B>;
  seq<B>(b: Monad<B>): Monad<B> {
    return seq<A, B>(this)(b);
  }
  abstract of<B>(b: B): Monad<B>;
}

export type Bind = {
  <A, B>(a: Monad<A>): (f: (a: A) => Monad<B>) => Monad<B>;
};

export let bind: Bind = a => f => a.bind(f);

// >>=
export type Seq = {
  <A, B>(a: Monad<A>): (b: Monad<B>) => Monad<B>;
};

// >>
export let seq: Seq = <A, B>(a: Monad<A>) => (b: Monad<B>) =>
  bind(a)(_ => b) as Monad<B>;

// return
export type Of = {
  <A>(a: A): Monad<A>;
};

export let liftM = <A, B>(f: (a: A) => B) => (a: Monad<A>) =>
  a.bind(i => a.of(f(i)));

export let liftM2 = <A, B, C>(f: (a: A) => (b: B) => C) => (a: Monad<A>) => (
  b: Monad<B>
) => a.bind(i => b.bind(j => a.of(f(i)(j))));
