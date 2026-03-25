import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getMe, getAppointments } from '../services/api'
import Calendar from '../components/Calendar'

function StudentHome() {
    const { logout } = useAuth()
    const navigate = useNavigate()
    const [student, setStudent] = useState(null)
    const [appointments, setAppointments] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        getMe()
            .then(res => setStudent(res.data))
            .catch(() => {
                logout()
                navigate('/login')
            })

        getAppointments()
            .then(res => setAppointments(res.data))
            .finally(() => setLoading(false))
    }, [])

    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    if (loading) return <p>Loading...</p>

    return (
        <div>
            <h1>Welcome, {student?.first_name}!</h1>
            <button onClick={handleLogout}>Logout</button>
            <Calendar appointments={appointments} />
        </div>
    )
}

export default StudentHome