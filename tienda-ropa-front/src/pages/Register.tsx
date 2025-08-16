import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { register } from '../services/api'
import { useUser } from '../context/UserContext'

const Register: React.FC = () => {
  const navigate = useNavigate()
  const { login: loginUser } = useUser()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirmation, setPasswordConfirmation] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({})

  const validateForm = () => {
    const errors: { [key: string]: string } = {}

    if (!name.trim()) {
      errors.name = 'El nombre es obligatorio'
    } else if (name.trim().length < 2) {
      errors.name = 'El nombre debe tener al menos 2 caracteres'
    }

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
    } else if (password.length < 8) {
      errors.password = 'La contraseña debe tener al menos 8 caracteres'
    }

    if (!passwordConfirmation) {
      errors.passwordConfirmation = 'La confirmación de contraseña es obligatoria'
    } else if (password !== passwordConfirmation) {
      errors.passwordConfirmation = 'Las contraseñas no coinciden'
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
    setSuccess('')
    setValidationErrors({})

    try {
      const response = await register(name, email, password, passwordConfirmation)
      // Auto-login
      if (response.data.token && response.data.user) {
        loginUser(response.data.user) // Llama a la función para loguear al usuario
        setSuccess('¡Registro exitoso! Ya estás logueado')

        // Pequeño delay para asegurar que el contexto se actualice
        setTimeout(() => {
          navigate('/usuario')
        }, 100)
      } else {
        // Fallback en caso de que no haya auto-login
        setSuccess('¡Registro exitoso! Ya puedes iniciar sesión')
        setTimeout(() => {
          navigate('/login')
        }, 2000)
      }

      setName('')
      setEmail('')
      setPassword('')
      setPasswordConfirmation('')
    } catch (err: any) {
      if (err.response?.status === 422) {
        const backendErrors = err.response.data.errors
        if (backendErrors) {
          const errorMessages: { [key: string]: string } = {}
          Object.keys(backendErrors).forEach(key => {
            errorMessages[key] = backendErrors[key][0]
          })
          setValidationErrors(errorMessages)
        }
      } else {
        setError(err.response?.data?.message || 'Error al registrar usuario')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="max-w-sm mx-auto">
      <h1 className="text-2xl font-bold mb-6">Registrarse</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div>
          <input
            className={`border rounded px-3 py-2 w-full ${validationErrors.name ? 'border-red-500' : ''}`}
            type="text"
            placeholder="Nombre"
            value={name}
            onChange={e => {
              setName(e.target.value.trimStart())
              clearFieldError('name')
            }}
          />
          {validationErrors.name && (
            <p className="text-red-500 text-sm mt-1">{validationErrors.name}</p>
          )}
        </div>
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
            placeholder="Contraseña (mínimo 8 caracteres)"
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
        <div>
          <input
            className={`border rounded px-3 py-2 w-full ${validationErrors.passwordConfirmation ? 'border-red-500' : ''}`}
            type="password"
            placeholder="Confirmar contraseña"
            value={passwordConfirmation}
            onChange={e => {
              setPasswordConfirmation(e.target.value)
              clearFieldError('passwordConfirmation')
            }}
          />
          {validationErrors.passwordConfirmation && (
            <p className="text-red-500 text-sm mt-1">{validationErrors.passwordConfirmation}</p>
          )}
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
          disabled={loading}
        >
          {loading ? 'Registrando...' : 'Crear cuenta'}
        </button>
        {error && <p className="text-red-600 text-center">{error}</p>}
        {success && <p className="text-green-600 text-center">{success}</p>}
        <div className="flex items-center my-4">
          <div className="flex-grow h-px bg-gray-300"></div>
          <span className="px-3 text-gray-500 text-sm">o</span>
          <div className="flex-grow h-px bg-gray-300"></div>
        </div>
        <button
          type="button"
          className="border border-blue-600 text-blue-600 py-2 rounded hover:bg-blue-50 transition-colors"
          onClick={() => navigate('/login')}
        >
          ¿Ya tienes cuenta? Inicia sesión aquí
        </button>
      </form>
    </section>
  )
}

export default Register