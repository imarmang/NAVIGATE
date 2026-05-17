import { createContext, useContext, useState, useEffect, useRef } from 'react'

const AuthContext = createContext()

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

    const logout = () => {
        localStorage.removeItem( 'access_token' )
        localStorage.removeItem( 'n_number' )
        if ( clearCacheRef.current ) clearCacheRef.current()
    }

    const isLoggedIn = () => !!localStorage.getItem( 'access_token' )

    return (
        <AuthContext.Provider value={{ loading, login, logout, isLoggedIn, registerClearCache }}>
            { children }
        </AuthContext.Provider>
    )
}

export function useAuth() {
    return useContext( AuthContext )
}