import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.js'

function ProtectedRoute({ children }) {
    const { loading, isLoggedIn } = useAuth()

    if (loading) return null

    if (!isLoggedIn()) return <Navigate to='/login' />

    return children
}

export default ProtectedRoute