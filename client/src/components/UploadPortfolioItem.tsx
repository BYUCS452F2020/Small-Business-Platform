import React, {useState} from 'react'
import FileUpload from './FileUpload'
import '../styles/upload-portfolio-item.scss'
import {addPortfolio} from '../Backend'

interface Props {handle: string}


const UploadPortfolioItem: React.FC <Props> = ({handle}: Props) => {
  const [description, setDescription] = useState<string>('')
  const [previewFile, setPreviewFile] = useState<string|null>('')

  async function handleSubmit() {
    const portfolioItem = {
      description: description,
      file: previewFile,
      handle: handle
    }
  
    try{
      await addPortfolio(portfolioItem)
      console.log('Portfolio submitted')
    } catch(err) {
      alert(err.message)
    }
  }

  async function setFile(file: File | null) {
    let fileBase64: Promise<string|null>;
    if (file) {
      fileBase64 = new Promise(resolve => {
        const reader = new FileReader()
        reader.addEventListener('load', () => {
          resolve(reader.result && reader.result.toString())
        })
        reader.readAsDataURL(file)
      })
    } else {
      fileBase64 = Promise.resolve(null)
    }
    setPreviewFile(await fileBase64)
  }

  return(
    <section className='portfolio-upload'>
      <h2>Upload Portfolio Item</h2>
      <div className='text-image-block'>
        <textarea 
          className='description' 
          placeholder="Tell me about this"
          value={description}
          onChange={(e) => setDescription(e.target.value)}/>
        <div className='image-block'>
          {previewFile && 
              <img src={previewFile} className='image-preview' alt="Portfolio image"/>
          }
        <FileUpload
            label="Portfolio image"
            accept={['.jpg', '.png']}
            onChange={setFile} />
        </div>
      </div>
      <button
        className="btn-plain smaller"
        type="submit"
        disabled={!description || !previewFile}
        onClick={handleSubmit}>
        Publish
      </button>  
    </section>
  )
}
export default UploadPortfolioItem
