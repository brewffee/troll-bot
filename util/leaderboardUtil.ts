import { Guild, Snowflake } from "discord.js";
import { client } from "../TrollClient";
import { quickSort } from "./quickSort";
import { UserData } from "../models/User";

// for lb functions
const awards = [
  client.config.reddit[2], // Platinum
  client.config.reddit[1], // Gold
  client.config.reddit[0], // Silver
];

export const humanize = (num: number) => {
  // formats numbers to be human readable (e.g. 1000 -> 1,000)
  return String(num).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export const getLeaderboard = async () => {
  // get all users in the guild and sort them by xp (preserve top 10)
  const users = await UserData.find({});
  const sorted = quickSort(users.map(shitter => [shitter.id, shitter.xp]), 0, users.length - 1);
  const topTen = sorted.filter((_, i) => i < 10); 

  // fetch all users
  client.guilds.cache.first().members.fetch({ force: true });

  // "**4**. User#0000 - 1234 karma"
  const leaderboard = topTen.reduce((str, curData) => { 
    const [id, xp] = curData; 
    if (xp <= 0) return str; // skip if no xp 

    // Placement (award or numeric)
    let place: string; console.log('step4. b'); 
    let pos = topTen.findIndex(item => item[0] === id) + 1;

    if (pos < 4) place = `${awards[pos - 1]} `;
    else place = `**${pos}.** `;

    // User tag (id if there's a problem)
    let user = client.guilds.cache.first().members.cache.get(id as Snowflake)?.user.tag || `Unknown User (${id})`;

    // append and continue :3
    return str + `${place} **${user}** - **${humanize(xp)}** karma\n`;
  }, '');

  return leaderboard; 
}

export const getStats = async (me: Snowflake) => {
  // get all users
  const users = await UserData.find({});
  const sorted = quickSort(users.map(shitter => [shitter.id, shitter.xp]), 0, users.length - 1);
  // return { place: 1, xp: 1 }
  const myStats = sorted.find(item => item[0] === me);

  return {
    place: sorted.findIndex(item => item[0] === me) + 1,
    xp: myStats[1],
  };
}

export const getPlaceString = (place: number) => {
  // returns the place as a string (e.g. 1 -> 1st, 2 -> 2nd, 3 -> 3rd, 4 -> 4th, 11 -> 11th, 21 -> 21st, 111 -> 111th)
  const lastDigit = place % 10;
  const lastTwoDigits = place % 100;

  if (lastDigit === 1 && lastTwoDigits !== 11) return `${place}st`;
  if (lastDigit === 2 && lastTwoDigits !== 12) return `${place}nd`;
  if (lastDigit === 3 && lastTwoDigits !== 13) return `${place}rd`;
  return `${place}th`;
}

export const getRichest = async () => {
  // like lb, but for eco
  const users = await UserData.find({});
  const sorted = quickSort(users.map(shitter => [shitter.id, shitter.balance]), 0, users.length - 1);
  const topTen = sorted.filter((_, i) => i < 10);

  // fetch all users
  client.guilds.cache.first().members.fetch({ force: true });

  const leaderboard = topTen.reduce((str, curData) => {
    const [id, balance] = curData;
    if (balance <= 0) return str; // no broke boys here

    // Placement
    let place: string;
    let pos = topTen.findIndex(item => item[0] === id) + 1;

    if (pos < 4) place = `${awards[pos - 1]} `;
    else place = `**${pos}.** `;

    // User tag (id if there's a problem)
    let user = client.guilds.cache.first().members.cache.get(id as Snowflake)?.user.tag || `Unknown User (${id})`;

    // append and continue :3
    return str + `${place} **${user}** - ${client.config.coin} **${humanize(balance)}**\n`;
  }, '');

  return leaderboard;
}

export const getEcoStats = async (me: Snowflake) => {
  // get all users
  const users = await UserData.find({});
  const sorted = quickSort(users.map(shitter => [shitter.id, shitter.balance]), 0, users.length - 1);
  // return { place: 1, balance: 1 }
  const myStats = sorted.find(item => item[0] === me);

  return {
    place: sorted.findIndex(item => item[0] === me) + 1,
    balance: myStats[1]
  };
}

export const getEcoPlaceString = (place: number) => {
  // Compatibility only, removing soon
  return getPlaceString(place);
}

// not finished
export const getLevels = (xp: number) => {
  return { 
    value: Math.floor(xp / 500),
    progression: Math.round(((xp % 500) / 500) * 100) / 100 
  };
}