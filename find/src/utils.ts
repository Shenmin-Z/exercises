export class Just<T> {
  constructor(public content: T) {}
}
export class Nothing {}
export type Maybe<T> = Just<T> | Nothing;

export function MaybeTernary<A, B, C>(
  m: Maybe<C>,
  isNothing: A,
  isJust: (a: C) => B,
): A | B {
  if (m instanceof Nothing) return isNothing;
  else return isJust(m.content);
}
