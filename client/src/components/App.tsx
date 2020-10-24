import React from 'react'
import { BrowserRouter, Switch, Route, Link } from 'react-router-dom'
import Login from './Login'
import '../styles/index.scss'
import Backend from '../Backend'
import BusinessRegistration from './BusinessRegistration'
import Signup from './SignUp'

const backend = new Backend('http://localhost:8000')

const AppRoutes = () => {
  return (
    <Switch>
      <Route  path='/signup'>
        <Signup backend={backend} />
      </Route>
      <Route exact path='/'>
        <Login backend={backend}/>
      </Route>
      <Route path='/business/register'>
        <BusinessRegistration backend={backend}/>
      </Route>
      <Route path='/home'>
        <Link to='/home/user'>
          user portfolio
        </Link>
        <br/>
        <Link to='/business/register'>
          register business
        </Link>
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
