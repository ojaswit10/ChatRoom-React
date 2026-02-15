import React from 'react'
import { Link } from 'react-router-dom';
import BannerImage from '../assets/pizza.jpeg'
import '../styles/Home.css'
import banner from '../assets/Yosemite National Park in winter.jpeg';
function Home() {
  return (
    <div className='home' style={{backgroundImage : `url(${BannerImage})`}}>
     <div className='headerContainer'>
      
      <h1>Pedro's pizzeria</h1>
      <p>Pizza to fit any taste</p>
      <Link to="/menu">
      <button>Order now</button>
      </Link>
     </div>
    </div>
  )
}

export default Home;
