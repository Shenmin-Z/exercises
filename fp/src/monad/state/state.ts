import { Monad } from "../monad";

type RunState<S, A> = {
  (s: S): [A, S];
};

export class State<S, A> implements Monad<A> {
  private constructor(public runState: RunState<S, A>) {}

  bind<B>(k: (a: A) => State<S, B>) {
    return new State((s: S) => {
      let [a, _s] = this.runState(s);
      return k(a).runState(_s);
    });
  }

  of<_S, _A>(a: _A): State<_S, _A> {
    return new State(s => [a, s]);
  }

  static get = new State<any, any>(s => [s, s]);

  static put<S>(s: S): State<S, any> {
    return new State(_ => [null, s]);
  }
}

export let ofState = State.prototype.of;
export let get = State.get;
export let put = State.put;
