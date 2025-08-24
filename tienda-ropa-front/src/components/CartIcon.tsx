import React from 'react'
import { useCart } from '../context/CartContext'

const CartIcon: React.FC = () => {
    const { totalItems, toggleCart } = useCart()

    return (
        <button
            onClick={toggleCart}
            className="relative p-2 text-gray-700 hover:text-gray-900 transition-colors duration-200 group"
            aria-label="Abrir carrito"
        >
            {/* Icono del carrito */}
            <svg
                className="w-6 h-6 group-hover:scale-110 transition-transform duration-200"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m0 0h7m-7 0v-2a2 2 0 012-2h3a2 2 0 012 2v2"
                />
            </svg>

            {/* Badge con el número de items */}
            {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium animate-bounce">
                    {totalItems > 99 ? '99+' : totalItems}
                </span>
            )}
        </button>
    )
}

export default CartIcon
