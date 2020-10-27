import React from 'react'
import {
  BrowserRouter,
  Switch,
  Route,
  useParams,
} from 'react-router-dom'
import PrivateRoute from './PrivateRoute'
import Login from './Login'
import '../styles/index.scss'
import BusinessRegistration from './BusinessRegistration'
import Signup from './SignUp'
import BusinessPortfolio from './BusinessPortfolio'
import NotFound from './NotFound'

const PortfolioWrapper: React.FC = () => (
  <BusinessPortfolio handle={(useParams() as {handle: string}).handle} />
)

const AppRoutes = () => {
  return (
    <Switch>
      <Route exact path='/signup'>
        <Signup />
      </Route>
      <Route exact path='/login'>
        <Login />
      </Route>
      <PrivateRoute exact path='/business/register'>
        <BusinessRegistration />
      </PrivateRoute>
      <Route exact path='/b/:handle'>
        <PortfolioWrapper />
      </Route>
      <PrivateRoute exact path='/'>
        HOME
      </PrivateRoute>
      <Route path='*'>
        <NotFound />
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