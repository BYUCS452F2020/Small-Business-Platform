import React from 'react'
import '../styles/portfolio-admin-bar.scss'

interface Props {
  handle: string
  onAddItemClicked: () => void
}

const PortfolioAdminBar: React.FC<Props> = (props: Props) => {
  return (
    <div className="portfolio-admin">
      <span>
        You are currently viewing your business ({props.handle}) as customers will see it.
      </span>

      <button onClick={props.onAddItemClicked}>
        Add Portfolio Item
      </button>
    </div>
  )
}

export default PortfolioAdminBar
