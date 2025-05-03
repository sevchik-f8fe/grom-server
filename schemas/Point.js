import mongoose from "mongoose";

const PointSchema = new mongoose.Schema({
    lon: { type: Number, required: true },
    lat: { type: Number, required: true },
    code: { type: String, required: true, unique: true },
});

export default mongoose.model('Point', PointSchema)