import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

export function AuthProvider({ children }) {
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        setLoading(false)
    }, [])

    const login = (token) => {
        localStorage.setItem('access_token', token)
    }

    const logout = () => {
        localStorage.removeItem('access_token')
    }

    const isLoggedIn = () => !!localStorage.getItem('access_token')

    return (
        <AuthContext.Provider value={{ loading, login, logout, isLoggedIn }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    return useContext(AuthContext)
}