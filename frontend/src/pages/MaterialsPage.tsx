import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../services/api'
import { useCartStore } from '../stores/CartStore'

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
    const cartItemCount = useCartStore((state) => state.items.reduce((sum, item) => sum + item.quantity, 0))

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
                            <Link to="/dashboard" className="text-gray-400 hover:text-white transition-colors">Dashboard</Link>
                            <Link to="/materials" className="text-primary font-medium">Materials</Link>
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
                        <div className="text-primary">Loading materials...</div>
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
    const [quantity, setQuantity] = useState(10)
    const [added, setAdded] = useState(false)
    const addItem = useCartStore((state) => state.addItem)

    const handleAddToCart = () => {
        addItem(material, quantity)
        setAdded(true)
        setTimeout(() => setAdded(false), 2000)
    }

    return (
        <div className="glass-card card-hover overflow-hidden">
            {/* Image */}
            <div
                className="h-48 bg-cover bg-center"
                style={{
                    backgroundImage: `url(${material.thumbnail || '/fabric-placeholder.png'})`,
                    backgroundColor: 'var(--bg-surface)',
                }}
            />

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
                        <span className="text-secondary flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            {material.carbonFootprint} kg CO₂e/m
                        </span>
                    )}
                </div>

                <div className="flex justify-between items-center mb-4">
                    <div className="text-xl font-bold text-primary">
                        {formatPrice(material.price, material.currency)}
                        <span className="text-gray-500 text-sm font-normal">/{material.unit}</span>
                    </div>
                </div>

                {/* Quantity + Add to Cart */}
                <div className="flex items-center gap-2">
                    <div className="flex items-center border border-white/10 rounded-lg overflow-hidden">
                        <button
                            onClick={() => setQuantity(Math.max(1, quantity - 5))}
                            className="px-3 py-2 bg-surface text-white hover:bg-white/5 transition-colors"
                        >
                            −
                        </button>
                        <input
                            type="number"
                            min="1"
                            max={material.quantity}
                            value={quantity}
                            onChange={(e) => setQuantity(Math.max(1, Math.min(material.quantity, parseInt(e.target.value) || 1)))}
                            className="w-16 text-center bg-transparent text-white border-x border-white/10 py-2 outline-none"
                        />
                        <button
                            onClick={() => setQuantity(Math.min(material.quantity, quantity + 5))}
                            className="px-3 py-2 bg-surface text-white hover:bg-white/5 transition-colors"
                        >
                            +
                        </button>
                    </div>
                    <button
                        onClick={handleAddToCart}
                        disabled={material.quantity < 1}
                        className={`btn-primary flex-1 py-2 text-sm transition-all ${added ? 'bg-secondary' : ''}`}
                    >
                        {added ? '✓ Added!' : 'Add to Cart'}
                    </button>
                </div>
            </div>
        </div>
    )
}
