import React, { useState } from 'react'
import { login } from '../services/api'

const Login: React.FC = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const response = await login(email, password)
      // Guarda el usuario o token según tu backend (ajusta esto)
      localStorage.setItem('user', JSON.stringify(response.data.user))
      // Si recibes un token, guarda también el token
      // localStorage.setItem('token', response.data.token)
      
      // Mostrar alert de éxito
      alert('¡Login exitoso! Bienvenido/a')
      
      // Redirige, muestra mensaje, etc.
    } catch (err: any) {
      setError(err.response?.data?.message || 'Credenciales inválidas')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="max-w-sm mx-auto">
      <h1 className="text-2xl font-bold mb-6">Iniciar sesión</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <input
          className="border rounded px-3 py-2"
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input
          className="border rounded px-3 py-2"
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
        {error && <p className="text-red-600">{error}</p>}
      </form>
    </section>
  )
}

export default Login