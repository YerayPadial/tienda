import axios from 'axios'

// Detectar entorno automáticamente
const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
const isDevelopment = import.meta.env.MODE === 'development'

// Configurar URL de API según el entorno
const API_URL = import.meta.env.VITE_API_URL || (
  isLocal || isDevelopment
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
    const token = localStorage.getItem('admin_token')
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
      // Verificar si es un error de login
      const url = error.config?.url
      const isLoginAttempt = url?.includes('/admin/login')

      if (!isLoginAttempt) {
        // Solo limpiar y redirigir si es un token expirado/inválido
        localStorage.removeItem('admin_token')
        localStorage.removeItem('admin_employee')

        // Solo redirigir si no estamos ya en la página de login
        if (!window.location.pathname.includes('/admin/login')) {
          window.location.href = '/panelTienda/admin/login'
        }
      }
    }
    return Promise.reject(error)
  }
)


// FUNCIONES DE AUTENTICACIÓN DE EMPLEADOS


export const employeeLogin = async (email: string, password: string) => {
  const response = await api.post('/admin/login', { email, password })
  const { token, employee } = response.data

  // Guardar token y empleado en localStorage
  localStorage.setItem('admin_token', token)
  localStorage.setItem('admin_employee', JSON.stringify(employee))

  return response
}

export const employeeLogout = async () => {
  try {
    await api.post('/admin/logout')
  } catch (error) {
    // Log del error solo en desarrollo
    if (import.meta.env.DEV) {
      console.error('Error during logout:', error)
    }
  } finally {
    // Limpiar datos locales de forma segura
    localStorage.removeItem('admin_token')
    localStorage.removeItem('admin_employee')
  }
}

export const verifyEmployeeAuth = async () => {
  try {
    const response = await api.get('/admin/me')
    return response.data
  } catch (error) {
    // Si falla la verificación, limpiar datos locales
    localStorage.removeItem('admin_token')
    localStorage.removeItem('admin_employee')
    throw error
  }
}


// FUNCIONES CRUD - EMPLEADOS


export const getEmployees = async () => {
  const response = await api.get('/admin/employees')
  return response.data
}

export const createEmployee = async (employeeData: any) => {
  const response = await api.post('/admin/employees', employeeData)
  return response.data
}

export const updateEmployee = async (id: number, employeeData: any) => {
  const response = await api.put(`/admin/employees/${id}`, employeeData)
  return response.data
}

export const deleteEmployee = async (id: number) => {
  const response = await api.delete(`/admin/employees/${id}`)
  return response.data
}


// FUNCIONES CRUD - PRODUCTOS


export const getProducts = async () => {
  const response = await api.get('/admin/products')
  return response.data
}

export const getProduct = async (id: number) => {
  const response = await api.get(`/admin/products/${id}`)
  return response.data
}

export const createProduct = async (productData: any) => {
  const response = await api.post('/admin/products', productData)
  return response.data
}

export const updateProduct = async (id: number, productData: any) => {
  const response = await api.put(`/admin/products/${id}`, productData)
  return response.data
}

export const deleteProduct = async (id: number) => {
  const response = await api.delete(`/admin/products/${id}`)
  return response.data
}


// FUNCIONES CRUD - USUARIOS/CLIENTES


export const getUsers = async () => {
  const response = await api.get('/admin/users')
  return response.data
}

export const updateUser = async (id: number, userData: any) => {
  const response = await api.put(`/admin/users/${id}`, userData)
  return response.data
}

export const deleteUser = async (id: number) => {
  const response = await api.delete(`/admin/users/${id}`)
  return response.data
}


// FUNCIONES CRUD - PEDIDOS


export const getOrders = async () => {
  const response = await api.get('/admin/orders')
  return response.data
}

export const getOrderDetail = async (id: number) => {
  const response = await api.get(`/admin/orders/${id}`)
  return response.data
}

export const updateOrderStatus = async (id: number, status: string) => {
  const response = await api.put(`/admin/orders/${id}`, { status })
  return response.data
}


// FUNCIONES AUXILIARES


export const getSizes = async () => {
  try {
    const response = await api.get('/sizes')
    return response.data
  } catch (error) {
    console.error('Error in getSizes:', error)
    throw error
  }
}

export const getColors = async () => {
  try {
    const response = await api.get('/colors')
    return response.data
  } catch (error) {
    console.error('Error in getColors:', error)
    throw error
  }
}

// Subir imagen
export const uploadImage = async (file: File) => {
  try {
    const formData = new FormData()
    formData.append('image', file)

    const response = await api.post('/admin/upload-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })

    return response.data
  } catch (error) {
    console.error('Error uploading image:', error)
    throw error
  }
}

// Eliminar imagen
export const deleteImage = async (path: string) => {
  try {
    const response = await api.delete('/admin/delete-image', {
      data: { path }
    })

    return response.data
  } catch (error) {
    console.error('Error deleting image:', error)
    throw error
  }
}

// Función helper para verificar si el empleado está autenticado
export const isEmployeeAuthenticated = (): boolean => {
  const token = localStorage.getItem('admin_token')
  const employee = localStorage.getItem('admin_employee')
  return !!(token && employee)
}
