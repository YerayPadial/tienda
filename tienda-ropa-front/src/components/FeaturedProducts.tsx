import React from 'react'
import { useNavigate } from 'react-router-dom'
import { FaArrowRight, FaShoppingBag, FaFire, FaGem } from 'react-icons/fa'

const featuredProducts = [
    {
        id: 1,
        name: "Vestido Elegante Azul",
        price: 89.99,
        originalPrice: 119.99,
        image: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400&h=500&fit=crop",
        badge: "Trending",
        category: "Mujer"
    },
    {
        id: 2,
        name: "Camisa Premium Hombre",
        price: 65.99,
        originalPrice: 85.99,
        image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400&h=500&fit=crop",
        badge: "Bestseller",
        category: "Hombre"
    },
    {
        id: 3,
        name: "Conjunto Deportivo",
        price: 45.99,
        originalPrice: 65.99,
        image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=500&fit=crop",
        badge: "Oferta",
        category: "Deportivo"
    },
    {
        id: 4,
        name: "Chaqueta Moderna",
        price: 125.99,
        originalPrice: 165.99,
        image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=500&fit=crop",
        badge: "Premium",
        category: "Unisex"
    }
]

const FeaturedProducts: React.FC = () => {
    const navigate = useNavigate()

    const getBadgeColor = (badge: string) => {
        switch (badge) {
            case 'Trending':
                return 'bg-gradient-to-r from-pink-500 to-red-500'
            case 'Bestseller':
                return 'bg-gradient-to-r from-green-500 to-emerald-500'
            case 'Oferta':
                return 'bg-gradient-to-r from-yellow-500 to-orange-500'
            case 'Premium':
                return 'bg-gradient-to-r from-purple-500 to-indigo-500'
            default:
                return 'bg-gradient-to-r from-blue-500 to-purple-500'
        }
    }

    const getBadgeIcon = (badge: string) => {
        switch (badge) {
            case 'Trending':
                return <FaFire />
            case 'Premium':
                return <FaGem />
            default:
                return null
        }
    }

    return (
        <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-5xl font-bold text-gray-800 mb-6">
                        Productos
                        <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            Destacados
                        </span>
                    </h2>
                    <div className="w-32 h-2 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto mb-8 rounded-full"></div>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Descubre nuestra selección especial de prendas más populares y exclusivas
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                    {featuredProducts.map((product, index) => (
                        <div
                            key={product.id}
                            className="group bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 hover:border-blue-200 transform hover:-translate-y-2"
                            style={{ animationDelay: `${index * 0.1}s` }}
                        >
                            {/* Imagen del producto */}
                            <div className="relative overflow-hidden">
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-700"
                                />

                                {/* Badge */}
                                <div className={`absolute top-4 left-4 ${getBadgeColor(product.badge)} text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg flex items-center gap-1`}>
                                    {getBadgeIcon(product.badge)}
                                    {product.badge}
                                </div>

                                {/* Overlay con acción */}
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                    <button
                                        onClick={() => navigate('/productos')}
                                        className="bg-white text-blue-600 px-6 py-3 rounded-full font-semibold hover:bg-blue-600 hover:text-white transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center gap-2"
                                    >
                                        <FaShoppingBag />
                                        Ver Producto
                                    </button>
                                </div>
                            </div>

                            {/* Información del producto */}
                            <div className="p-6">
                                <div className="text-sm text-blue-600 font-medium mb-2">{product.category}</div>
                                <h3 className="text-lg font-bold text-gray-800 mb-3 group-hover:text-blue-600 transition-colors duration-300">
                                    {product.name}
                                </h3>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <span className="text-xl font-bold text-blue-600">
                                            €{product.price}
                                        </span>
                                        <span className="text-sm text-gray-500 line-through">
                                            €{product.originalPrice}
                                        </span>
                                    </div>
                                    <div className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded-full font-medium">
                                        -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* CTA para ver todos los productos */}
                <div className="text-center">
                    <button
                        onClick={() => navigate('/productos')}
                        className="group bg-gradient-to-r from-blue-600 to-purple-600 text-white px-10 py-4 rounded-2xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 text-lg font-bold shadow-xl hover:shadow-2xl transform hover:scale-105 flex items-center gap-3 mx-auto"
                    >
                        <FaShoppingBag className="group-hover:rotate-12 transition-transform duration-300" />
                        Ver Toda la Colección
                        <FaArrowRight className="group-hover:translate-x-1 transition-transform duration-300" />
                    </button>
                </div>
            </div>
        </section>
    )
}

export default FeaturedProducts
