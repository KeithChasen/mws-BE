const generateToken = require("../../utils/jwt");
const User = require('../../mongo/User');
const { UserInputError } = require('apollo-server');


module.exports = {
  Mutation: {
     updateUser: async (_, { bio, age, occupation, nickname, firstname, lastname }, { user }) => {
       if (!user) {
         throw new UserInputError('Auth errors', {
           errors: {
             auth: 'Unauthorized'
           }
         });
       }

       const savedUser = await User.findOne({ email: user.email });

       savedUser.set({
         bio,
         age,
         occupation,
         nickname,
         firstname,
         lastname
       });

       const userResponse = await savedUser.save();

       const token = generateToken(userResponse);

       return {
         ...userResponse._doc,
         id: userResponse._id,
         token
       }
    }
  }
};
