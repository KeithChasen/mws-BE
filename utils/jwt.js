const jwt = require('jsonwebtoken');
const fs = require('fs');
const config = fs.existsSync(`${__dirname}/../config.js`)? require(`${__dirname}/../config.js`) : null;

const jwtSecret = process.env.JWT || config.JWT;

module.exports = user => jwt.sign({
  ...user,
  id: user._id
}, jwtSecret, { expiresIn: '1h' });
