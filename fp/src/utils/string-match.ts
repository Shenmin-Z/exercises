let pRegex1 = /^(\w+|'.*'|".*")$/;
let pRegex2 = /^(\w+|'.+'|".+")(:(\w+|'.+'|".+"))+$/;

let isS = (s: string) => /^('.*'|".*")$/.test(s);
let isA = (s: string) => !isS(s);

export const NO_MATCH = Symbol();

export let smatch = <T extends unknown>(
  s: string,
  pattern: string,
  fn: (...ms: string[]) => T
): T | symbol => {
  // Condition 1:
  if (pRegex1.test(pattern)) {
    if (isS(pattern)) {
      if (s === pattern.substring(1, pattern.length - 1)) {
        return fn();
      } else {
        return NO_MATCH;
      }
    } else {
      return fn(s);
    }
  }

  // Condition 2:
  if (!pRegex2.test(pattern)) throw new Error("Invalid pattern.");

  let ps = pattern.split(":");

  if (ps.filter(isA).length !== fn.length)
    throw new Error("Callback does not match pattern.");

  let pointer = 0;
  let args = [];
  for (let i = 0; i < ps.length; i++) {
    let current = ps[i];
    if (isS(current)) {
      let sToMatch = current.substring(1, current.length - 1);
      if (pointer + sToMatch.length > s.length) return NO_MATCH;
      if (s.substring(pointer, pointer + sToMatch.length) === sToMatch) {
        pointer += sToMatch.length;
        continue;
      } else return NO_MATCH;
    } else {
      // last one
      if (i === ps.length - 1) {
        if (pointer >= s.length) {
          args.push("");
        } else {
          args.push(s.substring(pointer));
        }
      } else {
        if (pointer >= s.length) return NO_MATCH;
        args.push(s.charAt(pointer));
        pointer++;
      }
    }
  }
  return fn(...args);
};
