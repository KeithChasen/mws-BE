const { ApolloServer, gql } = require('apollo-server');

const typeDefs = gql``;

const resolvers = {};

const server = new ApolloServer({
  typeDefs, resolvers
});

server
  .listen({})
  .then(res => {
    console.log(`Server is running at ${res.url}`)
  });
