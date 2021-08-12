import { Snowflake } from "discord.js";
import { xp } from "../models/xp";
import { TrollClient } from "../TrollClient";
import { quickSort } from "./quickSort";

export const getLeaderboard = async (client: TrollClient) => {
  const xpshitList = await xp.find({});
  const sortedList = quickSort(xpshitList.map(shitter => [shitter.id, shitter.xp]), 0, xpshitList.length - 1);
  const topTwenty = sortedList.filter((item, ind) => ind < 20);
  const lb = topTwenty.reduce((acc, cur) => {
    let pos = acc.replace(/[^\n]/g, '').length + 1;
    const awards = ['<:rplat:843164215786340442>', '<:rgold:843160855234215968>', '<:rsilver:843164309735735316>'];
    return `${acc}\n${pos < 4 ? awards[pos - 1] + ' ' : ''}**${pos}.** **${client.users.cache.get(cur[0])?.tag}** with **${cur[1].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}** karma`
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