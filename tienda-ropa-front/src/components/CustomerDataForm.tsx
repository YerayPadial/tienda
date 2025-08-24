import React, { useState } from 'react'

interface CustomerData {
    firstName: string
    lastName: string
    email: string
    phone: string
    dni: string
}

interface CustomerDataFormProps {
    initialData: CustomerData
    onSubmit: (data: CustomerData) => void
}

const CustomerDataForm: React.FC<CustomerDataFormProps> = ({ initialData, onSubmit }) => {
    const [formData, setFormData] = useState<CustomerData>(initialData)
    const [errors, setErrors] = useState<Partial<CustomerData>>({})
    const [touched, setTouched] = useState<Partial<Record<keyof CustomerData, boolean>>>({})

    const validateField = (name: keyof CustomerData, value: string): string => {
        switch (name) {
            case 'firstName':
                if (!value.trim()) return 'El nombre es obligatorio'
                if (value.trim().length < 2) return 'El nombre debe tener al menos 2 caracteres'
                return ''

            case 'lastName':
                if (!value.trim()) return 'Los apellidos son obligatorios'
                if (value.trim().length < 2) return 'Los apellidos deben tener al menos 2 caracteres'
                return ''

            case 'email':
                if (!value.trim()) return 'El email es obligatorio'
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
                if (!emailRegex.test(value)) return 'Por favor, introduce un email válido'
                return ''

            case 'phone':
                if (!value.trim()) return 'El teléfono es obligatorio'
                const phoneRegex = /^[6-9]\d{8}$/
                if (!phoneRegex.test(value.replace(/\s/g, ''))) return 'Introduce un teléfono español válido (9 dígitos)'
                return ''

            case 'dni':
                if (!value.trim()) return 'El DNI es obligatorio'
                const dniRegex = /^\d{8}[A-Z]$/
                if (!dniRegex.test(value.toUpperCase())) return 'Introduce un DNI válido (12345678A)'
                return ''

            default:
                return ''
        }
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target

        setFormData(prev => ({
            ...prev,
            [name]: value
        }))

        // Validar en tiempo real si el campo ha sido tocado
        if (touched[name as keyof CustomerData]) {
            const error = validateField(name as keyof CustomerData, value)
            setErrors(prev => ({
                ...prev,
                [name]: error
            }))
        }
    }

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        const fieldName = name as keyof CustomerData

        setTouched(prev => ({
            ...prev,
            [fieldName]: true
        }))

        const error = validateField(fieldName, value)
        setErrors(prev => ({
            ...prev,
            [fieldName]: error
        }))
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        // Validar todos los campos
        const newErrors: Partial<CustomerData> = {}
        let hasErrors = false

        Object.keys(formData).forEach(key => {
            const fieldName = key as keyof CustomerData
            const error = validateField(fieldName, formData[fieldName])
            if (error) {
                newErrors[fieldName] = error
                hasErrors = true
            }
        })

        setErrors(newErrors)
        setTouched({
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
            dni: true
        })

        if (!hasErrors) {
            onSubmit(formData)
        }
    }

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Datos del Cliente</h2>
                <p className="text-gray-600">Por favor, complete sus datos personales</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Nombre */}
                    <div>
                        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                            Nombre <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="firstName"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            onBlur={handleBlur}
                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${errors.firstName && touched.firstName
                                    ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                                    : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                                }`}
                            placeholder="Introduce tu nombre"
                        />
                        {errors.firstName && touched.firstName && (
                            <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
                        )}
                    </div>

                    {/* Apellidos */}
                    <div>
                        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                            Apellidos <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="lastName"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            onBlur={handleBlur}
                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${errors.lastName && touched.lastName
                                    ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                                    : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                                }`}
                            placeholder="Introduce tus apellidos"
                        />
                        {errors.lastName && touched.lastName && (
                            <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
                        )}
                    </div>
                </div>

                {/* Email */}
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                        Email <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${errors.email && touched.email
                                ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                                : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                            }`}
                        placeholder="correo@ejemplo.com"
                    />
                    {errors.email && touched.email && (
                        <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Teléfono */}
                    <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                            Teléfono <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            onBlur={handleBlur}
                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${errors.phone && touched.phone
                                    ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                                    : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                                }`}
                            placeholder="123456789"
                        />
                        {errors.phone && touched.phone && (
                            <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                        )}
                    </div>

                    {/* DNI */}
                    <div>
                        <label htmlFor="dni" className="block text-sm font-medium text-gray-700 mb-2">
                            DNI <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="dni"
                            name="dni"
                            value={formData.dni}
                            onChange={handleInputChange}
                            onBlur={handleBlur}
                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${errors.dni && touched.dni
                                    ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                                    : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                                }`}
                            placeholder="12345678A"
                            style={{ textTransform: 'uppercase' }}
                        />
                        {errors.dni && touched.dni && (
                            <p className="mt-1 text-sm text-red-600">{errors.dni}</p>
                        )}
                    </div>
                </div>

                {/* Submit button */}
                <div className="flex justify-end pt-6 border-t border-gray-200">
                    <button
                        type="submit"
                        className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                        Continuar a Datos de Envío
                    </button>
                </div>
            </form>
        </div>
    )
}

export default CustomerDataForm
