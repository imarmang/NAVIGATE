import { createContext, useContext, useState, useEffect } from 'react'
import { getMe } from '../services/api'

const AuthContext = createContext()

export function AuthProvider({ children }) {
    const [student, setStudent] = useState(null)
    const [loading, setLoading] = useState(true)

    // Check if user is already logged in on app load
    useEffect(() => {
        const token = localStorage.getItem('access_token')
        if (token) {
            getMe()
                .then(res => setStudent(res.data))
                .catch(() => localStorage.removeItem('access_token'))
                .finally(() => setLoading(false))
        } else {
            setLoading(false)
        }
    }, [])

    const login = (token, studentData) => {
        localStorage.setItem('access_token', token)
        setStudent(studentData)
    }

    const logout = () => {
        localStorage.removeItem('access_token')
        setStudent(null)
    }

    return (
        <AuthContext.Provider value={{ student, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    return useContext(AuthContext)
}