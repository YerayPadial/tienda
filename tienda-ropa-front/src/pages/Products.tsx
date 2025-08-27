import React, { useState, useEffect, useCallback, useRef } from 'react'
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
  const [loading, setLoading] = useState(true)
  const [isInitialLoad, setIsInitialLoad] = useState(true)
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
  const abortControllerRef = useRef<AbortController | null>(null)
  const fetchTimeoutRef = useRef<number | null>(null)

  useEffect(() => {
    fetchFiltersData()
  }, [])

  useEffect(() => {
    // Cancelar petición anterior si existe
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    // Limpiar timeout anterior
    if (fetchTimeoutRef.current) {
      clearTimeout(fetchTimeoutRef.current)
    }

    // Debounce para filtros (no para paginación ni ordenación)
    const isFilterChange = JSON.stringify(filters) !== JSON.stringify({
      category: '',
      gender: '',
      sizes: [],
      colors: [],
      priceRange: { min: 0, max: 1000 },
      search: ''
    })

    if (isFilterChange) {
      // Aplicar debounce solo para cambios de filtros
      fetchTimeoutRef.current = setTimeout(() => {
        fetchProducts()
      }, 300)
    } else {
      // Sin debounce para carga inicial, paginación o ordenación
      fetchProducts()
    }

    return () => {
      if (fetchTimeoutRef.current) {
        clearTimeout(fetchTimeoutRef.current)
      }
    }
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
    // Crear nuevo AbortController para esta petición
    abortControllerRef.current = new AbortController()

    // Solo mostrar loading en carga inicial o cambio de página
    if (isInitialLoad || currentPage > 1) {
      setLoading(true)
    }

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

      const response = await api.get(`/products?${params}`, {
        signal: abortControllerRef.current.signal
      })
      const data: ProductResponse = response.data
      setProducts(data.data)
      setCurrentPage(data.current_page)
      setTotalPages(data.last_page)
      setTotalProducts(data.total)

      // Marcar que ya no es la carga inicial
      if (isInitialLoad) {
        setIsInitialLoad(false)
      }
    } catch (error: any) {
      // No mostrar error si la petición fue cancelada
      if (error.name !== 'CanceledError' && error.name !== 'AbortError') {
        console.error('Error fetching products:', error)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleFiltersChange = useCallback((newFilters: FilterType) => {
    // Detectar si realmente cambió algún filtro
    const filtersChanged = JSON.stringify(filters) !== JSON.stringify(newFilters)

    setFilters(newFilters)

    // Solo resetear página si los filtros realmente cambiaron
    if (filtersChanged && currentPage !== 1) {
      setCurrentPage(1)
    }
  }, [filters, currentPage])

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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="container mx-auto px-4 py-12">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="relative">
                <div className="w-20 h-20 mx-auto mb-6">
                  <div className="absolute inset-0 border-4 border-blue-200 rounded-full animate-pulse"></div>
                  <div className="absolute inset-2 border-4 border-blue-600 rounded-full animate-spin border-t-transparent"></div>
                  <div className="absolute inset-4 border-4 border-purple-600 rounded-full animate-ping border-t-transparent"></div>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Cargando productos</h3>
              <p className="text-gray-600">Preparando nuestra mejor selección para ti...</p>
              <div className="mt-6 flex justify-center space-x-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-12">
        {/* Enhanced Professional Header */}
        <div className="text-center mb-8 md:mb-12 relative overflow-hidden">
          {/* Sophisticated Background Elements */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5 rounded-3xl -z-10 transform -skew-y-1"></div>
          <div className="absolute -top-10 -left-10 w-96 h-96 bg-gradient-to-r from-blue-400/5 to-purple-400/5 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-10 -right-10 w-96 h-96 bg-gradient-to-r from-purple-400/5 to-pink-400/5 rounded-full blur-3xl"></div>

          <div className="relative py-8 md:py-12">
            {/* Premium Quality Badge */}
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-gray-200 text-gray-800 px-6 py-2 rounded-full text-sm font-semibold mb-4 md:mb-6 shadow-lg">
              <div className="w-2 h-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"></div>
              <span>Colección Premium</span>
              <div className="w-2 h-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full"></div>
            </div>

            <h1 className="text-5xl md:text-7xl font-black text-gray-900 mb-4 md:mb-6 leading-tight tracking-tight">
              <span className="relative inline-block">
                Nuestra
                <div className="absolute -top-2 md:-top-3 -right-4 md:-right-6 w-4 h-4 md:w-6 md:h-6 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full opacity-80 animate-pulse"></div>
              </span>
              <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent font-extrabold">
                Colección Exclusiva
              </span>
            </h1>

            {/* Elegant Divider */}
            <div className="flex justify-center items-center gap-4 mb-6 md:mb-8">
              <div className="w-24 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
              <div className="w-3 h-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full shadow-lg"></div>
              <div className="w-16 h-px bg-gradient-to-r from-gray-300 via-gray-400 to-gray-300"></div>
              <div className="w-2 h-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full"></div>
              <div className="w-24 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
            </div>

            <p className="text-xl md:text-2xl text-gray-700 max-w-4xl mx-auto leading-relaxed mb-6 md:mb-8 font-light">
              <span className="font-semibold text-blue-600">Descubre</span> las últimas tendencias en moda con nuestra selección
              <span className="font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"> meticulosamente curada</span> de prendas
              <span className="font-semibold text-gray-900">excepcionales y de calidad superior</span>
            </p>

            {/* Professional Quality Indicators */}
            <div className="flex flex-wrap justify-center gap-4 md:gap-8 mb-6 md:mb-8">
              <div className="flex items-center gap-3 bg-white/60 backdrop-blur-sm px-4 md:px-6 py-2 md:py-3 rounded-full shadow-lg border border-white/30">
                <div className="w-6 h-6 md:w-8 md:h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 md:w-4 md:h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-gray-700 font-semibold text-sm md:text-base">Calidad Certificada</span>
              </div>

              <div className="flex items-center gap-3 bg-white/60 backdrop-blur-sm px-4 md:px-6 py-2 md:py-3 rounded-full shadow-lg border border-white/30">
                <div className="w-6 h-6 md:w-8 md:h-8 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 md:w-4 md:h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="text-gray-700 font-semibold text-sm md:text-base">Diseños Únicos</span>
              </div>

              <div className="flex items-center gap-3 bg-white/60 backdrop-blur-sm px-4 md:px-6 py-2 md:py-3 rounded-full shadow-lg border border-white/30">
                <div className="w-6 h-6 md:w-8 md:h-8 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 md:w-4 md:h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-gray-700 font-semibold text-sm md:text-base">Tendencias Actuales</span>
              </div>
            </div>

            {/* Professional Stats */}
            <div className="max-w-3xl mx-auto mb-4 md:mb-6">
              <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-6 md:p-8 shadow-xl border border-white/20">
                <div className="grid grid-cols-3 gap-4 md:gap-8 text-center">
                  <div>
                    <div className="text-2xl md:text-3xl font-black text-blue-600 mb-2">500+</div>
                    <div className="text-xs md:text-sm text-gray-600 font-medium">Productos Únicos</div>
                  </div>
                  <div>
                    <div className="text-2xl md:text-3xl font-black text-purple-600 mb-2">15</div>
                    <div className="text-xs md:text-sm text-gray-600 font-medium">Años de Experiencia</div>
                  </div>
                  <div>
                    <div className="text-2xl md:text-3xl font-black text-pink-600 mb-2">50+</div>
                    <div className="text-xs md:text-sm text-gray-600 font-medium">Marcas Selectas</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Subtle Call to Action */}
            <div className="mt-4 md:mt-6">
              <p className="text-base md:text-lg text-gray-600 font-medium">
                <span className="text-gray-800 font-semibold">Explora nuestra colección</span> y encuentra tu estilo perfecto
              </p>
            </div>
          </div>
        </div>        <div className="flex flex-col xl:flex-row gap-10">
          {/* Enhanced Sidebar - Filters */}
          <div className="xl:w-1/4">
            <div className="sticky top-8">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20">
                <ProductFilters
                  onFiltersChange={handleFiltersChange}
                  onSearch={handleSearch}
                  categories={categories}
                  genders={genders}
                />
              </div>
            </div>
          </div>

          {/* Enhanced Main Content */}
          <div className="xl:w-3/4">
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20">
              {/* Sort and Results Count */}
              <ProductSort
                currentSort={sortBy}
                onSortChange={handleSortChange}
                totalProducts={totalProducts}
              />

              {/* Enhanced Products Grid */}
              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8 mt-8">
                  {[...Array(6)].map((_, index) => (
                    <div key={index} className="bg-white/80 rounded-2xl shadow-xl border border-white/20 overflow-hidden animate-pulse">
                      <div className="aspect-square bg-gradient-to-br from-gray-200 to-gray-300"></div>
                      <div className="p-6">
                        <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full mb-3"></div>
                        <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full w-2/3 mb-4"></div>
                        <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full w-1/3"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : products.length === 0 ? (
                <div className="text-center py-20">
                  <div className="mb-6">
                    <div className="mx-auto w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                      <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m13-8V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v1M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" />
                      </svg>
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">No se encontraron productos</h3>
                  <p className="text-lg text-gray-500 mb-6">Intenta ajustar tus filtros o términos de búsqueda</p>
                  <button
                    onClick={() => window.location.reload()}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-full font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105"
                  >
                    Recargar página
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8 mt-8">
                  {products.map((product, index) => (
                    <div
                      key={product.id}
                      className="group bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden border border-white/20 hover:border-blue-200 cursor-pointer transform hover:-translate-y-2"
                      onClick={() => handleProductClick(product.id)}
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      {/* Enhanced Image Container */}
                      <div className="relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 aspect-square">
                        {product.images && product.images.length > 0 ? (
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                            onError={(e: any) => {
                              e.target.src = 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=400&h=500&fit=crop&q=80'
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                            <svg className="w-20 h-20 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                        )}

                        {/* Enhanced Category Badge */}
                        <div className="absolute top-4 left-4">
                          <span className="inline-block bg-white/95 backdrop-blur-sm text-gray-800 text-xs font-bold px-3 py-1.5 rounded-full shadow-lg border border-white/20">
                            {product.category}
                          </span>
                        </div>

                        {/* Price Badge */}
                        <div className="absolute top-4 right-4">
                          <span className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-bold px-3 py-1.5 rounded-full shadow-lg">
                            {product.price}€
                          </span>
                        </div>

                        {/* Enhanced Quick View Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-end justify-center pb-6">
                          <div className="bg-white/95 backdrop-blur-sm text-gray-800 px-6 py-3 rounded-full font-bold transform translate-y-8 group-hover:translate-y-0 transition-transform duration-500 shadow-xl border border-white/20 flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            Ver detalles
                          </div>
                        </div>
                      </div>

                      {/* Enhanced Product Info */}
                      <div className="p-6">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-sm font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                            {product.gender}
                          </span>
                          <div className="flex items-center space-x-1">
                            {[...Array(5)].map((_, i) => (
                              <svg key={i} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                        </div>

                        <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors duration-300 line-clamp-1">
                          {product.name}
                        </h3>

                        <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
                          {product.description}
                        </p>

                        {/* Enhanced Action Button */}
                        <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-bold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform group-hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center gap-2">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                          </svg>
                          Ver Producto
                        </button>
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
    </div>
  )
}

export default Products