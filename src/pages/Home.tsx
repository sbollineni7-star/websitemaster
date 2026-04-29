import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import Carousel from '../components/Carousel'
import VentureDetails from '../components/VentureDetails'
import Footer from '../components/Footer'
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
      <VentureDetails />
      <Footer />
    </div>
  )
}
