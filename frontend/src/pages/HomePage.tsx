import { Link } from 'react-router-dom'

export default function HomePage() {
  return (
    <div className="space-y-16 bg-pattern">
      {/* Hero Section */}
      <section className="text-center py-16">
        <h1 className="text-5xl font-bold text-white mb-6">
          Sustainable Textile <span className="accent-text">Marketplace</span>
        </h1>
        <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
          Connect textile manufacturers with fashion brands to trade deadstock fabric with full sustainability tracking through Digital Product Passports.
        </p>
        <div className="flex justify-center gap-4">
          <Link to="/register" className="btn-primary text-lg px-8 py-3">
            Start Trading
          </Link>
          <Link to="/login" className="btn-secondary text-lg px-8 py-3">
            Learn More
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="grid md:grid-cols-3 gap-6">
        <div className="glass-card card-hover p-6">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: 'rgba(212, 165, 165, 0.1)' }}>
            <svg className="w-6 h-6 accent-text" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold mb-2 text-white">Circular Economy</h3>
          <p className="text-gray-400">
            Transform textile waste into valuable resources by connecting excess inventory with brands seeking sustainable materials.
          </p>
        </div>

        <div className="glass-card card-hover p-6">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: 'rgba(212, 165, 165, 0.1)' }}>
            <svg className="w-6 h-6 accent-text" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold mb-2 text-white">Digital Product Passports</h3>
          <p className="text-gray-400">
            Every material comes with verifiable sustainability data including carbon footprint, water usage, and chemical composition.
          </p>
        </div>

        <div className="glass-card card-hover p-6">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: 'rgba(212, 165, 165, 0.1)' }}>
            <svg className="w-6 h-6 accent-text" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold mb-2 text-white">Scope 3 Reporting</h3>
          <p className="text-gray-400">
            Automate your sustainability compliance with built-in Scope 3 emission calculations and comprehensive reporting tools.
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="grid md:grid-cols-4 gap-6">
        {[
          { value: '10K+', label: 'Materials Listed' },
          { value: '500+', label: 'Active Companies' },
          { value: '2.5M', label: 'kg CO₂e Saved' },
          { value: '99.5%', label: 'Uptime' },
        ].map((stat) => (
          <div key={stat.label} className="glass-card p-6 text-center">
            <div className="text-3xl font-bold accent-text mb-1">{stat.value}</div>
            <div className="text-gray-400 text-sm">{stat.label}</div>
          </div>
        ))}
      </section>

      {/* CTA Section */}
      <section className="glass-card p-12 text-center">
        <h2 className="text-3xl font-bold mb-4 text-white">Ready to join the circular economy?</h2>
        <p className="text-lg text-gray-400 mb-6">
          Join thousands of manufacturers and brands transforming the textile industry.
        </p>
        <Link to="/register" className="btn-primary px-8 py-3 inline-block">
          Create Your Account
        </Link>
      </section>
    </div>
  )
}
