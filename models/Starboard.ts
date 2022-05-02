import type { Snowflake } from 'discord.js';
import mongoose from 'mongoose';

export interface StarboardFormat extends mongoose.Document {
  message_id: Snowflake,
  starboard_message_id: Snowflake,
  content: string,
  star_count: number,
}

const StarboardSchema = new mongoose.Schema({
  message_id: String,
  starboard_message_id: String,
  content: String,
  star_count: Number,
});

export const starboard = mongoose.model<StarboardFormat>("starboard", StarboardSchema, "starboard");
