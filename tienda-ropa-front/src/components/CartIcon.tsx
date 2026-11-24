import React from 'react'
import { useCart } from '../context/CartContext'
import { FaShoppingBag } from 'react-icons/fa'

const CartIcon: React.FC = () => {
    const { totalItems, toggleCart } = useCart()

    return (
        <button
            onClick={toggleCart}
            className="relative border border-line p-3 text-ink transition-colors hover:border-brand-400 hover:bg-sand"
            aria-label="Abrir carrito"
        >
            {/* Icono del carrito mejorado */}
            <FaShoppingBag className="h-4 w-4" aria-hidden="true" />

            {/* Badge con el número de items mejorado */}
            {totalItems > 0 && (
                <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full border border-paper bg-ink px-1 text-[10px] font-semibold text-white">
                    {totalItems > 99 ? '99+' : totalItems}
                </span>
            )}

        </button>
    )
}

export default CartIcon
