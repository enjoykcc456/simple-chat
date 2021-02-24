import React, { useEffect } from 'react'
import { gql, useLazyQuery } from '@apollo/client'
import { Col } from 'react-bootstrap'

import {
  MessageUser,
  useMessageDispatch,
  useMessageState,
} from '../../../context/message.context'
import { ActionKind } from '../../../context/message.context'

export interface Message {
  uuid: string
  content: string
  from: string
  to: string
  createdAt: string
}

const GET_MESSAGES = gql`
  query getMessages($from: String!) {
    getMessages(from: $from) {
      uuid
      content
      from
      to
      createdAt
    }
  }
`

const Messages = () => {
  const { users }: any = useMessageState()
  const dispatch: any = useMessageDispatch()

  const selectedUser = users?.find(
    (user: MessageUser) => user.selected === true
  )
  const messages = selectedUser?.messages

  const [
    getMessages,
    { loading: messagesLoading, data: messagesData },
  ] = useLazyQuery(GET_MESSAGES)

  useEffect(() => {
    if (selectedUser && !selectedUser.messages) {
      getMessages({ variables: { from: selectedUser.email } })
    }
  }, [selectedUser])

  useEffect(() => {
    if (messagesData) {
      console.log('dispatching')
      dispatch({
        type: ActionKind.SetUserMessages,
        payload: {
          email: selectedUser.email,
          messages: messagesData.getMessages,
        },
      })
    }
  }, [messagesData])

  let selectedChatMarkup
  if (!messages && !messagesLoading) {
    selectedChatMarkup = <p>Select a friend...</p>
  } else if (messagesLoading) {
    selectedChatMarkup = <p>Loading...</p>
  } else if (messages.length > 0) {
    selectedChatMarkup = messages.map((message: Message) => (
      <p key={message.uuid}>{message.content}</p>
    ))
  } else if (messages.length === 0) {
    selectedChatMarkup = <p>You are now connected! Send your first message!</p>
  }

  return <Col xs={8}>{selectedChatMarkup}</Col>
}

export default Messages
