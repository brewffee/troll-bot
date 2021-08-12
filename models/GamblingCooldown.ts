// Will probably turn into a universal cooldown, using it just for gambling atm

import { Snowflake } from 'discord.js';
import mongoose from 'mongoose';

export interface CooldownFormat extends mongoose.Document {
  id: Snowflake,
  time: number
}

const CooldownSchema = new mongoose.Schema({
  id: String,
  time: Number,
});

export const cooldown = mongoose.model<CooldownFormat>("gamblingCooldown", CooldownSchema, "gamblingCooldown");