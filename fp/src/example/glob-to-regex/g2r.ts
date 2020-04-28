import { Logger, record, ofLogger, liftM, liftM2 } from "../../monad";
import { smatch, NO_MATCH, runUntil } from "../../utils";

export let g2r = (s: string): Logger<string> =>
  _g2r(s).chain(ds => ofLogger("^" + ds));

let _g2r = (s: string): Logger<string> =>
  runUntil(
    [
      () => smatch(s, `''`, () => ofLogger("$")),
      () =>
        smatch(s, `'?'`, cs =>
          record("any").seq(_g2r(cs).chain(ds => ofLogger("." + ds)))
        ),
      () =>
        smatch(s, `'*'`, cs =>
          record("kleene start").seq(_g2r(cs).chain(ds => ofLogger(".*" + ds)))
        ),
      () =>
        smatch(s, `'[!':c:cs`, (c, cs) =>
          record("character class, negative").seq(
            charClass(cs).chain(ds => ofLogger("[^" + c + ds))
          )
        ),
      () =>
        smatch(s, `'[':c:cs`, (c, cs) =>
          record("character class").seq(
            charClass(cs).chain(ds => ofLogger("[" + c + ds))
          )
        ),
      () =>
        smatch(s, `'['`, _ => {
          throw new Error("unterminated character class");
        }),
      () =>
        smatch(s, `c:cs`, (c, cs) =>
          liftM2((a: string) => (b: string) => a + b)(escape(c))(_g2r(cs))
        )
    ],
    r => r !== NO_MATCH
  ) as Logger<string>;

let charClass = (s: string): Logger<string> =>
  runUntil(
    [
      () => smatch(s, `']':cs`, cs => liftM((s: string) => "]" + s)(_g2r(cs))),
      () => smatch(s, `c:cs`, (c, cs) => liftM((s: string) => c + s)(_g2r(cs)))
    ],
    r => r !== NO_MATCH
  ) as Logger<string>;

let escape = (c: string): Logger<string> =>
  "\\+()^$.{}]|".includes(c)
    ? record("escape").seq(ofLogger("\\" + c))
    : ofLogger(c);
