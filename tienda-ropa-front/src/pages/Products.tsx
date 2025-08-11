import React, { useEffect, useState } from 'react'
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

  return (
    <section>
      <h1 className="text-2xl font-bold mb-4">Productos</h1>
      {loading ? (
        <p>Cargando...</p>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {products.map(product => (
            <div key={product.id} className="border rounded p-4 shadow">
              <h2 className="font-semibold text-lg">{product.name}</h2>
              <p>{product.description}</p>
              <p className="text-sm text-gray-600">{product.category} - {product.gender}</p>
              <p className="text-blue-600 font-bold">{product.price} €</p>
              {product.images && product.images.length > 0 && (
                <img src={product.images[0]} alt={product.name} className="mt-2 h-32 object-cover" />
              )}
            </div>
          ))}
        </div>
      ) : (
        <p>No hay productos disponibles.</p>
      )}
    </section>
  )
}

export default Products