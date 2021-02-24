import bcrypt from 'bcryptjs'
import { UserInputError, AuthenticationError } from 'apollo-server'
import jwt from 'jsonwebtoken'
import { Op } from 'sequelize'

import * as env from '../../config/env.json'
import User from '../../models/User.model'
import Message from '../../models/Message.model'

interface Error {
  [key: string]: string
}

// A map of functions which return data for the schema.
const resolvers = {
  Query: {
    getUsers: async (_: any, __: any, { user }: { user: any }) => {
      try {
        if (!user) throw new AuthenticationError('Unauthenticated')

        let users = await User.findAll({
          where: { email: { [Op.ne]: user.email } },
        })

        const allUserMessages = await Message.findAll({
          where: { [Op.or]: [{ from: user.email }, { to: user.email }] },
          order: [['createdAt', 'DESC']],
        })

        users = users.map((otherUser: any) => {
          const latestMessage = allUserMessages.find(
            (m: any) => m.from === otherUser.email || m.to === otherUser.email
          )
          otherUser.latestMessage = latestMessage
          return otherUser
        })

        return users
      } catch (err) {
        console.log(err)
        throw err
      }
    },

    login: async (_: any, args: any) => {
      const { email, password } = args
      let errors: Error = {}

      try {
        // Validate input data
        if (email.trim() === '') errors.email = 'email must not be empty'
        if (password.trim() === '')
          errors.password = 'password must not be empty'

        if (Object.keys(errors).length > 0) {
          throw new UserInputError('Bad Input', { errors })
        }

        // Check if user with such email exists
        const user: any = await User.findOne({ where: { email } })
        if (!user) {
          errors.email = 'user not found for the email'
          throw new UserInputError('user not found', { errors })
        }

        // Compare the passwords
        const authenticated = await bcrypt.compare(password, user.password)

        if (!authenticated) {
          errors.password = 'password is incorrect'
          throw new UserInputError('password is incorrect', { errors })
        }
        const token = jwt.sign({ email }, env.JWT_SECRET, { expiresIn: '1h' })

        return {
          ...user.toJSON(),
          createdAt: user.createdAt.toISOString(),
          token,
        }
      } catch (err) {
        console.log(err)
        throw err
      }
    },
  },
  Mutation: {
    registerUser: async (_: any, args: any) => {
      let { username, email, password, confirmPassword } = args
      let errors: Error = {}

      try {
        // Validate input data
        if (username.trim() === '')
          errors.username = 'username must not be empty'
        if (email.trim() === '') errors.email = 'email must not be empty'
        if (password.trim() === '')
          errors.password = 'password must not be empty'
        if (confirmPassword.trim() === '')
          errors.confirmPassword = 'confirm password must not be empty'

        if (password !== confirmPassword)
          errors.confirmPassword = 'password must match'

        if (Object.keys(errors).length > 0) {
          throw errors
        }

        // Hash password
        password = await bcrypt.hash(password, 6)

        // Create User
        const user = await User.create({
          username,
          email,
          password,
        })

        return user
      } catch (err) {
        console.log(err)
        if (err.name === 'SequelizeUniqueConstraintError') {
          err.errors.forEach((e: Error) => {
            const errorSource = e.path.split('.')[1]
            return (errors[errorSource] = `${errorSource} is already taken`)
          })
        } else if (err.name === 'SequelizeValidationError') {
          err.errors.forEach(
            (e: Error) => (errors[e.path.split('.')[1]] = e.message)
          )
        }
        throw new UserInputError('Bad Input', { errors })
      }
    },
  },
}

export default resolvers
