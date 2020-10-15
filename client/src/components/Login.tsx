import React, { useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import LabeledInput from './LabeledInput'
import '../styles/Login.css'
import Backend from 'Backend'
// import img from '../assets/image.jpg'

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
    // try {
    //   // await backend.loginUser(user)

    //   // TODO: navigate to business page instead of alerting
    //   alert('Business registered!')
    // } catch (err) {
    //   console.error('registering business failed', err)
    //   alert('Sorry, an unexpected error occurred. Please try again later.')
    // }
  }

  return (
    <div className="center">
      <h1>SPACKLE</h1>
      {/* <img src={img} alt="logo" /> */}
      <div>
        <LabeledInput
          description="No spaces"
          inputType="input"
          label="Username"
          htmlAttrs={{
            pattern: '^[-_.a-zA-Z0-9]+$',
            placeholder: 'username',
            required: true,
            type: 'text',
            value: username,
            onChange: e => setUsername(e.target.value),
          }}
        />

        <LabeledInput
          description="Must include at least one capital letter, number, and symbol"
          inputType="input"
          label="Password"
          htmlAttrs={{
            pattern: '^[-_.a-zA-Z0-9]+$',
            placeholder: 'password',
            required: true,
            type: 'password',
            value: password,
            onChange: e => setPassword(e.target.value),
          }}
        />

        <div className="button-signup">
          Need to create an account?
          <Link to='/signup'> Click here!</Link>
        </div>

        <button className="button-style" onClick={handleSubmit} disabled={!username || !password}> Login </button>
      </div>

    </div>
  )
}

export default Login