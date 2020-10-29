import React, {useEffect, useState} from 'react'
import defaultLogo from '../assets/demo_icon.jpg'
import '../styles/business-portfolio.scss'
import {getBusiness, getPortfolio} from '../Backend'
import NotFound from './NotFound'
import PortfolioAdminBar from './PortfolioAdminBar'
import Dialog from './Dialog'
import UploadPortfolioItem from './UploadPortfolioItem'
import PortfolioItem from 'types/portfolioItem'
import PortfolioItemList from './PortfolioItemList'

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
  const [showAddItemDialog, setShowAddItemDialog] = useState<boolean>(false)
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([])

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

  useEffect(() => {
    (async () => {
      try {
        setPortfolioItems(await getPortfolio(handle))
      } catch (err) {
        alert('Sorry, an unexpected error occurred. Please try again later.')
      }
    })()
  }, [])

  return notFound ? <NotFound /> : (
    <>
      {
        showAddItemDialog && (
          <div className="add-item-dialog">
            <Dialog onClose={() => setShowAddItemDialog(false)}>
              <UploadPortfolioItem
                handle={handle}
                onSuccess={() => setShowAddItemDialog(false)}
              />
            </Dialog>
          </div>
        )
      }
      {
        editable && (
          <PortfolioAdminBar
            handle={handle}
            onAddItemClicked={() => setShowAddItemDialog(true)}
          />
        )
      }
      <div className="portfolio-body">
        <div className="top-half">
          <div className="left-half">
            <div className="container">
              <img className="logo" src={logo ? logo : defaultLogo}/>
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
                        <button className="contact-btn btn-plain"> Contact </button>
                      </a>
                    )
                  }
                </div>
              </div>
            </div>
          </div>
          <div className="right-half">
            <div className="featured-gallery pi-2-wide pi-no-description">
              <PortfolioItemList items={portfolioItems.slice(0, 4)} />
            </div>
          </div>
        </div>
        <hr className="solid" />
        <div className="bottom-half">
          <div className="portfolio-gallery">
            <PortfolioItemList items={portfolioItems} />
          </div>
        </div>
      </div>
    </>
  )
}

export default BusinessPortfolio
