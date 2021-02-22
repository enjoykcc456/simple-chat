import React from 'react'
import { Route, Redirect, RouteProps } from 'react-router-dom'

import { useAuthState } from '../../context/auth.context'

interface AuthRouteProps extends RouteProps {
  component: React.ComponentType<any>
}

const AuthRoute: React.FC<AuthRouteProps> = ({
  component: Component,
  ...rest
}: AuthRouteProps) => {
  const { user }: { [key: string]: string } = useAuthState()

  return (
    <Route
      {...rest}
      render={props => (user ? <Redirect to="/" /> : <Component {...props} />)}
    />
  )
}

export default AuthRoute
