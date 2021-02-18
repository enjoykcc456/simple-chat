import { ApolloServer } from 'apollo-server'

import resolvers from './graphql/resolvers'
import typeDefs from './graphql/typeDefs'
import sequelize from './config/database.config'

const MAX_RETRY = 20
const { PORT = 4000 } = process.env

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ctx => ctx,
})

const startApplication = async (retryCount: number) => {
  try {
    await sequelize.authenticate()
    await sequelize.sync({ force: true })
    server.listen(PORT).then(({ url }) => {
      console.log(`🚀 Server ready at ${url}`)
    })
  } catch (err) {
    console.log(err)

    const nextRetryCount = retryCount - 1
    if (nextRetryCount > 0) {
      setTimeout(async () => await startApplication(nextRetryCount), 3000)
      return
    }
    console.log('Unable to start server.')
  }
}

startApplication(MAX_RETRY)
