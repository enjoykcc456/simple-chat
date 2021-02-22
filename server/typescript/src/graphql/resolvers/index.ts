import userResolvers from './users.resolvers'
import messageResolvers from './messages.resolvers'

const rootResolvers = {
  Message: {
    createdAt: (parent: any) => parent.createdAt.toISOString(),
  },
  Query: {
    ...userResolvers.Query,
    ...messageResolvers.Query,
  },
  Mutation: {
    ...userResolvers.Mutation,
    ...messageResolvers.Mutation,
  },
}

export default rootResolvers
