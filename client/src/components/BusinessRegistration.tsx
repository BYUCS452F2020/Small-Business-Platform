import React, {useState} from 'react'
import LabeledInput from './LabeledInput'
import FileUpload from './FileUpload'
import '../styles/business-registration.scss'
import Backend from 'Backend'

interface Props {backend: Backend}

const BusinessRegistration: React.FC<Props> = ({backend}: Props) => {
  const [name, setName] = useState<string>('')
  const [handle, setHandle] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [website, setWebsite] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const [logo, setLogo] = useState<File|null>(null)
  const [handleError, setHandleError] = useState<string>('')
  const [nameError, setNameError] = useState<string>('')

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()

    let logoBase64: Promise<string|null>

    if (logo) {
      logoBase64 = new Promise(resolve => {
        const reader = new FileReader()
        reader.addEventListener('load', () => {
          resolve(reader.result && reader.result.toString())
        })
        reader.readAsDataURL(logo)
      })
    } else {
      logoBase64 = Promise.resolve(null)
    }

    const business = {
      name: name,
      handle: handle,
      email: email,
      website: website || undefined,
      description: description || undefined,
      logo: await logoBase64 || undefined,
    }

    try {
      await backend.registerBusiness(business)
      // TODO: navigate to business page instead of alerting
      alert('Business registered!')
    } catch (err) {
      if(err.message === 'BusinessNameTaken'){
        setNameError('This name is already taken')
      }
      else if(err.message === 'BusinessHandleTaken'){
        setHandleError('This handle is already taken')
      }
      else{
        alert(err.message)
      }
    }
  }

  return (
    <section className='bus-reg'>
      <h2>Add Your Business</h2>
      <form onSubmit={handleSubmit}>
        <LabeledInput
          error={nameError}
          inputType="input"
          label="Name"
          htmlAttrs={{
            placeholder: 'Awesome Company',
            required: true,
            type: 'text',
            value: name,
            onChange: (e) => {
              setName(e.target.value)
              setNameError('')
            },
          }}
        />

        <LabeledInput
          description="letters, numbers, periods, dashes, and underscores only"
          error={handleError}
          inputType="input"
          label="Handle"
          htmlAttrs={{
            pattern: '^[-_.a-zA-Z0-9]+$',
            placeholder: 'awesomeco',
            required: true,
            type: 'text',
            value: handle,
            onChange: (e) =>{
              setHandle(e.target.value)
              setHandleError('')
            },
          }}
        />

        <LabeledInput
          inputType="input"
          label="Email"
          htmlAttrs={{
            placeholder: 'hello@awesome.co',
            required: true,
            type: 'email',
            value: email,
            onChange: e => setEmail(e.target.value),
          }}
        />

        <LabeledInput
          inputType="input"
          label="Website"
          htmlAttrs={{
            placeholder: 'https://awesome.co',
            type: 'url',
            value: website,
            onChange: e => setWebsite(e.target.value),
          }}
        />

        <LabeledInput
          description="max 100 characters"
          inputType="textarea"
          label="Description"
          htmlAttrs={{
            maxLength: 100,
            placeholder: 'An awesome company with awesome products and services',
            value: description,
            onChange: e => setDescription(e.target.value),
          }}
        />

        <FileUpload
          label="Logo"
          accept={['.jpg', '.png']}
          onChange={setLogo}
        />

        <button
          className="btn-plain"
          type="submit">
          Create
        </button>
      </form>
    </section>
  )
}

export default BusinessRegistration
