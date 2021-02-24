import React from 'react'
import { Col, Image } from 'react-bootstrap'
import { gql, useQuery } from '@apollo/client'
import { MessageUser } from '../../../context/message.context'
import {
  useMessageState,
  useMessageDispatch,
  ActionKind,
} from '../../../context/message.context'

const GET_USERS = gql`
  query getUsers {
    getUsers {
      username
      email
      imageUrl
      createdAt
      latestMessage {
        uuid
        from
        to
        content
        createdAt
      }
    }
  }
`

const Users = () => {
  const { users }: any = useMessageState()
  const selectedUser = users?.find(
    (user: MessageUser) => user.selected === true
  )?.email
  const dispatch: any = useMessageDispatch()

  const { loading } = useQuery(GET_USERS, {
    onCompleted: data =>
      dispatch({ type: ActionKind.SetUsers, payload: data.getUsers }),
    onError: err => console.log(err),
  })

  let usersMarkup
  if (!users || loading) {
    usersMarkup = <p>Loading...</p>
  } else if (users.length === 0) {
    usersMarkup = <p>No user...</p>
  } else if (users.length > 0) {
    usersMarkup = users.map((user: MessageUser) => (
      <div
        role="button"
        className={`user-div d-flex p-3 ${
          selectedUser === user.email ? 'bg-white' : ''
        }`}
        key={user.email}
        onClick={() =>
          dispatch({ type: ActionKind.SetSelectedUser, payload: user.email })
        }
      >
        <Image
          src={user.imageUrl}
          roundedCircle
          className="mr-2"
          style={{ width: 50, height: 50, objectFit: 'cover' }}
        />
        <div>
          <p className="text-success">{user.username}</p>
          <p className="font-weight-light">
            {user.latestMessage
              ? user.latestMessage.content
              : 'You are now connected!'}
          </p>
        </div>
      </div>
    ))
  }
  return (
    <Col xs={4} className="p-0 bg-secondary">
      {usersMarkup}
    </Col>
  )
}

export default Users
