const { UserInputError } = require("apollo-server");
const ActivityDay = require('../../mongo/ActivityDay');

module.exports = {
    Query:{
        getActivities: async (_, __, { user }) =>  {
            if (!user) {
                throw new UserInputError('Auth errors', {
                    errors: {
                        auth: 'Unauthorized'
                    }
                });
            }

            return ActivityDay.find({ userid: user.id });
        }
    },
    Mutation: {
        saveActivity: async (_, { date, type, trainingType, result  }, { user }) => {
            if (!user) {
                throw new UserInputError('Auth errors', {
                    errors: {
                        auth: 'Unauthorized'
                    }
                });
            }

            const activity = await ActivityDay.findOne({ userid: user.id, date });

            if (activity) {
                return activity.save();
            } else {
                const newActivityRecord = {
                    date, type, trainingType, result
                };

                const activity = new ActivityDay({});

                return await activity.save();
            }
        }
    }
};
