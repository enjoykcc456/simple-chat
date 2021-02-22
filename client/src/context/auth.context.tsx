import jwtDecode from 'jwt-decode'
import React, { createContext, useContext, useReducer } from 'react'

export enum ActionKind {
  Login = 'LOGIN',
  Logout = 'LOGOUT',
}

export interface User {
  username: string
  email: string
  createdAt: string
  __typename: string
}

interface LoginResponse extends User {
  token: string
}

interface LoginUser {
  email: string
  iat: string
  exp: string
}

export type Action = {
  type: ActionKind
  payload: LoginResponse
}

interface State {
  user: LoginResponse | LoginUser | null
}

const AuthStateContext = createContext({})
const AuthDispatchContext = createContext({})

let user: LoginUser
const token = localStorage.getItem('token')

if (token) {
  const decodedToken: any = jwtDecode(token)
  const expiresAt = new Date(decodedToken.exp * 1000)

  if (new Date() > expiresAt) {
    localStorage.removeItem('token')
  } else {
    user = decodedToken
  }
} else console.log('No token found')

const authReducer = (state: State, action: Action): State => {
  const { type, payload } = action

  switch (type) {
    case ActionKind.Login:
      localStorage.setItem('token', payload.token)
      return {
        ...state,
        user: payload,
      }
    case ActionKind.Logout:
      localStorage.removeItem('token')
      return {
        ...state,
        user: null,
      }
    default:
      throw new Error(`Unknown action type: ${type}`)
  }
}

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(authReducer, { user })

  return (
    <AuthStateContext.Provider value={state}>
      <AuthDispatchContext.Provider value={dispatch}>
        {children}
      </AuthDispatchContext.Provider>
    </AuthStateContext.Provider>
  )
}

export const useAuthState = () => useContext(AuthStateContext)
export const useAuthDispatch = () => useContext(AuthDispatchContext)
