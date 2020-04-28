export let runUntil = <T>(
  fs: Array<() => T>,
  condition: (x: T) => Boolean
): T => {
  function* fg() {
    for (let f of fs) {
      yield f();
    }
  }

  for (let r of fg()) {
    if (condition(r)) {
      return r;
    } else {
      continue;
    }
  }

  throw new Error("runUntil failed: no condition was satisfied.");
};
