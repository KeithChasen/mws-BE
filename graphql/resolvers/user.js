const { UserInputError } = require('apollo-server');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs');

const config = fs.existsSync(`${__dirname}/../../config.js`)? require(`${__dirname}/../../config.js`) : null;
const User = require('../../mongo/User');
const { validateRegister, validateLogin } = require('../../utils/validations/auth');

const jwtSecret = process.env.JWT || config.JWT;

const generateToken = user => jwt.sign({
    id: user.id,
    email: user.email
  }, jwtSecret, { expiresIn: '1h' });

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
          errors: validatedInput
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

      const token = generateToken(userResponse);

      return {
        ...userResponse._doc,
        id: userResponse._id,
        token
      }
    },
    async login (_, { loginInput: { email, password }}) {
      const validatedInput = validateLogin(email, password);

      if(Object.keys(validatedInput).length) {
        throw new UserInputError('Validation errors', {
          errors: validatedInput
        });
      }

      const user = await User.findOne({ email });

      if (!user) {
        throw new UserInputError('User not found', {
          errors: {
            email: 'User not found'
          }
        });
      }

      const passwordMatch = await bcrypt.compare(password, user.password);

      if (!passwordMatch) {
        throw new UserInputError('Wrong credentials', {
          errors: {
            email: 'Wrong credentials'
          }
        });
      }

      const token = generateToken(user);

      return {
        ...user._doc,
        id: user._id,
        token
      }
    }
  }
};
