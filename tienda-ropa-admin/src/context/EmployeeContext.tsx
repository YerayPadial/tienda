import React, { createContext, useContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import { employeeLogin, employeeLogout, verifyEmployeeAuth } from '../services/api'

interface Employee {
    id: number
    name: string
    email: string
    rol: string
    is_active: boolean
}

interface EmployeeContextType {
    employee: Employee | null
    loading: boolean
    login: (email: string, password: string) => Promise<void>
    logout: () => Promise<void>
    isAuthenticated: boolean
}

const EmployeeContext = createContext<EmployeeContextType | undefined>(undefined)

interface EmployeeProviderProps {
    children: ReactNode
}

export const EmployeeProvider: React.FC<EmployeeProviderProps> = ({ children }) => {
    const [employee, setEmployee] = useState<Employee | null>(null)
    const [loading, setLoading] = useState(true)

    // Verificar autenticación al cargar la app
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const token = localStorage.getItem('admin_token')
                const savedEmployee = localStorage.getItem('admin_employee')

                if (token && savedEmployee) {
                    // Verificar que el token sigue siendo válido
                    const response = await verifyEmployeeAuth()
                    setEmployee(response.employee)
                }
            } catch (error) {
                console.error('Error verificando autenticación:', error)
                // Limpiar datos si hay error
                localStorage.removeItem('admin_token')
                localStorage.removeItem('admin_employee')
                setEmployee(null)
            } finally {
                setLoading(false)
            }
        }

        checkAuth()
    }, [])

    const login = async (email: string, password: string) => {
        try {
            const response = await employeeLogin(email, password)
            setEmployee(response.data.employee)
        } catch (error) {
            throw error
        }
    }

    const logout = async () => {
        try {
            await employeeLogout()
        } catch (error) {
            console.error('Error durante logout:', error)
        } finally {
            setEmployee(null)
        }
    }

    const value: EmployeeContextType = {
        employee,
        loading,
        login,
        logout,
        isAuthenticated: !!employee
    }

    return (
        <EmployeeContext.Provider value={value}>
            {children}
        </EmployeeContext.Provider>
    )
}

export const useEmployee = (): EmployeeContextType => {
    const context = useContext(EmployeeContext)
    if (context === undefined) {
        throw new Error('useEmployee debe ser usado dentro de un EmployeeProvider')
    }
    return context
}
