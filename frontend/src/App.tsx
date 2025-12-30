import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DashboardPage from './pages/DashboardPage'
import MaterialsPage from './pages/MaterialsPage'
import OrdersPage from './pages/OrdersPage' // Added import

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes with Layout */}
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
        </Route>

        {/* Auth routes (no layout - full page) */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected routes (dashboard has its own nav) */}
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/materials" element={<MaterialsPage />} />
        <Route path="/messages" element={<DashboardPage />} />
        <Route path="/orders" element={<OrdersPage />} /> {/* Added route */}
      </Routes>
    </BrowserRouter>
  )
}

export default App
