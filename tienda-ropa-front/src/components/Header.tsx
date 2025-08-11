import { Link } from 'react-router-dom'

const Header: React.FC = () => (
  <header className="bg-white shadow">
    <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
      <Link to="/" className="text-2xl font-bold text-blue-600">Tienda Ropa</Link>
      <div className="flex gap-4">
        <Link to="/" className="hover:text-blue-600">Inicio</Link>
        <Link to="/productos" className="hover:text-blue-600">Productos</Link>
        <Link to="/login" className="hover:text-blue-600">Login</Link>
      </div>
    </nav>
  </header>
)

export default Header