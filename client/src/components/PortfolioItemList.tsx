import React from 'react'
import PortfolioItemI from 'types/portfolioItem'
import PortfolioItem from './PortfolioItem'
import '../styles/portfolio-item-list.scss'

interface Props {
  items: PortfolioItemI[]
}

const PortfolioItemList: React.FC<Props> = ({items}: Props) => {
  return (
    <ul className="portfolio-item-list">
      {items.map(i => (
        <li key={i.id}>
          <PortfolioItem
            file={i.file}
            description={i.description}
          />
        </li>
      ))}
    </ul>
  )
}

export default PortfolioItemList
