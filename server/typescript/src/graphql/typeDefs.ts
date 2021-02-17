import { gql } from 'apollo-server'

// The GraphQL schema
const typeDefs = gql`
  type User {
    username: String!
    email: String!
    createdAt: String!
    token: String
  }
  type Query {
    getUsers: [User]!
    login(email: String!, password: String!): User!
  }
  type Mutation {
    registerUser(
      username: String!
      email: String!
      password: String!
      confirmPassword: String!
    ): User!
  }
`

export default typeDefs
