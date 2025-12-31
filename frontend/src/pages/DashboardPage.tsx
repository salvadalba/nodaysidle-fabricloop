import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../services/api'
import { useCartStore } from '../stores/CartStore'

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
    const [stats, setStats] = useState({ revenue: 0, activeListings: 0, pendingOrders: 0, co2Saved: 0 })
    const [recentActivity, setRecentActivity] = useState<any[]>([])
    const cartItemCount = useCartStore((state) => state.items.reduce((sum, item) => sum + item.quantity, 0))

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await api.getMe()
                setUser(response.user as User)
                return response.user
            } catch {
                navigate('/login')
                return null
            } finally {
                setLoading(false)
            }
        }

        const fetchData = async (currentUser: User) => {
            try {
                if (currentUser.role === 'manufacturer') {
                    const dashboardStats = await api.getDashboardStats()
                    setStats(dashboardStats)
                }
                const transactions = await api.getTransactions()
                setRecentActivity(transactions.slice(0, 5))
            } catch (err) {
                console.error('Failed to fetch dashboard data:', err)
            }
        }

        fetchUser().then(user => {
            if (user) fetchData(user as User)
        })
    }, [navigate])

    const handleLogout = () => {
        api.clearToken()
        navigate('/login')
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-dark">
                <div className="text-primary">Loading...</div>
            </div>
        )
    }

    const isManufacturer = user?.role === 'manufacturer'

    return (
        <div className="min-h-screen bg-dark">
            {/* Navigation */}
            <header className="bg-card border-b border-primary/10">
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
                            <Link to="/dashboard" className="text-primary font-medium">Dashboard</Link>
                            <Link to="/materials" className="text-gray-400 hover:text-white transition-colors">Materials</Link>
                            <Link to="/orders" className="text-gray-400 hover:text-white transition-colors">Orders</Link>
                            <Link to="/cart" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                                {cartItemCount > 0 && (
                                    <span className="bg-primary text-dark text-xs font-bold px-2 py-0.5 rounded-full">
                                        {cartItemCount}
                                    </span>
                                )}
                            </Link>
                            <div className="h-6 w-px bg-gray-700" />
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium bg-primary/20 text-primary">
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
                            <StatCard label="Active Listings" value={stats.activeListings.toString()} change="All time" />
                            <StatCard label="Total Sales" value={`$${stats.revenue.toLocaleString()}`} change="Lifetime revenue" />
                            <StatCard label="CO₂e Avoided" value={`${stats.co2Saved.toFixed(1)} kg`} change="Environmental impact" />
                            <StatCard label="Pending Orders" value={stats.pendingOrders.toString()} change="Action required" />
                        </>
                    ) : (
                        <>
                            <StatCard label="Materials Purchased" value="0" change="Start browsing" />
                            <StatCard label="Total Spent" value="$0" change="All time" />
                            <StatCard label="Scope 3 Saved" value="0 kg" change="CO₂e reduction" />
                            <StatCard label="Active Inquiries" value="0" change="With suppliers" />
                        </>
                    )}
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Recent Activity */}
                    <div className="lg:col-span-2 glass-card p-6">
                        <h2 className="text-lg font-semibold text-white mb-4">Recent Activity</h2>
                        <div className="space-y-4">
                            {recentActivity.length > 0 ? (
                                recentActivity.map((tx) => (
                                    <ActivityItem
                                        key={tx.id}
                                        title={`Order #${tx.id.slice(0, 8)}`}
                                        description={`${tx.quantity} ${tx.unit || 'units'} of ${tx.material_title || 'Material'}`}
                                        time={new Date(tx.created_at).toLocaleDateString()}
                                        type={tx.status === 'pending' ? 'info' : 'success'}
                                    />
                                ))
                            ) : (
                                <p className="text-gray-400 text-sm">No recent activity found.</p>
                            )}
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
                                    <Link to="/materials"><QuickAction icon="🔍" label="Browse Materials" /></Link>
                                    <Link to="/orders"><QuickAction icon="📋" label="View Orders" /></Link>
                                    <Link to="/cart"><QuickAction icon="🛒" label="View Cart" /></Link>
                                    <QuickAction icon="📊" label="Sustainability Report" />
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
            <div className="text-xs text-primary">{change}</div>
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
        <button className="w-full flex items-center gap-3 p-3 rounded-lg transition-all hover:bg-white/5 text-left border border-primary/10">
            <span className="text-lg">{icon}</span>
            <span className="text-gray-300 text-sm">{label}</span>
        </button>
    )
}

function MaterialCard({ title, type, quantity, price, co2 }: { title: string; type: string; quantity: string; price: string; co2: string }) {
    return (
        <div className="p-4 rounded-xl transition-all hover:bg-white/5 border border-primary/10">
            <div className="flex justify-between items-start mb-2">
                <h3 className="text-white font-medium">{title}</h3>
                <span className="badge">{type}</span>
            </div>
            <div className="text-gray-400 text-sm mb-3">{quantity} available</div>
            <div className="flex justify-between text-sm">
                <span className="text-white font-medium">{price}</span>
                <span className="text-secondary">{co2}</span>
            </div>
        </div>
    )
}
