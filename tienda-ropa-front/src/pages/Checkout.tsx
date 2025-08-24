import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import CheckoutSteps from '../components/CheckoutSteps'
import CustomerDataForm from '../components/CustomerDataForm'
import ShippingDataForm from '../components/ShippingDataForm'
import OrderSummary from '../components/OrderSummary'

interface CustomerData {
    firstName: string
    lastName: string
    email: string
    phone: string
    dni: string
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
    const [currentStep, setCurrentStep] = useState(1)
    const [customerData, setCustomerData] = useState<CustomerData>({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        dni: ''
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
            // lógica de crear el pedido
            console.log('Procesando pedido...', {
                customerData,
                shippingData,
                items,
                totalPrice
            })

            // Simular procesamiento
            await new Promise(resolve => setTimeout(resolve, 2000))

            // Limpiar carrito y redirigir
            clearCart()
            navigate('/pedido-confirmado')

        } catch (error) {
            console.error('Error al procesar el pedido:', error)
        } finally {
            setIsProcessing(false)
        }
    }

    if (items.length === 0) {
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
