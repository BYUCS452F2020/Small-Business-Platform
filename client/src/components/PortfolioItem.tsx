import React from 'react'
import '../styles/portfolio-item.scss'

interface Props {
  file: string
  description: string
}

const PortfolioItem: React.FC<Props> = (props: Props) => {
  return (
    <div className="portfolio-item">
      <img className="pi-img" src={props.file} alt="portfolio item image" />
      <div className="pi-description">{props.description}</div>
    </div>
  )
}

export default PortfolioItem
