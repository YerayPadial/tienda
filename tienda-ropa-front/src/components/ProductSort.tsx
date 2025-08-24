import React from 'react'

interface SortOption {
    value: string
    label: string
}

interface ProductSortProps {
    currentSort: string
    onSortChange: (sort: string) => void
    totalProducts: number
}

const ProductSort: React.FC<ProductSortProps> = ({
    currentSort,
    onSortChange,
    totalProducts
}) => {
    const sortOptions: SortOption[] = [
        { value: 'created_at', label: 'Más recientes' },
        { value: 'popularity', label: 'Más populares' },
        { value: 'price_asc', label: 'Precio: menor a mayor' },
        { value: 'price_desc', label: 'Precio: mayor a menor' },
        { value: 'name', label: 'Nombre A-Z' },
    ]

    return (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div className="text-sm text-gray-600">
                {totalProducts} {totalProducts === 1 ? 'producto encontrado' : 'productos encontrados'}
            </div>

            <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 whitespace-nowrap">Ordenar por:</span>
                <select
                    value={currentSort}
                    onChange={(e) => onSortChange(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                    {sortOptions.map(option => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    )
}

export default ProductSort
