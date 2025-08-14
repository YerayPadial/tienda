import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { fetchProductDetail } from '../services/api'

const ProductDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>()
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

    if (error) return <div>{error}</div>
    if (!product) return <div>Cargando...</div>

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg">
            <img src={product.image_url} alt={product.name} className="w-full h-64 object-cover mb-4" />
            <h1 className="text-2xl font-bold">{product.name}</h1>
            <p className="text-gray-700 mb-2">{product.description}</p>
            <p className="text-xl font-bold text-blue-600 mb-4">${product.price}</p>

            {/* Tallas */}
            {product.sizes.length > 1 && (
                <div className="mb-4">
                    <label className="font-semibold">Selecciona talla:</label>
                    <div className="flex gap-2 mt-2">
                        {product.sizes.map((size: any) => (
                            <button
                                key={size.id}
                                className={`px-4 py-2 rounded border ${selectedSize === size.id ? 'bg-blue-500 text-white' : 'bg-gray-100'
                                    }`}
                                onClick={() => setSelectedSize(size.id)}
                            >
                                {size.name}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Colores */}
            {product.colors.length > 1 && (
                <div className="mb-4">
                    <label className="font-semibold">Selecciona color:</label>
                    <div className="flex gap-2 mt-2">
                        {product.colors.map((color: any) => (
                            <button
                                key={color.id}
                                className={`px-4 py-2 rounded border ${selectedColor === color.id ? 'bg-blue-500 text-white' : 'bg-gray-100'
                                    }`}
                                onClick={() => setSelectedColor(color.id)}
                            >
                                {color.name}
                            </button>
                        ))}
                    </div>
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