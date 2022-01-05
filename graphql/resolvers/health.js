const { UserInputError } = require("apollo-server");
const HealthDiary = require('../../mongo/HealthDiary');

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
        saveBloodPressure: async (_, { date, time, sys, dia, pulse  }, { user }) => {
            if (!user) {
                throw new UserInputError('Auth errors', {
                    errors: {
                        auth: 'Unauthorized'
                    }
                });
            }

            const healthDiary = await HealthDiary.findOne({ userid: user.id, date });

            if (healthDiary) {
                console.log('you have a health diary')
            } else {
                console.log('you dont have a diary')
            }
        }
    }
};
