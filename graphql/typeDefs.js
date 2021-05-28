const { gql } = require('apollo-server');

module.exports = gql`  
#  todo: delete this one once we have valid query. 
# Added temporarily because otherwise apollo is broken
  type Query {
      hi: String
  }
  
  type User {
      id: ID!
      email: String!
      token: String
      createdAt: String
  }

  type ForgotResponse {
      status: Boolean!
      message: String!
  }
  
  input RegisterInput {
      email: String!
      password: String!
      confirmPassword: String!
  }

  input LoginInput {
      email: String!
      password: String!
  }

  input ForgotInput {
      email: String!
  }
  
  type Mutation {
      register(registerInput: RegisterInput): User
      login(loginInput: LoginInput): User
      forgot(forgotInput: ForgotInput): ForgotResponse
  }
`;
