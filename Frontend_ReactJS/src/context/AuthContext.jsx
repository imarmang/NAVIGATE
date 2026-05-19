import { createContext, useState, useEffect, useRef } from 'react'
import { logoutStudent } from '../services/api'

export const AuthContext = createContext()

export function AuthProvider( { children, queryClient } ) {
    const [ loading, setLoading ]   = useState( true )

    useEffect( () => {
        setLoading( false )
    }, [] )

    const login = ( token, nNumber ) => {
        localStorage.setItem( 'access_token', token )
        localStorage.setItem( 'n_number', nNumber )
    }

    const logout = async () => {
        try {
            await logoutStudent()
        } catch ( err ) {
            console.error( 'Logout API call failed:', err )
        } finally {
            localStorage.removeItem( 'access_token' )
            localStorage.removeItem( 'n_number' )
            queryClient.clear()
        }
    }

    const isLoggedIn = () => !!localStorage.getItem( 'access_token' )

    return (
        <AuthContext.Provider value={{ loading, login, logout, isLoggedIn }}>
            { children }
        </AuthContext.Provider>
    )
}