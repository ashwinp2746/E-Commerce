import React from 'react'
import './Breadcrums.css'
import arrow_icon from '../Assets/breadcrum_arrow.png'

// Breadcrumbs are a navigational aid on a website that 
// shows a user's current location and the path to get there.
// They are usually located at the top of a page, below the 
// main navigation bar and above the title. 
export default function Breadcrums(props) {
    const {product} = props;
  return (
    <div className='breadcrums'>
      Home <img src={arrow_icon} alt="" /> Shop <img src={arrow_icon} alt="" /> {product.category} <img src={arrow_icon} alt="" /> {product.name}
    </div>
  )
}
