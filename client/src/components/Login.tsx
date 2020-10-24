import React, { useEffect, useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import LabeledInput from './LabeledInput'
import '../styles/Login.scss'
import {login, hasAuthToken} from '../Backend'

const Login: React.FC = () => {
  const history = useHistory()
  const [username, setUsername] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [usernameErr, setUsernameErr] = useState<string>('')
  const [passwordErr, setPasswordErr] = useState<string>('')

  useEffect(() => {
    if (hasAuthToken()) {
      history.replace('/')
    }
  }, [])

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()

    try {
      await login(username, password)
      history.push('/home')
    } catch (err) {
      switch(err.message) {
      case 'UserNotFound':
        setUsernameErr('No user found with this username')
        break
      case 'IncorrectPassword':
        setPasswordErr('Incorrect password')
        break
      default:
        alert('Sorry, an unexpected error occurred. Please try again later.')
      }
    }
  }

  return (
    <div className="center">
      <form>
        <h1>SPACKLE</h1>
        <LabeledInput
          description=""
          error={usernameErr}
          inputType="input"
          label="Username"
          htmlAttrs={{
            pattern: '^[-_.a-zA-Z0-9]+$',
            placeholder: 'username',
            required: true,
            type: 'text',
            value: username,
            maxLength : 20,
            onChange: e => {
              setUsername(e.target.value)
              setUsernameErr('')
            },
          }}
        />

        <LabeledInput
          description=""
          error={passwordErr}
          inputType="input"
          label="Password"
          htmlAttrs={{
            placeholder: 'password',
            required: true,
            type: 'password',
            value: password,
            minLength : 8,
            maxLength : 64,
            onChange: e => {
              setPassword(e.target.value)
              setPasswordErr('')
            },
          }}
        />

        <div className="link-signup">
          Need to create an account?
          <Link to='/signup'> Click here!</Link>
        </div>

        <button
          className="btn-plain"
          type="submit"
          onClick={handleSubmit}
          disabled={!username || !password}>
          Login
        </button>
      </form>
    </div>
  )
}

export default Login
