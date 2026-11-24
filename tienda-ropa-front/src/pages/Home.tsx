import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaShoppingBag, FaMapMarkerAlt, FaUsers, FaClock, FaArrowRight, FaPhone, FaEnvelope, FaUser, FaUndoAlt, FaShieldAlt, FaHeart, FaTags, FaGift } from 'react-icons/fa'
import { useUser } from '../context/UserContext'
import Testimonials from '../components/Testimonials'
import FeaturedProducts from '../components/FeaturedProducts'
import Footer from '../components/Footer'
import heroImage from '../assets/coleccion-san-juan.webp'

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
      <section className="border-b border-line bg-sand" aria-labelledby="storefront-title">
        <div className="mx-auto grid max-w-7xl md:grid-cols-2">
          <div className="flex flex-col items-start justify-center px-6 py-12 sm:px-12 md:py-16 lg:px-20">
            <p className="mb-5 text-xs font-semibold uppercase tracking-[0.23em] text-muted">San Juan del Puerto, Huelva</p>
            <h1 id="storefront-title" className="font-display text-5xl font-normal leading-[0.98] tracking-tight text-ink sm:text-6xl lg:text-7xl">
              Moda para
              <span className="block italic text-brand-500">tu día a día.</span>
            </h1>
            <p className="mt-6 max-w-md text-base leading-relaxed text-muted">
              {user ? "Hola, " + user.name + ". Descubre las últimas prendas de nuestra colección." : "Explora nuestras colecciones de moda femenina y masculina."}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <button onClick={() => navigate('/productos')} className="shop-button shop-button-primary">
                Explorar catálogo <FaArrowRight aria-hidden="true" className="text-xs" />
              </button>
              <button onClick={() => navigate(user ? '/usuario' : '/login')} className="shop-button shop-button-secondary">
                {user ? 'Mi cuenta' : 'Iniciar sesión'}
              </button>
            </div>
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm text-muted">
              <span className="flex items-center gap-2"><FaUndoAlt aria-hidden="true" /> Devolución gratuita</span>
              <span className="flex items-center gap-2"><FaShieldAlt aria-hidden="true" /> Compra segura</span>
            </div>
          </div>
          <img src={heroImage} alt="Dos modelos con prendas beige y carbón" width={1080} height={1349} fetchPriority="high" className="h-72 w-full object-cover object-[50%_10%] sm:h-96 md:h-full md:max-h-[38rem] md:object-[50%_18%]" />
        </div>
      </section>

      <FeaturedProducts />

      {/* Sección de características destacadas */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl font-normal text-ink sm:text-5xl mb-6">¿Por qué elegirnos?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Más que una tienda, somos tu destino de moda con valores que importan
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="group text-center p-8 rounded-3xl hover:bg-gradient-to-br hover:from-blue-50 hover:to-purple-50 transition-all duration-300 hover:shadow-xl border border-gray-100">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 transition-transform duration-300">
                <FaHeart className="text-white text-2xl" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Calidad Premium</h3>
              <p className="text-gray-600 leading-relaxed">
                Seleccionamos cuidadosamente cada prenda para garantizar la mejor calidad y durabilidad en tu guardarropa.
              </p>
            </div>

            <div className="group text-center p-8 rounded-3xl hover:bg-gradient-to-br hover:from-purple-50 hover:to-pink-50 transition-all duration-300 hover:shadow-xl border border-gray-100">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-6 transition-transform duration-300">
                <FaTags className="text-white text-2xl" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Precios Justos</h3>
              <p className="text-gray-600 leading-relaxed">
                Moda accesible sin comprometer la calidad. Porque creemos que el estilo debe estar al alcance de todos.
              </p>
            </div>

            <div className="group text-center p-8 rounded-3xl hover:bg-gradient-to-br hover:from-pink-50 hover:to-blue-50 transition-all duration-300 hover:shadow-xl border border-gray-100">
              <div className="w-20 h-20 bg-gradient-to-br from-pink-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 transition-transform duration-300">
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

      {/* Quiénes Somos - Versión mejorada */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl font-normal text-ink sm:text-5xl mb-6">Nuestra Historia</h2>
            <div className="mx-auto mb-7 h-px w-16 bg-brand-300"></div>
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
              <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 transition-all duration-300">
                <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-brand-500 to-blue-600 rounded-lg flex items-center justify-center">
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

              <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 transition-all duration-300">
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
            <h2 className="font-display text-4xl font-normal text-ink sm:text-5xl mb-6">Visítanos</h2>
            <div className="mx-auto mb-7 h-px w-16 bg-brand-300"></div>
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
                    <div className="w-10 h-10 bg-gradient-to-br from-brand-400 to-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
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

      <section className="border-t border-line bg-sand px-6 py-14 lg:py-20">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="font-display text-4xl font-normal tracking-tight text-ink sm:text-5xl">Encuentra tu próximo look</h2>
          <div className="flex flex-wrap gap-3">
            <button onClick={() => navigate('/productos')} className="shop-button shop-button-primary">Explorar catálogo</button>
            <button onClick={() => navigate(user ? '/usuario' : '/registro')} className="shop-button shop-button-secondary">
              {user ? 'Mi panel personal' : 'Crear cuenta gratis'}
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}

export default Home
