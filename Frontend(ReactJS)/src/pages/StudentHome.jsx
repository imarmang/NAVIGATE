import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getMe, getAppointments, getStudentCourses } from '../services/api'
import Calendar from '../components/Calendar'
import CreateAppointment from '../components/CreateAppointment'
import StudentNavbar from '../components/navbar/StudentNavbar'
import '../styles/StudentHome.css'

function StudentHome() {
    const { logout } = useAuth()
    const navigate = useNavigate()
    const [student, setStudent] = useState(null)
    const [appointments, setAppointments] = useState([])
    const [courses, setCourses] = useState([])
    const [loading, setLoading] = useState(true)

    const fetchAppointments = () => {
        getAppointments()
            .then(res => setAppointments(res.data))
    }

    useEffect(() => {
        getMe()
            .then(res => setStudent(res.data))
            .catch(() => {
                logout()
                navigate('/login')
            })

        fetchAppointments()

        getStudentCourses()
            .then(res => setCourses(res.data))
            .finally(() => setLoading(false))
    }, [])

    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    const upcomingAppointments = appointments
        .filter(a => new Date(a.appointment_date) >= new Date())
        .sort((a, b) => new Date(a.appointment_date) - new Date(b.appointment_date))
        .slice(0, 3)

    const pastAppointments = appointments
        .filter(a => new Date(a.appointment_date) < new Date())
        .sort((a, b) => new Date(b.appointment_date) - new Date(a.appointment_date))

    if (loading) return <p>Loading...</p>

    return (
        <div className='home-wrapper'>

            <StudentNavbar student={student} onLogout={handleLogout} />

            <div className='home-content'>
                <h1 className='home-welcome'>
                    Welcome back, {student?.first_name}!
                </h1>
                <p className='home-welcome-sub'>
                    Here is your academic dashboard.
                </p>

                <CreateAppointment onAppointmentCreated={fetchAppointments} />

                {/* Three column widget row */}
                <div className='home-widgets-grid'>

                    {/* Upcoming Appointments */}
                    <div className='home-card'>
                        <h2 className='home-card-title'>Upcoming Appointments</h2>
                        {upcomingAppointments.length === 0 ? (
                            <p className='home-empty-text'>No upcoming appointments.</p>
                        ) : (
                            upcomingAppointments.map(appointment => (
                                <div key={appointment.id} className='appointment-item'>
                                    <div className='appointment-date-badge'>
                                        <span className='appointment-month'>
                                            {new Date(appointment.appointment_date).toLocaleString('default', { month: 'short' })}
                                        </span>
                                        <span className='appointment-day'>
                                            {new Date(appointment.appointment_date).getDate()}
                                        </span>
                                    </div>
                                    <div className='appointment-info'>
                                        <p className='appointment-course'>
                                            {appointment.subject} {appointment.course}
                                        </p>
                                        <p className='appointment-tutor'>
                                            {appointment.tutor_name} · {new Date(appointment.appointment_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Enrolled Courses */}
                    <div className='home-card'>
                        <h2 className='home-card-title'>My Courses</h2>
                        {courses.length === 0 ? (
                            <p className='home-empty-text'>No courses enrolled.</p>
                        ) : (
                            courses.map(course => (
                                <div key={course.id} className='course-item'>
                                    <div className='course-icon'>
                                        {course.subject.slice(0, 2)}
                                    </div>
                                    <div>
                                        <p className='course-name'>
                                            {course.subject} {course.course_id}
                                        </p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Appointment History */}
                    <div className='home-card'>
                        <h2 className='home-card-title'>Appointment History</h2>
                        {pastAppointments.length === 0 ? (
                            <p className='home-empty-text'>No past appointments.</p>
                        ) : (
                            pastAppointments.map(appointment => (
                                <div key={appointment.id} className='history-item'>
                                    <div className='history-info'>
                                        <p className='history-course'>
                                            {appointment.subject} {appointment.course}
                                        </p>
                                        <p className='history-date'>
                                            {new Date(appointment.appointment_date).toLocaleDateString()}
                                        </p>
                                    </div>
                                    {appointment.message && (
                                        <p className='history-message'>"{appointment.message}"</p>
                                    )}
                                </div>
                            ))
                        )}
                    </div>

                </div>

                {/* Calendar */}
                <div className='home-card'>
                    <h2 className='home-card-title'>Your Calendar</h2>
                    <Calendar appointments={appointments} />
                </div>

            </div>
        </div>
    )
}

export default StudentHome