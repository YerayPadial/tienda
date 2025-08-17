import axios from 'axios'

// Detectar entorno automáticamente
const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
const isDevelopment = import.meta.env.MODE === 'development'

// Configurar URL de API según el entorno
const API_URL = import.meta.env.VITE_API_URL || (
  isLocal || isDevelopment
    // Mismo enlace, pero configurado para posible cambios en futuro
    ? 'https://padiyera.com/api-tienda/public/index.php/api'  // Desarrollo local
    : 'https://padiyera.com/api-tienda/public/index.php/api'  // Producción
)

// Solo mostrar logs en desarrollo
if (isDevelopment || import.meta.env.DEV) {
  console.log('🌐 Modo Vite:', import.meta.env.MODE)
  console.log('🌐 Entorno detectado:', isLocal || isDevelopment ? 'Desarrollo' : 'Producción')
  console.log('🔗 API URL:', API_URL)
}

// Creamos una instancia de axios con la configuración base
export const api = axios.create({
  baseURL: API_URL,
  withCredentials: false,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

// Interceptor para agregar el token a todas las peticiones
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Interceptor para manejar errores de autenticación
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Verificar si es un error de login/register
      const url = error.config?.url
      const isLoginAttempt = url?.includes('/login')
      const isRegisterAttempt = url?.includes('/register')

      if (!isLoginAttempt && !isRegisterAttempt) {
        // Solo limpiar y redirigir si es un token expirado/inválido
        localStorage.removeItem('token')
        localStorage.removeItem('user')

        // Solo redirigir si no estamos ya en la página de login
        if (window.location.pathname !== '/login') {
          window.location.href = '/login'
        }
      }
    }
    return Promise.reject(error)
  }
)

// Funciones para autenticación
export const login = async (email: string, password: string) => {
  const response = await api.post('/login', { email, password })
  const { token, user } = response.data

  // Guardar token y usuario en localStorage
  localStorage.setItem('token', token)
  localStorage.setItem('user', JSON.stringify(user))

  return response
}

export const register = async (name: string, email: string, password: string, passwordConfirmation: string) => {
  const response = await api.post('/register', {
    name,
    email,
    password,
    password_confirmation: passwordConfirmation
  })

  // Si el registro incluye un token (auto-login), guardarlo
  if (response.data.token && response.data.user) {
    localStorage.setItem('token', response.data.token)
    localStorage.setItem('user', JSON.stringify(response.data.user))
  }

  return response
}

export const logout = async () => {
  try {
    await api.post('/logout')
  } catch (error) {
    console.error('Error during logout:', error)
  } finally {
    // Limpiar datos locales independientemente del resultado
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }
}

export const verifyAuth = async () => {
  try {
    const response = await api.get('/me')
    return response.data
  } catch (error) {
    // Si falla la verificación, limpiar datos locales
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    throw error
  }
}

// Funciones para perfil
export const updateProfile = (name: string, email: string, id: string | number) =>
  api.put('/profile', { id, name, email })

export const changePassword = (currentPassword: string, newPassword: string, id: string | number) =>
  api.put('/profile/password', { id, currentPassword, newPassword })

// Funciones para pedidos
export const fetchUserOrders = async (userId: string | number) => {
  const response = await api.get('/user-orders', { params: { user_id: userId } });
  return response.data.orders;
}

export const fetchOrderDetail = async (orderId: string | number) => {
  const response = await api.get(`/orders/${orderId}`);
  return response.data.order;
}

// Funciones para productos
export const fetchProductDetail = async (productId: string | number) => {
  const response = await api.get(`/products/${productId}`);
  return response.data;
}

export const fetchProducts = async () => {
  const response = await api.get('/products');
  return response.data;
}

// Función helper para verificar si el usuario está autenticado
export const isAuthenticated = (): boolean => {
  const token = localStorage.getItem('token')
  const user = localStorage.getItem('user')
  return !!(token && user)
}