const authResolvers = require('./auth');
const accountResolvers = require('./account');
const usersResolvers = require('./users');

module.exports = {
  Query:{
    ...usersResolvers.Query,
    ...accountResolvers.Query,
    ...authResolvers.Query,
  },
  Mutation: {
    ...usersResolvers.Mutation,
    ...accountResolvers.Mutation,
    ...authResolvers.Mutation,
  }
};
