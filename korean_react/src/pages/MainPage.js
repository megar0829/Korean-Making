import React from 'react'
import './MainPage.css'

export default function MainPage() {
  return (
    <div className='main__container'>
        <div className='main__banner'>
            <img className='main__logo__image' src="images/KM-Logo1.png" alt="logo_image" />
        </div>
        <div className='main__bottom'>
          <a href="/Speaking" className='main__content text-decoration-none link-dark'>
            <div className='main__bottom__image d-flex flex-column justify-content-center align-items-center'>
              <img className='main__bottom__logo' src="images/speaking_logo.png" alt="speaking_logo" /> 
            </div>
          </a>
          <a href="/Writing" className='main__content text-decoration-none link-dark'>
            <div className='main__bottom__image d-flex flex-column justify-content-center align-items-center'>
              <img className='main__bottom__logo' src="images/writing_logo.png" alt="writing_logo" />  
            </div>
          </a>
        </div>
    </div>
  )
}
