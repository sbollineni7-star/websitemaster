import { useState, useEffect } from 'react'
import csrImage from '../assets/csr.png'
import lamsiteOutlineImage from '../assets/lamsite out line.png'
import '../styles/Carousel.css'

const slides = [
  {
    id: 1,
    image: csrImage,
    eyebrow: 'Premium Real Estate',
    title: 'Find a property that fits your next chapter',
    description: 'Explore well-planned homes, investment plots, and curated property options with guidance at every step.',
  },
  {
    id: 2,
    image:
      'https://images.unsplash.com/photo-1774685110718-c5b4fe026144?auto=format&fit=crop&w=1800&q=80',
    eyebrow: 'Gated Community Homes',
    title: 'Secure community living for modern families',
    description: 'Discover planned neighborhoods with privacy, road access, open spaces, and everyday convenience close by.',
  },
  {
    id: 3,
    image:
      'https://images.unsplash.com/photo-1745429523615-2a82c60bfc02?auto=format&fit=crop&w=1800&q=80',
    eyebrow: 'Premium Interiors',
    title: 'Elegant interiors designed for comfortable living',
    description: 'Explore refined home spaces with practical layouts, warm finishes, and a premium living experience.',
  },
  {
    id: 4,
    image: lamsiteOutlineImage,
    eyebrow: 'Open Plots',
    title: 'Well-planned open plots in growing locations',
    description: 'Choose clear-title plots with strong access, future growth potential, and guided site visit support.',
  },
]

export default function Carousel() {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 6000)
    return () => clearInterval(interval)
  }, [])

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
  }

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  return (
    <section className="hero" aria-label="Featured real estate highlights">
      <div className="carousel-container">
        {slides.map((slide, index) => (
          <div key={slide.id} className={`carousel-slide ${index === currentSlide ? 'active' : ''}`}>
            <img src={slide.image} alt="" className="slide-background" />
          </div>
        ))}
      </div>

      <button className="carousel-btn carousel-btn-prev" onClick={goToPrevious} aria-label="Previous slide">
        &lt;
      </button>
      <button className="carousel-btn carousel-btn-next" onClick={goToNext} aria-label="Next slide">
        &gt;
      </button>

      <div className="carousel-dots" aria-label="Choose featured slide">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`dot ${index === currentSlide ? 'active' : ''}`}
            onClick={() => goToSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
          ></button>
        ))}
      </div>

    </section>
  )
}
