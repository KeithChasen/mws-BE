const { UserInputError } = require("apollo-server");
const HealthDiary = require('../../mongo/HealthDiary');

const MAX_ALLOWED_TIME_PERIOD_RECORDS = 4;

module.exports = {
    Query:{
        getHealthDiary: async (_, __, { user }) => {
            if (!user) {
                throw new UserInputError('Auth errors', {
                    errors: {
                        auth: 'Unauthorized'
                    }
                });
            }

            return HealthDiary.find({ userid: user.id });
        }
    },
    Mutation: {
        saveBloodPressure: async (_, { date, time, timePeriod, sys, dia, pulse  }, { user }) => {
            if (!user) {
                throw new UserInputError('Auth errors', {
                    errors: {
                        auth: 'Unauthorized'
                    }
                });
            }

            const healthDiary = await HealthDiary.findOne({ userid: user.id, date });

            if (healthDiary) {
                const bloodPressureRecords = healthDiary.activities.bloodPressure;

                const matchTimePeriodRecords = bloodPressureRecords.filter(bPR => bPR.timePeriod === timePeriod).length;

                if (matchTimePeriodRecords >= MAX_ALLOWED_TIME_PERIOD_RECORDS) {
                    throw new UserInputError('Limit Time Period records', {
                        errors: {
                            bloodPressure: `You can't add more than ${MAX_ALLOWED_TIME_PERIOD_RECORDS} records for ${timePeriod} time period`
                        }
                    });
                }

                const newBloodPressureRecord = {
                    sys,
                    dia,
                    pulse,
                    time,
                    timePeriod
                };


                healthDiary.activities.bloodPressure = [
                    ...healthDiary.activities.bloodPressure,
                    newBloodPressureRecord
                ]

                return healthDiary.save();
            } else {
                const bloodPressureRecord = {
                    sys,
                    dia,
                    pulse,
                    time,
                    timePeriod
                };

                const healthDiary = new HealthDiary({
                    userid: user.id,
                    date: date,
                    activities: {
                        bloodPressure: [bloodPressureRecord]
                    }
                });

                return await healthDiary.save();
            }
        }
    }
};
