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

    if (error) return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center">
                <div className="text-red-500 text-6xl mb-4">⚠️</div>
                <p className="text-gray-700 text-lg">{error}</p>
            </div>
        </div>
    )

    if (!product) return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-900 mx-auto mb-4"></div>
                <p className="text-gray-700 text-lg">Cargando producto...</p>
            </div>
        </div>
    )

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header/Navigation */}

            <div className="max-w-7xl mx-auto px-4 py-4">
                <button
                    onClick={() => navigate('/productos')}
                    className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors duration-200 font-medium"
                >
                    <FaArrowLeft className="text-sm" />
                    Volver a productos
                </button>
            </div>


            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                        {/* Image Section */}
                        <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 p-8">
                            {/* Carrusel de imágenes */}
                            <div className="relative group">
                                <div
                                    className="w-full h-96 lg:h-[500px] flex items-center justify-center rounded-xl bg-white shadow-inner select-none overflow-hidden"
                                    onTouchStart={onTouchStart}
                                    onTouchMove={onTouchMove}
                                    onTouchEnd={onTouchEnd}
                                >
                                    <img
                                        src={product.images && product.images.length > 0 ? product.images[currentImageIndex] : '/placeholder-image.jpg'}
                                        alt={`${product.name} - Imagen ${currentImageIndex + 1}`}
                                        className="max-w-full max-h-full object-contain transition-all duration-300 pointer-events-none"
                                        onError={(e: any) => {
                                            e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjI1NiIgdmlld0JveD0iMCAwIDQwMCAyNTYiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMjU2IiBmaWxsPSIjRjlGQUZCIi8+CjxwYXRoIGQ9Ik0yMDAgMTUwQzE5MC41IDE1MCAyMDAgMTM4LjggMjAwIDEzMkMyMDAgMTI1LjIgMTkwLjUgMTIwIDIwMCAxMjBDMjA5LjUgMTIwIDIyMCAxMjUuMiAyMjAgMTMyQzIyMCAxMzguOCAyMDkuNSAxNTAgMjAwIDE1MFpNMjAwIDE3MEMxODAuMiAxNzAgMTYwIDE2MC41IDE2MCA2MEMxNjAgMTQzLjUgMTgwLjIgMTMwIDIwMCAxMzBDMjE5LjggMTMwIDI0MCAxNDMuNSAyNDAgMTYwQzI0MCAxNjAuNSAyMTkuOCAxNzAgMjAwIDE3MFoiIGZpbGw9IiNEMUQ1REIiLz4KPC9zdmc+Cg=='
                                        }}
                                    />
                                </div>

                                {/* Flechas de navegación (solo si hay más de una imagen) */}
                                {product && product.images && product.images.length > 1 && (
                                    <>
                                        <button
                                            onClick={prevImage}
                                            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-90 text-gray-800 p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-opacity-100 hover:shadow-xl backdrop-blur-sm"
                                        >
                                            <FaChevronLeft size={18} />
                                        </button>
                                        <button
                                            onClick={nextImage}
                                            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-90 text-gray-800 p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-opacity-100 hover:shadow-xl backdrop-blur-sm"
                                        >
                                            <FaChevronRight size={18} />
                                        </button>
                                    </>
                                )}

                                {/* Indicadores de imagen (solo si hay más de una imagen) */}
                                {product && product.images && product.images.length > 1 && (
                                    <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2">
                                        {product.images.map((_: any, index: number) => (
                                            <button
                                                key={index}
                                                onClick={() => goToImage(index)}
                                                className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentImageIndex
                                                    ? 'bg-gray-800 shadow-lg scale-110'
                                                    : 'bg-gray-400 hover:bg-gray-600 hover:scale-105'
                                                    }`}
                                            />
                                        ))}
                                    </div>
                                )}

                                {/* Contador de imágenes */}
                                {product && product.images && product.images.length > 1 && (
                                    <div className="absolute top-4 right-4 bg-black bg-opacity-70 text-white px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm">
                                        {currentImageIndex + 1} / {product.images.length}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Product Info Section */}
                        <div className="p-8 lg:p-12 flex flex-col justify-between">
                            <div>
                                {/* Product Title & Price */}
                                <div className="mb-8">
                                    <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4 leading-tight">{product.name}</h1>
                                    <p className="text-gray-600 text-lg mb-6 leading-relaxed">{product.description}</p>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-4xl font-bold text-gray-900">{product.price}€</span>
                                        <span className="text-gray-500 text-lg">IVA incluido</span>
                                    </div>
                                </div>

                                {/* Tallas */}
                                {product.sizes.length > 1 && (
                                    <div className="mb-8">
                                        <label className="block text-lg font-semibold text-gray-900 mb-4">Selecciona talla:</label>
                                        <div className="grid grid-cols-4 gap-3">
                                            {product.sizes.map((size: any) => {
                                                const isAvailable = getSizeAvailability(size.id)
                                                const isSelected = selectedSize === size.id

                                                return (
                                                    <button
                                                        key={size.id}
                                                        className={`py-3 px-4 rounded-lg font-medium transition-all duration-200 ${isSelected
                                                            ? 'bg-gray-900 text-white shadow-lg scale-105'
                                                            : isAvailable
                                                                ? 'bg-gray-100 text-gray-900 hover:bg-gray-200 hover:shadow-md border border-gray-200'
                                                                : 'bg-gray-50 text-gray-400 border border-gray-200 cursor-not-allowed opacity-50 line-through'
                                                            }`}
                                                        onClick={() => {
                                                            if (isSelected) {
                                                                setSelectedSize(null)
                                                            } else if (isAvailable) {
                                                                setSelectedSize(size.id)
                                                            }
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
                                            <div className="mt-3">
                                                <button
                                                    onClick={() => setSelectedSize(null)}
                                                    className="text-sm text-gray-500 hover:text-gray-700 underline transition-colors"
                                                >
                                                    Limpiar selección
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Colores */}
                                {product.colors.length > 1 && (
                                    <div className="mb-8">
                                        <label className="block text-lg font-semibold text-gray-900 mb-4">Selecciona color:</label>
                                        <div className="grid grid-cols-3 gap-3">
                                            {product.colors.map((color: any) => {
                                                const isAvailable = getColorAvailability(color.id)
                                                const isSelected = selectedColor === color.id

                                                return (
                                                    <button
                                                        key={color.id}
                                                        className={`py-3 px-4 rounded-lg font-medium transition-all duration-200 ${isSelected
                                                            ? 'bg-gray-900 text-white shadow-lg scale-105'
                                                            : isAvailable
                                                                ? 'bg-gray-100 text-gray-900 hover:bg-gray-200 hover:shadow-md border border-gray-200'
                                                                : 'bg-gray-50 text-gray-400 border border-gray-200 cursor-not-allowed opacity-50 line-through'
                                                            }`}
                                                        onClick={() => {
                                                            if (isSelected) {
                                                                setSelectedColor(null)
                                                            } else if (isAvailable) {
                                                                setSelectedColor(color.id)
                                                            }
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
                                            <div className="mt-3">
                                                <button
                                                    onClick={() => setSelectedColor(null)}
                                                    className="text-sm text-gray-500 hover:text-gray-700 underline transition-colors"
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
                                                <div className="flex items-center gap-3 text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3">
                                                    <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                                                        <path d="M12 9v4m0 4h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                    </svg>
                                                    <span className="font-medium">
                                                        Selecciona {missing.join(' y ')} para ver el stock disponible
                                                    </span>
                                                </div>
                                            )
                                        } else {
                                            return (
                                                <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg px-4 py-3">
                                                    <div className="flex items-center gap-3">
                                                        <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                                                            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                        </svg>
                                                        <span className="font-semibold text-green-800">Stock disponible:</span>
                                                    </div>
                                                    <span className="text-2xl font-bold text-green-800">{stock}</span>
                                                </div>
                                            )
                                        }
                                    })()}
                                </div>
                            </div>

                            {/* Action Section */}
                            <div className="border-t border-gray-200 pt-8">
                                <button
                                    className={`w-full py-4 px-8 rounded-xl font-semibold text-lg transition-all duration-200 ${(() => {
                                        const needsSize = product.sizes.length > 1
                                        const needsColor = product.colors.length > 1
                                        const allSelected = (!needsSize || selectedSize) && (!needsColor || selectedColor)
                                        return allSelected && stock > 0
                                            ? 'bg-gray-900 text-white hover:bg-gray-800 transform hover:scale-[1.02] shadow-lg hover:shadow-xl'
                                            : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                    })()}`}
                                    disabled={(() => {
                                        const needsSize = product.sizes.length > 1
                                        const needsColor = product.colors.length > 1
                                        const allSelected = (!needsSize || selectedSize) && (!needsColor || selectedColor)
                                        return !(allSelected && stock > 0)
                                    })()}
                                // onClick={...} // función de añadir al carrito
                                >
                                    <div className="flex items-center justify-center gap-3">
                                        <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
                                            <path d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H19M17 17a2 2 0 1 1 4 0 2 2 0 0 1-4 0ZM9 17a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                        Añadir al carrito
                                    </div>
                                </button>

                                {/* Trust indicators */}
                                <div className="grid grid-cols-2 gap-4 mt-6 text-sm text-gray-600">
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
                                        <span>Devolución gratuita</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProductDetail