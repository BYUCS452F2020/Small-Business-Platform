import React, {useState} from 'react'
import FileUpload from './FileUpload'
import '../styles/upload-portfolio-item.scss'
import Backend from 'Backend'

interface Props {backend: Backend}

const UploadPortfolioItem: React.FC<Props> = ({backend}: Props) => {
  const [description, setDescription] = useState<string>('')
  const [portfolioFile, setPortfolioFile] = useState<File|null>(null)

  async function handleSubmit() {
    const portfolioItem = {
      description: description,
      file: portfolioFile
    }
  
    try{
      await backend.addPortfolio(portfolioItem)
      console.log('Portfolio submitted')
    } catch(err) {
      alert(err.message)
    }
  }

  return(
    <section className='portfolio-upload'>
      <textarea 
        className='description' 
        placeholder="Tell me about this"
        value={description}
        onChange={(e) => setDescription(e.target.value)}/>
      <br/>
      <hr className='horrizontal-line'/>
      <FileUpload
          label="Portfolio item"
          accept={['.jpg', '.png']}
          onChange={(file) =>{
            if (file !== null){
              setPortfolioFile(file)
            }
          }} 
        />
      <button
          className="btn-plain smaller"
          type="submit"
          disabled={!description || !portfolioFile}
          onClick={handleSubmit}>
          Publish
        </button>
    </section>
  )
}
export default UploadPortfolioItem