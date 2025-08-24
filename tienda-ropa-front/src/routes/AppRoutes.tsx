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
import Checkout from '../pages/Checkout'
import OrderConfirmation from '../pages/OrderConfirmation'
import ProtectedRoute from '../components/ProtectedRoute'
import { useUser } from '../context/UserContext'

const AppRoutes: React.FC = () => {
  const { user } = useUser()

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/productos" element={<Products />} />
      <Route path="/productos/:id" element={<ProductDetail />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/pedido-confirmado" element={<OrderConfirmation />} />
      <Route path="/login" element={<Login />} />
      <Route path="/registro" element={<Register />} />

      {/* Rutas protegidas */}
      <Route
        path="/usuario"
        element={
          <ProtectedRoute>
            <UserMenu user={user!} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/perfil"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/pedidos"
        element={
          <ProtectedRoute>
            <Order />
          </ProtectedRoute>
        }
      />
      <Route
        path="/detalles-pedido/:id"
        element={
          <ProtectedRoute>
            <OrderDetail />
          </ProtectedRoute>
        }
      />
    </Routes>
  )
}

export default AppRoutes