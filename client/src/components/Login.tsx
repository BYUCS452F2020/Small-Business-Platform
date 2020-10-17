import React, { useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import LabeledInput from './LabeledInput'
import '../styles/Login.css'
import Backend from 'Backend'

interface Props {backend: Backend}

const Login: React.FC<Props> = ({backend}: Props) => {
  const history = useHistory()
  const [username, setUsername] = useState<string>('')
  const [password, setPassword] = useState<string>('')

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()

    const user = {
      username: username,
      password: password,
    }

    console.log('Logging in user', user)
    history.push('/home')
    // TODO : Implement login with backend
  }

  return (
    <div className="center-login">
      <h1>SPACKLE</h1>
      <div>
        <LabeledInput
          description=""
          inputType="input"
          label="Username"
          htmlAttrs={{
            pattern: '^[-_.a-zA-Z0-9]+$',
            placeholder: 'username',
            required: true,
            type: 'text',
            value: username,
            maxLength : 20,
            onChange: e => setUsername(e.target.value),
          }}
        />

        <LabeledInput
          description=""
          inputType="input"
          label="Password"
          htmlAttrs={{
            placeholder: 'password',
            required: true,
            type: 'password',
            value: password,
            minLength : 8,
            maxLength : 64,
            onChange: e => setPassword(e.target.value),
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
      </div>

    </div>
  )
}

export default Login