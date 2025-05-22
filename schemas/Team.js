import mongoose from "mongoose";

const TeamSchema = new mongoose.Schema({
    teamName: { type: String, required: true, unique: true },
    currentPoint: { type: mongoose.Schema.Types.ObjectId, ref: 'Point', required: true, default: () => new mongoose.Types.ObjectId('681f7b184842dc852e405f6b') },
    currentCoords: {
        type: [Number],
        default: [59.938886, 30.313838], //питер
    },
    captain: {
        email: { type: String, required: true, unique: true, },
        phone: { type: String, required: true, unique: true, },
        passwordHash: { type: String, required: true, },
        username: { type: String, required: true, unique: true, },
        fullName: { type: String, required: true, },
    },
    subordinates: [{
        email: { type: String, required: true, unique: true, },
        username: { type: String, required: true, unique: true, },
        phone: { type: String, required: true, unique: true, },
    }],
});

export default mongoose.model('Team', TeamSchema);