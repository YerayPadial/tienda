import React, { useState, useEffect, useCallback, useRef } from 'react'
import { api } from '../services/api'
import PriceRangeSlider from './PriceRangeSlider'

// Custom Icons
const ChevronDownIcon = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
)

const ChevronUpIcon = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
    </svg>
)

const FunnelIcon = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
    </svg>
)

const XMarkIcon = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
)

interface Size {
    id: number
    name: string
}

interface Color {
    id: number
    name: string
    hex: string
}

interface FilterProps {
    onFiltersChange: (filters: ProductFilters) => void
    onSearch: (search: string) => void
    categories: string[]
    genders: string[]
}

export interface ProductFilters {
    category: string
    gender: string
    sizes: number[]
    colors: number[]
    priceRange: {
        min: number
        max: number
    }
    search: string
}

const ProductFilters: React.FC<FilterProps> = ({
    onFiltersChange,
    onSearch,
    categories,
    genders
}) => {
    const [isOpen, setIsOpen] = useState(false)
    const [sizes, setSizes] = useState<Size[]>([])
    const [colors, setColors] = useState<Color[]>([])
    const [expandedSections, setExpandedSections] = useState<{
        category: boolean
        gender: boolean
        size: boolean
        color: boolean
        price: boolean
    }>({
        category: true,
        gender: true,
        size: false,
        color: false,
        price: false
    })

    const [filters, setFilters] = useState<ProductFilters>({
        category: '',
        gender: '',
        sizes: [],
        colors: [],
        priceRange: { min: 0, max: 1000 },
        search: ''
    })

    const [searchTerm, setSearchTerm] = useState('')
    const [isFirstRender, setIsFirstRender] = useState(true)

    useEffect(() => {
        fetchSizes()
        fetchColors()
    }, [])

    const onFiltersChangeRef = useRef(onFiltersChange)
    const onSearchRef = useRef(onSearch)

    // Mantener las referencias actualizadas
    useEffect(() => {
        onFiltersChangeRef.current = onFiltersChange
        onSearchRef.current = onSearch
    })

    // Efecto para notificar cambios de filtros inmediatamente
    useEffect(() => {
        if (isFirstRender) {
            setIsFirstRender(false)
            return
        }

        // Notificar cambios inmediatamente (el debounce está en el padre)
        onFiltersChangeRef.current(filters)
    }, [filters, isFirstRender])

    // Efecto para notificar cambios de búsqueda  
    useEffect(() => {
        if (!isFirstRender) {
            onSearchRef.current(filters.search)
        }
    }, [filters.search, isFirstRender])

    const fetchSizes = async () => {
        try {
            const response = await api.get('/sizes')
            setSizes(response.data)
        } catch (error) {
            console.error('Error fetching sizes:', error)
        }
    }

    const fetchColors = async () => {
        try {
            const response = await api.get('/colors')
            setColors(response.data)
        } catch (error) {
            console.error('Error fetching colors:', error)
        }
    }

    const handleFilterChange = useCallback((newFilters: Partial<ProductFilters>) => {
        setFilters(prevFilters => ({ ...prevFilters, ...newFilters }))
    }, [])

    const handlePriceRangeChange = useCallback((newRange: { min: number; max: number }) => {
        setFilters(prevFilters => ({ ...prevFilters, priceRange: newRange }))
    }, [])

    const handleSearch = useCallback((e: React.FormEvent) => {
        e.preventDefault()
        setFilters(prevFilters => ({ ...prevFilters, search: searchTerm }))
    }, [searchTerm])

    const clearFilters = useCallback(() => {
        const clearedFilters: ProductFilters = {
            category: '',
            gender: '',
            sizes: [],
            colors: [],
            priceRange: { min: 0, max: 1000 },
            search: ''
        }
        setFilters(clearedFilters)
        setSearchTerm('')

        // Notificar inmediatamente
        onFiltersChangeRef.current(clearedFilters)
    }, [])

    const toggleSection = (section: keyof typeof expandedSections) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }))
    }

    const handleSizeToggle = useCallback((sizeId: number) => {
        setFilters(prevFilters => {
            const newSizes = prevFilters.sizes.includes(sizeId)
                ? prevFilters.sizes.filter(id => id !== sizeId)
                : [...prevFilters.sizes, sizeId]
            return { ...prevFilters, sizes: newSizes }
        })
    }, [])

    const handleColorToggle = useCallback((colorId: number) => {
        setFilters(prevFilters => {
            const newColors = prevFilters.colors.includes(colorId)
                ? prevFilters.colors.filter(id => id !== colorId)
                : [...prevFilters.colors, colorId]
            return { ...prevFilters, colors: newColors }
        })
    }, [])

    const hasActiveFilters = filters.category !== '' ||
        filters.gender !== '' ||
        filters.sizes.length > 0 ||
        filters.colors.length > 0 ||
        filters.search !== '' ||
        filters.priceRange.min > 0 ||
        filters.priceRange.max < 1000

    return (
        <>
            {/* Mobile Filter Button */}
            <div className="lg:hidden mb-6">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg border border-gray-300 shadow-sm hover:bg-gray-50 transition-colors"
                >
                    <FunnelIcon className="h-5 w-5" />
                    <span>Filtros</span>
                    {hasActiveFilters && (
                        <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                            {[
                                filters.category !== '' ? 1 : 0,
                                filters.gender !== '' ? 1 : 0,
                                filters.sizes.length,
                                filters.colors.length,
                                filters.search !== '' ? 1 : 0,
                                (filters.priceRange.min > 0 || filters.priceRange.max < 1000) ? 1 : 0
                            ].reduce((total, count) => total + count, 0)}
                        </span>
                    )}
                </button>
            </div>

            {/* Filters Panel */}
            <div className={`
        ${isOpen ? 'block' : 'hidden'} lg:block
        bg-white rounded-xl shadow-sm border border-gray-200 p-6 h-fit sticky top-4
      `}>
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        <FunnelIcon className="h-5 w-5" />
                        Filtros
                    </h3>
                    {hasActiveFilters && (
                        <button
                            onClick={clearFilters}
                            className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
                        >
                            <XMarkIcon className="h-4 w-4" />
                            Limpiar
                        </button>
                    )}
                    <button
                        onClick={() => setIsOpen(false)}
                        className="lg:hidden text-gray-400 hover:text-gray-600"
                    >
                        <XMarkIcon className="h-5 w-5" />
                    </button>
                </div>

                {/* Search */}
                <form onSubmit={handleSearch} className="mb-6">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Buscar productos..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <button
                            type="submit"
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </button>
                    </div>
                </form>

                {/* Category Filter */}
                <div className="mb-6">
                    <button
                        onClick={() => toggleSection('category')}
                        className="flex items-center justify-between w-full text-left font-medium text-gray-900 mb-3"
                    >
                        <span>Categoría</span>
                        {expandedSections.category ? (
                            <ChevronUpIcon className="h-4 w-4" />
                        ) : (
                            <ChevronDownIcon className="h-4 w-4" />
                        )}
                    </button>
                    {expandedSections.category && (
                        <div className="space-y-2">
                            <label className="flex items-center">
                                <input
                                    type="radio"
                                    name="category"
                                    value=""
                                    checked={filters.category === ''}
                                    onChange={(e) => handleFilterChange({ category: e.target.value })}
                                    className="mr-2 text-blue-600"
                                />
                                <span className="text-sm text-gray-700">Todas</span>
                            </label>
                            {categories.map(category => (
                                <label key={category} className="flex items-center">
                                    <input
                                        type="radio"
                                        name="category"
                                        value={category}
                                        checked={filters.category === category}
                                        onChange={(e) => handleFilterChange({ category: e.target.value })}
                                        className="mr-2 text-blue-600"
                                    />
                                    <span className="text-sm text-gray-700 capitalize">{category}</span>
                                </label>
                            ))}
                        </div>
                    )}
                </div>

                {/* Gender Filter */}
                <div className="mb-6">
                    <button
                        onClick={() => toggleSection('gender')}
                        className="flex items-center justify-between w-full text-left font-medium text-gray-900 mb-3"
                    >
                        <span>Género</span>
                        {expandedSections.gender ? (
                            <ChevronUpIcon className="h-4 w-4" />
                        ) : (
                            <ChevronDownIcon className="h-4 w-4" />
                        )}
                    </button>
                    {expandedSections.gender && (
                        <div className="space-y-2">
                            <label className="flex items-center">
                                <input
                                    type="radio"
                                    name="gender"
                                    value=""
                                    checked={filters.gender === ''}
                                    onChange={(e) => handleFilterChange({ gender: e.target.value })}
                                    className="mr-2 text-blue-600"
                                />
                                <span className="text-sm text-gray-700">Todos</span>
                            </label>
                            {genders.map(gender => (
                                <label key={gender} className="flex items-center">
                                    <input
                                        type="radio"
                                        name="gender"
                                        value={gender}
                                        checked={filters.gender === gender}
                                        onChange={(e) => handleFilterChange({ gender: e.target.value })}
                                        className="mr-2 text-blue-600"
                                    />
                                    <span className="text-sm text-gray-700 capitalize">{gender}</span>
                                </label>
                            ))}
                        </div>
                    )}
                </div>

                {/* Size Filter */}
                <div className="mb-6">
                    <button
                        onClick={() => toggleSection('size')}
                        className="flex items-center justify-between w-full text-left font-medium text-gray-900 mb-3"
                    >
                        <span>Tallas</span>
                        {expandedSections.size ? (
                            <ChevronUpIcon className="h-4 w-4" />
                        ) : (
                            <ChevronDownIcon className="h-4 w-4" />
                        )}
                    </button>
                    {expandedSections.size && (
                        <div className="grid grid-cols-3 gap-2">
                            {sizes.map(size => (
                                <label
                                    key={size.id}
                                    className={`
                    flex items-center justify-center p-2 text-sm border rounded-lg cursor-pointer transition-colors
                    ${filters.sizes.includes(size.id)
                                            ? 'bg-blue-500 text-white border-blue-500'
                                            : 'bg-white text-gray-700 border-gray-300 hover:border-blue-300'
                                        }
                  `}
                                >
                                    <input
                                        type="checkbox"
                                        checked={filters.sizes.includes(size.id)}
                                        onChange={() => handleSizeToggle(size.id)}
                                        className="sr-only"
                                    />
                                    {size.name}
                                </label>
                            ))}
                        </div>
                    )}
                </div>

                {/* Color Filter */}
                <div className="mb-6">
                    <button
                        onClick={() => toggleSection('color')}
                        className="flex items-center justify-between w-full text-left font-medium text-gray-900 mb-3"
                    >
                        <span>Colores</span>
                        {expandedSections.color ? (
                            <ChevronUpIcon className="h-4 w-4" />
                        ) : (
                            <ChevronDownIcon className="h-4 w-4" />
                        )}
                    </button>
                    {expandedSections.color && (
                        <div className="grid grid-cols-4 gap-2">
                            {colors.map(color => (
                                <label
                                    key={color.id}
                                    className={`
                    relative flex items-center justify-center p-2 rounded-lg cursor-pointer border-2 transition-all
                    ${filters.colors.includes(color.id)
                                            ? 'border-blue-500 shadow-md'
                                            : 'border-gray-200 hover:border-gray-300'
                                        }
                  `}
                                    title={color.name}
                                >
                                    <input
                                        type="checkbox"
                                        checked={filters.colors.includes(color.id)}
                                        onChange={() => handleColorToggle(color.id)}
                                        className="sr-only"
                                    />
                                    <div
                                        className="w-6 h-6 rounded-full border border-gray-300"
                                        style={{ backgroundColor: color.hex }}
                                    />
                                    {filters.colors.includes(color.id) && (
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <svg className="w-4 h-4 text-white drop-shadow-lg" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                    )}
                                </label>
                            ))}
                        </div>
                    )}
                </div>

                {/* Price Range */}
                <div className="mb-6">
                    <button
                        onClick={() => toggleSection('price')}
                        className="flex items-center justify-between w-full text-left font-medium text-gray-900 mb-3"
                    >
                        <span>Precio</span>
                        {expandedSections.price ? (
                            <ChevronUpIcon className="h-4 w-4" />
                        ) : (
                            <ChevronDownIcon className="h-4 w-4" />
                        )}
                    </button>
                    {expandedSections.price && (
                        <PriceRangeSlider
                            min={0}
                            max={1000}
                            value={filters.priceRange}
                            onChange={handlePriceRangeChange}
                            step={10}
                        />
                    )}
                </div>
            </div>
        </>
    )
}

export default ProductFilters
