import React, { Fragment } from 'react'
import { Link } from 'react-router-dom'
import { Row, Button, Col } from 'react-bootstrap'
import { gql, useQuery } from '@apollo/client'

import { useAuthDispatch, ActionKind, User } from '../context/auth.context'

const GET_USERS = gql`
  query getUsers {
    getUsers {
      username
      email
      createdAt
    }
  }
`

const HomePage = ({ history }: { history: any }) => {
  const dispatch: any = useAuthDispatch()

  const handleLogout = () => {
    dispatch({ type: ActionKind.Logout })
    history.push('/login')
  }

  const { loading, data, error } = useQuery(GET_USERS)

  if (error) {
    console.log(error)
  }

  if (data) {
    console.log(data)
  }

  let usersMarkup
  if (!data || loading) {
    usersMarkup = <p>Loading...</p>
  } else if (data.getUsers.length === 0) {
    usersMarkup = <p>No user...</p>
  } else if (data.getUsers.length > 0) {
    usersMarkup = data.getUsers.map((user: User) => (
      <div key={user.email}>
        <p>{user.username}</p>
      </div>
    ))
  }

  return (
    <Fragment>
      <Row className="bg-white justify-content-center">
        <Link to="/login">
          <Button variant="link">Login</Button>
        </Link>
        <Link to="/register">
          <Button variant="link">Register</Button>
        </Link>
        <Button variant="link" onClick={handleLogout}>
          Logout
        </Button>
      </Row>
      <Row>
        <Col xs={4}>{usersMarkup}</Col>
        <Col xs={8}></Col>
      </Row>
    </Fragment>
  )
}

export default HomePage
