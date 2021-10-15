const { UserInputError, withFilter } = require("apollo-server");

const User = require('../../mongo/User');
const Message = require('../../mongo/Message');

const CHAT_MESSAGES_BY_REQUEST = 5;

const getRecentMessages = (userId) => Message.find({
    $or: [{ from: userId }, { to: userId }]
  })
    .sort({ createdAt: -1 })
    .limit(1);

module.exports = {
  Query: {
    // todo: update this method once "friends" feature will be done
    getChatUsers: async (_, __, { user }) => {
      if (!user) {
        throw new UserInputError('Auth errors', {
          errors: {
            auth: 'Unauthorized'
          }
        });
      }

      const recentMessages = await getRecentMessages(user.id);

      const users = await User.find({email: {$nin: user._doc.email}});

      return users.map(companion => {
        const message = recentMessages.find(m => m.from == companion._id || m.to == companion._id);
        return {
          ...companion._doc,
          id: companion._doc._id,
          recentMessage: message ?? null
        };
      });
    },
    getMessages: async (_, { from, step }, { user }) => {
      if (!user) {
        throw new UserInputError('Auth errors', {
          errors: {
            auth: 'Unauthorized'
          }
        });
      }

      const companion = await User.findById(from);

      if (!companion) {
        throw new UserInputError('Error', {
          errors: {
            auth: 'User was not found'
          }
        });
      }

      return Message.find({
        $or: [
          { $and: [{ from: user.id, to: companion.id }]},
          { $and: [{ from: companion.id, to: user.id }]},
        ]
      })
        .sort({ createdAt: -1 })
        .skip(step * CHAT_MESSAGES_BY_REQUEST)
        .limit(CHAT_MESSAGES_BY_REQUEST)
    }
  },
  Mutation: {
    sendMessage: async (_, { to, content }, { user, pubsub }) => {
      if (!user) {
        throw new UserInputError('Auth errors', {
          errors: {
            auth: 'Unauthorized'
          }
        });
      }

      const recepient = await User.findById(to);

      if (to === user.id) {
        throw new UserInputError('Error', {
          errors: {
            auth: 'You can not message yourself'
          }
        });
      }

      if (!recepient) {
        throw new UserInputError('Error', {
          errors: {
            auth: 'User was not found'
          }
        });
      }

      if (content.trim() === '') {
        throw new UserInputError('Error', {
          errors: {
            auth: 'Message is empty'
          }
        });
      }

      const message = new Message({
        from: user.id,
        to,
        content,
        createdAt: Date.now()
      });

      const messageCreated = await message.save();

      pubsub.publish('NEW_MESSAGE', { newMessage: message });

      return messageCreated;
    }
  },
  Subscription: {
    newMessage: {
      subscribe: withFilter((_, __, { pubsub, user }) => {
        if (!user) {
          throw new UserInputError('Auth errors', {
            errors: {
              auth: 'Unauthorized'
            }
          });
        }
        return pubsub.asyncIterator(['NEW_MESSAGE'])
      }, (parent, _, { user }) => {
        return parent.newMessage.from === user.id || parent.newMessage.to === user.id;
      })
    }
  }
};
