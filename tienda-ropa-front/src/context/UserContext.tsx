import { createContext, useContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import { logout as apiLogout, verifyAuth, isAuthenticated } from '../services/api'

type User = {
    id: number
    name: string
    email: string
}

type UserContextType = {
    user: User | null
    login: (user: User) => void
    logout: () => Promise<void>
    loading: boolean
    checkAuth: () => Promise<void>
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)

    // Verificar autenticación al cargar la aplicación
    useEffect(() => {
        checkAuth()
    }, [])

    const checkAuth = async () => {
        setLoading(true)
        try {
            if (isAuthenticated()) {
                // Verificar que el token sigue siendo válido
                const response = await verifyAuth()
                setUser(response.user)
            }
        } catch (error) {
            console.error('Error verifying auth:', error)
            // Si falla la verificación, limpiar el estado
            setUser(null)
        } finally {
            setLoading(false)
        }
    }

    const login = (user: User) => {
        setUser(user)
        localStorage.setItem('user', JSON.stringify(user))
    }

    const logout = async () => {
        try {
            // Llamar al endpoint de logout del backend
            await apiLogout()
        } catch (error) {
            console.error('Error during logout:', error)
        } finally {
            // Limpiar estado local
            setUser(null)
            localStorage.removeItem('user')
            localStorage.removeItem('token')
        }
    }

    return (
        <UserContext.Provider value={{ user, login, logout, loading, checkAuth }}>
            {children}
        </UserContext.Provider>
    )
}

export const useUser = () => {
    const context = useContext(UserContext)
    if (!context) throw new Error('useUser must be used within a UserProvider')
    return context
}