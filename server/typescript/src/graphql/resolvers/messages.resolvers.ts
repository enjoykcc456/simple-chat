import { UserInputError, AuthenticationError } from 'apollo-server'
import { Op } from 'sequelize'

import User from '../../models/User.model'
import Message from '../../models/Message.model'

// A map of functions which return data for the schema.
const resolvers = {
  Query: {
    getMessages: async (
      parent: any,
      { from }: { from: any },
      { user }: { user: any }
    ) => {
      try {
        if (!user) throw new AuthenticationError('Unauthenticated')

        const otherUser: any = await User.findOne({ where: { email: from } })
        if (!otherUser) throw new UserInputError('User not found')

        const emails = [user.email, otherUser.email]

        const messages = await Message.findAll({
          where: {
            from: { [Op.in]: emails },
            to: { [Op.in]: emails },
          },
          order: [['createdAt', 'DESC']],
        })

        return messages
      } catch (err) {
        console.log(err)
        throw err
      }
    },
  },
  Mutation: {
    sendMessage: async (
      parent: any,
      { content, to }: { content: string; to: string },
      { user }: { user: any }
    ) => {
      try {
        if (!user) throw new AuthenticationError('Unauthenticated')

        // Validate input data
        if (content.trim() === '') throw new UserInputError('Message is empty')

        const recipient: any = await User.findOne({ where: { email: to } })
        if (!recipient) {
          throw new UserInputError('User not found')
        } else if (recipient.email === user.email) {
          throw new UserInputError('Sending message to self is not allowed')
        }

        // Create the message
        const message = await Message.create({
          from: user.email,
          to,
          content,
        })

        return message
      } catch (err) {
        console.log(err)
        throw err
      }
    },
  },
}

export default resolvers
