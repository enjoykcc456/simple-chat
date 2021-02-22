import jwt, { VerifyErrors } from 'jsonwebtoken'

import * as env from '../config/env.json'

interface DecodedToken {
  email: string
  iat: number
  exp: number
}

export const contextMiddleware = (context: any) => {
  if (context.req && context.req.headers.authorization) {
    const token = context.req.headers.authorization.split('Bearer ')[1]
    jwt.verify(
      token,
      env.JWT_SECRET,
      (err: VerifyErrors, decodedToken: object) => {
        context.user = decodedToken as DecodedToken
      }
    )
  }
  return context
}
