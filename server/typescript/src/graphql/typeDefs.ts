import { gql } from 'apollo-server'

// The GraphQL schema
const typeDefs = gql`
  type User {
    username: String!
    email: String!
    createdAt: String!
    token: String
  }
  type Message {
    uuid: String!
    content: String!
    from: String!
    to: String!
    createdAt: String!
  }
  type Query {
    getUsers: [User]!
    login(email: String!, password: String!): User!
    getMessages(from: String!): [Message]!
  }
  type Mutation {
    registerUser(
      username: String!
      email: String!
      password: String!
      confirmPassword: String!
    ): User!
    sendMessage(content: String!, to: String!): Message!
  }
`

export default typeDefs
