import type React from 'react'
import './styles.css'

export const PacmanLoader: React.FC = () => {
  return (
    <div className="loader">
      <div className="circles">
        <span className="one">jobs</span>
        <span className="two">apply</span>
        <span className="three">offer</span>
      </div>
      <div className="pacman">
        <span className="top" />
        <span className="bottom" />
        <span className="left" />
        <div className="eye" />
      </div>
    </div>
  )
}
