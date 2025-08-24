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
    <header className="bg-white shadow-lg border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-3 text-2xl font-bold text-gray-800 hover:text-blue-600 transition-colors duration-300"
            onClick={closeMenu}
          >
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <FaHome className="text-white text-lg" />
            </div>
            <span className="hidden sm:block">Tienda San Juan</span>
            <span className="sm:hidden">Tienda San Juan</span>
          </Link>

          {/* Navegación Desktop */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              to="/productos"
              className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-300 font-medium"
            >
              <FaShoppingBag className="text-sm" />
              <span>Productos</span>
            </Link>

            {/* Icono del carrito */}
            <CartIcon />

            {user ? (
              <div className="flex items-center gap-3">

                <Link
                  to="/usuario"
                  className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-all duration-300 font-medium border border-blue-200"
                >
                  <FaUser className="text-sm" />
                  <span>Mi Cuenta</span>
                </Link>

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white hover:bg-red-600 rounded-lg transition-all duration-300 font-medium shadow-md hover:shadow-lg"
                >
                  <FaSignOutAlt className="text-sm" />
                  <span>Salir</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="px-4 py-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-all duration-300 font-medium"
                >
                  Iniciar sesión
                </Link>

                <Link
                  to="/registro"
                  className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-all duration-300 font-medium shadow-md hover:shadow-lg"
                >
                  Crear cuenta
                </Link>
              </div>
            )}
          </nav>

          {/* Botones móviles (carrito y hamburguesa) */}
          <div className="md:hidden flex items-center gap-2">
            <CartIcon />
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
              aria-label="Abrir menú"
            >
              {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </div>

        {/* Menú móvil */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white">
            <div className="py-4 space-y-2">
              {/* Productos */}
              <Link
                to="/productos"
                className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300 font-medium"
                onClick={closeMenu}
              >
                <FaShoppingBag className="text-lg" />
                <span>Productos</span>
              </Link>

              {user ? (
                <>
                  {/* Mi cuenta */}
                  <Link
                    to="/usuario"
                    className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300 font-medium"
                    onClick={closeMenu}
                  >
                    <FaUser className="text-lg" />
                    <span>Mi Cuenta</span>
                  </Link>

                  {/* Cerrar sesión */}
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-3 text-red-600 hover:text-red-700 hover:bg-red-50 transition-all duration-300 font-medium w-full text-left"
                  >
                    <FaSignOutAlt className="text-lg" />
                    <span>Cerrar sesión</span>
                  </button>
                </>
              ) : (
                <>
                  {/* Iniciar sesión */}
                  <Link
                    to="/login"
                    className="flex items-center gap-3 px-4 py-3 text-blue-600 hover:text-blue-700 hover:bg-blue-50 transition-all duration-300 font-medium"
                    onClick={closeMenu}
                  >
                    <FaUser className="text-lg" />
                    <span>Iniciar sesión</span>
                  </Link>

                  {/* Crear cuenta */}
                  <Link
                    to="/registro"
                    className="flex items-center justify-center gap-2 mx-4 mt-2 px-4 py-3 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-all duration-300 font-medium shadow-md"
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