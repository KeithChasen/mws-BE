const { gql } = require('apollo-server');

module.exports = gql`  
  type Query {
      getUsers: [User]
      getUser(userId: ID): User
  }
  
  type User {
      id: ID!
      email: String!
      bio: String
      age: String
      occupation: String
      nickname: String
      firstname: String
      lastname: String
      token: String
      createdAt: String
      photo: String
  }

  type ForgotRestoreResponse {
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

  input RestoreInput {
      password: String!
      confirmPassword: String!
      hash: String!
  }
  
  type Mutation {
      register(registerInput: RegisterInput): User
      login(loginInput: LoginInput): User
      forgot(forgotInput: ForgotInput): ForgotRestoreResponse
      restore(restoreInput: RestoreInput): ForgotRestoreResponse
      updateUser(
          bio: String
          age: String
          occupation: String
          nickname: String
          firstname: String
          lastname: String
      ): User
      uploadAvatar(file: Upload): User!
  }
`;
