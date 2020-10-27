import React from 'react'
import '../styles/portfolio-admin-bar.scss'

interface Props {
  handle: string
}

const PortfolioAdminBar: React.FC<Props> = ({handle}: Props) => {
  return (
    <div className="portfolio-admin">
      <span>
        You are currently viewing your business ({handle}) as customers will see it.
      </span>

      {/* TODO: make this button work */}
      <button> Add Portfolio Item </button>
    </div>
  )
}

export default PortfolioAdminBar
