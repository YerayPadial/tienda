import React, { useState } from 'react'

interface ShippingData {
    deliveryType: 'home' | 'store'
    address?: string
    city?: string
    postalCode?: string
    province?: string
    notes?: string
}

interface ShippingDataFormProps {
    initialData: ShippingData
    onSubmit: (data: ShippingData) => void
    onBack: () => void
}

const ShippingDataForm: React.FC<ShippingDataFormProps> = ({ initialData, onSubmit, onBack }) => {
    const [formData, setFormData] = useState<ShippingData>(initialData)
    const [errors, setErrors] = useState<Partial<Omit<ShippingData, 'deliveryType' | 'notes'>>>({})
    const [touched, setTouched] = useState<Partial<Record<keyof ShippingData, boolean>>>({})

    const validateField = (name: keyof ShippingData, value: string): string => {
        // Solo validar si es envío a domicilio
        if (formData.deliveryType === 'store') return ''

        switch (name) {
            case 'address':
                if (!value.trim()) return 'La dirección es obligatoria para envío a domicilio'
                if (value.trim().length < 5) return 'La dirección debe tener al menos 5 caracteres'
                return ''

            case 'city':
                if (!value.trim()) return 'La ciudad es obligatoria'
                if (value.trim().length < 2) return 'La ciudad debe tener al menos 2 caracteres'
                return ''

            case 'postalCode':
                if (!value.trim()) return 'El código postal es obligatorio'
                const postalRegex = /^\d{5}$/
                if (!postalRegex.test(value)) return 'Introduce un código postal válido (5 dígitos)'
                return ''

            case 'province':
                if (!value.trim()) return 'La provincia es obligatoria'
                if (value.trim().length < 2) return 'La provincia debe tener al menos 2 caracteres'
                return ''

            default:
                return ''
        }
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target

        setFormData(prev => ({
            ...prev,
            [name]: value
        }))

        // Limpiar errores si es recogida en tienda
        if (name === 'deliveryType' && value === 'store') {
            setErrors({})
            setTouched({})
        }

        // Validar en tiempo real si el campo ha sido tocado
        if (touched[name as keyof ShippingData] && formData.deliveryType === 'home') {
            const error = validateField(name as keyof ShippingData, value)
            setErrors(prev => ({
                ...prev,
                [name]: error
            }))
        }
    }

    const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        const fieldName = name as keyof ShippingData

        setTouched(prev => ({
            ...prev,
            [fieldName]: true
        }))

        if (formData.deliveryType === 'home') {
            const error = validateField(fieldName, value)
            setErrors(prev => ({
                ...prev,
                [fieldName]: error
            }))
        }
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        // Si es recogida en tienda, no validar campos de dirección
        if (formData.deliveryType === 'store') {
            const storePickupData: ShippingData = {
                deliveryType: 'store',
                notes: formData.notes
            }
            onSubmit(storePickupData)
            return
        }

        // Validar todos los campos para envío a domicilio
        const newErrors: Partial<Omit<ShippingData, 'deliveryType' | 'notes'>> = {}
        let hasErrors = false

        const fieldsToValidate: (keyof ShippingData)[] = ['address', 'city', 'postalCode', 'province']

        fieldsToValidate.forEach(fieldName => {
            const value = formData[fieldName] || ''
            const error = validateField(fieldName, value)
            if (error) {
                newErrors[fieldName as keyof typeof newErrors] = error
                hasErrors = true
            }
        })

        setErrors(newErrors)
        setTouched({
            address: true,
            city: true,
            postalCode: true,
            province: true
        })

        if (!hasErrors) {
            onSubmit(formData)
        }
    }

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Datos de Envío</h2>
                <p className="text-gray-600">Seleccione el método de entrega</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Tipo de entrega */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                        Método de entrega <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Envío a domicilio */}
                        <label className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${formData.deliveryType === 'home'
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}>
                            <input
                                type="radio"
                                name="deliveryType"
                                value="home"
                                checked={formData.deliveryType === 'home'}
                                onChange={handleInputChange}
                                className="sr-only"
                            />
                            <div className="flex items-center">
                                <div className={`w-4 h-4 rounded-full border-2 mr-3 ${formData.deliveryType === 'home'
                                        ? 'border-blue-500 bg-blue-500'
                                        : 'border-gray-300'
                                    }`}>
                                    {formData.deliveryType === 'home' && (
                                        <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5"></div>
                                    )}
                                </div>
                                <div>
                                    <div className="font-medium text-gray-900">Envío a domicilio</div>
                                    <div className="text-sm text-gray-500">Entrega en la dirección especificada</div>
                                </div>
                            </div>
                        </label>

                        {/* Recogida en tienda */}
                        <label className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${formData.deliveryType === 'store'
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}>
                            <input
                                type="radio"
                                name="deliveryType"
                                value="store"
                                checked={formData.deliveryType === 'store'}
                                onChange={handleInputChange}
                                className="sr-only"
                            />
                            <div className="flex items-center">
                                <div className={`w-4 h-4 rounded-full border-2 mr-3 ${formData.deliveryType === 'store'
                                        ? 'border-blue-500 bg-blue-500'
                                        : 'border-gray-300'
                                    }`}>
                                    {formData.deliveryType === 'store' && (
                                        <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5"></div>
                                    )}
                                </div>
                                <div>
                                    <div className="font-medium text-gray-900">Recogida en tienda</div>
                                    <div className="text-sm text-gray-500">Gratis - Recoge en nuestra tienda</div>
                                </div>
                            </div>
                        </label>
                    </div>
                </div>

                {/* Campos de dirección (solo si es envío a domicilio) */}
                {formData.deliveryType === 'home' && (
                    <div className="space-y-6 pt-4 border-t border-gray-200">
                        <h3 className="text-lg font-medium text-gray-900">Dirección de entrega</h3>

                        {/* Dirección */}
                        <div>
                            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                                Dirección <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="address"
                                name="address"
                                value={formData.address || ''}
                                onChange={handleInputChange}
                                onBlur={handleBlur}
                                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${errors.address && touched.address
                                        ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                                        : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                                    }`}
                                placeholder="Calle, número, piso, puerta..."
                            />
                            {errors.address && touched.address && (
                                <p className="mt-1 text-sm text-red-600">{errors.address}</p>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Ciudad */}
                            <div>
                                <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                                    Ciudad <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="city"
                                    name="city"
                                    value={formData.city || ''}
                                    onChange={handleInputChange}
                                    onBlur={handleBlur}
                                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${errors.city && touched.city
                                            ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                                            : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                                        }`}
                                    placeholder="Madrid"
                                />
                                {errors.city && touched.city && (
                                    <p className="mt-1 text-sm text-red-600">{errors.city}</p>
                                )}
                            </div>

                            {/* Código postal */}
                            <div>
                                <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 mb-2">
                                    Código Postal <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="postalCode"
                                    name="postalCode"
                                    value={formData.postalCode || ''}
                                    onChange={handleInputChange}
                                    onBlur={handleBlur}
                                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${errors.postalCode && touched.postalCode
                                            ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                                            : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                                        }`}
                                    placeholder="28001"
                                    maxLength={5}
                                />
                                {errors.postalCode && touched.postalCode && (
                                    <p className="mt-1 text-sm text-red-600">{errors.postalCode}</p>
                                )}
                            </div>

                            {/* Provincia */}
                            <div>
                                <label htmlFor="province" className="block text-sm font-medium text-gray-700 mb-2">
                                    Provincia <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="province"
                                    name="province"
                                    value={formData.province || ''}
                                    onChange={handleInputChange}
                                    onBlur={handleBlur}
                                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${errors.province && touched.province
                                            ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                                            : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                                        }`}
                                    placeholder="Madrid"
                                />
                                {errors.province && touched.province && (
                                    <p className="mt-1 text-sm text-red-600">{errors.province}</p>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Información adicional para tienda */}
                {formData.deliveryType === 'store' && (
                    <div className="pt-4 border-t border-gray-200">
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <h3 className="text-lg font-medium text-blue-900 mb-2">Información de recogida</h3>
                            <div className="text-sm text-blue-800">
                                <p className="mb-2"><strong>Dirección:</strong> Calle San Juan, 123, 28001 Madrid</p>
                                <p className="mb-2"><strong>Horario:</strong> Lunes a Viernes de 10:00 a 20:00, Sábados de 10:00 a 14:00</p>
                                <p><strong>Teléfono:</strong> 912 345 678</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Notas adicionales */}
                <div>
                    <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
                        Notas adicionales (opcional)
                    </label>
                    <textarea
                        id="notes"
                        name="notes"
                        rows={3}
                        value={formData.notes || ''}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Instrucciones especiales para la entrega..."
                    />
                </div>

                {/* Buttons */}
                <div className="flex justify-between pt-6 border-t border-gray-200">
                    <button
                        type="button"
                        onClick={onBack}
                        className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                    >
                        Volver
                    </button>
                    <button
                        type="submit"
                        className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                        Continuar a Resumen
                    </button>
                </div>
            </form>
        </div>
    )
}

export default ShippingDataForm
