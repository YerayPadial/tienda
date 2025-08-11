import { Routes, Route } from 'react-router-dom'
import Home from '../pages/Home'
import Products from '../pages/Products'
import Login from '../pages/Login'
import Register from '../pages/Register'
import UserMenu from '../pages/UserMenu'

const getCurrentUser = () => {
  const userStr = localStorage.getItem('user')
  try {
    return userStr ? JSON.parse(userStr) : null
  } catch {
    return null
  }
}

const AppRoutes: React.FC = () => {
  const user = getCurrentUser()

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
    </Routes>
  )
}

export default AppRoutes