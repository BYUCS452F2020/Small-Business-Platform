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
import Backend from '../Backend'
import BusinessRegistration from './BusinessRegistration'
import Signup from './Signup'

const backend = new Backend('http://localhost:8000')

const AppRoutes = () => {
  return (
    <Switch>
      <Redirect exact from="/" to="/home" />
      <Route exact path='/signup'>
        <Signup backend={backend} />
      </Route>
      <Route exact path='/login'>
        <Login backend={backend}/>
      </Route>
      <PrivateRoute exact path='/business/register'>
        <BusinessRegistration backend={backend}/>
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
