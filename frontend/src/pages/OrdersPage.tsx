import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api, { Transaction, User } from '../services/api'

export default function OrdersPage() {
    const navigate = useNavigate()
    const [transactions, setTransactions] = useState<Transaction[]>([])
    const [loading, setLoading] = useState(true)
    const [user, setUser] = useState<User | null>(null)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userRes = await api.getMe()
                setUser(userRes.user)
                const data = await api.getTransactions()
                setTransactions(data)
            } catch (err) {
                console.error(err)
                navigate('/login')
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [navigate])

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#0d0d0d]">
                <div className="accent-text">Loading orders...</div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#0d0d0d]">
            {/* Header - Reusing similar style */}
            <header className="bg-[#141414] border-b border-[rgba(212,165,165,0.1)]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
                    <Link to="/" className="flex items-center gap-3">
                        <span className="text-xl font-semibold text-white">FabricLoop</span>
                    </Link>
                    <nav className="flex items-center gap-6">
                        <Link to="/dashboard" className="text-gray-400 hover:text-white">Dashboard</Link>
                        <Link to="/materials" className="text-gray-400 hover:text-white">Materials</Link>
                        <Link to="/orders" className="text-white font-medium">Orders</Link>
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
                                    {/* Thumbnail Placeholder */}
                                    <div className="w-16 h-16 bg-gray-800 rounded-lg overflow-hidden relative">
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
                                        <div className="text-sm accent-text">{tx.total_amount} {tx.currency}</div>
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
