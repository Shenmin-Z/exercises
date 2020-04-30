export let range = (start: number, end: number): number[] => {
  let tmp = [];
  for (let i = start; i <= end; i++) {
    tmp.push(i);
  }

  return tmp;
};
