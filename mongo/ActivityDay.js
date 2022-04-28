const { model, Schema } = require('mongoose');

const activityDay = new Schema({
    type: {
        type: String,
        enum: ['rest', 'training'],
        default: 'rest'
    },
    trainingType: {
        type: String,
        enum: ['bars-push-ups', 'pull-ups'],
        default: null
    },
    trainingString: String,
})


const activityDaySchema = new Schema({
    userid: String,
    date: String,
    activities: [activityDay]
});

module.exports = model('ActivityDay', activityDaySchema);