const { UserInputError } = require('apollo-server');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');

const config = fs.existsSync(`${__dirname}/../../config.js`)? require(`${__dirname}/../../config.js`) : null;
const User = require('../../mongo/User');
const RestorePassword = require('../../mongo/RestorePassword');
const { validateRegister, validateLogin, validateEmail } = require('../../utils/validations/auth');

const sendgridKey = process.env.SENDGRID || config.SENDGRID;
const emailFrom = process.env.EMAIL_FROM || config.EMAIL_FROM;
const frontDomain = process.env.FRONT_DOMAIN || config.FRONT_DOMAIN;

const emailTransporter = nodemailer.createTransport(sendgridTransport({
  auth: {
    api_key: sendgridKey
  }
}));

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

      try {
        const emailSent = await emailTransporter.sendMail({
          to: email,
          from: emailFrom,
          subject: 'Successful sign up',
          html: "<h1>Congratulations!</h1><p>You've been successfully signed up!</p>"
        });

        console.log(emailSent, 'email sent');
      } catch (e) {
        console.log(e, 'Email error');
      }

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
    },
    async forgot (_, { forgotInput: { email } }) {
      console.log(email, 'Email in node');

      const validatedEmail = validateEmail(email);

      if(Object.keys(validatedEmail).length) {
        throw new UserInputError('Validation errors', {
          errors: validatedEmail
        });
      }

      const user = await User.findOne({ email });

      if (!user) {
        throw new UserInputError('Email not found', {
          errors: {
            email: "User with such email wasn't found. Please register"
          }
        });
      }

      const hash = crypto.randomBytes(32).toString('hex');

      const newRestorePassword = RestorePassword({
        userid: user.id,
        hash: hash,
        timestamp: Date.now()
      });

      const newRestorePasswordResponse = await newRestorePassword.save();

      if (newRestorePasswordResponse.id) {
        try {
          const emailSent = await emailTransporter.sendMail({
            to: email,
            from: emailFrom,
            subject: 'Restore password',
            html:
              `<h1>Hello! We received your request to restore password</h1>
               <h2>If you didn't drop your password please ignore this email</h2>
               <p>Please use ths link to restore your password:</p>
               <p>${frontDomain}/restore?hash=${hash}</p>`
          });

          console.log(emailSent, 'email sent');

          return {
            status: true,
            message: "We've sent you an instruction to restore your password. Please check your mailbox"
          }
        } catch (e) {
          console.log(e, 'Email error');

          return {
            status: false,
            message: "Something went wrong"
          }
        }
      }

      return {
        status: false,
        message: "Something went wrong"
      }
    }
  }
};
