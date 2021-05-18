const { gql } = require('apollo-server');

module.exports = gql`  
  type User {
      id: ID!
      email: String!
      token: String
      createdAt: String
  }
  
  input RegisterInput {
      email: String!
      password: String!
      confirmPassword: String!
  }
  
  type Mutation {
      register(registerInput: RegisterInput): User
  }
`;
