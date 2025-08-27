import React from 'react'
import { FaStar, FaQuoteLeft } from 'react-icons/fa'

const testimonials = [
    {
        id: 1,
        name: "María González",
        location: "San Juan del Puerto",
        rating: 5,
        comment: "Increíble calidad y atención al cliente. Siempre encuentro lo que busco y el personal es súper amable. ¡Totalmente recomendado!",
        avatar: "https://randomuser.me/api/portraits/women/40.jpg"
    },
    {
        id: 2,
        name: "Carlos Ruiz",
        location: "Huelva",
        rating: 5,
        comment: "La mejor tienda de ropa de la zona. Precios justos, calidad excelente y siempre tienen las últimas tendencias. Mi familia y yo compramos aquí desde hace años.",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
    },
    {
        id: 3,
        name: "Ana Fernández",
        location: "Moguer",
        rating: 5,
        comment: "Me encanta la variedad que tienen. Desde ropa casual hasta vestidos elegantes. El asesoramiento personalizado es fantástico.",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face"
    }
]

const Testimonials: React.FC = () => {
    return (
        <section className="py-20 bg-gradient-to-br from-purple-50 to-blue-50">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-5xl font-bold text-gray-800 mb-6">
                        Lo que Dicen Nuestros
                        <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            Clientes Felices
                        </span>
                    </h2>
                    <div className="w-32 h-2 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto mb-8 rounded-full"></div>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        La satisfacción de nuestros clientes es nuestra mayor recompensa
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {testimonials.map((testimonial, index) => (
                        <div
                            key={testimonial.id}
                            className="bg-white p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100"
                            style={{ animationDelay: `${index * 0.2}s` }}
                        >
                            {/* Icono de comillas */}
                            <div className="text-blue-500 mb-4">
                                <FaQuoteLeft className="text-3xl opacity-50" />
                            </div>

                            {/* Comentario */}
                            <p className="text-gray-600 mb-6 leading-relaxed text-lg">
                                "{testimonial.comment}"
                            </p>

                            {/* Rating */}
                            <div className="flex items-center gap-1 mb-6">
                                {[...Array(testimonial.rating)].map((_, i) => (
                                    <FaStar key={i} className="text-yellow-400 text-lg" />
                                ))}
                            </div>

                            {/* Información del cliente */}
                            <div className="flex items-center gap-4">
                                <img
                                    src={testimonial.avatar}
                                    alt={testimonial.name}
                                    className="w-14 h-14 rounded-full object-cover border-3 border-blue-200"
                                />
                                <div>
                                    <h4 className="font-bold text-gray-800 text-lg">{testimonial.name}</h4>
                                    <p className="text-sm text-gray-500">{testimonial.location}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Estadísticas adicionales */}
                <div className="mt-16 bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        <div>
                            <div className="text-4xl font-bold text-blue-600 mb-2">500+</div>
                            <div className="text-gray-600 font-medium">Clientes Satisfechos</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold text-purple-600 mb-2">98%</div>
                            <div className="text-gray-600 font-medium">Índice de Satisfacción</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold text-green-600 mb-2">1000+</div>
                            <div className="text-gray-600 font-medium">Productos Vendidos</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold text-pink-600 mb-2">5⭐</div>
                            <div className="text-gray-600 font-medium">Valoración Media</div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Testimonials
