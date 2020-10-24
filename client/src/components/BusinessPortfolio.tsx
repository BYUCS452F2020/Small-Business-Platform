import React from 'react'
import icon from '../assets/demo_icon.jpg'
import '../styles/business-portfolio.scss'

const BusinessPortfolio : React.FC = () => {
  return (
    <div className="portfolio-body">
      <div className="top-half">
        {/* TODO: Fix the "left-half" and "container" classes to be responsive for small screens */}
        <div className="left-half">
          <div className="container">
            <img src={icon}/>
            <div className="business-info">
              <div className="business-name">
                {/* TODO: Display actual business name */}
              Jason Cox LLC
              </div>
              <div>
                {/* TODO: Display actual business description */}
              Barber and Dog Lover
              </div>
              <div>
                {/* TODO: Allow user to update business profile */}
                <button className="btn-plain">
                  Update Profile
                </button>
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
  )
}

export default BusinessPortfolio
