import React, { useState } from 'react'
import { Container } from 'react-bootstrap'
import { BrowserRouter, Route, Switch } from 'react-router-dom'

import './App.scss'
import ApolloProvider from './ApolloProvider'
import { AuthProvider } from './context/auth.context'
import HomePage from './pages/Home.page'
import LoginPage from './pages/Login.page'
import RegisterPage from './pages/Register.page'
import AuthRoute from './common/utils/AuthRoute'

function App() {
  return (
    <ApolloProvider>
      <AuthProvider>
        <BrowserRouter>
          <Container className="pt-5">
            <Switch>
              <Route exact path="/" component={HomePage} />
              <AuthRoute path="/login" component={LoginPage} />
              <AuthRoute path="/register" component={RegisterPage} />
            </Switch>
          </Container>
        </BrowserRouter>
      </AuthProvider>
    </ApolloProvider>
  )
}

export default App
