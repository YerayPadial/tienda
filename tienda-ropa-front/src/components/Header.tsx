import { Link, useNavigate } from 'react-router-dom'
import { FaSignOutAlt } from 'react-icons/fa'
import { useUser } from '../context/UserContext'

const Header: React.FC = () => {
  const { user, logout } = useUser()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-blue-600 text-white shadow">
      <Link to="/" className="text-2xl font-bold hover:underline">Tienda Ropa</Link>
      <nav className="flex items-center gap-6">
        <Link to="/productos" className="font-semibold text-lg hover:underline">Productos</Link>
        {user ? (
          <>
            <Link to="/usuario" className="font-semibold text-lg hover:underline">
              Perfil
            </Link>
            <button
              onClick={handleLogout}
              className="items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              <FaSignOutAlt />

            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="font-semibold text-lg hover:underline">Iniciar sesión</Link>
          </>
        )}
      </nav>
    </header>
  )
}

export default Header