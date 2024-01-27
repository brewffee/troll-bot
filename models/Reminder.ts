import { Snowflake } from 'discord.js';
import mongoose from 'mongoose';

export interface ReminderFormat extends mongoose.Document {
    id: Snowflake, // for whom
    reminder: string, // what
    time: number, // and when

    channel: Snowflake | null, // where (if applicable)
    direct: boolean, // if it's a dm instead (channel should be null)
}

const reminderSchema = new mongoose.Schema({
    id: String,
    reminder: String,
    time: Number,

    channel: String, 
    direct: Boolean,
});

export const Reminder = mongoose.model<ReminderFormat>('reminder', reminderSchema, 'reminder');
