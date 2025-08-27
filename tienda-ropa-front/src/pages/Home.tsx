import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaShoppingBag, FaMapMarkerAlt, FaUsers, FaClock, FaArrowRight, FaPhone, FaEnvelope, FaUser, FaUndoAlt, FaShieldAlt, FaHeart, FaTags, FaGift } from 'react-icons/fa'
import { useUser } from '../context/UserContext'
import Testimonials from '../components/Testimonials'
import FeaturedProducts from '../components/FeaturedProducts'
import Footer from '../components/Footer'

const Home: React.FC = () => {
  const navigate = useNavigate()
  const { user } = useUser()

  // Actualizar meta tags para SEO
  useEffect(() => {
    document.title = 'Tienda de Ropa San Juan del Puerto - Moda y Estilo en Huelva'

    // Meta description
    const metaDescription = document.querySelector('meta[name="description"]')
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Tienda de ropa en San Juan del Puerto, Huelva. Encuentra las últimas tendencias en moda masculina y femenina. Ubicados en Calle Tonelero, 21610.')
    } else {
      const newMeta = document.createElement('meta')
      newMeta.name = 'description'
      newMeta.content = 'Tienda de ropa en San Juan del Puerto, Huelva. Encuentra las últimas tendencias en moda masculina y femenina. Ubicados en Calle Tonelero, 21610.'
      document.head.appendChild(newMeta)
    }

    // Meta keywords
    const metaKeywords = document.querySelector('meta[name="keywords"]')
    if (metaKeywords) {
      metaKeywords.setAttribute('content', 'tienda ropa, moda, San Juan del Puerto, Huelva, ropa mujer, ropa hombre, tendencias, Calle Tonelero')
    } else {
      const newKeywords = document.createElement('meta')
      newKeywords.name = 'keywords'
      newKeywords.content = 'tienda ropa, moda, San Juan del Puerto, Huelva, ropa mujer, ropa hombre, tendencias, Calle Tonelero'
      document.head.appendChild(newKeywords)
    }

    // Meta author
    const metaAuthor = document.querySelector('meta[name="author"]')
    if (!metaAuthor) {
      const newAuthor = document.createElement('meta')
      newAuthor.name = 'author'
      newAuthor.content = 'Yeray Padial - Tienda de Ropa San Juan del Puerto'
      document.head.appendChild(newAuthor)
    }

    // Cleanup function
    return () => {
      document.title = 'Tienda de Ropa'
    }
  }, [])

  useEffect(() => {
  }, [user])

  return (
    <main className="min-h-screen" role="main">
      {/* Hero Section Mejorado */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-24" role="banner">
        {/* Elementos decorativos */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full opacity-10 blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-gradient-to-br from-pink-400 to-purple-600 rounded-full opacity-10 blur-3xl"></div>

        <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
          {user && (
            <div className="mb-6 animate-bounce">
              <div className="inline-flex items-center gap-2 px-6 py-3 bg-white/80 backdrop-blur-sm rounded-full shadow-lg border border-blue-100">
                <span className="text-2xl">👋</span>
                <p className="text-lg text-blue-600 font-medium">
                  ¡Hola, <span className="font-bold">{user.name}</span>!
                </p>
              </div>
            </div>
          )}

          <h1 className="text-6xl md:text-7xl font-bold text-gray-800 mb-8 leading-tight">
            <span className="block">Tu Tienda de</span>
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent block animate-pulse">
              Moda Exclusiva
            </span>
            <span className="text-4xl md:text-5xl text-gray-600 block mt-2">
              en San Juan del Puerto
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
            {user
              ? "¡Bienvenido de vuelta! Descubre nuestras novedades exclusivas y encuentra tu próximo look favorito con las últimas tendencias."
              : "Descubre las últimas tendencias en moda. Calidad premium, estilo único y precios increíbles en el corazón de Huelva."
            }
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-12">
            <button
              onClick={() => navigate('/productos')}
              className="group bg-gradient-to-r from-blue-600 to-purple-600 text-white px-10 py-5 rounded-2xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 flex items-center justify-center gap-3 text-xl font-bold shadow-2xl hover:shadow-purple-500/25 transform hover:scale-105"
            >
              <FaShoppingBag className="group-hover:rotate-12 transition-transform duration-300" />
              Explorar Catálogo
              <FaArrowRight className="group-hover:translate-x-1 transition-transform duration-300" />
            </button>

            {!user ? (
              <button
                onClick={() => navigate('/login')}
                className="border-3 border-blue-600 text-blue-600 px-10 py-5 rounded-2xl hover:bg-blue-600 hover:text-white transition-all duration-300 text-xl font-bold shadow-lg hover:shadow-blue-500/25 transform hover:scale-105"
              >
                Iniciar Sesión
              </button>
            ) : (
              <button
                onClick={() => navigate('/usuario')}
                className="border-3 border-purple-600 text-purple-600 px-10 py-5 rounded-2xl hover:bg-purple-600 hover:text-white transition-all duration-300 text-xl font-bold flex items-center justify-center gap-3 shadow-lg hover:shadow-purple-500/25 transform hover:scale-105"
              >
                <FaUser />
                Mi Cuenta
              </button>
            )}
          </div>

          {/* Indicadores de confianza */}
          <div className="flex flex-wrap justify-center gap-8 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <FaUndoAlt className="text-blue-500" />
              <span>Devolución gratuita</span>
            </div>
            <div className="flex items-center gap-2">
              <FaShieldAlt className="text-purple-500" />
              <span>Compra segura</span>
            </div>
          </div>
        </div>
      </section>

      {/* Sección de características destacadas */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-gray-800 mb-6">¿Por qué elegirnos?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Más que una tienda, somos tu destino de moda con valores que importan
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="group text-center p-8 rounded-3xl hover:bg-gradient-to-br hover:from-blue-50 hover:to-purple-50 transition-all duration-300 hover:shadow-xl border border-gray-100">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <FaHeart className="text-white text-2xl" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Calidad Premium</h3>
              <p className="text-gray-600 leading-relaxed">
                Seleccionamos cuidadosamente cada prenda para garantizar la mejor calidad y durabilidad en tu guardarropa.
              </p>
            </div>

            <div className="group text-center p-8 rounded-3xl hover:bg-gradient-to-br hover:from-purple-50 hover:to-pink-50 transition-all duration-300 hover:shadow-xl border border-gray-100">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <FaTags className="text-white text-2xl" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Precios Justos</h3>
              <p className="text-gray-600 leading-relaxed">
                Moda accesible sin comprometer la calidad. Porque creemos que el estilo debe estar al alcance de todos.
              </p>
            </div>

            <div className="group text-center p-8 rounded-3xl hover:bg-gradient-to-br hover:from-pink-50 hover:to-blue-50 transition-all duration-300 hover:shadow-xl border border-gray-100">
              <div className="w-20 h-20 bg-gradient-to-br from-pink-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <FaGift className="text-white text-2xl" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Experiencia Única</h3>
              <p className="text-gray-600 leading-relaxed">
                Atención personalizada y asesoramiento experto para ayudarte a encontrar tu estilo perfecto.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Productos Destacados */}
      <FeaturedProducts />

      {/* Quiénes Somos - Versión mejorada */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-gray-800 mb-6">Nuestra Historia</h2>
            <div className="w-32 h-2 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto mb-8 rounded-full"></div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Una familia apasionada por la moda, comprometida con ofrecer lo mejor en estilo y calidad
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
                <h3 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <FaUsers className="text-white text-xl" />
                  </div>
                  Nuestra Misión
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed text-lg">
                  Somos una tienda familiar establecida en San Juan del Puerto,
                  con la misión de democratizar la moda de calidad. Creemos que
                  cada persona merece sentirse especial y expresar su personalidad
                  a través de su estilo único.
                </p>
                <p className="text-gray-600 leading-relaxed text-lg">
                  Con años de experiencia en el sector textil, hemos construido
                  relaciones sólidas con proveedores que comparten nuestros valores
                  de calidad, sostenibilidad y trato justo.
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 transform hover:scale-105 transition-all duration-300">
                <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-600 rounded-lg flex items-center justify-center">
                    <FaShoppingBag className="text-white" />
                  </div>
                  Colección Femenina
                </h3>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-center gap-3">
                    <span className="w-3 h-3 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full"></span>
                    Vestidos elegantes y casuales
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-3 h-3 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full"></span>
                    Blusas y camisetas premium
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-3 h-3 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full"></span>
                    Pantalones y faldas modernas
                  </li>
                </ul>
              </div>

              <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 transform hover:scale-105 transition-all duration-300">
                <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <FaUser className="text-white" />
                  </div>
                  Colección Masculina
                </h3>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-center gap-3">
                    <span className="w-3 h-3 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full"></span>
                    Camisas formales y casuales
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-3 h-3 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full"></span>
                    Pantalones de todas las ocasiones
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-3 h-3 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full"></span>
                    Chaquetas y accesorios únicos
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <Testimonials />

      {/* Localización mejorada */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-gray-800 mb-6">Visítanos</h2>
            <div className="w-32 h-2 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto mb-8 rounded-full"></div>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Te esperamos en nuestra boutique en el corazón de San Juan del Puerto
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Información de contacto mejorada */}
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-10 rounded-3xl shadow-xl border border-gray-100">
              <h3 className="text-3xl font-bold text-gray-800 mb-8 flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <FaMapMarkerAlt className="text-white text-xl" />
                </div>
                Información de Contacto
              </h3>

              <div className="space-y-6">
                <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-red-400 to-pink-500 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FaMapMarkerAlt className="text-white" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-800 text-lg mb-2">Dirección</p>
                      <p className="text-gray-600 leading-relaxed">
                        <strong>Calle Tonelero</strong><br />
                        San Juan del Puerto, Huelva<br />
                        <span className="text-blue-600 font-semibold">21610, España</span>
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FaClock className="text-white" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-800 text-lg mb-2">Horarios</p>
                      <div className="text-gray-600 space-y-1">
                        <p><strong>Lunes - Viernes:</strong> 10:00 - 14:00, 17:00 - 20:30</p>
                        <p><strong>Sábados:</strong> 10:00 - 14:00</p>
                        <p><strong>Domingos:</strong> <span className="text-red-500">Cerrado</span></p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg flex items-center justify-center">
                        <FaPhone className="text-white text-sm" />
                      </div>
                      <p className="font-bold text-gray-800">Teléfono</p>
                    </div>
                    <p className="text-gray-600 font-mono">+34 123 456 789</p>
                  </div>

                  <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-500 rounded-lg flex items-center justify-center">
                        <FaEnvelope className="text-white text-sm" />
                      </div>
                      <p className="font-bold text-gray-800">Email</p>
                    </div>
                    <p className="text-gray-600 font-mono text-sm">info@tiendaropa.com</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Mapa mejorado */}
            <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
              <h3 className="text-3xl font-bold text-gray-800 mb-6">Cómo Llegar</h3>
              <div className="rounded-2xl overflow-hidden shadow-lg mb-6">
                <iframe
                  src="https://www.google.com/maps?q=Calle+Tonelero,+San+Juan+del+Puerto,+Huelva,+21610&hl=es&z=16&output=embed"
                  width="100%"
                  height="350"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Ubicación de la tienda en Calle Tonelero, San Juan del Puerto, Huelva"
                  className="grayscale hover:grayscale-0 transition-all duration-500"
                ></iframe>
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-2xl border border-blue-100">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FaMapMarkerAlt className="text-white" />
                  </div>
                  <div>
                    <p className="text-blue-800 font-bold mb-2">
                      🚗 Fácil acceso y aparcamiento
                    </p>
                    <p className="text-sm text-blue-700 mb-3">
                      Ubicados en el centro de San Juan del Puerto, con múltiples opciones
                      de aparcamiento gratuito y excelente conexión de transporte público.
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-blue-600 font-medium bg-blue-100 px-3 py-1 rounded-full">
                        📍 Calle Tonelero, 21610
                      </span>
                      <a
                        href="https://www.google.com/maps/search/Calle+Tonelero,+San+Juan+del+Puerto,+Huelva,+21610"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-600 hover:text-blue-800 underline font-medium hover:bg-blue-100 px-2 py-1 rounded transition-all duration-300"
                      >
                        Ver en Google Maps →
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action mejorado */}
      <section className="relative py-24 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white overflow-hidden">
        {/* Elementos decorativos */}
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>

        <div className="max-w-6xl mx-auto text-center px-6 relative z-10">
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-white/20 backdrop-blur-sm rounded-full border border-white/30 mb-6">
              <span className="text-2xl">✨</span>
              <span className="font-semibold">¡Última oportunidad!</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              ¿Listo para Revolucionar
              <span className="block bg-gradient-to-r from-yellow-300 to-pink-300 bg-clip-text text-transparent">
                tu Estilo?
              </span>
            </h2>
            <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-3xl mx-auto leading-relaxed">
              Únete a miles de clientes satisfechos y descubre por qué somos la tienda
              de moda favorita en San Juan del Puerto
            </p>
          </div>

          {/* Estadísticas impresionantes */}
          <div className="grid grid-cols-3 gap-8 mb-12 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-300 mb-2">500+</div>
              <div className="text-sm opacity-80">Clientes Felices</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-pink-300 mb-2">100+</div>
              <div className="text-sm opacity-80">Productos Únicos</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-300 mb-2">99%</div>
              <div className="text-sm opacity-80">Satisfacción</div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-8">
            <button
              onClick={() => navigate('/productos')}
              className="group bg-white text-blue-600 px-10 py-5 rounded-2xl hover:bg-gray-100 transition-all duration-300 flex items-center justify-center gap-3 text-xl font-bold shadow-2xl hover:shadow-white/25 transform hover:scale-105"
            >
              <FaShoppingBag className="group-hover:rotate-12 transition-transform duration-300" />
              Explorar Catálogo
              <FaArrowRight className="group-hover:translate-x-1 transition-transform duration-300" />
            </button>

            {!user ? (
              <button
                onClick={() => navigate('/registro')}
                className="border-3 border-white text-white px-10 py-5 rounded-2xl hover:bg-white hover:text-blue-600 transition-all duration-300 text-xl font-bold shadow-lg transform hover:scale-105"
              >
                Crear Cuenta Gratis
              </button>
            ) : (
              <button
                onClick={() => navigate('/usuario')}
                className="border-3 border-white text-white px-10 py-5 rounded-2xl hover:bg-white hover:text-purple-600 transition-all duration-300 text-xl font-bold flex items-center justify-center gap-3 shadow-lg transform hover:scale-105"
              >
                <FaUser />
                Mi Panel Personal
              </button>
            )}
          </div>

          {/* Garantías y promesas */}
          <div className="flex flex-wrap justify-center gap-8 text-sm opacity-90">
            <div className="flex items-center gap-2">
              <FaUndoAlt className="text-green-300 text-lg" />
              <span className="font-medium">Devolución gratuita</span>
            </div>
            <div className="flex items-center gap-2">
              <FaShieldAlt className="text-blue-300 text-lg" />
              <span className="font-medium">Pago 100% seguro</span>
            </div>
            <div className="flex items-center gap-2">
              <FaHeart className="text-pink-300 text-lg" />
              <span className="font-medium">Atención personalizada</span>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}

export default Home