const authResolvers = require('./auth');
const userResolvers = require('./user');

module.exports = {
  Query:{
    ...userResolvers.Query,
    ...authResolvers.Query,
  },
  Mutation: {
    ...userResolvers.Mutation,
    ...authResolvers.Mutation,
  }
};
