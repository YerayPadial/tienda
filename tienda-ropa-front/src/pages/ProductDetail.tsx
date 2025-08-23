import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { FaArrowLeft } from 'react-icons/fa'
import { fetchProductDetail } from '../services/api'

const ProductDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const [product, setProduct] = useState<any>(null)
    const [selectedSize, setSelectedSize] = useState<string | null>(null)
    const [selectedColor, setSelectedColor] = useState<string | null>(null)
    const [stock, setStock] = useState<number>(0)
    const [error, setError] = useState('')

    useEffect(() => {
        if (id) {
            fetchProductDetail(id)
                .then(data => setProduct(data.product))
                .catch(() => setError('Error al cargar el producto'))
        }
    }, [id])

    // Funciones auxiliares para determinar disponibilidad
    const getSizeAvailability = (sizeId: string) => {
        if (!product || !product.stocks) return false

        const needsColor = product.colors.length > 1

        if (needsColor && selectedColor) {
            // Si hay color seleccionado, verificar si existe stock para esta talla con ese color
            return product.stocks.some((s: any) =>
                s.size_id === sizeId && s.color_id === selectedColor && s.stock > 0
            )
        } else if (needsColor && !selectedColor) {
            // Si no hay color seleccionado, verificar si existe stock para esta talla con cualquier color
            return product.stocks.some((s: any) =>
                s.size_id === sizeId && s.stock > 0
            )
        } else {
            // Si no hay variación de colores, solo verificar stock para la talla
            return product.stocks.some((s: any) =>
                s.size_id === sizeId && s.stock > 0
            )
        }
    }

    const getColorAvailability = (colorId: string) => {
        if (!product || !product.stocks) return false

        const needsSize = product.sizes.length > 1

        if (needsSize && selectedSize) {
            // Si hay talla seleccionada, verificar si existe stock para este color con esa talla
            return product.stocks.some((s: any) =>
                s.color_id === colorId && s.size_id === selectedSize && s.stock > 0
            )
        } else if (needsSize && !selectedSize) {
            // Si no hay talla seleccionada, verificar si existe stock para este color con cualquier talla
            return product.stocks.some((s: any) =>
                s.color_id === colorId && s.stock > 0
            )
        } else {
            // Si no hay variación de tallas, solo verificar stock para el color
            return product.stocks.some((s: any) =>
                s.color_id === colorId && s.stock > 0
            )
        }
    }

    useEffect(() => {
        // Solo busca el stock si están seleccionadas TODAS las opciones necesarias
        if (product && product.stocks) {
            // Verificar si se necesita seleccionar talla y color
            const needsSize = product.sizes.length > 1
            const needsColor = product.colors.length > 1

            // Solo calcular stock si todas las opciones necesarias están seleccionadas
            if (
                (!needsSize || selectedSize) &&
                (!needsColor || selectedColor)
            ) {
                // Buscar el stock exacto para la combinación seleccionada
                const exactStock = product.stocks.find((s: any) => {
                    const sizeMatch = !needsSize || s.size_id === selectedSize
                    const colorMatch = !needsColor || s.color_id === selectedColor
                    return sizeMatch && colorMatch
                })
                setStock(exactStock ? exactStock.stock : 0)
            } else {
                // Si no están todas las opciones seleccionadas, resetear stock
                setStock(0)
            }
        }
    }, [selectedSize, selectedColor, product])

    // Efecto para resetear selecciones inválidas cuando cambian las opciones disponibles
    useEffect(() => {
        if (product && product.stocks) {
            // Si hay una talla seleccionada pero ya no está disponible, resetearla
            if (selectedSize && !getSizeAvailability(selectedSize)) {
                setSelectedSize(null)
            }

            // Si hay un color seleccionado pero ya no está disponible, reseteerlo
            if (selectedColor && !getColorAvailability(selectedColor)) {
                setSelectedColor(null)
            }
        }
    }, [selectedSize, selectedColor, product])

    if (error) return <div>{error}</div>
    if (!product) return <div>Cargando...</div>

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg">
            {/* Botón de volver */}
            <button
                onClick={() => navigate('/productos')}
                className="flex items-center gap-2 mb-6 text-blue-600 hover:text-blue-800 transition-colors"
            >
                <FaArrowLeft />
                Volver a productos
            </button>

            <img
                src={product.images && product.images.length > 0 ? product.images[0] : '/placeholder-image.jpg'}
                alt={product.name}
                className="w-full h-64 object-cover mb-4"
                onError={(e: any) => {
                    e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjI1NiIgdmlld0JveD0iMCAwIDQwMCAyNTYiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMjU2IiBmaWxsPSIjRTVFN0VCIi8+CjxwYXRoIGQ9Ik0yMDAgMTUwQzE5MC41IDE1MCAyMDAgMTM4LjggMjAwIDEzMkMyMDAgMTI1LjIgMTkwLjUgMTIwIDIwMCAxMjBDMjA5LjUgMTIwIDIyMCAxMjUuMiAyMjAgMTMyQzIyMCAxMzguOCAyMDkuNSAxNTAgMjAwIDE1MFpNMjAwIDE3MEMxODAuMiAxNzAgMTYwIDE2MC41IDE2MCA2MEMxNjAgMTQzLjUgMTgwLjIgMTMwIDIwMCAxMzBDMjE5LjggMTMwIDI0MCAxNDMuNSAyNDAgMTYwQzI0MCAxNjAuNSAyMTkuOCAxNzAgMjAwIDE3MFoiIGZpbGw9IiM5QzlDQTMiLz4KPC9zdmc+Cg=='
                }}
            />
            <h1 className="text-2xl font-bold">{product.name}</h1>
            <p className="text-gray-700 mb-2">{product.description}</p>
            <p className="text-xl font-bold text-blue-600 mb-4">{product.price}€</p>

            {/* Tallas */}
            {product.sizes.length > 1 && (
                <div className="mb-4">
                    <label className="font-semibold">Selecciona talla:</label>
                    <div className="flex gap-2 mt-2 flex-wrap">
                        {product.sizes.map((size: any) => {
                            const isAvailable = getSizeAvailability(size.id)
                            const isSelected = selectedSize === size.id

                            return (
                                <button
                                    key={size.id}
                                    className={`px-4 py-2 rounded border transition-all ${isSelected
                                        ? 'bg-blue-500 text-white border-blue-500 hover:bg-blue-600'
                                        : isAvailable
                                            ? 'bg-gray-100 hover:bg-gray-200 border-gray-300'
                                            : 'bg-gray-50 text-gray-400 border-gray-200 cursor-not-allowed opacity-50 line-through'
                                        }`}
                                    onClick={() => {
                                        if (isSelected) {
                                            // Si ya está seleccionado, deseleccionar
                                            setSelectedSize(null)
                                        } else if (isAvailable) {
                                            // Si está disponible, seleccionar
                                            setSelectedSize(size.id)
                                        }
                                        // Si no está disponible, no hacer nada
                                    }}
                                    disabled={!isAvailable && !isSelected}
                                    title={
                                        isSelected
                                            ? 'Clic para deseleccionar'
                                            : !isAvailable
                                                ? 'Sin stock disponible'
                                                : 'Seleccionar talla'
                                    }
                                >
                                    {size.name}
                                </button>
                            )
                        })}
                    </div>
                    {selectedSize && (
                        <div className="mt-2 flex items-center justify-between">
                            <button
                                onClick={() => setSelectedSize(null)}
                                className="text-xs text-gray-500 hover:text-gray-700 underline"
                            >
                                Limpiar selección
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* Colores */}
            {product.colors.length > 1 && (
                <div className="mb-4">
                    <label className="font-semibold">Selecciona color:</label>
                    <div className="flex gap-2 mt-2 flex-wrap">
                        {product.colors.map((color: any) => {
                            const isAvailable = getColorAvailability(color.id)
                            const isSelected = selectedColor === color.id

                            return (
                                <button
                                    key={color.id}
                                    className={`px-4 py-2 rounded border transition-all ${isSelected
                                        ? 'bg-blue-500 text-white border-blue-500 hover:bg-blue-600'
                                        : isAvailable
                                            ? 'bg-gray-100 hover:bg-gray-200 border-gray-300'
                                            : 'bg-gray-50 text-gray-400 border-gray-200 cursor-not-allowed opacity-50 line-through'
                                        }`}
                                    onClick={() => {
                                        if (isSelected) {
                                            // Si ya está seleccionado, deseleccionar
                                            setSelectedColor(null)
                                        } else if (isAvailable) {
                                            // Si está disponible, seleccionar
                                            setSelectedColor(color.id)
                                        }
                                        // Si no está disponible, no hacer nada
                                    }}
                                    disabled={!isAvailable && !isSelected}
                                    title={
                                        isSelected
                                            ? 'Clic para deseleccionar'
                                            : !isAvailable
                                                ? 'Sin stock disponible'
                                                : 'Seleccionar color'
                                    }
                                >
                                    {color.name}
                                </button>
                            )
                        })}
                    </div>
                    {selectedColor && (
                        <div className="mt-2 flex items-center justify-between">
                            <button
                                onClick={() => setSelectedColor(null)}
                                className="text-xs text-gray-500 hover:text-gray-700 underline"
                            >
                                Limpiar selección
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* Stock disponible */}
            <div className="mb-4 text-gray-600">
                {(() => {
                    const needsSize = product.sizes.length > 1
                    const needsColor = product.colors.length > 1
                    const allSelected = (!needsSize || selectedSize) && (!needsColor || selectedColor)
                    const NoSelected = (selectedSize && !selectedColor) || (!selectedSize && selectedColor)
                    if (NoSelected) {
                        if (!allSelected) {
                            const missing = []
                            if (needsSize && !selectedSize) missing.push('talla')
                            if (needsColor && !selectedColor) missing.push('color')

                            return (
                                <span className="text-amber-600 italic">
                                    Selecciona {missing.join(' y ')} para ver el stock disponible
                                </span>
                            )
                        } else {
                            return (
                                <span>
                                    <span className="font-semibold">Stock disponible:</span> {stock}
                                </span>
                            )
                        }
                    }
                })()}
            </div>

            {/* Botón añadir al carrito */}
            <button
                className={`bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 ${(() => {
                    const needsSize = product.sizes.length > 1
                    const needsColor = product.colors.length > 1
                    const allSelected = (!needsSize || selectedSize) && (!needsColor || selectedColor)
                    return allSelected && stock > 0 ? '' : 'opacity-50 cursor-not-allowed'
                })()}`}
                disabled={(() => {
                    const needsSize = product.sizes.length > 1
                    const needsColor = product.colors.length > 1
                    const allSelected = (!needsSize || selectedSize) && (!needsColor || selectedColor)
                    return !(allSelected && stock > 0)
                })()}
            // onClick={...} // función de añadir al carrito
            >
                Añadir al carrito
            </button>
        </div>
    )
}

export default ProductDetail