const { ApolloServer, gql } = require('apollo-server');
const fs = require('fs');

const config = fs.existsSync('./config') ? require('./config') : null;

const PORT = process.env.PORT || config.PORT;

const typeDefs = gql``;

const resolvers = {};

const server = new ApolloServer({
  typeDefs, resolvers
});

server
  .listen({ port: PORT })
  .then(res => {
    console.log(`Server is running at ${res.url}`)
  });
