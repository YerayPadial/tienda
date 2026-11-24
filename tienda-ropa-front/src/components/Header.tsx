import { Link, useNavigate } from 'react-router-dom'
import { FaSignOutAlt, FaUser, FaShoppingBag, FaBars, FaTimes } from 'react-icons/fa'
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
    <header className="sticky top-0 z-50 border-b border-line bg-paper">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="flex h-16 items-center justify-between gap-3 lg:h-[4.5rem]">
          {/* Logo mejorado */}
          <Link
            to="/"
            className="font-display text-2xl tracking-tight text-ink transition-colors hover:text-brand-500 sm:text-3xl"
            onClick={closeMenu}
          >
            Tienda San Juan
          </Link>

          {/* Navegación Desktop mejorada */}
          <nav className="hidden items-center gap-5 md:flex">
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
                  className="shop-button shop-button-primary min-h-10 px-4 py-2"
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
          <div className="border-t border-line bg-paper md:hidden">
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
