import React, { useState } from 'react'
import { Container } from 'react-bootstrap'
import { BrowserRouter, Route, Switch } from 'react-router-dom'

import './App.scss'
import ApolloProvider from './ApolloProvider'
import HomePage from './pages/Home.page'
import LoginPage from './pages/Login.page'
import RegisterPage from './pages/Register.page'

function App() {
  return (
    <ApolloProvider>
      <BrowserRouter>
        <Container className="pt-5">
          <Switch>
            <Route exact path="/" component={HomePage} />
            <Route path="/login" component={LoginPage} />
            <Route path="/register" component={RegisterPage} />
          </Switch>
        </Container>
      </BrowserRouter>
    </ApolloProvider>
  )
}

export default App
