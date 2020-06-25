import {
  factorial,
  TCO_factorial,
  async_factorial,
  TCO_async_factorial
} from "./tail-call-optimization";

const SMALL = 100;
const BIG = 100000;

//console.log(factorial(SMALL));
//console.log(TCO_factorial(SMALL));
//async_factorial(SMALL, res => {
//  console.log(res);
//});
//TCO_async_factorial(SMALL, res => {
//  console.log(res);
//});

try {
  factorial(BIG);
} catch (e) {
  console.log(e.name);
}

try {
  TCO_factorial(BIG);
} catch (e) {
  console.log(e.name);
}

async_factorial(BIG, res => {
  console.log(res);
});

TCO_async_factorial(BIG, res => {
  console.log(res);
});
