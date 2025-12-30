import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../services/api'

interface Material {
    id: string
    title: string
    materialType: string
    quantity: number
    unit: string
    price: number
    currency: string
    thumbnail: string | null
    seller?: {
        companyName: string
    }
    carbonFootprint?: number
    createdAt: string
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

export default function MaterialsPage() {
    const navigate = useNavigate()
    const [materials, setMaterials] = useState<Material[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [materialType, setMaterialType] = useState('')
    const [priceRange, setPriceRange] = useState('')

    useEffect(() => {
        fetchMaterials()
    }, [materialType, priceRange])

    const fetchMaterials = async () => {
        setLoading(true)
        try {
            const params = new URLSearchParams()
            if (materialType) params.append('materialType', materialType)
            if (priceRange === 'low') params.append('maxPrice', '15')
            if (priceRange === 'mid') {
                params.append('minPrice', '15')
                params.append('maxPrice', '50')
            }
            if (priceRange === 'high') params.append('minPrice', '50')
            if (searchTerm) params.append('search', searchTerm)

            const response = await fetch(`${API_URL}/materials?${params}`)
            const data = await response.json()
            setMaterials(data.materials || [])
        } catch (error) {
            console.error('Failed to fetch materials:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        fetchMaterials()
    }

    const handleLogout = () => {
        api.clearToken()
        navigate('/login')
    }

    const formatPrice = (price: number, currency: string) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency,
        }).format(price)
    }

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
                            <Link to="/dashboard" className="text-gray-400 hover:text-white transition-colors">Dashboard</Link>
                            <Link to="/materials" className="text-white font-medium">Materials</Link>
                            <Link to="/messages" className="text-gray-400 hover:text-white transition-colors">Messages</Link>
                            <div className="h-6 w-px bg-gray-700" />
                            <button onClick={handleLogout} className="text-gray-400 hover:text-white text-sm transition-colors">
                                Sign out
                            </button>
                        </nav>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-white mb-2">Material Marketplace</h1>
                    <p className="text-gray-400">Discover sustainable fabrics from verified manufacturers</p>
                </div>

                {/* Filters */}
                <div className="glass-card p-4 mb-6">
                    <form onSubmit={handleSearch} className="flex flex-wrap gap-4 items-end">
                        <div className="flex-1 min-w-[200px]">
                            <label className="label">Search</label>
                            <input
                                type="text"
                                className="input"
                                placeholder="Search materials..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="w-48">
                            <label className="label">Material Type</label>
                            <select
                                className="input"
                                value={materialType}
                                onChange={(e) => setMaterialType(e.target.value)}
                            >
                                <option value="">All Types</option>
                                <option value="Cotton">Cotton</option>
                                <option value="Wool">Wool</option>
                                <option value="Silk">Silk</option>
                                <option value="Linen">Linen</option>
                                <option value="Tencel">Tencel</option>
                            </select>
                        </div>
                        <div className="w-48">
                            <label className="label">Price Range</label>
                            <select
                                className="input"
                                value={priceRange}
                                onChange={(e) => setPriceRange(e.target.value)}
                            >
                                <option value="">Any Price</option>
                                <option value="low">Under $15/m</option>
                                <option value="mid">$15 - $50/m</option>
                                <option value="high">Over $50/m</option>
                            </select>
                        </div>
                        <button type="submit" className="btn-primary px-6 py-3">
                            Search
                        </button>
                    </form>
                </div>

                {/* Results */}
                {loading ? (
                    <div className="text-center py-12">
                        <div className="accent-text">Loading materials...</div>
                    </div>
                ) : materials.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="text-gray-400">No materials found matching your criteria.</div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {materials.map((material) => (
                            <MaterialCard key={material.id} material={material} formatPrice={formatPrice} />
                        ))}
                    </div>
                )}
            </main>
        </div>
    )
}

function MaterialCard({
    material,
    formatPrice
}: {
    material: Material
    formatPrice: (price: number, currency: string) => string
}) {
    const [buying, setBuying] = useState(false)

    const handlePurchase = async () => {
        if (!confirm(`Confirm purchase of 10 ${material.unit} of ${material.title}?`)) return

        setBuying(true)
        try {
            await api.createTransaction({
                material_id: material.id,
                quantity: 10,
                total_amount: material.price * 10,
                currency: material.currency
            })
            alert('Purchase successful! Check your Orders page.')
        } catch (err) {
            alert('Purchase failed: ' + (err as Error).message)
        } finally {
            setBuying(false)
        }
    }

    return (
        <div className="glass-card card-hover overflow-hidden">
            {/* Image */}
            <div
                className="h-48 bg-cover bg-center"
                style={{
                    backgroundImage: material.thumbnail
                        ? `url(${material.thumbnail})`
                        : 'linear-gradient(135deg, rgba(212, 165, 165, 0.2), rgba(212, 165, 165, 0.05))',
                    backgroundColor: '#1a1a1a',
                }}
            >
                {!material.thumbnail && (
                    <div className="w-full h-full flex items-center justify-center">
                        <svg className="w-12 h-12 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="p-5">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-white font-semibold">{material.title}</h3>
                    <span className="badge">{material.materialType}</span>
                </div>

                <div className="text-gray-400 text-sm mb-3">
                    {material.seller?.companyName || 'Unknown Seller'}
                </div>

                <div className="flex justify-between items-center text-sm mb-4">
                    <span className="text-gray-400">
                        {material.quantity} {material.unit} available
                    </span>
                    {material.carbonFootprint && (
                        <span className="text-green-400 flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            {material.carbonFootprint} kg CO₂e/m
                        </span>
                    )}
                </div>

                <div className="flex justify-between items-center">
                    <div className="text-xl font-bold accent-text">
                        {formatPrice(material.price, material.currency)}
                        <span className="text-gray-500 text-sm font-normal">/{material.unit}</span>
                    </div>
                    <button
                        onClick={handlePurchase}
                        disabled={buying || material.quantity < 10}
                        className="btn-primary px-4 py-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {buying ? 'Processing...' : 'Buy 10'}
                    </button>
                </div>
            </div>
        </div>
    )
}
