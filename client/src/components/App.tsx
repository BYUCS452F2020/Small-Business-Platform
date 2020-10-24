import React from 'react'
import { BrowserRouter, Switch, Route, Link } from 'react-router-dom'
import Login from './Login'
import '../styles/index.css'
import Backend from '../Backend'
import BusinessRegistration from './BusinessRegistration'
import Signup from './SignUp'
import UserPortfolio from './UserPortfolio'

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
      <Route path='/home/user'>
        <UserPortfolio />
      </Route>
      <Route path='/home'>
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
