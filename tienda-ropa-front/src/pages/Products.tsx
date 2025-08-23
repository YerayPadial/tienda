import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../services/api'

type Product = {
  id: number
  name: string
  description: string
  category: string
  gender: string
  price: number
  images: string[]
}

const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [hoveredProduct, setHoveredProduct] = useState<number | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    api.get('/products')
      .then(response => {
        setProducts(response.data)
      })
      .catch(error => {
        console.error('Error al obtener productos:', error)
      })
      .finally(() => setLoading(false))
  }, [])

  const getCategoryColor = (category: string) => {
    const colors = {
      'camisetas': 'bg-blue-100 text-blue-800',
      'pantalones': 'bg-green-100 text-green-800',
      'zapatos': 'bg-purple-100 text-purple-800',
      'accesorios': 'bg-pink-100 text-pink-800',
      'abrigos': 'bg-orange-100 text-orange-800',
    }
    return colors[category.toLowerCase() as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  const getGenderIcon = (gender: string) => {
    switch (gender.toLowerCase()) {
      case 'hombre':
        return '👨'
      case 'mujer':
        return '👩'
      case 'unisex':
        return '👤'
      default:
        return '👤'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-900 mx-auto mb-6"></div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Cargando productos</h2>
            <p className="text-gray-600">Estamos preparando lo mejor para ti...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight">
              Nuestra Colección
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Descubre piezas únicas y tendencias de moda que definen tu estilo personal
            </p>
            <div className="flex items-center justify-center gap-6 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span>Calidad premium</span>
              </div>
              <div className="flex items-center gap-2">
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span>Envío gratuito</span>
              </div>
              <div className="flex items-center gap-2">
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span>Devolución fácil</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {products.length > 0 ? (
          <>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {products.length} {products.length === 1 ? 'Producto' : 'Productos'}
                </h2>
                <p className="text-gray-600 mt-1">Encuentra tu estilo perfecto</p>
              </div>

              {/* Filter/Sort placeholder */}
              <div className="flex items-center gap-4">
                <div className="text-sm text-gray-500">
                  Ordenar por popularidad
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {products.map(product => (
                <div
                  key={product.id}
                  className="group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 hover:border-gray-300"
                  onMouseEnter={() => setHoveredProduct(product.id)}
                  onMouseLeave={() => setHoveredProduct(null)}
                >
                  {/* Image Container */}
                  <div className="relative overflow-hidden bg-gray-100 aspect-square">
                    {product.images && product.images.length > 0 ? (
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e: any) => {
                          e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDQwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjRjlGQUZCIi8+CjxwYXRoIGQ9Ik0yMDAgMjIwQzE4NS44IDIyMCAyMDAgMjAyLjQgMjAwIDIwMEMyMDAgMTk3LjYgMTg1LjggMTgwIDIwMCAxODBDMjE0LjIgMTgwIDIzMCAxOTcuNiAyMzAgMjAwQzIzMCAyMDIuNCAyMTQuMiAyMjAgMjAwIDIyMFpNMjAwIDI2MEMxNzIuNCAyNjAgMTUwIDIzNy42IDE1MCAyMTBDMTUwIDI1Mi40IDE3Mi40IDIzMCAyMDAgMjMwQzIyNy42IDIzMCAyNTAgMjUyLjQgMjUwIDIxMEMyNTAgMjM3LjYgMjI3LjYgMjYwIDIwMCAyNjBaIiBmaWxsPSIjRDFENURCIi8+Cjwvc3ZnPgo='
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-100">
                        <svg width="48" height="48" fill="none" viewBox="0 0 24 24" className="text-gray-400">
                          <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                    )}

                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                      <button
                        onClick={() => navigate(`/productos/${product.id}`)}
                        className="opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 bg-white text-gray-900 px-6 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl"
                      >
                        Ver detalles
                      </button>
                    </div>

                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex flex-col gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(product.category)}`}>
                        {product.category}
                      </span>
                    </div>

                    <div className="absolute top-3 right-3">
                      <span className="text-2xl" title={product.gender}>
                        {getGenderIcon(product.gender)}
                      </span>
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="p-6">
                    <div className="mb-4">
                      <h3 className="font-bold text-lg text-gray-900 mb-2 group-hover:text-gray-700 transition-colors">
                        {product.name}
                      </h3>
                      <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed">
                        {product.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-right">
                        <div className="text-2xl font-bold text-gray-900">
                          {product.price}€
                        </div>
                        <div className="text-xs text-gray-500">
                          IVA incluido
                        </div>
                      </div>

                      <button
                        onClick={() => navigate(`/productos/${product.id}`)}
                        className="p-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors shadow-md hover:shadow-lg"
                        title="Ver producto"
                      >
                        <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                          <path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-6">🛍️</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">No hay productos disponibles</h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Estamos trabajando para traerte los mejores productos. Vuelve pronto para descubrir nuestra colección.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
            >
              Actualizar página
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Products