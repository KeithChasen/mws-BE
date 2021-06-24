const authResolvers = require('./auth');
const accountResolvers = require('./account');
const usersResolvers = require('./users');
const chatResolvers = require('./chat');

module.exports = {
  Query:{
    ...usersResolvers.Query,
    ...accountResolvers.Query,
    ...authResolvers.Query,
    ...chatResolvers.Query,
  },
  Mutation: {
    ...usersResolvers.Mutation,
    ...accountResolvers.Mutation,
    ...authResolvers.Mutation,
    ...chatResolvers.Mutation,
  },
  Subscription: {
    ...chatResolvers.Subscription
  }
};
