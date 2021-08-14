import mongoose from 'mongoose';

export interface DebtFormat extends mongoose.Document {
  id: 1,
  balance: number,
}

const DebtSchema = new mongoose.Schema({
  id: Number,
  balance: Number,
});

export const debt = mongoose.model<DebtFormat>("debt", DebtSchema, "debt");
