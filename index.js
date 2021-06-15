const { ApolloServer } = require('apollo-server');
const mongoose = require('mongoose');
const fs = require('fs');

const config = fs.existsSync('./config.js') ? require('./config.js') : null;

const PORT = process.env.PORT || config.PORT;
const MONGO = process.env.MONGO || config.MONGO;

const typeDefs = require('./graphql/typeDefs');

const resolvers = require('./graphql/resolvers');

const authMiddleware = require('./utils/authMiddleware');

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleware
});

mongoose
  .connect(MONGO, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log('Mongo is connected');
    return server.listen({ port: PORT })
  })
  .then(res => {
    console.log(`Server is running at ${res.url}`)
  })
  .catch(err => console.error(err));
