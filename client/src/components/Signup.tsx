import React, { FormEvent, useEffect, useState }from 'react'
import { Link, useHistory } from 'react-router-dom'
import LabeledInput from './LabeledInput'
import '../styles/Signup.scss'
import Backend from '../Backend'

interface Props {backend: Backend}

const Signup: React.FC<Props> = ({backend}: Props) => {
  const history = useHistory()
  const [firstName, setFirstName] = useState<string>('')
  const [lastName, setLastName] = useState<string>('')
  const [username, setUsername] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [confirmedPassword, setConfirmedPassword] = useState<string>('')
  const [usernameErr, setUsernameErr] = useState<string>('')
  const [confirmedPasswordErr, setConfirmedPasswordErr] = useState<string>('')

  useEffect(() => {
    if (confirmedPassword && password !== confirmedPassword) {
      setConfirmedPasswordErr('This password doesn\'t match the one entered above')
    } else {
      setConfirmedPasswordErr('')
    }
  }, [password, confirmedPassword])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    try {
      await backend.signup({firstName, lastName, username, email}, password)
      history.push('/business/register')
    } catch (err) {
      if (err.message === 'UsernameTaken') {
        setUsernameErr('This username has already been taken')
      } else {
        alert('Sorry, an unexpected error occurred. Please try again later.')
      }
    }
  }

  return (
    <div className="center">
      <form onSubmit={handleSubmit}>
        <h1>Sign up </h1>
        <LabeledInput
          description=""
          inputType="input"
          label="First Name"
          htmlAttrs={{
            placeholder: 'Jane',
            required: true,
            type: 'text',
            value: firstName,
            maxLength : 20,
            onChange: e => setFirstName(e.target.value),
          }}
        />

        <LabeledInput
          description=""
          inputType="input"
          label="Last Name"
          htmlAttrs={{
            placeholder: 'Doe',
            required: true,
            type: 'text',
            value: lastName,
            maxLength : 20,
            onChange: e => setLastName(e.target.value),
          }}
        />

        <LabeledInput
          description="letters, numbers, periods, dashes, and underscores only"
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
              setUsernameErr('')
              setUsername(e.target.value)
            },
          }}
        />

        <LabeledInput
          description=""
          inputType="input"
          label="Email"
          htmlAttrs={{
            placeholder: 'you@email.com',
            required: true,
            type: 'email',
            value: email,
            minLength : 5,
            maxLength : 32,
            onChange: e => setEmail(e.target.value),
          }}
        />
        <LabeledInput
          inputType="input"
          label="Password"
          htmlAttrs={{
            placeholder: 'password',
            required: true,
            type: 'Password',
            value: password,
            minLength : 8,
            maxLength : 64,
            onChange: e => setPassword(e.target.value),
          }}
        />

        <LabeledInput
          description=""
          error={confirmedPasswordErr}
          inputType="input"
          label="Confirm password"
          htmlAttrs={{
            placeholder: 'confirm password',
            required: true,
            type: 'password',
            value: confirmedPassword,
            minLength: 8,
            maxLength: 64,
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
          disabled={!firstName || !lastName || !username || !email ||
            !password || !confirmedPassword || !!confirmedPasswordErr}
        >
          Next
        </button>
      </form>
    </div>
  )
}

export default Signup
