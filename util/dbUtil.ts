import { Snowflake } from 'discord.js';
import { client } from '../TrollClient';
import { quickSort } from './quickSort';
import { UserData } from '../models/User';

// The awards to use for leaderboard functions
// TODO: don't use TrollConfig.reddit[] for this 
const awards = [
  client.config.reddit[2], // Platinum
  client.config.reddit[1], // Gold
  client.config.reddit[0], // Silver
];

// Formats numbers to be humanly readable (ex. 1000 => 1,000)
export const humanize = (num: number) => {
  return String(num).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// Get the top 10 users in the database and sort them by their  XP
export const getLeaderboard = async () => {
  const users = await UserData.find({});
  const sorted = quickSort(users.map(shitter => [shitter.id, shitter.xp]), 0, users.length - 1);
  const topTen = sorted.filter((_, i) => i < 10); 

  // Format this data into a humanly readable format
  const leaderboard = await topTen.reduce(async (str, i) => {
    const string = await str;
    const [id, xp] = i; 
    if (xp <= 0) return string; 

    let place: string;
    const pos = topTen.findIndex(item => item[0] === id);
    if (pos < awards.length) place = `${awards[pos]} `;
    else place = `**${pos + 1}.** `;

    // If we can't fetch the user for some reason, fallback to their ID
    const user = (await client.users.fetch(id))?.tag || `Unknown (${id})`;

    return string + `${place} **${user}** - **${humanize(xp)}** karma\n`;
  }, Promise.resolve(''));

  return leaderboard; 
}

// Get the XP for a specified user. If no user is given, use 
// the message author instead.
export const getStats = async (user: Snowflake) => {
  const users = await UserData.find({});
  const sorted = quickSort(users.map(shitter => [shitter.id, shitter.xp]), 0, users.length - 1);
  const myStats = sorted.find(item => item[0] === user);

  return {
    place: sorted.findIndex(item => item[0] === user) + 1,
    xp: myStats[1],
  };
}

// Returns the placement number as a string (ex. 1 => 1st, 2 => 2nd)
export const getPlaceString = (place: number) => {
  const last = place % 10;
  const lastTwo = place % 100;

  if (last === 1 && lastTwo !== 11) return `${place}st`;
  if (last === 2 && lastTwo !== 12) return `${place}nd`;
  if (last === 3 && lastTwo !== 13) return `${place}rd`;
  return `${place}th`;
}

// Similar to getLeaderboard() above, gets the top 10 users
// in the database and sorts them instead by their coins
export const getRichest = async () => {
  const users = await UserData.find({});
  const sorted = quickSort(users.map(shitter => [shitter.id, shitter.balance]), 0, users.length - 1);
  const topTen = sorted.filter((_, i) => i < 10);

  const leaderboard = await topTen.reduce(async (str, i) => {
    const string = await str;
    const [id, balance] = i;
    if (balance <= 0) return string;

    let place: string;
    const pos = topTen.findIndex(item => item[0] === id);
    if (pos < awards.length) place = `${awards[pos]} `;
    else place = `**${pos + 1}.** `;

    // If we can't fetch the user for some reason, fallback to their ID
    const user = (await client.users.fetch(id))?.tag || `Unknown (${id})`;

    // TODO: allow flipping of currency symbol placement
    return string + `${place} **${user}** - ${client.config.coin} **${humanize(balance)}**\n`;
  }, Promise.resolve(''));

  return leaderboard;
}

// Get the balance of a specified user. If no user is given, 
// use the message author instead.
export const getEcoStats = async (user: Snowflake) => {
  const users = await UserData.find({});
  const sorted = quickSort(users.map(shitter => [shitter.id, shitter.balance]), 0, users.length - 1);
  const userStats = sorted.find(item => item[0] === user) ?? [false];

  return {
    place: sorted.findIndex(item => item[0] === user) + 1,
    balance: userStats[1] ?? 0
  };
}

// TODO: implement levels
export const getLevels = (xp: number) => {
  return { 
    value: Math.floor(xp / 500),
    progression: Math.round(((xp % 500) / 500) * 100) / 100 
  };
}