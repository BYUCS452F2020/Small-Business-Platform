import React from 'react'
import {
  BrowserRouter,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom'
import PrivateRoute from './PrivateRoute'
import Login from './Login'
import '../styles/index.scss'
import BusinessRegistration from './BusinessRegistration'
import Signup from './Signup'
import UserPortfolio from './BusinessPortfolio'

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
      <Route exact path='/home/user'>
        <UserPortfolio />
      </Route>
      <PrivateRoute exact path='/home'>
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
