import '../styles/VentureDetails.css'

const ventures = [
  {
    id: 1,
    name: 'Premium Residential Plots',
    location: 'Guntur Growth Corridor',
    price: 'Contact for pricing',
    image:
      'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1000&q=80',
    description: 'Clear-title plots in a well-connected location with planned roads and essential access nearby.',
    highlights: ['Clear title', 'Road access', 'Site visits'],
    status: 'Open',
  },
  {
    id: 2,
    name: 'Modern Family Homes',
    location: 'Residential neighborhoods',
    price: 'Budget friendly options',
    image:
      'https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?auto=format&fit=crop&w=1000&q=80',
    description: 'Comfortable home options for families looking for practical layouts and peaceful surroundings.',
    highlights: ['Family ready', 'Good access', 'Verified options'],
    status: 'Featured',
  },
  {
    id: 3,
    name: 'Apartment Investments',
    location: 'Prime city access',
    price: 'Multiple ranges',
    image:
      'https://images.unsplash.com/photo-1600607688969-a5bfcd646154?auto=format&fit=crop&w=1000&q=80',
    description: 'Apartment choices suited for first-time buyers, rental income planning, and long-term value.',
    highlights: ['Prime access', 'Rental potential', 'Guided support'],
    status: 'Available',
  },
]

const benefits = [
  {
    title: 'Verified Guidance',
    text: 'Get practical support for location, budget, documentation, and next steps.',
  },
  {
    title: 'Easy Site Visits',
    text: 'Schedule visits quickly and understand every project before deciding.',
  },
  {
    title: 'Transparent Process',
    text: 'Clear communication from inquiry to final discussion.',
  },
]

export default function VentureDetails() {
  return (
    <main>
      <section className="home-overview" aria-label="Company strengths">
        <div className="home-overview-container">
          <div className="overview-copy">
            <span className="section-kicker">Why choose us</span>
            <h2>Property support that keeps decisions simple</h2>
            <p>
              Whether you are planning a home purchase or looking for an investment, we help you compare options,
              understand locations, and move forward with clarity.
            </p>
          </div>
          <div className="overview-stats">
            <div>
              <strong>5+</strong>
              <span>Years of experience</span>
            </div>
            <div>
              <strong>100%</strong>
              <span>Client-focused service</span>
            </div>
            <div>
              <strong>3</strong>
              <span>Core property categories</span>
            </div>
          </div>
        </div>
      </section>

      <section className="benefits" aria-label="Service benefits">
        <div className="benefits-container">
          {benefits.map((benefit) => (
            <article key={benefit.title} className="benefit-item">
              <h3>{benefit.title}</h3>
              <p>{benefit.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="ventures" id="projects">
        <div className="ventures-container">
          <div className="ventures-header">
            <span className="section-kicker">Featured projects</span>
            <h2>Explore property options</h2>
            <p>Clear, accessible project information so visitors can compare quickly and contact you with confidence.</p>
          </div>

          <div className="ventures-grid">
            {ventures.map((venture) => (
              <article key={venture.id} className="venture-card">
                <div className="venture-image">
                  <img src={venture.image} alt={venture.name} />
                  <span className="venture-status">{venture.status}</span>
                </div>

                <div className="venture-info">
                  <div>
                    <p className="venture-location">{venture.location}</p>
                    <h3 className="venture-name">{venture.name}</h3>
                    <p className="venture-price">{venture.price}</p>
                  </div>

                  <p className="venture-description">{venture.description}</p>

                  <div className="venture-highlights">
                    {venture.highlights.map((highlight) => (
                      <span key={highlight}>{highlight}</span>
                    ))}
                  </div>

                  <div className="venture-actions">
                    <a href="tel:+917995088752" className="inquiry-btn">
                      Call Now
                    </a>
                    <a href="/about" className="details-link">
                      More Info
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
