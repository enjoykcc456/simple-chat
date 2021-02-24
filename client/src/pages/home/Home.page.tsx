import React, { useState, Fragment } from 'react'
import { Link } from 'react-router-dom'
import { Row, Button, Card } from 'react-bootstrap'

import { useAuthDispatch, ActionKind, User } from '../../context/auth.context'
import Users from './components/Users.component'
import Messages from './components/Messages.component'

const HomePage = ({ history }: { history: any }) => {
  const dispatch: any = useAuthDispatch()

  const handleLogout = () => {
    dispatch({ type: ActionKind.Logout })
    history.push('/login')
  }

  return (
    <Fragment>
      <Row className="justify-content-center mb-2">
        <Card className="card flex-grow-1 flex-row justify-content-around">
          <Link to="/login">
            <Button variant="link">Login</Button>
          </Link>
          <Link to="/register">
            <Button variant="link">Register</Button>
          </Link>
          <Button variant="link" onClick={handleLogout}>
            Logout
          </Button>
        </Card>
      </Row>
      <Row>
        <Card className="flex-row flex-grow-1 overflow-hidden">
          <Users />
          <Messages />
        </Card>
      </Row>
    </Fragment>
  )
}

export default HomePage
