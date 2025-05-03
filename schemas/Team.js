const mongoose = require('mongoose');

const TeamSchema = new mongoose.Schema({
    teamName: { type: String, required: true, },
    currentPoint: { type: mongoose.Schema.Types.ObjectId, ref: 'Point', required: true, },
    captain: {
        email: { type: String, required: true, unique: true, },
        phoneNumber: { type: String, required: true, unique: true, },
        passwordHash: { type: String, required: true, },
        tgUsername: { type: String, required: true, unique: true, },
        firstName: { type: String, required: true, },
        lastName: { type: String, required: true, },
        middleName: { type: String, },
    },
    subordinates: [{
        email: { type: String, required: true, unique: true, },
        tgUsername: { type: String, required: true, unique: true, },
        firstName: { type: String, required: true, },
        lastName: { type: String, required: true, },
        middleName: { type: String, },
        phoneNumber: { type: String, required: true, unique: true, },
    }],
});

module.exports = mongoose.model('Team', TeamSchema);