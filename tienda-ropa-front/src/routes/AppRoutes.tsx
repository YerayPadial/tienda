import { Routes, Route } from 'react-router-dom'
import Home from '../pages/Home'
import Products from '../pages/Products'
import Login from '../pages/Login'
import Register from '../pages/Register'
import UserMenu from '../pages/UserMenu'
import Profile from '../pages/Profile'
import Order from '../pages/Order'
import OrderDetail from '../pages/OrderDetail'
import ProductDetail from '../pages/ProductDetail'
import { useUser } from '../context/UserContext'

const AppRoutes: React.FC = () => {
  const { user } = useUser()

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/productos" element={<Products />} />
      <Route path="/login" element={<Login />} />
      <Route path="/registro" element={<Register />} />
      <Route
        path="/usuario"
        element={
          user
            ? <UserMenu user={user} />
            : <div className="p-8 text-center text-xl">Debes iniciar sesión</div>
        }
      />
      <Route
        path="/perfil"
        element={
          user
            ? <Profile />
            : <div className="p-8 text-center text-xl">Debes iniciar sesión</div>
        }
      />
      <Route
        path="/pedidos"
        element={
          user
            ? <Order />
            : <div className="p-8 text-center text-xl">Debes iniciar sesión</div>
        }
      />
      <Route
        path="/detalles-pedido/:id"
        element={<OrderDetail />} />
      <Route
        path="/productos/:id"
        element={<ProductDetail />} />
    </Routes>

  )
}

export default AppRoutes