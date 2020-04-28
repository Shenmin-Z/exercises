import { smatch } from "./string-match";

test("smatch: invalid", () => {
  expect(() => {
    smatch("", `'!':`, () => {});
  }).toThrowError("Invalid pattern.");

  expect(() => {
    smatch("", `'!':*`, () => {});
  }).toThrowError("Invalid pattern.");

  expect(() => {
    smatch("", `'!':cs`, () => {});
  }).toThrowError("Callback does not match pattern.");
});

test("smatch: valid", () => {
  let f1 = jest.fn(cs => {});
  smatch("", `'!':cs`, f1);
  expect(f1).toHaveBeenCalledTimes(0);

  let f2 = jest.fn(cs => {});
  smatch("!", `'!':cs`, f2);
  expect(f2).toBeCalledWith("");

  let f3 = jest.fn(cs => {});
  smatch("!test", `'!':cs`, f3);
  expect(f3).toBeCalledWith("test");

  let f4 = jest.fn(cs => {});
  smatch("*test", `'!':cs`, f4);
  expect(f4).toHaveBeenCalledTimes(0);
});

test("", () => {
  let fn = jest.fn(cs => {});
  smatch("!*abc", `'!':"*":cs`, fn);
  expect(fn).toBeCalledWith("abc");
});

test("", () => {
  let fn = jest.fn((c, cs) => {});
  smatch("!*abc", `'!':"*":c:cs`, fn);
  expect(fn).toBeCalledWith("a", "bc");
});

test("", () => {
  let fn = jest.fn((c, cs) => {});
  smatch("!a*bc", `'!':c:"*":cs`, fn);
  expect(fn).toBeCalledWith("a", "bc");
});

test("", () => {
  let fn = jest.fn((c, cs) => {});
  smatch("!a!bc", `'!':c:"*":cs`, fn);
  expect(fn).toHaveBeenCalledTimes(0);
});

test("", () => {
  let fn = jest.fn((a, b, c, cs) => {});
  smatch("!!abctest", `'!!':a:b:c:cs`, fn);
  expect(fn).toBeCalledWith("a", "b", "c", "test");
});

test("", () => {
  let fn = jest.fn((a, b, c, cs) => {});
  smatch("!!ab", `'!!':a:b:c:cs`, fn);
  expect(fn).toHaveBeenCalledTimes(0);
});

test("last is empty", () => {
  let fn = jest.fn((a, b, c) => {});
  smatch("ab", `a:b:c`, fn);
  expect(fn).toBeCalledWith("a", "b", "");
});

test("No colon 1", () => {
  let fn = jest.fn(() => {});
  smatch("ab", `''`, fn);
  expect(fn).toHaveBeenCalledTimes(0);
});

test("No colon 2", () => {
  let fn = jest.fn(() => {});
  smatch("", `''`, fn);
  expect(fn).toBeCalled();
});

test("No colon 3", () => {
  let fn = jest.fn(() => {});
  smatch("!!", `'!!'`, fn);
  expect(fn).toBeCalled();
});

test("No colon 4", () => {
  let fn = jest.fn(c => {});
  smatch("ab", `c`, fn);
  expect(fn).toBeCalledWith("ab");
});
