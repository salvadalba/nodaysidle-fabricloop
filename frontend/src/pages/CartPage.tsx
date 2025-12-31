import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCartStore } from '../stores/CartStore'
import api from '../services/api'

export default function CartPage() {
    const navigate = useNavigate()
    const { items, removeItem, updateQuantity, clearCart, getTotal } = useCartStore()
    const [isCheckingOut, setIsCheckingOut] = useState(false)
    const [checkoutError, setCheckoutError] = useState('')

    const handleLogout = () => {
        api.clearToken()
        navigate('/login')
    }

    const handleCheckout = async () => {
        if (items.length === 0) return

        setIsCheckingOut(true)
        setCheckoutError('')

        try {
            // Create transactions for each cart item
            for (const item of items) {
                await api.createTransaction({
                    material_id: item.material.id,
                    quantity: item.quantity,
                    total_amount: item.material.price * item.quantity,
                    currency: item.material.currency
                })
            }

            clearCart()
            alert('Order placed successfully! Check your Orders page.')
            navigate('/orders')
        } catch (err) {
            setCheckoutError((err as Error).message || 'Checkout failed')
        } finally {
            setIsCheckingOut(false)
        }
    }

    const formatPrice = (price: number, currency: string = 'USD') => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency,
        }).format(price)
    }

    const totalAmount = getTotal()
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)

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
                            <Link to="/materials" className="text-gray-400 hover:text-white transition-colors">Materials</Link>
                            <Link to="/orders" className="text-gray-400 hover:text-white transition-colors">Orders</Link>
                            <Link to="/cart" className="text-primary font-medium flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                                Cart ({itemCount})
                            </Link>
                            <div className="h-6 w-px bg-gray-700" />
                            <button onClick={handleLogout} className="text-gray-400 hover:text-white text-sm transition-colors">
                                Sign out
                            </button>
                        </nav>
                    </div>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <h1 className="text-2xl font-bold text-white mb-6">Shopping Cart</h1>

                {items.length === 0 ? (
                    <div className="glass-card p-12 text-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <p className="text-gray-400 mb-4">Your cart is empty</p>
                        <Link to="/materials" className="btn-primary inline-block">
                            Browse Materials
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {/* Cart Items */}
                        <div className="glass-card divide-y divide-white/5">
                            {items.map((item) => (
                                <div key={item.material.id} className="p-4 flex items-center gap-4">
                                    {/* Thumbnail */}
                                    <div
                                        className="w-20 h-20 rounded-lg bg-cover bg-center flex-shrink-0"
                                        style={{
                                            backgroundImage: item.material.thumbnail
                                                ? `url(${item.material.thumbnail})`
                                                : 'linear-gradient(135deg, var(--color-primary-rgb, 167, 217, 48) / 0.2, transparent)',
                                            backgroundColor: 'var(--bg-surface)',
                                        }}
                                    />

                                    {/* Info */}
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-white font-medium truncate">{item.material.title}</h3>
                                        <p className="text-gray-500 text-sm">{item.material.materialType}</p>
                                        <p className="text-primary text-sm">
                                            {formatPrice(item.material.price, item.material.currency)}/{item.material.unit}
                                        </p>
                                    </div>

                                    {/* Quantity Controls */}
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => updateQuantity(item.material.id, item.quantity - 1)}
                                            disabled={item.quantity <= 1}
                                            className="w-8 h-8 rounded-lg bg-surface border border-white/10 text-white hover:border-primary/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        >
                                            −
                                        </button>
                                        <span className="w-12 text-center text-white font-medium">
                                            {item.quantity}
                                        </span>
                                        <button
                                            onClick={() => updateQuantity(item.material.id, item.quantity + 1)}
                                            disabled={item.quantity >= item.material.quantity}
                                            className="w-8 h-8 rounded-lg bg-surface border border-white/10 text-white hover:border-primary/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        >
                                            +
                                        </button>
                                    </div>

                                    {/* Subtotal */}
                                    <div className="w-24 text-right">
                                        <p className="text-white font-semibold">
                                            {formatPrice(item.material.price * item.quantity, item.material.currency)}
                                        </p>
                                    </div>

                                    {/* Remove */}
                                    <button
                                        onClick={() => removeItem(item.material.id)}
                                        className="text-gray-500 hover:text-red-400 transition-colors"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </div>
                            ))}
                        </div>

                        {/* Summary */}
                        <div className="glass-card p-6">
                            {checkoutError && (
                                <div className="error-message mb-4">{checkoutError}</div>
                            )}

                            <div className="flex justify-between items-center mb-4">
                                <span className="text-gray-400">Subtotal ({itemCount} items)</span>
                                <span className="text-xl font-bold text-white">{formatPrice(totalAmount)}</span>
                            </div>

                            <button
                                onClick={handleCheckout}
                                disabled={isCheckingOut}
                                className="btn-primary w-full py-4 text-lg"
                            >
                                {isCheckingOut ? 'Processing...' : 'Checkout'}
                            </button>

                            <p className="text-gray-500 text-sm text-center mt-3">
                                Orders are typically confirmed within 24 hours
                            </p>
                        </div>
                    </div>
                )}
            </main>
        </div>
    )
}
