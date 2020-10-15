import React from 'react'
import { BrowserRouter, Switch, Route, Link } from 'react-router-dom'
import Login from './Login'
import '../styles/index.css'
import Backend from '../Backend'
import BusinessRegistration from './BusinessRegistration'

const backend = new Backend('http://localhost:8000')

// import * as logo from '../assets/SpackleLogo.png'
// const logo = [require('../assets/SpackleLogo.png')]

const AppRoutes = () => {
  return (
    <Switch>
      <Route exact path='/'>
        <Login backend={backend}/>
      </Route>
      <Route path='/business/register'>
        <BusinessRegistration backend={backend}/>
      </Route>
      <Route path='/dashboard'>
        <Link to='/dashboard/portfolio'>
          dashboard portfolio
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
