const authResolvers = require('./auth');
const accountResolvers = require('./account');
const usersResolvers = require('./users');
const chatResolvers = require('./chat');
const friendsResolvers = require('./friends');

module.exports = {
  Query:{
    ...usersResolvers.Query,
    ...accountResolvers.Query,
    ...authResolvers.Query,
    ...chatResolvers.Query,
    ...friendsResolvers.Query
  },
  Mutation: {
    ...usersResolvers.Mutation,
    ...accountResolvers.Mutation,
    ...authResolvers.Mutation,
    ...chatResolvers.Mutation,
    ...friendsResolvers.Mutation,
  },
  Subscription: {
    ...chatResolvers.Subscription
  }
};
