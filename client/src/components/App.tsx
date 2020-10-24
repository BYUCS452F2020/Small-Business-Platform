import React from 'react'
import {
  BrowserRouter,
  Switch,
  Route,
  Link,
  Redirect,
} from 'react-router-dom'
import PrivateRoute from './PrivateRoute'
import Login from './Login'
import '../styles/index.scss'
import BusinessRegistration from './BusinessRegistration'
import Signup from './Signup'
import UserPortfolio from './UserPortfolio'

const AppRoutes = () => {
  return (
    <Switch>
      <Redirect exact from="/" to="/home" />
      <Route exact path='/signup'>
        <Signup />
      </Route>
      <Route exact path='/login'>
        <Login />
      </Route>
      <PrivateRoute exact path='/business/register'>
        <BusinessRegistration />
      </PrivateRoute>
      <PrivateRoute exact path='/home'>
        <Link to='/home/user'>
          user portfolio
        </Link>
        <br/>
        <Link to='/business/register'>
          register business
        </Link>
      </PrivateRoute>
      <Route path='*'>
        404 Not Found
      </Route>
    </Switch>
  )
}

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  )
}

export default App
