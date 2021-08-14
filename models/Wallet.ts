import { Snowflake } from 'discord.js';
import mongoose from 'mongoose';

export interface WalletFormat extends mongoose.Document {
  id: Snowflake,
  balance: number,
}

const WalletSchema = new mongoose.Schema({
  id: String,
  balance: Number,
});

export const wallet = mongoose.model<WalletFormat>("coinstuff", WalletSchema, "coinstuff");

