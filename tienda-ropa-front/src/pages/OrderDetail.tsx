import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { FaArrowLeft, FaBox, FaCreditCard, FaTag } from 'react-icons/fa'
import { fetchOrderDetail } from '../services/api'

const OrderDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const [order, setOrder] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        if (id) {
            fetchOrderDetail(id)
                .then(setOrder)
                .catch(() => setError('Error al cargar el pedido'))
                .finally(() => setLoading(false))
        }
    }, [id])

    if (loading) return <div className="text-center p-8">Cargando pedido...</div>
    if (error) return <div className="text-center p-8 text-red-500">{error}</div>
    if (!order) return <div className="text-center p-8">Pedido no encontrado</div>

    return (
        <section className="max-w-2xl mx-auto p-6">
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 mb-6 text-blue-600 hover:text-blue-800 transition-colors"
            >
                <FaArrowLeft />
                Volver
            </button>
            <div className="bg-white shadow-lg rounded-xl p-8">
                <div className="flex items-center gap-4 mb-6">
                    <FaBox className="text-green-500 text-3xl" />
                    <h1 className="text-2xl font-bold text-gray-800">Pedido #{order.id}</h1>
                </div>
                <div className="mb-4">
                    <span className="font-semibold">Estado: </span>
                    <span>{order.status}</span>
                </div>
                <div className="mb-4">
                    <span className="font-semibold">Fecha: </span>
                    <span>{new Date(order.created_at).toLocaleDateString('es-ES')}</span>
                </div>
                <div className="mb-4">
                    <span className="font-semibold">Usuario: </span>
                    <span>{order.user?.name} ({order.user?.email})</span>
                </div>
                <div className="mb-4">
                    <span className="font-semibold">Tipo envío: </span>
                    <span>{order.shipping_type === 'recogida' ? 'Recogida en tienda' : 'Envío a domicilio'}</span>
                </div>
                {order.shipping_type === 'domicilio' && (
                    <div className="mb-4">
                        <span className="font-semibold">Datos de envío: </span>
                        {order.shipping_data && typeof order.shipping_data === 'object' ? (
                            <ul className="list-disc ml-6">
                                {Object.entries(order.shipping_data)
                                    .filter(([, value]) => value !== null && value !== undefined && value !== '')
                                    .map(([key, value]) => {
                                        // Mapear nombres técnicos a nombres amigables
                                        const fieldNames: { [key: string]: string } = {
                                            address: 'Dirección',
                                            city: 'Ciudad',
                                            postal_code: 'Código postal',
                                            province: 'Provincia',
                                            phone: 'Teléfono',
                                            notes: 'Notas'
                                        }

                                        const displayName = fieldNames[key] || key

                                        return (
                                            <li key={key}>
                                                <span className="font-bold">{displayName}:</span> {String(value)}
                                            </li>
                                        )
                                    })}
                            </ul>
                        ) : (
                            <span>No disponible</span>
                        )}
                    </div>
                )}
                <div className="border-t border-b py-4 my-4">
                    <h4 className="font-medium text-gray-700 mb-3">Productos:</h4>
                    <div className="space-y-2">
                        {order.items.map((item: any, idx: number) => (
                            <div key={idx} className="flex justify-between items-center">
                                <div>
                                    <span className="text-gray-800 font-medium flex items-center gap-2">
                                        <FaTag className="text-gray-400" />
                                        {item.product?.name ?? 'Producto'}
                                    </span>
                                    <span className="text-gray-500 ml-2">x{item.quantity}</span>
                                    {item.size && <span className="text-xs ml-2 text-gray-500">Talla: {item.size.name}</span>}
                                    {item.color && <span className="text-xs ml-2 text-gray-500">Color: {item.color.name}</span>}
                                </div>
                                <span className="font-medium">
                                    {item.product?.price ? Number(item.product.price).toFixed(2) : '--'}€
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="flex items-center gap-2 mb-2">
                    <FaCreditCard className="text-gray-500" />
                    <span className="text-xl font-bold text-gray-800">
                        Total: {order.items.reduce(
                            (total: number, item: any) => total + ((item.product?.price ?? 0) * item.quantity), 0
                        ).toFixed(2)}€
                    </span>
                </div>
            </div>
        </section>
    )
}

export default OrderDetail