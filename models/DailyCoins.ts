import { Snowflake } from 'discord.js';
import mongoose from 'mongoose';

export interface DailyFormat extends mongoose.Document {
  id: Snowflake,
  collectedAt: number
}

const DailySchema = new mongoose.Schema({
  id: String,
  collectedAt: { type: Number, default: Date.now() }
});

export const daily = mongoose.model<DailyFormat>("daily", DailySchema, "daily");

