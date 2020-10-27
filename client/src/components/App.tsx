import React from 'react'
import {
  BrowserRouter,
  Switch,
  Route,
} from 'react-router-dom'
import PrivateRoute from './PrivateRoute'
import Login from './Login'
import '../styles/index.scss'
import BusinessRegistration from './BusinessRegistration'
import Signup from './Signup'
import UploadItem from './UploadPortfolioItem'
import BusinessPortfolio from './BusinessPortfolio'

const AppRoutes = () => {
  return (
    <Switch>
      <Route exact path='/signup'>
        <Signup />
      </Route>
      <Route exact path='/test'>
        <UploadItem handle='natehood' />
      </Route>

      <Route exact path='/login'>
        <Login />
      </Route>
      <PrivateRoute exact path='/business/register'>
        <BusinessRegistration />
      </PrivateRoute>
      <Route exact path='/'>
        <BusinessPortfolio />
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
