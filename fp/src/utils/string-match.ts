let pRegex = /^(\w+|'.+'|".+")(:(\w+|'.+'|".+"))+$/;

let isS = (s: string) => /'.+'|".+"/.test(s);
let isA = (s: string) => !isS(s);

export let smatch = (
  s: string,
  pattern: string,
  fn: (...ms: string[]) => unknown
) => {
  if (!pRegex.test(pattern)) throw new Error("Invalid pattern.");

  let ps = pattern.split(":");

  if (ps.filter(isA).length !== fn.length)
    throw new Error("Callback does not match pattern.");

  let pointer = 0;
  let args = [];
  for (let i = 0; i < ps.length; i++) {
    let current = ps[i];
    if (isS(current)) {
      let sToMatch = current.substring(1, current.length - 1);
      if (pointer + sToMatch.length > s.length) return;
      if (s.substring(pointer, pointer + sToMatch.length) === sToMatch) {
        pointer += sToMatch.length;
        continue;
      } else return;
    } else {
      // last one
      if (i === ps.length - 1) {
        if (pointer >= s.length) {
          args.push("");
        } else {
          args.push(s.substring(pointer));
        }
      } else {
        if (pointer >= s.length) return;
        args.push(s.charAt(pointer));
        pointer++;
      }
    }
  }
  fn(...args);
};
