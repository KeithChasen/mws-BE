const authResolvers = require('./auth');
const accountResolvers = require('./account');
const usersResolvers = require('./users');
const chatResolvers = require('./chat');
const friendsResolvers = require('./friends');
const healthResolvers = require('./health');

module.exports = {
  Query:{
    ...usersResolvers.Query,
    ...accountResolvers.Query,
    ...authResolvers.Query,
    ...chatResolvers.Query,
    ...friendsResolvers.Query,
    ...healthResolvers.Query
  },
  Mutation: {
    ...usersResolvers.Mutation,
    ...accountResolvers.Mutation,
    ...authResolvers.Mutation,
    ...chatResolvers.Mutation,
    ...friendsResolvers.Mutation,
    ...healthResolvers.Mutation
  },
  Subscription: {
    ...chatResolvers.Subscription
  }
};
