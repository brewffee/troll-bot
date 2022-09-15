import { Snowflake } from 'discord.js';
import mongoose from 'mongoose';

export interface UserFormat extends mongoose.Document {
  id: Snowflake, // index
  
  xp: number,
  balance: number,
  lastEarned: number,
  lastGamble: number,
  lastDaily: number,
  //lastBeg: number, // lower rep when begging too much
  //totalLost: number, // for fun :D

  // inventory: { 
  //   items: {
  //     name: string,
  //     amount: number
  //   }[],
  //   hasFishingLicense: boolean
  // },
}

const userSchema = new mongoose.Schema({
  id: String,

  xp: Number,
  balance: Number,
  lastEarned: Number, // last time they earned xp
  lastGamble: { type: Number, default: Date.now() },
  lastDaily: { type: Number, default: Date.now() },
  //lastBeg: Number,
  //totalLost: Number,

  // Enable this in the future
  // inventory: {
  //   items: {
  //     name: String,
  //     amount: Number
  //   },
  //   hasFishingLicense: Boolean
  // }
});

export const UserData = mongoose.model<UserFormat>("user", userSchema, "user");
