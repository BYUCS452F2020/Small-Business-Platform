import React from 'react'
import {Route, RouteProps, Redirect} from 'react-router-dom'
import Backend from '../Backend'

const PrivateRoute: React.FC<React.PropsWithChildren<RouteProps>> = (
  {children, ...rest}: React.PropsWithChildren<RouteProps>,
) => {
  return <Route {...rest} render={({location}) => {
    if (Backend.hasAuthToken()) {
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
