const { UserInputError } = require("apollo-server");
const Friend = require('../../mongo/Friend');

module.exports = {
  Mutation: {
    addToFriendsRequest: async (_, {  selectedUserId }, { user }) => {
      if (!user) {
        throw new UserInputError('Auth errors', {
          errors: {
            auth: 'Unauthorized'
          }
        });
      }

      //todo: put these queries to some separate helper file
      const areTheyFriends = await Friend.find({
        $or: [
          { $and: [
              {
                invitee: user.id,
                requester: selectedUserId
              }
            ]
          },
          { $and: [
              {
                invitee: selectedUserId,
                requester: user.id
              }
            ]
          },
        ]
      });

      if (!areTheyFriends.length) {
        try {
          const newFriendRequest = new Friend({
            invitee: selectedUserId,
            requester: user.id,
          });

          return await newFriendRequest.save();
        } catch (e) {
          throw new UserInputError('Add friends request error', {
            errors: {
              friend: 'Friends request failure'
            }
          });
        }
      }

      throw new UserInputError('Add friends request error', {
        errors: {
          friend: 'You already sent a friend request to this user'
        }
      });
    }
  }
};
