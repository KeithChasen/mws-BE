const { model, Schema } = require('mongoose');

const healthDiarySchema = new Schema({
    userid: String,
    date: String,
    activities: {
        bloodPressure: [String],
        pulse: [String]
    }
});

module.exports = model('HealthDiary', healthDiarySchema);
