import type { Snowflake } from 'discord.js';
import mongoose from 'mongoose';

export interface StarboardFormat extends mongoose.Document {
  message_id: Snowflake,
}

const StarboardSchema = new mongoose.Schema({
  message_id: String,
});

export const starboard = mongoose.model<StarboardFormat>("starboard", StarboardSchema, "starboard");
