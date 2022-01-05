const { UserInputError } = require("apollo-server");
const Friend = require('../../mongo/Friend');

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

            return Friend.find({ userid: user.id });
        }

    },
    Mutation: {
        updateHealthDiary: async (_, {  activities }, { user }) => {
            if (!user) {
                throw new UserInputError('Auth errors', {
                    errors: {
                        auth: 'Unauthorized'
                    }
                });
            }
        }
    }
};
