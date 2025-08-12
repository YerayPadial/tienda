import React from 'react'
import { useNavigate } from 'react-router-dom'
import { FaArrowLeft, FaUser, FaEnvelope, FaEdit } from 'react-icons/fa'

const getCurrentUser = () => {
  const userStr = localStorage.getItem('user')
  try {
    return userStr ? JSON.parse(userStr) : null
  } catch {
    return null
  }
}

const Perfil: React.FC = () => {
  const navigate = useNavigate()
  const user = getCurrentUser()

  if (!user) {
    return (
      <div className="p-8 text-center">
        <p className="text-xl text-gray-600 mb-4">Debes iniciar sesión para ver tu perfil</p>
        <button 
          onClick={() => navigate('/login')}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Ir al Login
        </button>
      </div>
    )
  }

  return (
    <section className="max-w-2xl mx-auto p-6">
      {/* Botón de regresar */}
      <button
        onClick={() => navigate('/usuario')}
        className="flex items-center gap-2 mb-6 text-blue-600 hover:text-blue-800 transition-colors"
      >
        <FaArrowLeft />
        Volver al menú
      </button>

      {/* Información del perfil */}
      <div className="bg-white shadow-lg rounded-xl p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full mb-4">
            <FaUser className="text-blue-500 text-3xl" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800">Mi Perfil</h1>
          <p className="text-gray-600">Gestiona tu información personal</p>
        </div>

        {/* Información del usuario */}
        <div className="space-y-6">
          <div className="border rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FaUser className="text-gray-500" />
                <div>
                  <label className="block text-sm font-medium text-gray-700">Nombre</label>
                  <p className="text-lg text-gray-900">{user.name}</p>
                </div>
              </div>
              <button className="text-blue-600 hover:text-blue-800">
                <FaEdit />
              </button>
            </div>
          </div>

          <div className="border rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FaEnvelope className="text-gray-500" />
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <p className="text-lg text-gray-900">{user.email}</p>
                </div>
              </div>
              <button className="text-blue-600 hover:text-blue-800">
                <FaEdit />
              </button>
            </div>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4">
          <button className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors">
            Editar Perfil
          </button>
          <button className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition-colors">
            Cambiar Contraseña
          </button>
        </div>
      </div>
    </section>
  )
}

export default Perfil
