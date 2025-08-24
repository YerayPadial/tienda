import React, { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import ProductFilters from '../components/ProductFilters'
import type { ProductFilters as FilterType } from '../components/ProductFilters'
import Pagination from '../components/Pagination'
import ProductSort from '../components/ProductSort'
import { api } from '../services/api'

interface Product {
  id: number
  name: string
  price: number
  images: string[]
  category: string
  gender: string
  description: string
}

interface ProductResponse {
  data: Product[]
  current_page: number
  last_page: number
  per_page: number
  total: number
  from: number
  to: number
}

const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [totalPages, setTotalPages] = useState<number>(1)
  const [totalProducts, setTotalProducts] = useState<number>(0)
  const [categories, setCategories] = useState<string[]>([])
  const [genders, setGenders] = useState<string[]>([])
  const [filters, setFilters] = useState<FilterType>({
    category: '',
    gender: '',
    sizes: [],
    colors: [],
    priceRange: { min: 0, max: 1000 },
    search: ''
  })
  const [sortBy, setSortBy] = useState<string>('created_at')
  const navigate = useNavigate()

  useEffect(() => {
    fetchFiltersData()
  }, [])

  useEffect(() => {
    fetchProducts()
  }, [currentPage, filters, sortBy])

  const fetchFiltersData = async () => {
    try {
      const response = await api.get('/products/filters')
      setCategories(response.data.categories || [])
      setGenders(response.data.genders || [])
    } catch (error) {
      console.error('Error fetching filters:', error)
    }
  }

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        per_page: '10',
        sort_by: sortBy,
      })

      // Agregar filtros a los parámetros
      if (filters.search) params.append('search', filters.search)
      if (filters.category) params.append('category', filters.category)
      if (filters.gender) params.append('gender', filters.gender)
      if (filters.priceRange.min > 0) params.append('min_price', filters.priceRange.min.toString())
      if (filters.priceRange.max < 1000) params.append('max_price', filters.priceRange.max.toString())
      if (filters.sizes.length > 0) params.append('sizes', filters.sizes.join(','))
      if (filters.colors.length > 0) params.append('colors', filters.colors.join(','))

      const response = await api.get(`/products?${params}`)
      const data: ProductResponse = response.data
      setProducts(data.data)
      setCurrentPage(data.current_page)
      setTotalPages(data.last_page)
      setTotalProducts(data.total)
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFiltersChange = useCallback((newFilters: FilterType) => {
    setFilters(newFilters)
    setCurrentPage(1) // Resetea a la primera pagina cuando los filtros cambian
  }, [])

  const handleSearch = useCallback((searchTerm: string) => {
    setFilters(prev => ({ ...prev, search: searchTerm }))
    setCurrentPage(1)
  }, [])

  const handleSortChange = useCallback((sort: string) => {
    setSortBy(sort)
    setCurrentPage(1)
  }, [])

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  const handleProductClick = useCallback((productId: number) => {
    navigate(`/productos/${productId}`)
  }, [navigate])

  if (loading && products.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Nuestra Colección
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Descubre las últimas tendencias en moda con nuestra selección cuidadosamente curada
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar - Filters */}
          <div className="lg:w-1/4">
            <ProductFilters
              onFiltersChange={handleFiltersChange}
              onSearch={handleSearch}
              categories={categories}
              genders={genders}
            />
          </div>

          {/* Main Content */}
          <div className="lg:w-3/4">
            {/* Sort and Results Count */}
            <ProductSort
              currentSort={sortBy}
              onSortChange={handleSortChange}
              totalProducts={totalProducts}
            />

            {/* Products Grid */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {[...Array(6)].map((_, index) => (
                  <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden animate-pulse">
                    <div className="aspect-square bg-gray-200"></div>
                    <div className="p-6">
                      <div className="h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
                      <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-16">
                <div className="mb-4">
                  <svg className="mx-auto h-24 w-24 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m13-8V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v1M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron productos</h3>
                <p className="text-gray-500">Intenta ajustar tus filtros o términos de búsqueda</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {products.map(product => (
                  <div
                    key={product.id}
                    className="group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 hover:border-gray-300 cursor-pointer"
                    onClick={() => handleProductClick(product.id)}
                  >
                    {/* Image Container */}
                    <div className="relative overflow-hidden bg-gray-100 aspect-square">
                      {product.images && product.images.length > 0 ? (
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={(e: any) => {
                            e.target.src = '/placeholder-image.jpg'
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-200">
                          <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}

                      {/* Category Badge */}
                      <div className="absolute top-3 left-3">
                        <span className="inline-block bg-white/90 backdrop-blur-sm text-gray-800 text-xs font-medium px-2 py-1 rounded-full">
                          {product.category}
                        </span>
                      </div>

                      {/* Quick View Overlay */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <span className="bg-white text-gray-800 px-4 py-2 rounded-lg font-medium transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                          Ver detalles
                        </span>
                      </div>
                    </div>

                    {/* Product Info */}
                    <div className="p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                        {product.name}
                      </h3>

                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {product.description}
                      </p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl font-bold text-gray-900">
                            €{product.price}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                            {product.gender}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                itemsPerPage={10}
                totalItems={totalProducts}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Products