import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function ProtectedRoute({ children }) {
    const { student, loading } = useAuth()

    if (loading) return null

    if (!student) return <Navigate to='/login' />

    return children
}

export default ProtectedRoute