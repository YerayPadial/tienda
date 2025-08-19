import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaArrowLeft, FaUser, FaEnvelope, FaEdit, FaSave, FaTimes } from 'react-icons/fa'
import { updateProfile, changePassword } from '../services/api'
import { useUser } from '../context/UserContext'

const Profile: React.FC = () => {
    const navigate = useNavigate()
    const { user, login } = useUser()

    // Edición de campos
    const [editingField, setEditingField] = useState<"name" | "email" | "both" | "password" | null>(null)
    const [editName, setEditName] = useState(user?.name || '')
    const [editEmail, setEditEmail] = useState(user?.email || '')
    const [editNameError, setEditNameError] = useState('')
    const [editEmailError, setEditEmailError] = useState('')

    // Cambio de contraseña
    const [currentPassword, setCurrentPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [repeatPassword, setRepeatPassword] = useState('')
    const [passwordError, setPasswordError] = useState('')

    // Estado general
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState('')
    const [error, setError] = useState('')

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

    // Validación de campos
    const validateProfile = () => {
        let valid = true
        setEditNameError('')
        setEditEmailError('')

        // Validar que no se guarden cambios sin hacer modificaciones
        if (editName.trim() === user.name && editEmail.trim() === user.email) {
            setError('No se han realizado cambios en el perfil')
            return false
        }

        if (editName.trim().length < 2) {
            setEditNameError('El nombre debe tener al menos 2 caracteres')
            valid = false
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(editEmail)) {
            setEditEmailError('Debe ser un email válido')
            valid = false
        }
        return valid
    }

    const validatePassword = () => {
        setPasswordError('')
        if (!currentPassword || !newPassword || !repeatPassword) {
            setPasswordError('Todos los campos son obligatorios')
            return false
        }
        if (newPassword.length < 8) {
            setPasswordError('La nueva contraseña debe tener al menos 8 caracteres')
            return false
        }
        if (newPassword !== repeatPassword) {
            setPasswordError('Las nuevas contraseñas no coinciden')
            return false
        }
        return true
    }

    // Guardar cambios de perfil (individual o conjunto)
    const handleSaveProfile = async () => {
        setLoading(true)
        setError('')
        setSuccess('')
        if (!validateProfile()) {
            setLoading(false)
            return
        }
        try {
            // Llamada al backend, enviando también el id del usuario
            const response = await updateProfile(editName, editEmail, user.id)
            // Actualiza el contexto global (que también actualiza localStorage)
            login(response.data.user)
            setSuccess('Perfil actualizado correctamente')
            setEditingField(null)
        } catch (err: any) {
            // Manejar errores específicos de validación del backend
            if (err.response?.status === 422 && err.response?.data?.errors) {
                const errors = err.response.data.errors

                // Error específico para email ya existente
                if (errors.email) {
                    setEditEmailError(errors.email[0])
                }

                // Error para nombre
                if (errors.name) {
                    setEditNameError(errors.name[0])
                }
            } else {
                setError(err.response?.data?.message || 'Error al actualizar perfil')
            }
        } finally {
            setLoading(false)
        }
    }

    // Guardar cambio de contraseña
    const handleSavePassword = async () => {
        setLoading(true)
        setError('')
        setSuccess('')
        if (!validatePassword()) {
            setLoading(false)
            return
        }
        try {
            // Llamada al backend, enviando también el id del usuario
            await changePassword(currentPassword, newPassword, user.id)
            setSuccess('Contraseña actualizada correctamente')
            setEditingField(null)
            setCurrentPassword('')
            setNewPassword('')
            setRepeatPassword('')
        } catch (err: any) {
            // Manejar errores específicos del cambio de contraseña
            if (err.response?.status === 400) {
                setPasswordError(err.response.data.message || 'La contraseña actual es incorrecta')
            } else if (err.response?.status === 422 && err.response?.data?.errors) {
                const errors = err.response.data.errors
                if (errors.currentPassword) {
                    setPasswordError(errors.currentPassword[0])
                } else if (errors.newPassword) {
                    setPasswordError(errors.newPassword[0])
                } else {
                    setPasswordError('Error de validación en el cambio de contraseña')
                }
            } else {
                setPasswordError(err.response?.data?.message || 'Error al cambiar la contraseña')
            }
        } finally {
            setLoading(false)
        }
    }

    // Cancelar edición
    const handleCancel = () => {
        setEditName(user.name)
        setEditEmail(user.email)
        setEditingField(null)
        setCurrentPassword('')
        setNewPassword('')
        setRepeatPassword('')
        setEditNameError('')
        setEditEmailError('')
        setPasswordError('')
        setSuccess('')
        setError('')
    }

    return (
        <section className="max-w-2xl mx-auto p-6">
            <button
                onClick={() => navigate('/usuario')}
                className="flex items-center gap-2 mb-6 text-blue-600 hover:text-blue-800 transition-colors"
            >
                <FaArrowLeft />
                Volver al menú
            </button>

            <div className="bg-white shadow-lg rounded-xl p-8">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full mb-4">
                        <FaUser className="text-blue-500 text-3xl" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-800">Mi Perfil</h1>
                    <p className="text-gray-600">Gestiona tu información personal</p>
                </div>
                {/* Mensajes */}
                {success && <p className="text-green-600 text-center mb-4">{success}</p>}
                {error && <p className="text-red-600 text-center mb-4">{error}</p>}
                {/* Edición de campos */}
                {editingField === "name" && (
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Editar Nombre</label>
                        <input
                            type="text"
                            className="border rounded px-3 py-2 w-full"
                            value={editName}
                            onChange={e => setEditName(e.target.value)}
                            autoFocus
                        />
                        {editNameError && <p className="text-red-500 text-sm mt-1">{editNameError}</p>}
                        <div className="flex gap-2 mt-4">
                            <button
                                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-2"
                                onClick={handleSaveProfile}
                                disabled={loading}
                            >
                                <FaSave />
                                Guardar
                            </button>
                            <button
                                className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 flex items-center gap-2"
                                onClick={handleCancel}
                            >
                                <FaTimes />
                                Cancelar
                            </button>
                        </div>
                    </div>
                )}
                {editingField === "email" && (
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Editar Email</label>
                        <input
                            type="email"
                            className="border rounded px-3 py-2 w-full"
                            value={editEmail}
                            onChange={e => setEditEmail(e.target.value)}
                            autoFocus
                        />
                        {editEmailError && <p className="text-red-500 text-sm mt-1">{editEmailError}</p>}
                        <div className="flex gap-2 mt-4">
                            <button
                                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-2"
                                onClick={handleSaveProfile}
                                disabled={loading}
                            >
                                <FaSave />
                                Guardar
                            </button>
                            <button
                                className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 flex items-center gap-2"
                                onClick={handleCancel}
                            >
                                <FaTimes />
                                Cancelar
                            </button>
                        </div>
                    </div>
                )}
                {editingField === "both" && (
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Editar Nombre y Email</label>
                        <input
                            type="text"
                            className="border rounded px-3 py-2 w-full mb-2"
                            value={editName}
                            onChange={e => setEditName(e.target.value)}
                            placeholder="Nombre"
                        />
                        {editNameError && <p className="text-red-500 text-sm mb-1">{editNameError}</p>}
                        <input
                            type="email"
                            className="border rounded px-3 py-2 w-full"
                            value={editEmail}
                            onChange={e => setEditEmail(e.target.value)}
                            placeholder="Email"
                        />
                        {editEmailError && <p className="text-red-500 text-sm mt-1">{editEmailError}</p>}
                        <div className="flex gap-2 mt-4">
                            <button
                                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-2"
                                onClick={handleSaveProfile}
                                disabled={loading}
                            >
                                <FaSave />
                                Guardar
                            </button>
                            <button
                                className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 flex items-center gap-2"
                                onClick={handleCancel}
                            >
                                <FaTimes />
                                Cancelar
                            </button>
                        </div>
                    </div>
                )}
                {editingField === "password" && (
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Cambiar Contraseña</label>
                        <input
                            type="password"
                            className="border rounded px-3 py-2 w-full mb-2"
                            value={currentPassword}
                            onChange={e => setCurrentPassword(e.target.value)}
                            placeholder="Contraseña actual"
                        />
                        <input
                            type="password"
                            className="border rounded px-3 py-2 w-full mb-2"
                            value={newPassword}
                            onChange={e => setNewPassword(e.target.value)}
                            placeholder="Nueva contraseña"
                        />
                        <input
                            type="password"
                            className="border rounded px-3 py-2 w-full mb-2"
                            value={repeatPassword}
                            onChange={e => setRepeatPassword(e.target.value)}
                            placeholder="Repetir nueva contraseña"
                        />
                        {passwordError && <p className="text-red-500 text-sm mt-1">{passwordError}</p>}
                        <div className="flex gap-2 mt-4">
                            <button
                                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-2"
                                onClick={handleSavePassword}
                                disabled={loading}
                            >
                                <FaSave />
                                Guardar
                            </button>
                            <button
                                className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 flex items-center gap-2"
                                onClick={handleCancel}
                            >
                                <FaTimes />
                                Cancelar
                            </button>
                        </div>
                    </div>
                )}

                {/* Información del usuario (solo se muestra si no se está editando) */}
                {!editingField && (
                    <div className="space-y-6">
                        <div className="border rounded-lg p-4">
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex items-start gap-3 flex-1 min-w-0">
                                    <FaUser className="text-gray-500 mt-1 flex-shrink-0" />
                                    <div className="flex-1 min-w-0">
                                        <label className="block text-sm font-medium text-gray-700">Nombre</label>
                                        <p className="text-lg text-gray-900 email-display">{user.name}</p>
                                    </div>
                                </div>
                                <button
                                    className="text-blue-600 hover:text-blue-800 flex-shrink-0"
                                    title="Editar nombre"
                                    onClick={() => setEditingField("name")}
                                >
                                    <FaEdit />
                                </button>
                            </div>
                        </div>

                        <div className="border rounded-lg p-4">
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex items-start gap-3 flex-1 min-w-0">
                                    <FaEnvelope className="text-gray-500 mt-1 flex-shrink-0" />
                                    <div className="flex-1 min-w-0">
                                        <label className="block text-sm font-medium text-gray-700">Email</label>
                                        <p className="text-lg text-gray-900 email-display">{user.email}</p>
                                    </div>
                                </div>
                                <button
                                    className="text-blue-600 hover:text-blue-800 flex-shrink-0"
                                    title="Editar email"
                                    onClick={() => setEditingField("email")}
                                >
                                    <FaEdit />
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Botones de acción (solo si no se está editando) */}
                {!editingField && (
                    <div className="mt-8 flex flex-col sm:flex-row gap-4">
                        <button
                            className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
                            onClick={() => setEditingField("both")}
                        >
                            Editar Perfil
                        </button>
                        <button
                            className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition-colors"
                            onClick={() => setEditingField("password")}
                        >
                            Cambiar Contraseña
                        </button>
                    </div>
                )}
            </div>
        </section>
    )
}

export default Profile