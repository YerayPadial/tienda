import React from 'react'
import { useNavigate } from 'react-router-dom'

const OrderConfirmation: React.FC = () => {
    const navigate = useNavigate()

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
            <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
                {/* Icono de éxito */}
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
                    <svg
                        className="h-8 w-8 text-green-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 48 48"
                        aria-hidden="true"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M20 28l-8-8m0 0l8-8m-8 8h28"
                        />
                        <circle cx="24" cy="24" r="20" strokeWidth={2} />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />
                    </svg>
                </div>

                {/* Título */}
                <h1 className="text-2xl font-bold text-gray-900 mb-4">
                    ¡Pedido Confirmado!
                </h1>

                {/* Mensaje */}
                <p className="text-gray-600 mb-8">
                    Su pedido ha sido procesado correctamente. 
                </p>

                {/* Información adicional */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                    <h3 className="text-sm font-medium text-blue-900 mb-2">Información importante:</h3>
                    <ul className="text-sm text-blue-800 text-left space-y-1">
                        <li>• Su pedido está en estado "Pendiente"</li>
                        <li>• Puede consultar el estado en su área de usuario</li>
                    </ul>
                </div>

                {/* Botones */}
                <div className="space-y-3">
                    <button
                        onClick={() => navigate('/usuario')}
                        className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                        Ver mis pedidos
                    </button>
                    <button
                        onClick={() => navigate('/productos')}
                        className="w-full bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                    >
                        Seguir comprando
                    </button>
                </div>
            </div>
        </div>
    )
}

export default OrderConfirmation
