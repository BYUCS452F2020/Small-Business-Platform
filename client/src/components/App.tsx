import React from 'react'
import '../styles/index.scss'
import Backend from '../Backend'
import BusinessRegistration from './BusinessRegistration'

const backend = new Backend('http://localhost:8000')

const App: React.FC = () => {
  return (
    <>
      <h1>Hello Spackle!</h1>
      <BusinessRegistration backend={backend}/>
    </>
  )
}

export default App
