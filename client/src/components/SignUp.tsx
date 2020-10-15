import React, { FormEvent, useState }from 'react'
import { Link, useHistory } from 'react-router-dom'
import LabeledInput from './LabeledInput'
import '../styles/Signup.css'
import Backend from 'Backend'

interface Props {backend: Backend}

const Signup: React.FC<Props> = ({backend}: Props) => {
  const history = useHistory()
  const [firstName, setFirstName] = useState<string>('')
  const [lastName, setLastName] = useState<string>('')
  const [username, setUsername] = useState<string>('')
  const [email, setEmail] = useState<string>('')
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
      <form>
        <h1>Sign up </h1>
        <LabeledInput
          description=""
          inputType="input"
          label="First Name"
          htmlAttrs={{
            pattern: '^[-_.a-zA-Z]+$',
            placeholder: 'Jane',
            required: true,
            type: 'text',
            value: firstName,
            onChange: e => setFirstName(e.target.value),
          }}
        />

        <LabeledInput
          description=""
          inputType="input"
          label="Last Name"
          htmlAttrs={{
            pattern: '^[-_.a-zA-Z]+$',
            placeholder: 'Doe',
            required: true,
            type: 'text',
            value: lastName,
            onChange: e => setLastName(e.target.value),
          }}
        />

        <LabeledInput
          description="letters, numbers, periods, dashes, and underscores only"
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
          description="must contain @ symbol"
          inputType="input"
          label="Email"
          htmlAttrs={{
            placeholder: 'you@email.com',
            required: true,
            type: 'email',
            value: email,
            onChange: e => setEmail(e.target.value),
          }}
        />
        <LabeledInput
          description="must include at least one capital letter, number, and symbol"
          inputType="input"
          label="Password"
          htmlAttrs={{
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
          disabled={!firstName || !lastName ||
                    !username || !email || !password || !confirmedPassword}
          onClick={handleSubmit}>
          Next
        </button>
      </form>
    </div>
  )
}

export default Signup
