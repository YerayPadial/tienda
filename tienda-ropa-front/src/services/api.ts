import axios from 'axios'

const API_URL = 'https://padiyera.com/api-tienda/public/index.php/api' 

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: false, 
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})