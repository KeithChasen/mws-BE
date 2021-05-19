const { UserInputError } = require('apollo-server');
const bcrypt = require('bcryptjs');

const User = require('../../mongo/User');
const { validateRegister } = require('../../utils/validations/auth')

module.exports = {
  Query: {
    async hi() {
      console.log('hi')
    }
  },
  Mutation: {
    async register(_, { registerInput: { email, password, confirmPassword }}) {

      const validatedInput = validateRegister(email, password, confirmPassword);

      if(Object.keys(validatedInput).length) {
        throw new UserInputError('Validation errors', {
          validatedInput
        });
      }

      const user = await User.findOne({ email });

      if (user) {
        throw new UserInputError('Email in use', {
          errors: {
            email: 'Such email is already in use'
          }
        });
      }

      password = await bcrypt.hash(password, 12);

      const newUser = new User({
        email,
        password
      });

      const userResponse = await newUser.save();

      return {
        ...userResponse._doc,
        id: userResponse._id
      }
    }
  }
};
