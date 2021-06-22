const { UserInputError } = require('apollo-server');
const User = require('../../mongo/User');

module.exports = {
  Query: {
    async getUsers(_, __, { user }) {
      if (!user) {
        throw new UserInputError('Auth errors', {
          errors: {
            auth: 'Unauthorized'
          }
        });
      }

      return User.find({ email: { $nin: user._doc.email }});
    },
    async getUser(_, { userId }, { user }) {
      if (!user) {
        throw new UserInputError('Auth errors', {
          errors: {
            auth: 'Unauthorized'
          }
        });
      }

      return User.findById(userId);
    }
  },
  Mutation: {}
};