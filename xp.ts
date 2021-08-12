import { Snowflake } from 'discord.js';
import mongoose, { Mongoose } from 'mongoose';
import { TrollClient } from './TrollClient';

export interface xpformat extends mongoose.Document {
  id: Snowflake,
  xp: number,
  earnedAt: number
}

const xpschema = new mongoose.Schema({
  id: String,
  xp: Number,
  earnedAt: { type: Number, default: Date.now() }
});

export const xp = mongoose.model<xpformat>("xpshit", xpschema, "xpshit");

// THANKS SIRH FOR ALL CODE BELOW
// https://github.com/OfficialSirH

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
  let pivot = list[Math.floor((right + left) / 2)][1],
    i = left,
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

export const getLeaderboard = async (client: TrollClient) => {
  const xpshitList = await xp.find({});
  const sortedList = quickSort(xpshitList.map(shitter => [shitter.id, shitter.xp]), 0, xpshitList.length - 1);
  const topTwenty = sortedList.filter((item, ind) => ind < 20);
  const lb = topTwenty.reduce((acc, cur) => {
    let pos = acc.replace(/[^\n]/g, '').length + 1;
    const awards = ['<:rplat:843164215786340442>', '<:rgold:843160855234215968>', '<:rsilver:843164309735735316>'];
    return `${acc}\n${pos < 4 ? awards[pos - 1] : ''}**${pos}.** **${client.users.cache.get(cur[0])?.tag}** with **${cur[1]}** karma`
  }, '');
  return lb;
}

export const getStats = async (me: Snowflake) => {
  const xpshitList = await xp.find({});
  const sortedList = quickSort(xpshitList.map(shitter => [shitter.id, shitter.xp]), 0, xpshitList.length - 1);
  return sortedList.map((item, ind) => ({ id: item[0], xp: item[1], place: ind + 1 })).filter(item => item.id == me)[0];
}

export const getPlaceString = (place: number) => {
  let placeString = place.toString();
  const lastDigit = placeString[placeString.length -1];
  if (place >= 4 && place <= 20) placeString += 'th';
  else if (lastDigit == '1') placeString += 'st';
  else if (lastDigit == '2') placeString += 'nd';
  else if (lastDigit == '3') placeString += 'rd';
  else if (Number(lastDigit) >= 4) placeString += 'th';
  return placeString;
} 