import { Outlet, Link } from 'react-router-dom'

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#0d0d0d' }}>
      <header style={{ backgroundColor: '#141414', borderBottom: '1px solid rgba(212, 165, 165, 0.1)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center gap-3">
              <div className="logo-icon w-9 h-9">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 2c1.5 0 2.897.5 4.05 1.35l-8.7 8.7A7.962 7.962 0 016 12c0-3.309 2.691-6 6-6zm0 12c-1.5 0-2.897-.5-4.05-1.35l8.7-8.7A7.962 7.962 0 0118 12c0 3.309-2.691 6-6 6z" />
                </svg>
              </div>
              <span className="text-xl font-semibold text-white">FabricLoop</span>
            </Link>
            <nav className="flex items-center gap-4">
              <Link to="/login" className="text-gray-400 hover:text-white font-medium transition-colors">
                Sign In
              </Link>
              <Link to="/register" className="btn-primary px-5 py-2 text-sm">
                Get Started
              </Link>
            </nav>
          </div>
        </div>
      </header>
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <Outlet />
      </main>
      <footer style={{ backgroundColor: '#141414', borderTop: '1px solid rgba(212, 165, 165, 0.1)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-between items-center">
            <p className="text-gray-500 text-sm">
              © 2024 FabricLoop. Sustainable Textile Marketplace.
            </p>
            <div className="flex gap-6">
              <a href="#" className="text-gray-500 hover:text-gray-300 text-sm transition-colors">Privacy</a>
              <a href="#" className="text-gray-500 hover:text-gray-300 text-sm transition-colors">Terms</a>
              <a href="#" className="text-gray-500 hover:text-gray-300 text-sm transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
