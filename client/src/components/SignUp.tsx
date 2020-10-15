import React, { FormEvent, useState }from 'react'
import { Link, useHistory } from 'react-router-dom'
import LabeledInput from './LabeledInput'
import '../styles/Signup.css'
import Backend from 'Backend'

interface Props {backend: Backend}

const Signup: React.FC<Props> = ({backend}: Props) => {
  const history = useHistory()
  const [username, setUsername] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [confirmedPassword, setConfirmedPassword] = useState<string>('')

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    console.log('clicked')
    history.push('/business/register')

    // TODO: Verify that the passwords match
    // TODO: Send info to the backend
    // TODO: If everything checks out, history.push('/business/register')
  }

  return (
    <div className="center">
      <h1>Sign up </h1>
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
            type: 'Password',
            value: password,
            onChange: e => setPassword(e.target.value),
          }}
        />

        <LabeledInput
          description=""
          inputType="input"
          label="Confirm password"
          htmlAttrs={{
            pattern: '^[-_.a-zA-Z0-9]+$',
            placeholder: 'confirm password',
            required: true,
            type: 'password',
            value: confirmedPassword,
            onChange: e => setConfirmedPassword(e.target.value),
          }}
        />
        <div className="link-login">
          Already have an account?
          <Link to='/'> Click here!</Link>
        </div>

        <button
          className="btn-plain"
          type="submit"
          disabled={!username || !password || !confirmedPassword}
          onClick={handleSubmit}>
          Next
        </button>
      </div>
    </div>
  )
}

export default Signup