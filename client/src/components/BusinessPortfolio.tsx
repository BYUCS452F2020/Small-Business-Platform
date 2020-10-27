import React, {useEffect, useState} from 'react'
import defaultLogo from '../assets/demo_icon.jpg'
import '../styles/business-portfolio.scss'
import {getBusiness} from '../Backend'
import NotFound from './NotFound'
import PortfolioAdminBar from './PortfolioAdminBar'

interface Props {
  handle: string
}

const BusinessPortfolio : React.FC<Props> = ({handle}: Props) => {
  const [name, setName] = useState<string>('loading...')
  const [email, setEmail] = useState<string>('')
  const [description, setDescription] = useState<string>('loading...')
  const [website, setWebsite] = useState<string>('')
  const [logo, setLogo] = useState<string>('')
  const [editable, setEditable] = useState<boolean>(false)
  const [notFound, setNotFound] = useState<boolean>(false)

  useEffect(() => {
    (async () => {
      try {
        const business = await getBusiness(handle)
        setName(business.name)
        setEmail(business.email)
        setDescription(business.description || '')
        setWebsite(business.website || '')
        setLogo(business.logo || '')
        setEditable(!!business.editable)
      } catch (err) {
        switch(err.message) {
        case 'BusinessNotFound':
          setNotFound(true)
          break
        default:
          alert('Sorry, an unexpected error occurred. Please try again later.')
        }
      }
    })()
  }, [])

  return notFound ? <NotFound /> : (
    <>
      {editable && <PortfolioAdminBar handle={handle} />}
      <div className="portfolio-body">
        <div className="top-half">
          {/* TODO: Fix the "left-half" and "container" classes to be responsive for small screens */}
          <div className="left-half">
            <div className="container">
              <img src={logo ? logo : defaultLogo}/>
              <div className="business-info">
                <div className="business-name"> {name} </div>
                <div className="business-description"> {description} </div>
                <div className="business-website">
                  {
                    website && (
                      <a href={website} target="_blank" rel="noreferrer">
                        {website}
                      </a>
                    )
                  }
                </div>
                <div>
                  {
                    email && (
                      <a
                        href={`mailto:${email}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <button className="btn-plain"> Contact </button>
                      </a>
                    )
                  }
                </div>
              </div>
            </div>
          </div>
          <div className="right-half">
            <div className="featured-gallery-container">
              <div className="featured-gallery">
                <div className="item-placeholder">
                Item 1
                </div>
                <div className="item-placeholder">
                Item 2
                </div>
                <div className="item-placeholder">
                Item 3
                </div>
                <div className="item-placeholder">
                Item 4
                </div>
              </div>
            </div>
          </div>
        </div>
        <hr className="solid" />
        <div className="bottom-half">
          <div className="portfolio-gallery">
            {/* TODO: Get the portfolio items and populate the portfolio */}
            <div className="item-placeholder">Item 1</div>
            <div className="item-placeholder">Item 2</div>
            <div className="item-placeholder">Item 3</div>
            <div className="item-placeholder">Item 4</div>
            <div className="item-placeholder">Item 5</div>
            <div className="item-placeholder">Item 6</div>
          </div>
        </div>
      </div>
    </>
  )
}

export default BusinessPortfolio
