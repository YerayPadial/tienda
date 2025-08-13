import axios from 'axios'

const API_URL = 'https://padiyera.com/api-tienda/public/index.php/api'

// Creamos una instancia de axios con la configuración base
export const api = axios.create({
  baseURL: API_URL,
  withCredentials: false,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

// Funciones para interactuar con la API
export const login = (email: string, password: string) =>
  api.post('/login', { email, password })

export const register = (name: string, email: string, password: string, passwordConfirmation: string) =>
  api.post('/register', {
    name,
    email,
    password,
    password_confirmation: passwordConfirmation
  })

export const updateProfile = (name: string, email: string, id: string | number) =>
  api.put('/profile', { id, name, email })

export const changePassword = (currentPassword: string, newPassword: string, id: string | number) =>
  api.put('/profile/password', { id, currentPassword, newPassword })


export const fetchUserOrders = async (userId: string | number) => {
  const response = await api.get('/user-orders', { params: { user_id: userId } });
  return response.data.orders;
}

export const fetchOrderDetail = async (orderId: string | number) => {
  const response = await api.get(`/orders/${orderId}`);
  return response.data.order;
}