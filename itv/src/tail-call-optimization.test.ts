import {
  factorial,
  TCO_factorial,
  async_factorial,
  TCO_async_factorial
} from "./tail-call-optimization";

const BIG = 100000;

try {
  factorial(BIG);
} catch (e) {
  console.log(e);
}

try {
  TCO_factorial(BIG);
} catch (e) {
  console.log(e);
}

// this is put before async_factorial
// as async_factorial would emit exception
// which cannot be caught by try catch
// (because it's async)
TCO_async_factorial(BIG, res => {
  console.log(res);
});

async_factorial(BIG, res => {
  console.log(res);
});
