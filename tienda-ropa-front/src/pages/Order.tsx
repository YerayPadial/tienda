import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaArrowLeft, FaBox, FaCalendar, FaCreditCard, FaTag } from 'react-icons/fa'
import { fetchUserOrders } from '../services/api'

const getCurrentUser = () => {
  const userStr = localStorage.getItem('user')
  try {
    return userStr ? JSON.parse(userStr) : null
  } catch {
    return null
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Entregado':
      return 'text-green-600 bg-green-100'
    case 'En camino':
      return 'text-blue-600 bg-blue-100'
    case 'Procesando':
      return 'text-yellow-600 bg-yellow-100'
    default:
      return 'text-gray-600 bg-gray-100'
  }
}

const Order: React.FC = () => {
  const navigate = useNavigate()
  const user = getCurrentUser()
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (user) {
      fetchUserOrders(user.id)
        .then(setOrders)
        .catch(() => setError('Error al cargar los pedidos'))
        .finally(() => setLoading(false))
    }
  }, [user])

  if (!user) {
    return (
      <div className="p-8 text-center">
        <p className="text-xl text-gray-600 mb-4">Debes iniciar sesión para ver tus pedidos</p>
        <button
          onClick={() => navigate('/login')}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Ir al Login
        </button>
      </div>
    )
  }

  return (
    <section className="max-w-4xl mx-auto p-6">
      {/* Botón de regresar */}
      <button
        onClick={() => navigate('/usuario')}
        className="flex items-center gap-2 mb-6 text-blue-600 hover:text-blue-800 transition-colors"
      >
        <FaArrowLeft />
        Volver al menú
      </button>

      {/* Encabezado */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
          <FaBox className="text-green-500 text-3xl" />
        </div>
        <h1 className="text-3xl font-bold text-gray-800">Mis Pedidos</h1>
        <p className="text-gray-600">Consulta el estado de tus compras</p>
      </div>

      {/* Estado de carga */}
      {loading && (
        <div className="text-center py-12 text-gray-500">Cargando pedidos...</div>
      )}

      {/* Error */}
      {error && (
        <div className="text-center py-12 text-red-500">{error}</div>
      )}

      {/* Lista de pedidos */}
      {!loading && orders && orders.length > 0 && (
        <div className="space-y-6">
          {orders.map(order => (
            <div key={order.id} className="bg-white shadow-lg rounded-xl p-6">
              {/* Encabezado del pedido */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                <div className="flex items-center gap-4 mb-2 sm:mb-0">
                  <h3 className="text-lg font-semibold">Pedido #{order.id}</h3>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </div>
                <div className="text-sm text-gray-500 flex items-center gap-2">
                  <FaCalendar />
                  {new Date(order.created_at).toLocaleDateString('es-ES')}
                </div>
              </div>

              {/* Productos del pedido */}
              <div className="border-t border-b py-4 my-4">
                <h4 className="font-medium text-gray-700 mb-3">Productos:</h4>
                <div className="space-y-2">
                  {order.items.map((item: any, index: number) => (
                    <div key={index} className="flex justify-between items-center">
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
                        ${item.product?.price ? Number(item.product.price).toFixed(2) : '--'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total y acciones */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2 mb-2 sm:mb-0">
                  <FaCreditCard className="text-gray-500" />
                  <span className="text-xl font-bold text-gray-800">
                    Total: ${order.items.reduce((total: number, item: any) => total + ((item.product?.price ?? 0) * item.quantity), 0).toFixed(2)}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button className="px-4 py-2 border border-blue-600 text-blue-600 rounded hover:bg-blue-50 transition-colors" onClick={() => navigate(`/detalles-pedido/${order.id}`)}>

                    Ver Detalles
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Mensaje si no hay pedidos */}
      {!loading && orders.length === 0 && (
        <div className="text-center py-12">
          <FaBox className="text-gray-300 text-6xl mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No tienes pedidos aún</h3>
          <p className="text-gray-500 mb-6">¡Explora nuestros productos y haz tu primera compra!</p>
          <button
            onClick={() => navigate('/productos')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Ver Productos
          </button>
        </div>
      )}
    </section>
  )
}

export default Order