import React, { createContext, useContext, useReducer } from 'react'

import { Message } from '../pages/home/components/Messages.component'

export enum ActionKind {
  SetUsers = 'SET_USERS',
  SetSelectedUser = 'SET_SELECTED_USER',
  SetUserMessages = 'SET_USER_MESSAGES',
}

export interface User {
  username: string
  email: string
  createdAt: string
  __typename: string
}

export interface MessageUser extends User {
  imageUrl: string
  latestMessage: Message
  selected?: boolean
}

interface LoginResponse extends User {
  token: string
}

interface SetUserMessage {
  email: string
  messages: any
}

export type Action = {
  type: ActionKind
  payload: LoginResponse | SetUserMessage | string
}

interface State {
  users: any | null
}

const MessageStateContext = createContext({})
const MessageDispatchContext = createContext({})

const messageReducer = (state: State, action: Action): State => {
  const { type, payload } = action
  let usersCopy
  switch (type) {
    case ActionKind.SetUsers:
      return {
        ...state,
        users: payload,
      }
    case ActionKind.SetSelectedUser:
      usersCopy = state.users.map((user: MessageUser) => ({
        ...user,
        selected: user.email === payload,
      }))

      return {
        ...state,
        users: usersCopy,
      }
    case ActionKind.SetUserMessages:
      const { email, messages } = payload as SetUserMessage
      usersCopy = [...state.users]

      const userIndex = usersCopy.findIndex(user => user.email === email)
      usersCopy[userIndex] = { ...usersCopy[userIndex], messages }

      return {
        ...state,
        users: usersCopy,
      }
    default:
      throw new Error(`Unknown action type: ${type}`)
  }
}

export const MessageProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const [state, dispatch] = useReducer(messageReducer, { users: null })

  return (
    <MessageStateContext.Provider value={state}>
      <MessageDispatchContext.Provider value={dispatch}>
        {children}
      </MessageDispatchContext.Provider>
    </MessageStateContext.Provider>
  )
}

export const useMessageState = () => useContext(MessageStateContext)
export const useMessageDispatch = () => useContext(MessageDispatchContext)
