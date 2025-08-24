import React from 'react'
import type { CartItem as CartItemType } from '../types/cart'
import { useCart } from '../context/CartContext'

interface CartItemProps {
    item: CartItemType
}

const CartItem: React.FC<CartItemProps> = ({ item }) => {
    const { updateQuantity, removeFromCart } = useCart()

    const handleQuantityChange = (newQuantity: number) => {
        if (newQuantity <= 0) {
            removeFromCart(item.product_id, item.size_name, item.color_name)
        } else {
            updateQuantity(item.id, newQuantity)
        }
    }

    return (
        <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            {/* Imagen del producto */}
            <div className="flex-shrink-0">
                <img
                    src={item.product_image || '/placeholder-image.jpg'}
                    alt={item.product_name}
                    className="w-16 h-16 object-cover rounded-md"
                />
            </div>

            {/* Información del producto */}
            <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-gray-900 truncate">
                    {item.product_name}
                </h4>

                {/* Especificaciones seleccionadas */}
                <div className="flex flex-wrap gap-2 mt-1">
                    {item.size_name && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            Talla: {item.size_name}
                        </span>
                    )}
                    {item.color_name && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Color: {item.color_name}
                        </span>
                    )}
                </div>

                {/* Precio y controles de cantidad */}
                <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center space-x-2">
                        {/* Botón decrementar */}
                        <button
                            onClick={() => handleQuantityChange(item.quantity - 1)}
                            className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors duration-200"
                            aria-label="Decrementar cantidad"
                        >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                            </svg>
                        </button>

                        {/* Cantidad */}
                        <span className="text-sm font-medium min-w-[2rem] text-center">
                            {item.quantity}
                        </span>

                        {/* Botón incrementar */}
                        <button
                            onClick={() => handleQuantityChange(item.quantity + 1)}
                            className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors duration-200"
                            aria-label="Incrementar cantidad"
                        >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                        </button>
                    </div>

                    {/* Precio total del item */}
                    <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">
                            {(item.product_price * item.quantity).toFixed(2)} €
                        </p>
                        {item.quantity > 1 && (
                            <p className="text-xs text-gray-500">
                                {item.product_price.toFixed(2)}€ c/u
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* Botón eliminar */}
            <div className="flex-shrink-0">
                <button
                    onClick={() => removeFromCart(item.product_id, item.size_name, item.color_name)}
                    className="p-1 text-gray-400 hover:text-red-500 transition-colors duration-200"
                    aria-label="Eliminar del carrito"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                    </svg>
                </button>
            </div>
        </div>
    )
}

export default CartItem
