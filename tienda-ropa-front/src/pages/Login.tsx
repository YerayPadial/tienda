import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { login } from '../services/api'
import { useUser } from '../context/UserContext'

const Login: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { login: loginUser } = useUser()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({})
  const [redirectMessage, setRedirectMessage] = useState('')

  // Verificar si hay un mensaje de redirección desde otra página
  useEffect(() => {
    if (location.state?.message) {
      setRedirectMessage(location.state.message)
    }
  }, [location.state])

  const validateForm = () => {
    const errors: { [key: string]: string } = {}

    if (!email.trim()) {
      errors.email = 'El email es obligatorio'
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email)) {
        errors.email = 'Debe ser un email válido'
      }
    }

    if (!password) {
      errors.password = 'La contraseña es obligatoria'
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const clearFieldError = (fieldName: string) => {
    if (validationErrors[fieldName]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[fieldName]
        return newErrors
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    setLoading(true)
    setError('')
    setValidationErrors({})

    try {
      const response = await login(email, password)
      loginUser(response.data.user)
      setEmail('')
      setPassword('')

      // Pequeño delay para asegurar que el contexto se actualice
      setTimeout(() => {
        // Redirigir a la página de origen o a usuario por defecto
        const redirectTo = location.state?.from || '/usuario'
        navigate(redirectTo)
      }, 100)
    } catch (err: any) {

      if (err.response?.status === 422) {
        // Errores de validación del backend
        const backendErrors = err.response.data.errors
        if (backendErrors) {
          const errorMessages: { [key: string]: string } = {}
          Object.keys(backendErrors).forEach(key => {
            errorMessages[key] = backendErrors[key][0]
          })
          setValidationErrors(errorMessages)
        }
      } else if (err.response?.status === 401) {
        // Credenciales incorrectas
        setError(err.response?.data?.message || 'Email o contraseña incorrectos')
      } else {
        // Otros errores
        setError(err.response?.data?.message || 'Error al iniciar sesión. Inténtalo de nuevo.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="max-w-sm mx-auto">
      <h1 className="text-2xl font-bold mb-6">Iniciar sesión</h1>

      {/* Mensaje de redirección desde checkout */}
      {redirectMessage && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-blue-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <p className="text-blue-800 text-sm">{redirectMessage}</p>
          </div>
        </div>
      )}

      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div>
          <input
            className={`border rounded px-3 py-2 w-full ${validationErrors.email ? 'border-red-500' : ''}`}
            type="text"
            placeholder="Correo electrónico"
            value={email}
            onChange={e => {
              setEmail(e.target.value.trim())
              clearFieldError('email')
            }}
          />
          {validationErrors.email && (
            <p className="text-red-500 text-sm mt-1">{validationErrors.email}</p>
          )}
        </div>
        <div>
          <input
            className={`border rounded px-3 py-2 w-full ${validationErrors.password ? 'border-red-500' : ''}`}
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={e => {
              setPassword(e.target.value)
              clearFieldError('password')
            }}
          />
          {validationErrors.password && (
            <p className="text-red-500 text-sm mt-1">{validationErrors.password}</p>
          )}
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
          disabled={loading}
        >
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
        {error && <p className="text-red-600 text-center">{error}</p>}
        <div className="flex items-center my-4">
          <div className="flex-grow h-px bg-gray-300"></div>
          <span className="px-3 text-gray-500 text-sm">o</span>
          <div className="flex-grow h-px bg-gray-300"></div>
        </div>
        <button
          type="button"
          className="border border-blue-600 text-blue-600 py-2 rounded hover:bg-blue-50 transition-colors"
          onClick={() => navigate('/registro')}
        >
          ¿No tienes cuenta? Regístrate aquí
        </button>
      </form>
    </section>
  )
}

export default Login