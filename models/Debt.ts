import mongoose from 'mongoose';

export interface DebtFormat extends mongoose.Document {
  id: 1,
  karma: number,
}

const DebtSchema = new mongoose.Schema({
  id: Number,
  karma: Number,
});

export const debt = mongoose.model<DebtFormat>("debt", DebtSchema, "debt");
