import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { FaArrowLeft, FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import { fetchProductDetail } from '../services/api'

const ProductDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const [product, setProduct] = useState<any>(null)
    const [selectedSize, setSelectedSize] = useState<string | null>(null)
    const [selectedColor, setSelectedColor] = useState<string | null>(null)
    const [stock, setStock] = useState<number>(0)
    const [error, setError] = useState('')
    const [currentImageIndex, setCurrentImageIndex] = useState(0)
    const [touchStart, setTouchStart] = useState<number | null>(null)
    const [touchEnd, setTouchEnd] = useState<number | null>(null)

    useEffect(() => {
        if (id) {
            fetchProductDetail(id)
                .then(data => setProduct(data.product))
                .catch(() => setError('Error al cargar el producto'))
        }
    }, [id])

    // Funciones para el carrusel de imágenes
    const nextImage = () => {
        if (product && product.images && product.images.length > 1) {
            setCurrentImageIndex((prevIndex) =>
                prevIndex === product.images.length - 1 ? 0 : prevIndex + 1
            )
        }
    }

    const prevImage = () => {
        if (product && product.images && product.images.length > 1) {
            setCurrentImageIndex((prevIndex) =>
                prevIndex === 0 ? product.images.length - 1 : prevIndex - 1
            )
        }
    }

    const goToImage = (index: number) => {
        setCurrentImageIndex(index)
    }

    // Funciones para manejar el deslizamiento táctil
    const minSwipeDistance = 50

    const onTouchStart = (e: React.TouchEvent) => {
        setTouchEnd(null)
        setTouchStart(e.targetTouches[0].clientX)
    }

    const onTouchMove = (e: React.TouchEvent) => {
        setTouchEnd(e.targetTouches[0].clientX)
    }

    const onTouchEnd = () => {
        if (!touchStart || !touchEnd) return

        const distance = touchStart - touchEnd
        const isLeftSwipe = distance > minSwipeDistance
        const isRightSwipe = distance < -minSwipeDistance

        if (product && product.images && product.images.length > 1) {
            if (isLeftSwipe) {
                nextImage()
            } else if (isRightSwipe) {
                prevImage()
            }
        }
    }

    // Resetear índice de imagen cuando cambie el producto
    useEffect(() => {
        setCurrentImageIndex(0)
    }, [product])

    // Navegación con teclado para el carrusel
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (product && product.images && product.images.length > 1) {
                if (event.key === 'ArrowLeft') {
                    event.preventDefault()
                    prevImage()
                } else if (event.key === 'ArrowRight') {
                    event.preventDefault()
                    nextImage()
                }
            }
        }

        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [product, currentImageIndex])

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

            {/* Carrusel de imágenes */}
            <div className="relative mb-4 group">
                <div
                    className="w-full h-64 overflow-hidden rounded-lg bg-gray-200 select-none"
                    onTouchStart={onTouchStart}
                    onTouchMove={onTouchMove}
                    onTouchEnd={onTouchEnd}
                >
                    <img
                        src={product.images && product.images.length > 0 ? product.images[currentImageIndex] : '/placeholder-image.jpg'}
                        alt={`${product.name} - Imagen ${currentImageIndex + 1}`}
                        className="w-full h-full object-cover transition-opacity duration-300 pointer-events-none"
                        onError={(e: any) => {
                            e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjI1NiIgdmlld0JveD0iMCAwIDQwMCAyNTYiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMjU2IiBmaWxsPSIjRTVFN0VCIi8+CjxwYXRoIGQ9Ik0yMDAgMTUwQzE5MC41IDE1MCAyMDAgMTM4LjggMjAwIDEzMkMyMDAgMTI1LjIgMTkwLjUgMTIwIDIwMCAxMjBDMjA5LjUgMTIwIDIyMCAxMjUuMiAyMjAgMTMyQzIyMCAxMzguOCAyMDkuNSAxNTAgMjAwIDE1MFpNMjAwIDE3MEMxODAuMiAxNzAgMTYwIDE2MC41IDE2MCA2MEMxNjAgMTQzLjUgMTgwLjIgMTMwIDIwMCAxMzBDMjE5LjggMTMwIDI0MCAxNDMuNSAyNDAgMTYwQzI0MCAxNjAuNSAyMTkuOCAxNzAgMjAwIDE3MFoiIGZpbGw9IiM5QzlDQTMiLz4KPC9zdmc+Cg=='
                        }}
                    />
                </div>

                {/* Flechas de navegación (solo si hay más de una imagen) */}
                {product && product.images && product.images.length > 1 && (
                    <>
                        <button
                            onClick={prevImage}
                            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-opacity-70"
                        >
                            <FaChevronLeft size={16} />
                        </button>
                        <button
                            onClick={nextImage}
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-opacity-70"
                        >
                            <FaChevronRight size={16} />
                        </button>
                    </>
                )}

                {/* Indicadores de imagen (solo si hay más de una imagen) */}
                {product && product.images && product.images.length > 1 && (
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                        {product.images.map((_: any, index: number) => (
                            <button
                                key={index}
                                onClick={() => goToImage(index)}
                                className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentImageIndex
                                    ? 'bg-white shadow-lg'
                                    : 'bg-white bg-opacity-50 hover:bg-opacity-75'
                                    }`}
                            />
                        ))}
                    </div>
                )}

                {/* Contador de imágenes */}
                {product && product.images && product.images.length > 1 && (
                    <div className="absolute top-4 right-4 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
                        {currentImageIndex + 1} / {product.images.length}
                    </div>
                )}
            </div>
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

                    if (!allSelected) {
                        const missing = []
                        if (needsSize && !selectedSize) missing.push('talla')
                        if (needsColor && !selectedColor) missing.push('color')

                        return (
                            <span className="flex items-center gap-2 text-gray-500 text-sm bg-gray-100 rounded px-2 py-1">
                                <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><path d="M12 17v.01M12 7a5 5 0 0 1 5 5c0 2.5-2.5 4-5 4s-5-1.5-5-4a5 5 0 0 1 5-5Zm0 0V4m0 13v3" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
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