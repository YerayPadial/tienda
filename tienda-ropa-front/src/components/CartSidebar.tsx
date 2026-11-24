import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useUser } from '../context/UserContext'
import CartItem from './CartItem'

const CartSidebar: React.FC = () => {
    const navigate = useNavigate()
    const { user } = useUser()
    const {
        items,
        isOpen,
        toggleCart,
        totalPrice,
        totalItems,
        clearCart
    } = useCart()

    const handleCheckout = () => {
        toggleCart()

        if (!user) {
            // Si no está logueado, redirigir al login
            navigate('/login', {
                state: {
                    from: '/checkout',
                    message: 'Debes iniciar sesión para proceder con el pago'
                }
            })
        } else {
            // Si está logueado, ir al checkout
            navigate('/checkout')
        }
    }

    return (
        <>
            {/* Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300"
                    onClick={toggleCart}
                />
            )}

            {/* Sidebar */}
            <div
                className={`fixed top-0 right-0 h-full w-96 max-w-full bg-paper shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'
                    }`}
            >
                {/* Header del carrito */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900">
                        Carrito de Compras {totalItems > 0 && `(${totalItems})`}
                    </h2>
                    <button
                        onClick={toggleCart}
                        className="p-1 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                        aria-label="Cerrar carrito"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Contenido del carrito */}
                <div className="flex flex-col h-full">
                    {items.length === 0 ? (
                        // Carrito vacío
                        <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
                            <svg className="w-16 h-16 mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1.5}
                                    d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m0 0h7m-7 0v-2a2 2 0 012-2h3a2 2 0 012 2v2"
                                />
                            </svg>
                            <p className="text-lg font-medium mb-2">Tu carrito está vacío</p>
                            <p className="text-sm text-center">Agrega algunos productos para comenzar tu compra</p>
                        </div>
                    ) : (
                        <>
                            {/* Lista de items */}
                            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                {items.map((item) => (
                                    <CartItem key={item.id} item={item} />
                                ))}
                            </div>

                            {/* Footer con total y acciones */}
                            <div className="border-t border-gray-200 p-4 space-y-4">
                                {/* Botón para limpiar carrito */}
                                <button
                                    onClick={clearCart}
                                    className="w-full text-sm text-gray-500 hover:text-red-500 transition-colors duration-200"
                                >
                                    Vaciar carrito
                                </button>

                                {/* Total */}
                                <div className="flex justify-between items-center text-lg font-semibold">
                                    <span>Total:</span>
                                    <span className="text-green-600">{totalPrice.toFixed(2)}€</span>
                                </div>

                                {/* Botón de checkout */}
                                <button
                                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                    onClick={handleCheckout}
                                >
                                    Proceder al Pago
                                </button>

                                {/* Botón para continuar comprando */}
                                <button
                                    onClick={toggleCart}
                                    className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                                >
                                    Continuar Comprando
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </>
    )
}

export default CartSidebar
