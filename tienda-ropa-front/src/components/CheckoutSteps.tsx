import React from 'react'

interface CheckoutStepsProps {
    currentStep: number
}

const CheckoutSteps: React.FC<CheckoutStepsProps> = ({ currentStep }) => {
    const steps = [
        { id: 1, title: 'Datos del Cliente', description: 'Información personal' },
        { id: 2, title: 'Datos de Envío', description: 'Dirección de entrega' },
        { id: 3, title: 'Resumen del Pedido', description: 'Confirmar y pagar' }
    ]

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
                {steps.map((step, index) => (
                    <React.Fragment key={step.id}>
                        {/* Step circle and content */}
                        <div className="flex flex-col items-center">
                            {/* Circle */}
                            <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-200 ${step.id < currentStep
                                        ? 'bg-green-500 text-white' // Completed
                                        : step.id === currentStep
                                            ? 'bg-blue-600 text-white' // Current
                                            : 'bg-gray-200 text-gray-500' // Pending
                                    }`}
                            >
                                {step.id < currentStep ? (
                                    // Check icon for completed steps
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                        <path
                                            fillRule="evenodd"
                                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                ) : (
                                    step.id
                                )}
                            </div>

                            {/* Text */}
                            <div className="mt-3 text-center">
                                <div
                                    className={`text-sm font-medium ${step.id <= currentStep ? 'text-gray-900' : 'text-gray-500'
                                        }`}
                                >
                                    {step.title}
                                </div>
                                <div
                                    className={`text-xs mt-1 ${step.id <= currentStep ? 'text-gray-600' : 'text-gray-400'
                                        }`}
                                >
                                    {step.description}
                                </div>
                            </div>
                        </div>

                        {/* Connection line */}
                        {index < steps.length - 1 && (
                            <div className="flex-1 mx-4">
                                <div
                                    className={`h-0.5 transition-all duration-200 ${step.id < currentStep ? 'bg-green-500' : 'bg-gray-200'
                                        }`}
                                />
                            </div>
                        )}
                    </React.Fragment>
                ))}
            </div>
        </div>
    )
}

export default CheckoutSteps
