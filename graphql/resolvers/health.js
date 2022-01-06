const { UserInputError } = require("apollo-server");
const HealthDiary = require('../../mongo/HealthDiary');
const User = require("../../mongo/User");

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
                const bloodPressureRecord = {
                    sys,
                    dia,
                    pulse,
                    time,
                    timePeriod
                };

                healthDiary.activities.bloodPressure = [
                    ...healthDiary.activities.bloodPressure,
                    bloodPressureRecord
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
