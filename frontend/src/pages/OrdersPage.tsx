import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api, { Transaction, User } from '../services/api'
import { useCartStore } from '../stores/CartStore'

export default function OrdersPage() {
    const navigate = useNavigate()
    const [transactions, setTransactions] = useState<Transaction[]>([])
    const [loading, setLoading] = useState(true)
    const [user, setUser] = useState<User | null>(null)
    const cartItemCount = useCartStore((state) => state.items.reduce((sum, item) => sum + item.quantity, 0))

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const userRes = await api.getMe()
                setUser(userRes.user)
                return userRes.user
            } catch (err) {
                console.error(err)
                navigate('/login')
                return null
            } finally {
                setLoading(false)
            }
        }

        const fetchTransactions = async () => {
            try {
                const data = await api.getTransactions()
                setTransactions(data)
            } catch (err) {
                console.error('Failed to fetch transactions:', err)
            }
        }

        fetchUser().then(user => {
            if (user) fetchTransactions()
        })
    }, [navigate])

    const handleLogout = () => {
        api.clearToken()
        navigate('/login')
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-dark">
                <div className="text-primary">Loading orders...</div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-dark">
            {/* Header */}
            <header className="bg-card border-b border-primary/10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
                    <Link to="/" className="flex items-center gap-3">
                        <div className="logo-icon w-9 h-9">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                                <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 2c1.5 0 2.897.5 4.05 1.35l-8.7 8.7A7.962 7.962 0 016 12c0-3.309 2.691-6 6-6zm0 12c-1.5 0-2.897-.5-4.05-1.35l8.7-8.7A7.962 7.962 0 0118 12c0 3.309-2.691 6-6 6z" />
                            </svg>
                        </div>
                        <span className="text-xl font-semibold text-white">FabricLoop</span>
                    </Link>
                    <nav className="flex items-center gap-6">
                        <Link to="/dashboard" className="text-gray-400 hover:text-white transition-colors">Dashboard</Link>
                        <Link to="/materials" className="text-gray-400 hover:text-white transition-colors">Materials</Link>
                        <Link to="/orders" className="text-primary font-medium">Orders</Link>
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
                        <button onClick={handleLogout} className="text-gray-400 hover:text-white text-sm transition-colors">
                            Sign out
                        </button>
                    </nav>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <h1 className="text-2xl font-bold text-white mb-6">
                    {user?.role === 'manufacturer' ? 'Incoming Orders' : 'My Purchases'}
                </h1>

                <div className="space-y-4">
                    {transactions.length > 0 ? (
                        transactions.map((tx) => (
                            <div key={tx.id} className="glass-card p-6 flex flex-col md:flex-row justify-between items-center gap-4">
                                <div className="flex items-center gap-4">
                                    {/* Thumbnail */}
                                    <div className="w-16 h-16 bg-surface rounded-lg overflow-hidden relative">
                                        {tx.material_images && tx.material_images[0] ? (
                                            <img src={tx.material_images[0]} alt="Material" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-xs text-gray-500">Img</div>
                                        )}
                                    </div>

                                    <div>
                                        <h3 className="text-white font-medium">{tx.material_title || 'Unknown Material'}</h3>
                                        <div className="text-sm text-gray-400">
                                            Order ID: <span className="font-mono">{tx.id.slice(0, 8)}</span>
                                        </div>
                                        <div className="text-xs text-gray-500 mt-1">
                                            {new Date(tx.created_at).toLocaleDateString()}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-8">
                                    <div className="text-right">
                                        <div className="text-white font-medium">{tx.quantity} units</div>
                                        <div className="text-sm text-primary">{tx.total_amount} {tx.currency}</div>
                                    </div>

                                    <StatusBadge status={tx.status} />
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-12 glass-card">
                            <p className="text-gray-400">No orders found.</p>
                            <Link to="/materials" className="mt-4 inline-block btn-primary">
                                Browse Materials
                            </Link>
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}

function StatusBadge({ status }: { status: string }) {
    const colors = {
        pending: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
        confirmed: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
        shipped: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
        delivered: 'bg-green-500/20 text-green-300 border-green-500/30',
        cancelled: 'bg-red-500/20 text-red-300 border-red-500/30'
    }
    const style = colors[status as keyof typeof colors] || colors.pending

    return (
        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${style} capitalize`}>
            {status}
        </span>
    )
}
