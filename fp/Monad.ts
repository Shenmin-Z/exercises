export type Monad<A> = {
  gge: <B>(f: (a: A) => Monad<B>) => Monad<B>;
};

export type GGE = {
  <A, B>(a: Monad<A>): (f: (a: A) => Monad<B>) => Monad<B>;
};

export let gge: GGE = a => f => a.gge(f);

export type GG = {
  <A, B>(a: Monad<A>): (b: Monad<B>) => Monad<B>;
};

export let gg: GG = <A, B>(a: Monad<A>) => (b: Monad<B>) =>
  gge(a)(_ => b) as Monad<B>;

// return
export type Inject = {
  <A>(a: A): Monad<A>;
};
