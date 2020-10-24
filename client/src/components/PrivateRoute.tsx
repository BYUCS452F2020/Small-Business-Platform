import React from 'react'
import {Route, RouteProps, Redirect} from 'react-router-dom'
import {hasAuthToken} from '../Backend'

const PrivateRoute: React.FC<React.PropsWithChildren<RouteProps>> = (
  {children, ...rest}: React.PropsWithChildren<RouteProps>,
) => {
  return <Route {...rest} render={({location}) => {
    if (hasAuthToken()) {
      return children
    } else {
      return (
        <Redirect to={{
          pathname: '/login',
          state: {from: location},
        }}/>
      )
    }
  }} />
}

export default PrivateRoute
