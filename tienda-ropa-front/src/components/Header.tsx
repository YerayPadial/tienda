import { Link, useNavigate } from 'react-router-dom'
import { FaSignOutAlt, FaUser, FaShoppingBag, FaHome, FaBars, FaTimes } from 'react-icons/fa'
import { useUser } from '../context/UserContext'
import CartIcon from './CartIcon'
import { useState } from 'react'

const Header: React.FC = () => {
  const { user, logout } = useUser()
  const navigate = useNavigate()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleLogout = async () => {
    try {
      await logout()
      navigate('/')
      setIsMenuOpen(false) // Cerrar menú al hacer logout
    } catch (error) {
      console.error('Error during logout:', error)
      // Incluso si hay error, navegar al home
      navigate('/')
      setIsMenuOpen(false)
    }
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  return (
    <header className="bg-white shadow-xl border-b border-gray-200 sticky top-0 z-50 backdrop-blur-sm bg-white/95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="flex items-center justify-between h-20">
          {/* Logo mejorado */}
          <Link
            to="/"
            className="flex items-center gap-3 text-2xl font-bold text-gray-800 hover:text-blue-600 transition-all duration-300 group"
            onClick={closeMenu}
          >
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300 group-hover:scale-105 transform">
              <FaHome className="text-white text-xl" />
            </div>
            <div className="hidden sm:block">
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Tienda San Juan
              </span>
              <div className="text-xs text-gray-500 font-normal -mt-1">
                Moda & Estilo
              </div>
            </div>
          </Link>

          {/* Navegación Desktop mejorada */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              to="/productos"
              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-300 font-medium group"
            >
              <FaShoppingBag className="text-sm group-hover:scale-110 transition-transform" />
              <span>Productos</span>
            </Link>

            {/* Icono del carrito mejorado */}
            <CartIcon />

            {user ? (
              <div className="flex items-center gap-4">

                <Link
                  to="/usuario"
                  className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-xl transition-all duration-300 font-medium border border-blue-200 hover:border-blue-300 shadow-sm hover:shadow-md"
                >
                  <FaUser className="text-sm" />
                  <span>Mi Cuenta</span>
                </Link>

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 rounded-xl transition-all duration-300 font-medium shadow-md hover:shadow-lg transform hover:scale-105"
                >
                  <FaSignOutAlt className="text-sm" />
                  <span>Salir</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link
                  to="/login"
                  className="px-4 py-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-xl transition-all duration-300 font-medium"
                >
                  Iniciar sesión
                </Link>

                <Link
                  to="/registro"
                  className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 rounded-xl transition-all duration-300 font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  Crear cuenta
                </Link>
              </div>
            )}
          </nav>

          {/* Botones móviles mejorados */}
          <div className="md:hidden flex items-center gap-3">
            <CartIcon />
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-3 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-300"
              aria-label="Abrir menú"
            >
              {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </div>

        {/* Menú móvil mejorado */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white/95 backdrop-blur-sm">
            <div className="py-6 space-y-3">
              {/* Productos */}
              <Link
                to="/productos"
                className="flex items-center gap-4 px-6 py-4 text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300 font-medium rounded-xl mx-4"
                onClick={closeMenu}
              >
                <FaShoppingBag className="text-xl" />
                <span>Productos</span>
              </Link>

              {user ? (
                <>
                  <div className="px-6 py-2 text-sm text-gray-500 border-b border-gray-100 mx-4">
                    Hola, <span className="font-semibold text-blue-600">{user.name}</span> 👋
                  </div>

                  {/* Mi cuenta */}
                  <Link
                    to="/usuario"
                    className="flex items-center gap-4 px-6 py-4 text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300 font-medium rounded-xl mx-4"
                    onClick={closeMenu}
                  >
                    <FaUser className="text-xl" />
                    <span>Mi Cuenta</span>
                  </Link>

                  {/* Cerrar sesión */}
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-4 px-6 py-4 text-red-600 hover:text-red-700 hover:bg-red-50 transition-all duration-300 font-medium w-full text-left rounded-xl mx-4"
                  >
                    <FaSignOutAlt className="text-xl" />
                    <span>Cerrar sesión</span>
                  </button>
                </>
              ) : (
                <>
                  {/* Iniciar sesión */}
                  <Link
                    to="/login"
                    className="flex items-center gap-4 px-6 py-4 text-blue-600 hover:text-blue-700 hover:bg-blue-50 transition-all duration-300 font-medium rounded-xl mx-4"
                    onClick={closeMenu}
                  >
                    <FaUser className="text-xl" />
                    <span>Iniciar sesión</span>
                  </Link>

                  {/* Crear cuenta */}
                  <Link
                    to="/registro"
                    className="flex items-center justify-center gap-3 mx-6 mt-4 px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 rounded-xl transition-all duration-300 font-medium shadow-lg"
                    onClick={closeMenu}
                  >
                    <FaUser className="text-lg" />
                    <span>Crear cuenta</span>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header