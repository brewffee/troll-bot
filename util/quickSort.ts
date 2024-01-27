// THANKS SIRH FOR ALL CODE BELOW
// https://github.com/OfficialSirH

import { Snowflake } from 'discord.js';

// QUICK SORT ALGORITHM BELOW
export const quickSort = (list: [Snowflake, number][], left: number, right: number) => {
  let index: number;
  if (list.length > 1) {
    index = partition(list, left, right); //index returned from partition
    if (left < index - 1) { //more elements on the left side of the pivot
      quickSort(list, left, index - 1);
    }
    if (index < right) { //more elements on the right side of the pivot
      quickSort(list, index, right);
    }
  }
  return list;
};

const swap = (list: [Snowflake, number][], leftIndex: number, rightIndex: number) => {
  const temp = list[leftIndex];
  list[leftIndex] = list[rightIndex];
  list[rightIndex] = temp;
  return list;
};

const partition = (list: [Snowflake, number][], left: number, right: number) => {
  const pivot = list[Math.floor((right + left) / 2)][1];
  let i = left,
    j = right;
  while (i <= j) {
    while (list[i][1] > pivot) {
      i++;
    }
    while (list[j][1] < pivot) {
      j--;
    }
    if (i <= j) {
      swap(list, i, j);
      i++;
      j--;
    }
  }
  return i;
};