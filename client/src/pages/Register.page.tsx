import React, { useState } from 'react'
import { Row, Col, Form, Button, Card } from 'react-bootstrap'
import { gql, useMutation } from '@apollo/client'
import { RouteComponentProps, Link } from 'react-router-dom'

interface RegisterData {
  username: string
  email: string
  password: string
  confirmPassword: string
}

export interface Error {
  username?: string
  email?: string
  password?: string
  confirmPassword?: string
}

const REGISTER_USER = gql`
  mutation registerUser(
    $username: String!
    $email: String!
    $password: String!
    $confirmPassword: String!
  ) {
    registerUser(
      username: $username
      email: $email
      password: $password
      confirmPassword: $confirmPassword
    ) {
      username
      email
      createdAt
    }
  }
`

const RegisterPage: React.FC<RouteComponentProps> = props => {
  const [formVars, setFormVars] = useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
  })
  const [errors, setErrors] = useState<Error>({})

  const [registerUser, { loading }] = useMutation<{
    registerUser: RegisterData
  }>(REGISTER_USER, {
    update: (_, __) => props.history.push('/login'),
    onError: err => setErrors(err.graphQLErrors[0].extensions?.errors),
    variables: formVars,
  })

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault()
    registerUser()
  }

  return (
    <div>
      <Row className="justify-content-center">
        <Col sm={8} md={6} lg={4}>
          <Card className="card bg-white py-5 px-4">
            <h1 className="text-center">Register</h1>
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
                <Form.Label className={errors.username && 'text-danger'}>
                  {errors.username ?? 'Username'}
                </Form.Label>
                <Form.Control
                  type="text"
                  value={formVars.username}
                  className={errors.username && 'is-invalid'}
                  onChange={e =>
                    setFormVars({ ...formVars, username: e.target.value })
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
              <Form.Group>
                <Form.Label className={errors.confirmPassword && 'text-danger'}>
                  {errors.confirmPassword ?? 'Confirm Password'}
                </Form.Label>
                <Form.Control
                  type="password"
                  value={formVars.confirmPassword}
                  className={errors.confirmPassword && 'is-invalid'}
                  onChange={e =>
                    setFormVars({
                      ...formVars,
                      confirmPassword: e.target.value,
                    })
                  }
                />
              </Form.Group>
              <div className="d-flex flex-column pt-2">
                <Button variant="success" type="submit" disabled={loading}>
                  {loading ? 'Loading...' : 'Register'}
                </Button>
                <small className="pt-2">
                  Already have an account? <Link to="/login">Login</Link>
                </small>
              </div>
            </Form>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default RegisterPage
