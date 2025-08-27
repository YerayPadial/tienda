import React from 'react'
import { useCart } from '../context/CartContext'
import { FaShoppingBag } from 'react-icons/fa'

const CartIcon: React.FC = () => {
    const { totalItems, toggleCart } = useCart()

    return (
        <button
            onClick={toggleCart}
            className="relative p-3 bg-gradient-to-br from-blue-50 to-purple-50 hover:from-blue-100 hover:to-purple-100 text-blue-600 hover:text-blue-700 rounded-xl transition-all duration-300 group border border-blue-200 hover:border-blue-300 shadow-md hover:shadow-lg transform hover:scale-105"
            aria-label="Abrir carrito"
        >
            {/* Icono del carrito mejorado */}
            <FaShoppingBag className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />

            {/* Badge con el número de items mejorado */}
            {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold shadow-lg animate-pulse border-2 border-white">
                    {totalItems > 99 ? '99+' : totalItems}
                </span>
            )}

            {/* Efecto de brillo */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 rounded-xl"></div>
        </button>
    )
}

export default CartIcon
