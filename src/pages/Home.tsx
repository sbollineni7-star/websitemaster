import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import Carousel from '../components/Carousel'
import VentureDetails from '../components/VentureDetails'
import Footer from '../components/Footer'
import video1 from '../assets/Video 1.mp4'
import '../styles/Home.css'

export default function Home() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading
    setTimeout(() => setIsLoading(false), 500)
  }, [])

  if (isLoading) {
    return <div className="loading">Loading...</div>
  }

  return (
    <div className="home">
      <Navbar />
      <Carousel />
      <section className="video-section">
        <div className="video-content">
          <h2>Development Progress</h2>
          <p>Watch our featured presentation to learn more about the project and vision.</p>
        </div>
        <div className="video-wrapper">
          <video src={video1} controls preload="metadata" className="featured-video" />
        </div>
      </section>
      <VentureDetails />
      <Footer />
    </div>
  )
}
