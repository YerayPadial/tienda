import React, { useState } from 'react'
import type { CartItem } from '../types/cart'

interface CustomerData {
    firstName: string
    lastName: string
    email: string
    phone: string
}

interface ShippingData {
    deliveryType: 'home' | 'store'
    address?: string
    city?: string
    postalCode?: string
    province?: string
    notes?: string
}

interface OrderSummaryProps {
    customerData: CustomerData
    shippingData: ShippingData
    items: CartItem[]
    totalPrice: number
    onBack: () => void
    onPlaceOrder: () => void
    isProcessing: boolean
}

const OrderSummary: React.FC<OrderSummaryProps> = ({
    customerData,
    shippingData,
    items,
    totalPrice,
    onBack,
    onPlaceOrder,
    isProcessing
}) => {
    const [showConfirmModal, setShowConfirmModal] = useState(false)

    const shippingCost = shippingData.deliveryType === 'home' ? 5.99 : 0
    const finalTotal = totalPrice + shippingCost

    const handleConfirmOrder = () => {
        setShowConfirmModal(false)
        onPlaceOrder()
    }

    return (
        <>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="mb-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Resumen del Pedido</h2>
                    <p className="text-gray-600">Revise su pedido antes de confirmar la compra</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Columna izquierda - Datos del cliente y envío */}
                    <div className="space-y-6">
                        {/* Datos del cliente */}
                        <div className="bg-gray-50 rounded-lg p-4">
                            <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
                                <svg className="w-5 h-5 mr-2 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                </svg>
                                Datos del Cliente
                            </h3>
                            <div className="space-y-2 text-sm">
                                <p><span className="font-medium">Nombre:</span> {customerData.firstName} {customerData.lastName}</p>
                                <p><span className="font-medium">Email:</span> {customerData.email}</p>
                                <p><span className="font-medium">Teléfono:</span> {customerData.phone}</p>
                            </div>
                        </div>

                        {/* Datos de envío */}
                        <div className="bg-gray-50 rounded-lg p-4">
                            <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
                                <svg className="w-5 h-5 mr-2 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                                    <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1V8a1 1 0 00-1-1h-3z" />
                                </svg>
                                Datos de Envío
                            </h3>
                            <div className="space-y-2 text-sm">
                                <p>
                                    <span className="font-medium">Método:</span>
                                    {shippingData.deliveryType === 'home' ? ' Envío a domicilio' : ' Recogida en tienda'}
                                </p>
                                {shippingData.deliveryType === 'home' ? (
                                    <>
                                        <p><span className="font-medium">Dirección:</span> {shippingData.address}</p>
                                        <p><span className="font-medium">Ciudad:</span> {shippingData.city}</p>
                                        <p><span className="font-medium">Código Postal:</span> {shippingData.postalCode}</p>
                                        <p><span className="font-medium">Provincia:</span> {shippingData.province}</p>
                                    </>
                                ) : (
                                    <p><span className="font-medium">Dirección de recogida:</span> Calle San Juan, 123, 28001 Madrid</p>
                                )}
                                {shippingData.notes && (
                                    <p><span className="font-medium">Notas:</span> {shippingData.notes}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Columna derecha - Productos y totales */}
                    <div className="space-y-6">
                        {/* Productos */}
                        <div className="bg-gray-50 rounded-lg p-4">
                            <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
                                <svg className="w-5 h-5 mr-2 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 2L3 7v11a1 1 0 001 1h12a1 1 0 001-1V7l-7-5zM8 15a1 1 0 001 1h2a1 1 0 001-1v-3a1 1 0 00-1-1H9a1 1 0 00-1 1v3z" clipRule="evenodd" />
                                </svg>
                                Productos ({items.length})
                            </h3>
                            <div className="space-y-3 max-h-64 overflow-y-auto">
                                {items.map((item) => (
                                    <div key={item.id} className="flex items-center space-x-3 bg-white rounded-lg p-3">
                                        <img
                                            src={item.product_image || '/placeholder-image.jpg'}
                                            alt={item.product_name}
                                            className="w-12 h-12 object-cover rounded"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-900 truncate">
                                                {item.product_name}
                                            </p>
                                            <div className="flex flex-wrap gap-1 mt-1">
                                                {item.size_name && (
                                                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                                        {item.size_name}
                                                    </span>
                                                )}
                                                {item.color_name && (
                                                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                                                        {item.color_name}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-medium text-gray-900">
                                                {item.quantity} x {(Number(item.product_price) || 0).toFixed(2)}€
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {((Number(item.product_price) || 0) * item.quantity).toFixed(2)}€
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Totales */}
                        <div className="bg-gray-50 rounded-lg p-4">
                            <h3 className="text-lg font-medium text-gray-900 mb-3">Resumen de Costes</h3>
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span>Subtotal productos:</span>
                                    <span>{totalPrice.toFixed(2)}€</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span>Gastos de envío:</span>
                                    <span>{shippingCost > 0 ? `${shippingCost.toFixed(2)}€` : 'Gratis'}</span>
                                </div>
                                <div className="border-t border-gray-300 pt-2">
                                    <div className="flex justify-between text-lg font-semibold">
                                        <span>Total:</span>
                                        <span className="text-blue-600">{finalTotal.toFixed(2)}€</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Buttons */}
                <div className="flex justify-between pt-6 border-t border-gray-200 mt-8">
                    <button
                        type="button"
                        onClick={onBack}
                        disabled={isProcessing}
                        className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Volver
                    </button>
                    <button
                        type="button"
                        onClick={() => setShowConfirmModal(true)}
                        disabled={isProcessing}
                        className="bg-green-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                    >
                        {isProcessing ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Procesando...
                            </>
                        ) : (
                            'Confirmar Pedido'
                        )}
                    </button>
                </div>
            </div>

            {/* Modal de confirmación */}
            {showConfirmModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md mx-4">
                        <div className="text-center">
                            <svg className="w-12 h-12 text-orange-500 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">Confirmar Pedido</h3>
                            <p className="text-gray-600 mb-6">
                                ¿Está seguro de que desea realizar este pedido por un total de <strong>{finalTotal.toFixed(2)}€</strong>?
                            </p>
                            <div className="flex justify-center space-x-3">
                                <button
                                    onClick={() => setShowConfirmModal(false)}
                                    className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={handleConfirmOrder}
                                    className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors"
                                >
                                    Sí, confirmar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default OrderSummary
