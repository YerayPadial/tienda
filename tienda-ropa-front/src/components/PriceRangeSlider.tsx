import React, { useState, useEffect, useCallback } from 'react'

interface PriceRangeSliderProps {
    min: number
    max: number
    value: { min: number; max: number }
    onChange: (value: { min: number; max: number }) => void
    step?: number
}

const PriceRangeSlider: React.FC<PriceRangeSliderProps> = ({
    min,
    max,
    value,
    onChange,
    step = 1
}) => {
    const [isDragging, setIsDragging] = useState<'min' | 'max' | null>(null)
    const [localMin, setLocalMin] = useState(value.min)
    const [localMax, setLocalMax] = useState(value.max)

    // Sincronizar valores locales con los props solo si no estamos arrastrando
    useEffect(() => {
        if (!isDragging) {
            setLocalMin(value.min)
            setLocalMax(value.max)
        }
    }, [value.min, value.max, isDragging])

    // Notificar cambios con debounce
    useEffect(() => {
        const timer = setTimeout(() => {
            if ((localMin !== value.min || localMax !== value.max) && !isDragging) {
                onChange({ min: localMin, max: localMax })
            }
        }, 500)

        return () => clearTimeout(timer)
    }, [localMin, localMax, onChange, value.min, value.max, isDragging])

    const getPercentage = useCallback((val: number) => {
        return ((val - min) / (max - min)) * 100
    }, [min, max])

    const handleMouseDown = (thumb: 'min' | 'max') => (e: React.MouseEvent) => {
        e.preventDefault()
        setIsDragging(thumb)
    }

    const handleMouseMove = useCallback((e: MouseEvent) => {
        if (!isDragging) return

        const slider = document.getElementById('price-range-slider')
        if (!slider) return

        const rect = slider.getBoundingClientRect()
        const percentage = Math.min(Math.max(0, (e.clientX - rect.left) / rect.width), 1)
        const newValue = min + percentage * (max - min)
        const steppedValue = Math.round(newValue / step) * step

        if (isDragging === 'min') {
            const newMin = Math.min(steppedValue, localMax - step)
            const clampedMin = Math.max(min, newMin)
            setLocalMin(clampedMin)
        } else {
            const newMax = Math.max(steppedValue, localMin + step)
            const clampedMax = Math.min(max, newMax)
            setLocalMax(clampedMax)
        }
    }, [isDragging, min, max, step, localMin, localMax])

    const handleMouseUp = useCallback(() => {
        if (isDragging) {
            // Notificar el cambio final cuando se termina de arrastrar
            onChange({ min: localMin, max: localMax })
        }
        setIsDragging(null)
    }, [isDragging, localMin, localMax, onChange])

    const handleTouchMove = useCallback((e: TouchEvent) => {
        if (!isDragging) return

        const slider = document.getElementById('price-range-slider')
        if (!slider) return

        const rect = slider.getBoundingClientRect()
        const touch = e.touches[0]
        const percentage = Math.min(Math.max(0, (touch.clientX - rect.left) / rect.width), 1)
        const newValue = min + percentage * (max - min)
        const steppedValue = Math.round(newValue / step) * step

        if (isDragging === 'min') {
            const newMin = Math.min(steppedValue, localMax - step)
            const clampedMin = Math.max(min, newMin)
            setLocalMin(clampedMin)
        } else {
            const newMax = Math.max(steppedValue, localMin + step)
            const clampedMax = Math.min(max, newMax)
            setLocalMax(clampedMax)
        }
    }, [isDragging, min, max, step, localMin, localMax])

    useEffect(() => {
        if (isDragging) {
            document.addEventListener('mousemove', handleMouseMove)
            document.addEventListener('mouseup', handleMouseUp)
            document.addEventListener('touchmove', handleTouchMove)
            document.addEventListener('touchend', handleMouseUp)

            return () => {
                document.removeEventListener('mousemove', handleMouseMove)
                document.removeEventListener('mouseup', handleMouseUp)
                document.removeEventListener('touchmove', handleTouchMove)
                document.removeEventListener('touchend', handleMouseUp)
            }
        }
    }, [isDragging, handleMouseMove, handleMouseUp, handleTouchMove])

    const minPercentage = getPercentage(localMin)
    const maxPercentage = getPercentage(localMax)

    return (
        <div className="space-y-4">
            {/* Range inputs for precise control */}
            <div className="grid grid-cols-2 gap-3">
                <div>
                    <label className="block text-xs text-gray-600 mb-1">Mínimo</label>
                    <input
                        type="number"
                        min={min}
                        max={localMax - step}
                        value={localMin}
                        onChange={(e) => {
                            const newMin = Math.max(min, Math.min(Number(e.target.value || 0), localMax - step))
                            setLocalMin(newMin)
                        }}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>
                <div>
                    <label className="block text-xs text-gray-600 mb-1">Máximo</label>
                    <input
                        type="number"
                        min={localMin + step}
                        max={max}
                        value={localMax}
                        onChange={(e) => {
                            const newMax = Math.min(max, Math.max(Number(e.target.value || 0), localMin + step))
                            setLocalMax(newMax)
                        }}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>
            </div>

            {/* Visual slider */}
            <div className="relative">
                <div
                    id="price-range-slider"
                    className="relative h-2 bg-gray-200 rounded-full cursor-pointer"
                >
                    {/* Active range */}
                    <div
                        className="absolute h-2 bg-blue-500 rounded-full"
                        style={{
                            left: `${minPercentage}%`,
                            width: `${maxPercentage - minPercentage}%`
                        }}
                    />

                    {/* Min thumb */}
                    <div
                        className={`absolute w-5 h-5 bg-white border-2 border-blue-500 rounded-full cursor-grab shadow-lg transform -translate-y-1.5 transition-all ${isDragging === 'min' ? 'cursor-grabbing scale-110 border-blue-600' : 'hover:scale-105'
                            }`}
                        style={{ left: `${minPercentage}%`, marginLeft: '-10px' }}
                        onMouseDown={handleMouseDown('min')}
                        onTouchStart={() => setIsDragging('min')}
                    />

                    {/* Max thumb */}
                    <div
                        className={`absolute w-5 h-5 bg-white border-2 border-blue-500 rounded-full cursor-grab shadow-lg transform -translate-y-1.5 transition-all ${isDragging === 'max' ? 'cursor-grabbing scale-110 border-blue-600' : 'hover:scale-105'
                            }`}
                        style={{ left: `${maxPercentage}%`, marginLeft: '-10px' }}
                        onMouseDown={handleMouseDown('max')}
                        onTouchStart={() => setIsDragging('max')}
                    />
                </div>

                {/* Value labels */}
                <div className="flex justify-between mt-2 text-xs text-gray-500">
                    <span>€{min}</span>
                    <span>€{max}</span>
                </div>
            </div>

            {/* Current selection display */}
            <div className="text-center">
                <div className="text-sm font-medium text-gray-700">
                    €{localMin} - €{localMax}
                </div>
            </div>
        </div>
    )
}

export default PriceRangeSlider
