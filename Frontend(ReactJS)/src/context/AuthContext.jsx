import { createContext, useState, useEffect, useRef } from 'react'
import { logoutStudent } from '../services/api'

export const AuthContext = createContext()

export function AuthProvider( { children } ) {
    const [ loading, setLoading ]   = useState( true )
    const clearCacheRef             = useRef( null )

    useEffect( () => {
        setLoading( false )
    }, [] )

    // Called by DataProvider to register its clearCache function
    const registerClearCache = ( fn ) => {
        clearCacheRef.current = fn
    }

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
            if ( clearCacheRef.current ) clearCacheRef.current()
        }
    }

    const isLoggedIn = () => !!localStorage.getItem( 'access_token' )

    return (
        <AuthContext.Provider value={{ loading, login, logout, isLoggedIn, registerClearCache }}>
            { children }
        </AuthContext.Provider>
    )
}