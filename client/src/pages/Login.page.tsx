import React, { useState, useContext } from 'react'
import { gql, useLazyQuery } from '@apollo/client'
import { Row, Col, Form, Button, Card } from 'react-bootstrap'
import { Link, RouteComponentProps } from 'react-router-dom'

import { Error } from './Register.page'
import { useAuthDispatch, ActionKind } from '../context/auth.context'

interface LoginVars {
  email: string
  password: string
}

interface LoginData {
  login: {
    email: string
    username: string
    token: string
    createdAt: string
  }
}

const LOGIN_USER = gql`
  query login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      username
      email
      createdAt
      token
    }
  }
`

const LoginPage: React.FC<RouteComponentProps> = props => {
  const [formVars, setFormVars] = useState({
    email: '',
    password: '',
  })
  const [errors, setErrors] = useState<Error>({})
  const dispatch: any = useAuthDispatch()

  const [login, { loading }] = useLazyQuery<LoginData, LoginVars>(LOGIN_USER, {
    onError: err => {
      console.log(err.graphQLErrors[0].extensions?.errors)
      setErrors(err.graphQLErrors[0].extensions?.errors)
    },
    onCompleted(data) {
      dispatch({ type: ActionKind.Login, payload: data.login })
      props.history.push('/')
    },
  })

  const loginUser = () => {
    login({ variables: formVars })
  }

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault()
    loginUser()
  }

  return (
    <div>
      <Row className="justify-content-center">
        <Col sm={8} md={6} lg={4}>
          <Card className="card bg-white py-5 px-4">
            <h1 className="text-center">Login</h1>
            <Form onSubmit={handleSubmitForm}>
              <Form.Group>
                <Form.Label className={errors.email && 'text-danger'}>
                  {errors.email ?? 'Email address'}
                </Form.Label>
                <Form.Control
                  type="email"
                  value={formVars.email}
                  className={errors.email && 'is-invalid'}
                  onChange={e =>
                    setFormVars({ ...formVars, email: e.target.value })
                  }
                />
              </Form.Group>
              <Form.Group>
                <Form.Label className={errors.password && 'text-danger'}>
                  {errors.password ?? 'Password'}
                </Form.Label>
                <Form.Control
                  type="password"
                  value={formVars.password}
                  className={errors.password && 'is-invalid'}
                  onChange={e =>
                    setFormVars({ ...formVars, password: e.target.value })
                  }
                />
              </Form.Group>
              <div className="d-flex flex-column pt-2">
                <Button variant="success" type="submit" disabled={loading}>
                  {loading ? 'Loading...' : 'Login'}
                </Button>
                <small className="pt-2">
                  Don't have an account? <Link to="/register">Register</Link>
                </small>
              </div>
            </Form>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default LoginPage
