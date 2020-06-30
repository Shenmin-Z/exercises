import { deepStrictEqual } from "assert";

let quickSortFunctional = (nums: number[]): number[] => {
  if (nums.length <= 1) return nums;
  let pivot = nums[0];
  let rest = nums.slice(1);
  return [
    ...quickSortFunctional(rest.filter(i => i < pivot)),
    pivot,
    ...quickSortFunctional(rest.filter(i => i >= pivot))
  ];
};

let swap = (nums: number[], a: number, b: number) => {
  let tmp = nums[a];
  nums[a] = nums[b];
  nums[b] = tmp;
};

let quickSortInPlace = (nums: number[]) => {
  // Not including end
  let qs = (start: number, end: number) => {
    if (end - start <= 1) return;
    let pivot = nums[start];
    let left = start + 1,
      right = end - 1;
    while (left < right) {
      while (nums[left] <= pivot && left < right) {
        left++;
      }
      while (nums[right] >= pivot && right > left) {
        right--;
      }
      if (left < right) {
        swap(nums, left, right);
        right--;
        left++;
      }
    }
    let pos = nums[right] > pivot ? right - 1 : right;
    swap(nums, start, pos);
    qs(start, pos);
    qs(pos + 1, end);
  };
  qs(0, nums.length);
};

// Merge Sort requires O(n) space!
let mergeSort = (nums: number[]): number[] => {
  let merge = (na: number[], nb: number[]): number[] => {
    let tmp: number[] = [];
    while (na.length > 0 && nb.length > 0) {
      if (na[0] > nb[0]) {
        tmp.push(nb.shift() as number);
      } else {
        tmp.push(na.shift() as number);
      }
    }
    tmp = tmp.concat(na);
    tmp = tmp.concat(nb);
    return tmp;
  };
  if (nums.length <= 1) return nums;
  let mid = Math.floor(nums.length / 2);
  return merge(mergeSort(nums.slice(0, mid)), mergeSort(nums.slice(mid)));
};

let gen = (len = 100) => {
  let tmp = [];
  for (let i = 0; i < len; i++) {
    tmp.push(Math.floor(Math.random() * 100));
  }
  return tmp;
};

let ran1 = gen();
deepStrictEqual(
  quickSortFunctional(ran1),
  ran1.sort((a, b) => a - b)
);

let ran2 = gen(100);
let ran22 = [...ran2];
let ran222 = [...ran2];
quickSortInPlace(ran22);
ran222.sort((a, b) => a - b);
deepStrictEqual(ran22, ran222);

let ran3 = gen();
deepStrictEqual(
  mergeSort(ran3),
  ran3.sort((a, b) => a - b)
);
