export interface CartItem {
    id: string 
    product_id: number
    product_name: string
    product_price: number
    product_image?: string
    product_category: string
    size_id: number
    size_name: string
    color_id: number
    color_name: string
    color_hex?: string
    quantity: number
    stock_available: number
}

export interface CartContextType {
    items: CartItem[]
    totalItems: number
    totalPrice: number
    isOpen: boolean
    addItem: (item: Omit<CartItem, 'id'>) => void
    removeItem: (id: string) => void
    removeFromCart: (productId: number, size?: string, color?: string) => void
    updateQuantity: (id: string, quantity: number) => void
    clearCart: () => void
    openCart: () => void
    closeCart: () => void
    toggleCart: () => void
}
