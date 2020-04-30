type RunState<S, A> = {
  (s: S): [A, S];
};

// Tried to extend Monad but Typescript won't let me :(
export class State<S, A> {
  private constructor(public runState: RunState<S, A>) {}

  bind<B>(k: (a: A) => State<S, B>) {
    return new State((s: S) => {
      let [a, _s] = this.runState(s);
      return k(a).runState(_s);
    });
  }

  static of<_S, _A>(rs: RunState<_S, _A>): State<_S, _A> {
    return new State(rs);
  }

  static get = new State<any, any>(s => [s, s]);

  static put<S>(s: S): State<S, any> {
    return new State(_ => [null, s]);
  }
}

export let ofState = State.of;
export let get = State.get;
export let put = State.put;
