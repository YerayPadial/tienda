import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaShoppingBag, FaMapMarkerAlt, FaUsers, FaClock, FaArrowRight, FaPhone, FaEnvelope, FaUser } from 'react-icons/fa'
import { useUser } from '../context/UserContext'

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
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-purple-50 py-20" role="banner">
        <div className="max-w-6xl mx-auto px-6 text-center">
          {user ? (
            <div className="mb-4">
              <p className="text-lg text-blue-600 font-medium">
                ¡Hola, {user.name}! 👋
              </p>
            </div>
          ) : null}
          <h1 className="text-5xl font-bold text-gray-800 mb-6 leading-tight">
            Tu Tienda de Moda en
            <span className="text-blue-600 block">San Juan del Puerto</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            {user
              ? "¡Bienvenido de vuelta! Descubre nuestras novedades y encuentra tu próximo look favorito."
              : "Descubre las últimas tendencias en moda masculina y femenina. Estilo, calidad y buen precio en el corazón de Huelva."
            }
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/productos')}
              className="bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition-all duration-300 flex items-center justify-center gap-2 text-lg font-semibold shadow-lg"
            >
              <FaShoppingBag />
              Ver Productos
              <FaArrowRight />
            </button>

            {/* Mostrar botones de autenticación solo si no hay usuario logueado */}
            {!user ? (
              <button
                onClick={() => navigate('/login')}
                className="border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-lg hover:bg-blue-600 hover:text-white transition-all duration-300 text-lg font-semibold"
              >
                Iniciar Sesión
              </button>
            ) : (
              <button
                onClick={() => navigate('/usuario')}
                className="border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-lg hover:bg-blue-600 hover:text-white transition-all duration-300 text-lg font-semibold flex items-center justify-center gap-2"
              >
                <FaUser />
                Mi Cuenta
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Quiénes Somos */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">¿Quiénes Somos?</h2>
            <div className="w-24 h-1 bg-blue-600 mx-auto mb-6"></div>
          </div>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-3">
                <FaUsers className="text-blue-600" />
                Nuestra Historia
              </h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Somos una tienda de ropa familiar establecida en San Juan del Puerto,
                comprometidos con ofrecer las mejores tendencias de moda a precios accesibles.
                Con años de experiencia en el sector, conocemos lo que nuestros clientes buscan.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Nuestro equipo se dedica a seleccionar cuidadosamente cada prenda,
                asegurando calidad, estilo y comodidad para toda la familia.
              </p>
            </div>
            <div className="bg-gradient-to-br from-blue-100 to-purple-100 p-8 rounded-2xl">
              <h3 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-3">
                <FaShoppingBag className="text-blue-600" />
                Qué Ofrecemos
              </h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-center gap-3">
                  <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                  Ropa de mujer: vestidos, blusas, pantalones
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                  Ropa de hombre: camisas, pantalones, chaquetas
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                  Accesorios y complementos
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                  Asesoramiento personalizado
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Localización */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">¿Dónde Estamos?</h2>
            <div className="w-24 h-1 bg-blue-600 mx-auto mb-6"></div>
            <p className="text-xl text-gray-600">Te esperamos en nuestra tienda física</p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Información de contacto */}
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <h3 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-3">
                <FaMapMarkerAlt className="text-blue-600" />
                Información de Contacto
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <FaMapMarkerAlt className="text-blue-600 mt-1" />
                  <div>
                    <p className="font-semibold text-gray-800">Dirección</p>
                    <p className="text-gray-600">
                      Calle Tonelero<br />
                      San Juan del Puerto, Huelva<br />
                      21610, España
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <FaClock className="text-blue-600 mt-1" />
                  <div>
                    <p className="font-semibold text-gray-800">Horarios</p>
                    <p className="text-gray-600">
                      Lunes - Viernes: 10:00 - 14:00, 17:00 - 20:30<br />
                      Sábados: 10:00 - 14:00<br />
                      Domingos: Cerrado
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <FaPhone className="text-blue-600 mt-1" />
                  <div>
                    <p className="font-semibold text-gray-800">Teléfono</p>
                    <p className="text-gray-600">+34 123 456 789</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <FaEnvelope className="text-blue-600 mt-1" />
                  <div>
                    <p className="font-semibold text-gray-800">Email</p>
                    <p className="text-gray-600">info@tiendaropa.com</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Mapa */}
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <h3 className="text-2xl font-semibold text-gray-800 mb-6">Cómo Llegar</h3>
              <div className="rounded-lg overflow-hidden shadow-md">
                <iframe
                  src="https://www.google.com/maps?q=Calle+Tonelero,+San+Juan+del+Puerto,+Huelva,+21610&hl=es&z=16&output=embed"
                  width="100%"
                  height="300"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Ubicación de la tienda en Calle Tonelero, San Juan del Puerto, Huelva"
                ></iframe>
              </div>
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Fácil acceso:</strong> Ubicados en el centro de San Juan del Puerto,
                  con fácil aparcamiento y acceso en transporte público.
                </p>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-xs text-blue-600">📍 Calle Tonelero, 21610</span>
                  <a
                    href="https://www.google.com/maps/search/Calle+Tonelero,+San+Juan+del+Puerto,+Huelva,+21610"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-600 hover:text-blue-800 underline"
                  >
                    Ver en Google Maps
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h2 className="text-4xl font-bold mb-4">¿Listo para Renovar tu Estilo?</h2>
          <p className="text-xl mb-8 opacity-90">
            Descubre nuestra colección y encuentra las prendas perfectas para ti
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/productos')}
              className="bg-white text-blue-600 px-8 py-4 rounded-lg hover:bg-gray-100 transition-all duration-300 flex items-center justify-center gap-2 text-lg font-semibold"
            >
              <FaShoppingBag />
              Explorar Catálogo
            </button>

            {/* Solo mostrar "Crear Cuenta" si no hay usuario logueado */}
            {!user ? (
              <button
                onClick={() => navigate('/registro')}
                className="border-2 border-white text-white px-8 py-4 rounded-lg hover:bg-white hover:text-blue-600 transition-all duration-300 text-lg font-semibold"
              >
                Crear Cuenta
              </button>
            ) : (
              <button
                onClick={() => navigate('/usuario')}
                className="border-2 border-white text-white px-8 py-4 rounded-lg hover:bg-white hover:text-blue-600 transition-all duration-300 text-lg font-semibold flex items-center justify-center gap-2"
              >
                <FaUser />
                Mi Panel
              </button>
            )}
          </div>
        </div>
      </section>
    </main>
  )
}

export default Home