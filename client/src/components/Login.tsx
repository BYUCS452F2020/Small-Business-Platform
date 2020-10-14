import React from 'react'
import { useHistory } from 'react-router-dom'
import '../styles/Login.css'
// import img from '../assets/image.jpg'

const LoginComponent: React.FC = () => {
  const history = useHistory()

  const handleLogin = () => {
    history.push('/dashboard')
  }

  return (
    <div className="center">
      <h1>SPACKLE</h1>
      {/* <img src={img} alt="logo" /> */}
      <div onClick={handleLogin}>
        <button className="button-style"> Get Started </button>
      </div>

    </div>
  )
}

export default LoginComponent