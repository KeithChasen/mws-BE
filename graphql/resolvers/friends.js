const { UserInputError } = require("apollo-server");
const Friend = require('../../mongo/Friend');

module.exports = {
  Query:{
    getFriends: async (_, __, { user }) => {
      if (!user) {
        throw new UserInputError('Auth errors', {
          errors: {
            auth: 'Unauthorized'
          }
        });
      }

      return Friend.find({
        $or: [
          { invitee:   user.id },
          { requester: user.id }
        ]
      });
    }

  },
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
    },
    changeFriendshipStatus: async (_, {  selectedUserId, friendshipStatus }, { user }) => {
      if (!user) {
        throw new UserInputError('Auth errors', {
          errors: {
            auth: 'Unauthorized'
          }
        });
      }

      const friendRequest = await Friend.findOne({
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

      if (friendRequest) {
        if (!friendshipStatus) {
          const deletedRequest = await friendRequest.deleteOne();
        }

        if (friendshipStatus === 'active') {
          friendRequest.set({
            status: friendshipStatus
          });

          return await friendRequest.save();
        }
      }
    }
  }
};
