import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useUser } from '../context/UserContext'
import { createOrder, checkStock } from '../services/api'
import CheckoutSteps from '../components/CheckoutSteps'
import CustomerDataForm from '../components/CustomerDataForm'
import ShippingDataForm from '../components/ShippingDataForm'
import OrderSummary from '../components/OrderSummary'

interface CustomerData {
    firstName: string
    lastName: string
    email: string
    phone: string
}

interface ShippingData {
    deliveryType: 'home' | 'store'
    address?: string
    city?: string
    postalCode?: string
    province?: string
    notes?: string
}

const Checkout: React.FC = () => {
    const navigate = useNavigate()
    const { items, totalPrice, clearCart } = useCart()
    const { user, loading } = useUser()
    const [currentStep, setCurrentStep] = useState(1)
    const [customerData, setCustomerData] = useState<CustomerData>({
        firstName: '',
        lastName: '',
        email: '',
        phone: ''
    })
    const [shippingData, setShippingData] = useState<ShippingData>({
        deliveryType: 'home',
        address: '',
        city: '',
        postalCode: '',
        province: '',
        notes: ''
    })
    const [isProcessing, setIsProcessing] = useState(false)

    // Verificar autenticación
    useEffect(() => {
        if (!loading && !user) {
            navigate('/login', {
                replace: true,
                state: {
                    from: '/checkout',
                    message: 'Debes iniciar sesión para proceder con el pago'
                }
            })
        }
    }, [user, loading, navigate])

    // Redirigir si el carrito está vacío
    useEffect(() => {
        if (items.length === 0) {
            navigate('/productos')
        }
    }, [items, navigate])

    const handleCustomerDataSubmit = (data: CustomerData) => {
        setCustomerData(data)
        setCurrentStep(2)
    }

    const handleShippingDataSubmit = (data: ShippingData) => {
        setShippingData(data)
        setCurrentStep(3)
    }

    const handleBackToCustomer = () => {
        setCurrentStep(1)
    }

    const handleBackToShipping = () => {
        setCurrentStep(2)
    }

    const handlePlaceOrder = async () => {
        setIsProcessing(true)

        try {
            if (!user) {
                throw new Error('Usuario no autenticado')
            }

            // Preparar items para verificación de stock
            const itemsToCheck = items.map(item => ({
                product_id: item.product_id,
                size_id: item.size_id,
                color_id: item.color_id,
                quantity: item.quantity
            }))

            console.log('Verificando stock...', itemsToCheck)

            // Verificar stock antes de proceder
            const stockCheck = await checkStock(itemsToCheck)

            if (!stockCheck.success) {
                // Mostrar errores de stock al usuario
                const errorMessage = stockCheck.stock_errors.join('\n')
                alert(`Problemas de stock detectados:\n\n${errorMessage}\n\nPor favor, ajusta las cantidades en tu carrito.`)
                return
            }

            // Preparar datos del pedido según el formato esperado por el backend
            const orderData = {
                user_id: user.id,
                shipping_type: (shippingData.deliveryType === 'home' ? 'domicilio' : 'recogida') as 'domicilio' | 'recogida',
                shipping_data: shippingData.deliveryType === 'home' ? {
                    address: shippingData.address,
                    city: shippingData.city,
                    postal_code: shippingData.postalCode,
                    province: shippingData.province,
                    phone: customerData.phone,
                    notes: shippingData.notes
                } : {
                    phone: customerData.phone,
                    notes: shippingData.notes
                },
                items: itemsToCheck
            }

            console.log('Enviando pedido al backend:', orderData)

            // Crear el pedido en el backend
            const response = await createOrder(orderData)

            if (response.success) {
                console.log('Pedido creado exitosamente:', response.order)

                // Limpiar carrito y redirigir
                clearCart()
                navigate('/pedido-confirmado')
            } else {
                // Si hay errores de stock en la creación del pedido
                if (response.stock_errors) {
                    const errorMessage = response.stock_errors.join('\n')
                    alert(`Problemas de stock detectados:\n\n${errorMessage}\n\nAlgún producto se agotó mientras procesábamos tu pedido.`)
                } else {
                    throw new Error(response.message || 'Error al crear el pedido')
                }
            }

        } catch (error) {
            console.error('Error al procesar el pedido:', error)
            alert('Error al procesar el pedido. Por favor, inténtalo de nuevo.')
        } finally {
            setIsProcessing(false)
        }
    }

    if (items.length === 0) {
        return null
    }

    // Mostrar loading mientras se verifica la autenticación
    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Verificando autenticación...</p>
                </div>
            </div>
        )
    }

    // Si no hay usuario autenticado, no mostrar nada (se redirigirá)
    if (!user) {
        return null
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4">
                {/* Header */}
                <div className="mb-8">
                    <button
                        onClick={() => navigate('/productos')}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-4"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Volver a productos
                    </button>

                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Finalizar Compra</h1>
                    <p className="text-gray-600">Complete los siguientes pasos para realizar su pedido</p>
                </div>

                {/* Steps indicator */}
                <CheckoutSteps currentStep={currentStep} />

                {/* Content based on current step */}
                <div className="mt-8">
                    {currentStep === 1 && (
                        <CustomerDataForm
                            initialData={customerData}
                            onSubmit={handleCustomerDataSubmit}
                        />
                    )}

                    {currentStep === 2 && (
                        <ShippingDataForm
                            initialData={shippingData}
                            onSubmit={handleShippingDataSubmit}
                            onBack={handleBackToCustomer}
                        />
                    )}

                    {currentStep === 3 && (
                        <OrderSummary
                            customerData={customerData}
                            shippingData={shippingData}
                            items={items}
                            totalPrice={totalPrice}
                            onBack={handleBackToShipping}
                            onPlaceOrder={handlePlaceOrder}
                            isProcessing={isProcessing}
                        />
                    )}
                </div>
            </div>
        </div>
    )
}

export default Checkout
