import React, { FormEvent, useState } from 'react'
import FileUpload from './FileUpload'
import '../styles/upload-portfolio-item.scss'
import { addPortfolioItem } from '../Backend'
import LabeledInput from './LabeledInput'

interface Props {
  handle: string
  onSuccess: () => void
}

const UploadPortfolioItem: React.FC<Props> = ({handle, onSuccess}: Props) => {
  const [description, setDescription] = useState<string>('')
  const [previewFileData, setPreviewFileData] = useState<string>('')

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    const portfolioItem = {
      description: description,
      file: previewFileData,
    }

    try {
      await addPortfolioItem(portfolioItem, handle)
      onSuccess()
    } catch (err) {
      alert('Sorry, an unexpected error occurred. Please try again later.')
    }
  }

  async function setFile(file: File | null) {
    let fileBase64: Promise<string>
    if (file) {
      fileBase64 = new Promise(resolve => {
        const reader = new FileReader()
        reader.addEventListener('load', () => {
          resolve(reader.result && reader.result.toString() || '')
        })
        reader.readAsDataURL(file)
      })
    } else {
      fileBase64 = Promise.resolve('')
    }

    setPreviewFileData(await fileBase64)
  }

  return (
    <section className='portfolio-upload'>
      <h2>Upload Portfolio Item</h2>
      <form onSubmit={handleSubmit}>
        <div className='text-image-block'>
          <div className='description'>
            <LabeledInput
              inputType="textarea"
              label="Description"

              htmlAttrs={{
                placeholder: 'Tell me about this',
                value: description,
                onChange: e => setDescription(e.target.value),
                required: true,
              }}
            />
          </div>
          <div className='image-block'>
            {
              previewFileData &&
              <img
                src={previewFileData}
                className='image-preview'
                alt="Portfolio image" />
            }
            <FileUpload
              label="Image"
              accept={['.jpg', '.png']}
              onChange={setFile}
              htmlAttrs={{ required: true }} />
          </div>
        </div>
        <button
          className="btn-plain smaller"
          type="submit"
          disabled={!description || !previewFileData}>
          Publish
        </button>
      </form>
    </section>
  )
}
export default UploadPortfolioItem
