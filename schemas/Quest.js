import mongoose from "mongoose";

const d = new Date('2025-9-1');

const QuestSchema = new mongoose.Schema({
    startAt: { type: Date, default: d, required: true },
    winner: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', default: null },
});

export default mongoose.model('Quest', QuestSchema)