import mongoose from "mongoose";

const QuestSchema = new mongoose.Schema({
    startAt: { type: Date, default: Date.now, required: true },
    winner: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', default: null },
});

export default mongoose.model('Quest', QuestSchema)