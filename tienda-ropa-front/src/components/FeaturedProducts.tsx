import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaArrowRight, FaShoppingBag, FaSpinner } from 'react-icons/fa'
import { fetchRecentProducts } from '../services/api'

interface Product {
  id: number
  name: string
  price: number
  image_url?: string
  category?: {
    name: string
  }
  created_at: string
}

const FeaturedProducts: React.FC = () => {
  const navigate = useNavigate()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadRecentProducts = async () => {
      try {
        setLoading(true)
        const response = await fetchRecentProducts(4)
        setProducts(response.products || response.data || response)
      } catch (err) {
        console.error('Error fetching recent products:', err)
        setError('Error al cargar productos recientes')
      } finally {
        setLoading(false)
      }
    }

    loadRecentProducts()
  }, [])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('es-ES', { 
      day: 'numeric', 
      month: 'short',
      year: 'numeric'
    })
  }

  const getDefaultImage = () => {
    return "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=500&fit=crop"
  }

  if (loading) {
    return (
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center">
            <FaSpinner className="animate-spin text-4xl text-blue-600 mx-auto mb-4" />
            <p className="text-gray-600">Cargando productos recientes...</p>
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Reintentar
            </button>
          </div>
        </div>
      </section>
    )
  }

  if (!products || products.length === 0) {
    return (
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center">
            <p className="text-gray-600">No hay productos recientes disponibles.</p>
          </div>
        </div>
      </section>
    )
  }

    return (
        <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-6">
                <div className="mb-8 border-b border-line pb-5">
                    <h2 className="font-display text-4xl font-normal tracking-tight text-ink sm:text-5xl">Últimas incorporaciones</h2>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                    {products.map((product, index) => (
                        <div
                            key={product.id}
                            className="group overflow-hidden border border-line bg-paper transition-colors hover:border-brand-400"
                            style={{ animationDelay: `${index * 0.1}s` }}
                        >
                            {/* Imagen del producto */}
                            <div className="relative overflow-hidden">
                                <img
                                    src={product.image_url || getDefaultImage()}
                                    alt={product.name}
                                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-700"
                                    onError={(e) => {
                                      const target = e.target as HTMLImageElement
                                      target.src = getDefaultImage()
                                    }}
                                />

                                {/* Badge de Nuevo */}
                                <div className="absolute top-4 left-4 bg-paper text-ink px-3 py-1 text-xs font-semibold border border-line flex items-center gap-1">
                                    <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                                    Nuevo
                                </div>

                                {/* Overlay con acción */}
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                    <button
                                        onClick={() => navigate(`/productos/${product.id}`)}
                                        className="bg-white text-blue-600 px-6 py-3 rounded-full font-semibold hover:bg-blue-600 hover:text-white transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center gap-2"
                                    >
                                        <FaShoppingBag />
                                        Ver Producto
                                    </button>
                                </div>
                            </div>

                            {/* Información del producto */}
                            <div className="p-6">
                                <div className="text-sm text-blue-600 font-medium mb-2">
                                  {product.category?.name || 'General'}
                                </div>
                                <h3 className="text-lg font-bold text-gray-800 mb-3 group-hover:text-blue-600 transition-colors duration-300 line-clamp-2">
                                    {product.name}
                                </h3>

                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-2">
                                        <span className="text-xl font-bold text-blue-600">
                                            €{Number(product.price).toFixed(2)}
                                        </span>
                                    </div>
                                    <div className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full font-medium">
                                        {formatDate(product.created_at)}
                                    </div>
                                </div>

                                {/* Botón de acción */}
                                <button
                                  onClick={() => navigate(`/productos/${product.id}`)}
                                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
                                >
                                  Ver Detalles
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* CTA para ver todos los productos */}
                <div className="text-center">
                    <button
                        onClick={() => navigate('/productos')}
                        className="group bg-gradient-to-r from-blue-600 to-purple-600 text-white px-10 py-4 rounded-2xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 text-lg font-bold shadow-xl hover:shadow-2xl transform hover:scale-105 flex items-center gap-3 mx-auto"
                    >
                        <FaShoppingBag className="group-hover:rotate-12 transition-transform duration-300" />
                        Ver Toda la Colección
                        <FaArrowRight className="group-hover:translate-x-1 transition-transform duration-300" />
                    </button>
                </div>
            </div>
        </section>
    )
}

export default FeaturedProducts
