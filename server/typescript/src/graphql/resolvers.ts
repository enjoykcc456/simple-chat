import bcrypt from 'bcryptjs'
import { UserInputError, AuthenticationError } from 'apollo-server'
import jwt, { VerifyErrors } from 'jsonwebtoken'
import { Op } from 'sequelize'

import User from '../models/User.model'
import * as env from '../config/env.json'

interface SequelizeError {
  [key: string]: string
}

interface Error {
  [key: string]: string
}

interface User {
  username: string
  password: string
}

interface DecodedToken {
  email: string
  iat: number
  exp: number
}

// A map of functions which return data for the schema.
const resolvers = {
  Query: {
    getUsers: async (_: any, __: any, context: any) => {
      try {
        let user: DecodedToken
        if (context.req && context.req.headers.authorization) {
          const token = context.req.headers.authorization.split('Bearer ')[1]
          jwt.verify(
            token,
            env.JWT_SECRET,
            (err: VerifyErrors, decodedToken: object) => {
              if (err) {
                throw new AuthenticationError('Unauthenticated')
              }
              user = decodedToken as DecodedToken
            }
          )
        }

        if (user) {
          const users = await User.findAll({
            where: { email: { [Op.ne]: user.email } },
          })
          return users
        }
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
          throw new AuthenticationError('password is incorrect')
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
          err.errors.forEach(
            (e: SequelizeError) =>
              (errors[e.path] = `${e.path} is already taken`)
          )
        } else if (err.name === 'SequelizeValidationError') {
          err.errors.forEach(
            (e: SequelizeError) => (errors[e.path] = e.message)
          )
        }
        throw new UserInputError('Bad Input', { errors })
      }
    },
  },
}

export default resolvers
