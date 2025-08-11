import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login } from '../services/api'

const Login: React.FC = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({})

  const validateForm = () => {
    const errors: { [key: string]: string } = {}

    // Validar email vacío
    if (!email.trim()) {
      errors.email = 'El email es obligatorio'
    } else {
      // Validar formato de email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email)) {
        errors.email = 'Debe ser un email válido'
      }
    }

    // Validar contraseña vacía
    if (!password) {
      errors.password = 'La contraseña es obligatoria'
    } else if (password.length < 1) {
      errors.password = 'La contraseña no puede estar vacía'
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  // Función para limpiar errores específicos cuando el usuario empiece a escribir
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

    // Validar formulario antes de enviar
    if (!validateForm()) {
      return
    }

    setLoading(true)
    setError('')
    setValidationErrors({})

    try {
      const response = await login(email, password)
      // Guarda el usuario
      localStorage.setItem('user', JSON.stringify(response.data.user))

      // Mostrar alert de éxito
      alert(`¡Login exitoso! Bienvenido/a ${response.data.user.name}`)

      // Limpiar formulario
      setEmail('')
      setPassword('')

      // Redirige al menú de usuario
      navigate('/usuario')
    } catch (err: any) {
      if (err.response?.status === 422) {
        // Errores de validación del backend
        const backendErrors = err.response.data.errors
        if (backendErrors) {
          const errorMessages: { [key: string]: string } = {}
          Object.keys(backendErrors).forEach(key => {
            errorMessages[key] = backendErrors[key][0] // Primer error de cada campo
          })
          setValidationErrors(errorMessages)
        }
      } else {
        setError(err.response?.data?.message || 'Credenciales inválidas')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="max-w-sm mx-auto">
      <h1 className="text-2xl font-bold mb-6">Iniciar sesión</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div>
          <input
            className={`border rounded px-3 py-2 w-full ${validationErrors.email ? 'border-red-500' : ''}`}
            type="text"
            placeholder="Correo electrónico"
            value={email}
            onChange={e => {
              setEmail(e.target.value.trim()) // Eliminar espacios
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

        {/* Separador */}
        <div className="flex items-center my-4">
          <div className="flex-grow h-px bg-gray-300"></div>
          <span className="px-3 text-gray-500 text-sm">o</span>
          <div className="flex-grow h-px bg-gray-300"></div>
        </div>

        {/* Botón de registro */}
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