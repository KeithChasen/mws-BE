const { UserInputError } = require('apollo-server');
const bcrypt = require('bcryptjs');

const User = require('../../mongo/User');
const { validateRegister, validateLogin } = require('../../utils/validations/auth');

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
    },
    async login (_, { loginInput: { email, password }}) {
      const validatedInput = validateLogin(email, password);

      if(Object.keys(validatedInput).length) {
        throw new UserInputError('Validation errors', {
          validatedInput
        });
      }

      const user = await User.findOne({ email });

      if (!user) {
        throw new UserInputError('User not found', {
          errors: {
            user: 'User not found'
          }
        });
      }

      const passwordMatch = await bcrypt.compare(password, user.password);

      if (!passwordMatch) {
        throw new UserInputError('Wrong credentials', {
          errors: {
            user: 'Wrong credentials'
          }
        });
      }

      return {
        ...user._doc,
        id: user._id
      }
    }
  }
};
