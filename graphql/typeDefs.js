const { gql } = require('apollo-server');

module.exports = gql`  
  type User {
      id: ID!
      email: String!
      token: String
      createdAt: String
  }
`;
