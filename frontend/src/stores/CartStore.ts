import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CartItem {
    material: {
        id: string
        title: string
        materialType: string
        price: number
        currency: string
        unit: string
        quantity: number // available quantity
        thumbnail?: string | null
        seller?: {
            companyName: string
        }
    }
    quantity: number
}

interface CartState {
    items: CartItem[]
    addItem: (material: CartItem['material'], quantity: number) => void
    removeItem: (materialId: string) => void
    updateQuantity: (materialId: string, quantity: number) => void
    clearCart: () => void
    getTotal: () => number
    getItemCount: () => number
}

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            items: [],

            addItem: (material, quantity) => {
                set((state) => {
                    const existingIndex = state.items.findIndex(
                        (item) => item.material.id === material.id
                    )

                    if (existingIndex >= 0) {
                        // Update existing item quantity
                        const newItems = [...state.items]
                        const newQty = newItems[existingIndex].quantity + quantity
                        // Don't exceed available stock
                        newItems[existingIndex].quantity = Math.min(newQty, material.quantity)
                        return { items: newItems }
                    } else {
                        // Add new item
                        return {
                            items: [...state.items, { material, quantity: Math.min(quantity, material.quantity) }]
                        }
                    }
                })
            },

            removeItem: (materialId) => {
                set((state) => ({
                    items: state.items.filter((item) => item.material.id !== materialId)
                }))
            },

            updateQuantity: (materialId, quantity) => {
                set((state) => ({
                    items: state.items.map((item) =>
                        item.material.id === materialId
                            ? { ...item, quantity: Math.max(1, Math.min(quantity, item.material.quantity)) }
                            : item
                    )
                }))
            },

            clearCart: () => set({ items: [] }),

            getTotal: () => {
                return get().items.reduce(
                    (total, item) => total + item.material.price * item.quantity,
                    0
                )
            },

            getItemCount: () => {
                return get().items.reduce((count, item) => count + item.quantity, 0)
            }
        }),
        {
            name: 'fabricloop-cart'
        }
    )
)
