const jwt = require('jsonwebtoken');
const fs = require('fs');
const { PubSub } = require("apollo-server");

const pubsub = new PubSub();
const config = fs.existsSync(`${__dirname}/../config.js`)? require(`${__dirname}/../config.js`) : null;
const jwtSecret = process.env.JWT || config.JWT;

module.exports = context => {
  let token = null;
  if(context.req && context.req.headers.authorization) {
    token = context.req.headers.authorization.split('Bearer ')[1];
  } else if (context.connection && context.connection.context.Authorization) {
    token = context.connection.context.Authorization.split('Bearer ')[1];
  }

  if (token) {
    jwt.verify(token, jwtSecret, (err, decodedToken) => {
      context.user = decodedToken;
    });
  }
  context.pubsub = pubsub;

  return context;
};