import { MyPromise } from "./MyPromise";

console.log("start");

new MyPromise(res => {
  console.log("this should be between start and end");
  res(999);
}).then(x => {
  console.log(x);
});

new MyPromise(res => {
  setTimeout(() => {
    res("print last");
  }, 0);
}).then(x => {
  console.log(x);
});

new MyPromise((_, rej) => {
  rej("rejected");
}).then(
  _ => {},
  x => {
    console.log(x);
  }
);

MyPromise.resolve(1)
  .then(x => {
    console.log(x);
    return 2;
  })
  .then(x => {
    console.log(x);
    return { aaa: 123 };
  });

console.log("end");
