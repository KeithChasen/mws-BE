const { model, Schema } = require('mongoose');

const bloodPressure = new Schema({
    sys: String,
    dia: String,
    pulse: String,
    time: String,
    timePeriod: String,
})


const healthDiarySchema = new Schema({
    userid: String,
    date: String,
    activities: {
        bloodPressure: [bloodPressure]
    }
});

module.exports = model('HealthDiary', healthDiarySchema);
