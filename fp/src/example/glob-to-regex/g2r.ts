import { Logger, record, ofLogger } from "../../monad";

//export let g2r = (s: string) => _g2r(s).chain(ds => ofLogger("^" + ds));

//let _g2r = (s: string): Logger<string> => {
//  if (s === "") return ofLogger("$");

//  let head = s[0];
//  let tail = s.slice(1);

//  if (head === "?") {
//    return record("any").seq(_g2r(tail).chain(ds => ofLogger("." + ds)));
//  }
//  if (head === "*") {
//    return record("kleene start").seq(
//      _g2r(tail).chain(ds => ofLogger(".*" + ds))
//    );
//  }
//  if (head === "[") {
//    if (tail === "") throw new Error("unterminated character class");
//    if (tail[0] === "!" && tail.length >= 2) {
//      return record("character class, negative").seq(
//        charClass(tail.slice(2)).chain(ds => ofLogger("[^" + tail[1] + ds))
//      );
//    }
//    return record("character class").seq(
//      charClass(tail.slice(1)).chain(ds => ofLogger("[" + tail[0] + ds))
//    );
//  }
//};

//let charClass = (s: string): Logger<string> => {

//};
