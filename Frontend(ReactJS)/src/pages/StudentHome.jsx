import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.js'
import { useData } from '../hooks/useData.js'
import CreateAppointment from '../components/CreateAppointment'
import StudentNavbar from '../components/navbar/StudentNavbar'
import '../styles/StudentHome.css'
import nsuBackground from '../assets/nsuBackground.jpeg'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCalendarXmark, faBookOpen, faClockRotateLeft, faPlus } from '@fortawesome/free-solid-svg-icons'
import LoadingScreen from "../components/LoadingScreen.jsx";

function StudentHome() {
    const { logout }                                                    = useAuth()
    const { student, appointments, courses, loading, fetchAll,
            refreshAppointments }                                       = useData()
    const navigate                                                      = useNavigate()
    const [ showForm, setShowForm ]                                     = useState( false )

    useEffect( () => {
        fetchAll().catch( () => {
            logout()
            navigate( '/login' )
        } )
    }, [] )

    const handleLogout = () => {
        logout()
        navigate( '/login' )
    }

    const upcomingAppointments = appointments
        .filter( a => new Date( a.appointment_date ) >= new Date() )
        .sort( ( a, b ) => new Date( a.appointment_date ) - new Date( b.appointment_date ) )
        .slice( 0, 3 )

    const pastAppointments = appointments
        .filter( a => new Date( a.appointment_date ) < new Date() )
        .sort( ( a, b ) => new Date( b.appointment_date ) - new Date( a.appointment_date ) )

    if ( loading ) return <LoadingScreen message="Logging you in..." />

    return (
        <div className='home-wrapper'>

            <StudentNavbar student={student} onLogout={handleLogout} />

           {/* Hero */}
            <div className='home-hero' style={{ backgroundImage: `url(${nsuBackground})` }}>
                <div className='home-hero-overlay' />
                <div className='home-hero-content'>
                    <h1 className='home-hero-title'>
                        Welcome back, {student?.first_name}!
                    </h1>
                    <p className='home-hero-sub'>
                        Here is your academic dashboard for { new Date().toLocaleString('default', { month: 'long', year: 'numeric' } ) }.
                    </p>
                </div>
                <div className='home-hero-stats'>
                    <div className='home-hero-stat'>
                        <span className='home-hero-stat-number'>{upcomingAppointments.length}</span>
                        <span className='home-hero-stat-label'>Upcoming</span>
                    </div>
                    <div className='home-hero-stat'>
                        <span className='home-hero-stat-number'>{courses.length}</span>
                        <span className='home-hero-stat-label'>Courses</span>
                    </div>
                    <div className='home-hero-stat'>
                        <span className='home-hero-stat-number'>{pastAppointments.length}</span>
                        <span className='home-hero-stat-label'>Completed</span>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className='home-content'>

                <div className='create-appointment-wrapper'>
                    <button
                        className='btn-make-appointment'
                        onClick={() => setShowForm( !showForm )}
                    >
                        <FontAwesomeIcon icon={faPlus} style={{ marginRight: '8px' }} />
                        Make an Appointment
                    </button>
                    {showForm && <CreateAppointment onAppointmentCreated={() => {
                        refreshAppointments()
                        setShowForm( false )
                    }} />}
                </div>

                <div className='home-two-col'>

                    {/* Upcoming Appointments */}
                    <div className='home-card'>
                        <div className='home-card-header'>
                            <h2 className='home-card-title'>Upcoming Appointments</h2>
                        </div>
                        {upcomingAppointments.length === 0 ? (
                           <div className='home-empty'>
                               <FontAwesomeIcon icon={faCalendarXmark} className='home-empty-fa-icon' />
                               <p className='home-empty-text'>No upcoming appointments.</p>
                           </div>
                        ) : (
                            upcomingAppointments.map( appointment => (
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
                                            {appointment.tutor_name}
                                        </p>
                                    </div>
                                    <span className='appointment-time-badge'>
                                        {new Date(appointment.appointment_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                            ))
                        )}
                    </div>

                    {/* My Courses */}
                    <div className='home-card'>
                        <div className='home-card-header'>
                            <h2 className='home-card-title'>My Courses</h2>
                        </div>
                        {courses.length === 0 ? (
                            <div className='home-empty'>
                                <FontAwesomeIcon icon={faBookOpen} className='home-empty-fa-icon' />
                                <p className='home-empty-text'>No courses enrolled yet.</p>
                            </div>
                        ) : (
                            courses.map( course => (
                                <div key={course.id} className='course-item'>
                                    <div className='course-icon'>
                                        {course.subject.slice(0, 2)}
                                    </div>
                                    <p className='course-name'>
                                        {course.subject} {course.course_id}
                                    </p>
                                </div>
                            ))
                        )}
                    </div>

                </div>

                {/* Appointment History */}
                <div className='home-card'>
                    <div className='home-card-header'>
                        <h2 className='home-card-title'>Appointment History</h2>
                    </div>
                    {pastAppointments.length === 0 ? (
                        <div className='home-empty'>
                            <FontAwesomeIcon icon={faClockRotateLeft} className='home-empty-fa-icon' />
                            <p className='home-empty-text'>No past appointments yet.</p>
                        </div>
                    ) : (
                        pastAppointments.map( appointment => (
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
                                        {appointment.tutor_name}
                                    </p>
                                </div>
                                {appointment.message && (
                                    <span style={{ fontSize: '12px', color: '#506B90', fontStyle: 'italic' }}>
                                        "{appointment.message}"
                                    </span>
                                )}
                            </div>
                        ))
                    )}
                </div>

            </div>
        </div>
    )
}

export default StudentHome