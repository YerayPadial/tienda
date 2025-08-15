import { createContext, useContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'

type User = {
    id: number
    name: string
    email: string
}

type UserContextType = {
    user: User | null
    login: (user: User) => void
    logout: () => void
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null)

    useEffect(() => {
        const stored = localStorage.getItem('user')
        if (stored) {
            setUser(JSON.parse(stored))
        }
    }, [])

    const login = (user: User) => {
        console.log('UserContext - Login called with:', user)
        setUser(user)
        localStorage.setItem('user', JSON.stringify(user))
    }

    const logout = () => {
        console.log('UserContext - Logout called')
        setUser(null)
        localStorage.removeItem('user')
    }

    return (
        <UserContext.Provider value={{ user, login, logout }}>
            {children}
        </UserContext.Provider>
    )
}

export const useUser = () => {
    const context = useContext(UserContext)
    if (!context) throw new Error('useUser must be used within a UserProvider')
    return context
}