import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../services/api'

interface User {
    userId: string
    email: string
    companyName: string
    role: string
}

export default function DashboardPage() {
    const navigate = useNavigate()
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await api.getMe()
                setUser(response.user as User)
            } catch {
                navigate('/login')
            } finally {
                setLoading(false)
            }
        }
        fetchUser()
    }, [navigate])

    const handleLogout = () => {
        api.clearToken()
        navigate('/login')
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#0d0d0d' }}>
                <div className="accent-text">Loading...</div>
            </div>
        )
    }

    const isManufacturer = user?.role === 'manufacturer'

    return (
        <div className="min-h-screen" style={{ backgroundColor: '#0d0d0d' }}>
            {/* Navigation */}
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
                        <nav className="flex items-center gap-6">
                            <Link to="/dashboard" className="text-white font-medium">Dashboard</Link>
                            <Link to="/materials" className="text-gray-400 hover:text-white transition-colors">Materials</Link>
                            <Link to="/messages" className="text-gray-400 hover:text-white transition-colors">Messages</Link>
                            <div className="h-6 w-px bg-gray-700" />
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium" style={{ backgroundColor: 'rgba(212, 165, 165, 0.2)', color: '#d4a5a5' }}>
                                    {user?.companyName?.charAt(0) || 'U'}
                                </div>
                                <button onClick={handleLogout} className="text-gray-400 hover:text-white text-sm transition-colors">
                                    Sign out
                                </button>
                            </div>
                        </nav>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Welcome Section */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-white mb-1">
                        Welcome back, {user?.companyName}
                    </h1>
                    <p className="text-gray-400">
                        {isManufacturer ? 'Manage your material listings and transactions' : 'Discover sustainable materials for your brand'}
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                    {isManufacturer ? (
                        <>
                            <StatCard label="Active Listings" value="12" change="+2 this week" />
                            <StatCard label="Total Sales" value="$24,500" change="+15% this month" />
                            <StatCard label="CO₂e Avoided" value="2.4 tons" change="Environmental impact" />
                            <StatCard label="Pending Orders" value="3" change="Awaiting shipment" />
                        </>
                    ) : (
                        <>
                            <StatCard label="Materials Purchased" value="8" change="+1 this week" />
                            <StatCard label="Total Spent" value="$18,200" change="This quarter" />
                            <StatCard label="Scope 3 Saved" value="1.8 tons" change="CO₂e reduction" />
                            <StatCard label="Active Inquiries" value="5" change="With suppliers" />
                        </>
                    )}
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Recent Activity */}
                    <div className="lg:col-span-2 glass-card p-6">
                        <h2 className="text-lg font-semibold text-white mb-4">Recent Activity</h2>
                        <div className="space-y-4">
                            <ActivityItem
                                title={isManufacturer ? "New inquiry received" : "Order confirmed"}
                                description={isManufacturer ? "Nordic Apparel Co. interested in organic cotton" : "Silk blend from Milano Textiles shipped"}
                                time="2 hours ago"
                                type="info"
                            />
                            <ActivityItem
                                title={isManufacturer ? "Listing view spike" : "Digital passport received"}
                                description={isManufacturer ? "Recycled denim getting high engagement" : "Full sustainability data for linen order"}
                                time="5 hours ago"
                                type="success"
                            />
                            <ActivityItem
                                title="Message from support"
                                description="Your account verification is complete"
                                time="1 day ago"
                                type="neutral"
                            />
                            <ActivityItem
                                title={isManufacturer ? "Payment received" : "Sustainability report ready"}
                                description={isManufacturer ? "$3,200 for organic wool order" : "Q4 2024 Scope 3 emissions summary"}
                                time="2 days ago"
                                type="success"
                            />
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="glass-card p-6">
                        <h2 className="text-lg font-semibold text-white mb-4">Quick Actions</h2>
                        <div className="space-y-3">
                            {isManufacturer ? (
                                <>
                                    <QuickAction icon="+" label="Add New Listing" />
                                    <QuickAction icon="📦" label="Manage Inventory" />
                                    <QuickAction icon="📊" label="View Analytics" />
                                    <QuickAction icon="💬" label="Check Messages" />
                                </>
                            ) : (
                                <>
                                    <QuickAction icon="🔍" label="Browse Materials" />
                                    <QuickAction icon="📋" label="View Orders" />
                                    <QuickAction icon="📊" label="Sustainability Report" />
                                    <QuickAction icon="💬" label="Contact Suppliers" />
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Materials Preview */}
                <div className="mt-8 glass-card p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-semibold text-white">
                            {isManufacturer ? 'Your Listings' : 'Recommended Materials'}
                        </h2>
                        <Link to="/materials" className="link text-sm">View all →</Link>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <MaterialCard
                            title="Organic Cotton Twill"
                            type="Cotton"
                            quantity="500 m"
                            price="$12.50/m"
                            co2="0.8 kg CO₂e/m"
                        />
                        <MaterialCard
                            title="Recycled Wool Blend"
                            type="Wool"
                            quantity="320 m"
                            price="$28.00/m"
                            co2="1.2 kg CO₂e/m"
                        />
                        <MaterialCard
                            title="Hemp Linen Mix"
                            type="Linen"
                            quantity="800 m"
                            price="$9.75/m"
                            co2="0.5 kg CO₂e/m"
                        />
                    </div>
                </div>
            </main>
        </div>
    )
}

function StatCard({ label, value, change }: { label: string; value: string; change: string }) {
    return (
        <div className="glass-card p-5">
            <div className="text-gray-400 text-sm mb-1">{label}</div>
            <div className="text-2xl font-bold text-white mb-1">{value}</div>
            <div className="text-xs accent-text">{change}</div>
        </div>
    )
}

function ActivityItem({ title, description, time, type }: { title: string; description: string; time: string; type: 'info' | 'success' | 'neutral' }) {
    const dotColors = {
        info: 'bg-blue-400',
        success: 'bg-green-400',
        neutral: 'bg-gray-400'
    }
    return (
        <div className="flex gap-4 items-start">
            <div className={`w-2 h-2 rounded-full mt-2 ${dotColors[type]}`} />
            <div className="flex-1">
                <div className="text-white font-medium text-sm">{title}</div>
                <div className="text-gray-400 text-sm">{description}</div>
                <div className="text-gray-500 text-xs mt-1">{time}</div>
            </div>
        </div>
    )
}

function QuickAction({ icon, label }: { icon: string; label: string }) {
    return (
        <button className="w-full flex items-center gap-3 p-3 rounded-lg transition-all hover:bg-white/5 text-left" style={{ border: '1px solid rgba(212, 165, 165, 0.1)' }}>
            <span className="text-lg">{icon}</span>
            <span className="text-gray-300 text-sm">{label}</span>
        </button>
    )
}

function MaterialCard({ title, type, quantity, price, co2 }: { title: string; type: string; quantity: string; price: string; co2: string }) {
    return (
        <div className="p-4 rounded-xl transition-all hover:bg-white/5" style={{ border: '1px solid rgba(212, 165, 165, 0.1)' }}>
            <div className="flex justify-between items-start mb-2">
                <h3 className="text-white font-medium">{title}</h3>
                <span className="badge">{type}</span>
            </div>
            <div className="text-gray-400 text-sm mb-3">{quantity} available</div>
            <div className="flex justify-between text-sm">
                <span className="text-white font-medium">{price}</span>
                <span className="text-green-400">{co2}</span>
            </div>
        </div>
    )
}
