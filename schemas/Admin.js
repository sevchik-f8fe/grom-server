import mongoose from "mongoose";

const AdminSchema = new mongoose.Schema({
    login: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
});

export default mongoose.model('Admin', AdminSchema)