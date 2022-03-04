import { Guild, Snowflake } from "discord.js";
import { wallet } from "../models/Wallet";
import { xp } from "../models/xp";
import { client } from "../TrollClient";
import { quickSort } from "./quickSort";

export const getLeaderboard = async (guild: Guild) => {
  const xpshitList = await xp.find({});
  const sortedList = quickSort(xpshitList.map(shitter => [shitter.id, shitter.xp]), 0, xpshitList.length - 1);
  const topTwenty = sortedList.filter((item, ind) => ind < 20);
  const lb = topTwenty.reduce((acc, cur) => {
    if (cur[1] <= 0) return acc;
    let pos = acc.replace(/[^\n]/g, '').length + 1;
    const awards = ['<:rplat:843164215786340442>', '<:rgold:843160855234215968>', '<:rsilver:843164309735735316>'];
    return `${acc}\n${pos < 4 ? awards[pos - 1] + ' ' : ''}**${pos}.** **${guild.members.cache.get(cur[0])?.user.tag}** with **${cur[1].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}** karma`
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
  const lastDigit = placeString[placeString.length - 1];
  if (place >= 4 && place <= 20) placeString += 'th';
  else if (lastDigit == '1') placeString += 'st';
  else if (lastDigit == '2') placeString += 'nd';
  else if (lastDigit == '3') placeString += 'rd';
  else if (Number(lastDigit) >= 4) placeString += 'th';
  return placeString;
}

export const getRichest = async (guild: Guild) => {
  const moneyshitList = await wallet.find({});
  const sortedList = quickSort(moneyshitList.map(shitter => [shitter.id, shitter.balance]), 0, moneyshitList.length - 1);
  const bigGuys = sortedList.filter((item, ind) => ind < 20);
  const lb = bigGuys.reduce((acc, cur) => {
    if (cur[1] <= 0) return acc;
    let pos = acc.replace(/[^\n]/g, '').length + 1;
    const awards = ['<:rplat:843164215786340442>', '<:rgold:843160855234215968>', '<:rsilver:843164309735735316>'];
    return `${acc}\n${pos < 4 ? awards[pos - 1] + ' ' : ''}**${pos}.** **${guild.members.cache.get(cur[0])?.user.tag}** with ${client.config.coin}**${cur[1].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}**`
  }, '');
  return lb;
}

export const getEcoStats = async (me: Snowflake) => {
  const moneyshitList = await wallet.find({});
  const sortedList = quickSort(moneyshitList.map(shitter => [shitter.id, shitter.balance]), 0, moneyshitList.length - 1);
  return sortedList.map((item, ind) => ({ id: item[0], balance: item[1], place: ind + 1 })).filter(item => item.id == me)[0];
}

export const getEcoPlaceString = (place: number) => {
  let placeString = place.toString();
  const lastDigit = placeString[placeString.length - 1];
  if (place >= 4 && place <= 20) placeString += 'th';
  else if (lastDigit == '1') placeString += 'st';
  else if (lastDigit == '2') placeString += 'nd';
  else if (lastDigit == '3') placeString += 'rd';
  else if (Number(lastDigit) >= 4) placeString += 'th';
  return placeString;
}

export const getLevels = (xp: number) => {
  return { 
    value: Math.floor(xp / 500),
    progression: Math.round(((xp % 500) / 500) * 100) / 100 
  };
}