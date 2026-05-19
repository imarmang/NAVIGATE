import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useAuth } from '../hooks/useAuth'
import { getMe, getAppointments, getStudentCourses } from '../services/api'
import StudentNavbar from '../components/navbar/StudentNavbar'
import LoadingScreen from '../components/LoadingScreen'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCalendar, faBookOpen, faEnvelope, faIdCard } from '@fortawesome/free-solid-svg-icons'
import nsuBackground from '../assets/nsuBackground.jpeg'
import '../styles/StudentHome.css'

function StudentHome() {
    const { logout }    = useAuth()
    const navigate      = useNavigate()

    const { data: student, isLoading: loadingMe } = useQuery( {
        queryKey:  [ 'me' ],
        queryFn:   () => getMe().then( res => res.data ),
        staleTime: Infinity,
    } )

    const { data: appointments = [], isLoading: loadingAppts } = useQuery( {
        queryKey:  [ 'appointments' ],
        queryFn:   () => getAppointments().then( res => res.data ),
        staleTime: 5 * 60 * 1000,
    } )

    const { data: courses = [], isLoading: loadingCourses } = useQuery( {
        queryKey:  [ 'my-courses' ],
        queryFn:   () => getStudentCourses().then( res => res.data ),
        staleTime: Infinity,
    } )

    const handleLogout = async () => {
        await logout()
        navigate( '/login' )
    }

    const upcomingCount = appointments.filter(
        a => new Date( a.appointment_date ) >= new Date()
    ).length

    const today = new Date().toLocaleDateString( 'en-US', {
        weekday: 'long',
        year:    'numeric',
        month:   'long',
        day:     'numeric'
    } )

    const initials = student
        ? `${ student.first_name?.[0] }${ student.last_name?.[0] }`
        : ''

    if ( loadingMe || loadingAppts || loadingCourses ) return <LoadingScreen message='Loading your dashboard...' />

    return (
        <div className='home-wrapper'>
            <StudentNavbar student={student} onLogout={handleLogout} />

            {/* Hero */}
            <div
                className='home-hero'
                style={{ backgroundImage: `url(${ nsuBackground })` }}
            >
                <div className='home-hero-overlay' />
                <div className='home-hero-content'>
                    <p className='home-hero-date'>{ today }</p>
                    <h1 className='home-hero-title'>
                        Welcome back, { student?.first_name }!
                    </h1>
                    <p className='home-hero-sub'>
                        Nova Southeastern University · College of Computing, AI, and Cybersecurity
                    </p>
                </div>
            </div>

            <div className='home-content'>

                {/* Profile card */}
                <div className='home-card'>
                    <div className='home-profile-top'>
                        <div className='home-avatar'>{ initials }</div>
                        <div className='home-avatar-info'>
                            <p className='home-avatar-name'>{ student?.first_name } { student?.last_name }</p>
                            <p className='home-avatar-sub'>Computer Science · NSU CCAC</p>
                        </div>
                    </div>

                    <div className='home-profile-divider' />

                    <div className='home-profile-grid'>
                        <div className='home-profile-row'>
                            <FontAwesomeIcon icon={faIdCard} className='home-profile-icon' />
                            <div>
                                <p className='home-profile-label'>N-Number</p>
                                <p className='home-profile-value'>{ student?.n_number }</p>
                            </div>
                        </div>
                        <div className='home-profile-row'>
                            <FontAwesomeIcon icon={faEnvelope} className='home-profile-icon' />
                            <div>
                                <p className='home-profile-label'>Email</p>
                                <p className='home-profile-value'>{ student?.email }</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stat cards */}
                <div className='home-stats-grid'>
                    <div
                        className='home-stat-card'
                        onClick={ () => navigate( '/appointments' ) }
                    >
                        <div className='home-stat-icon appointments'>
                            <FontAwesomeIcon icon={faCalendar} />
                        </div>
                        <div className='home-stat-info'>
                            <span className='home-stat-number'>{ upcomingCount }</span>
                            <span className='home-stat-label'>Upcoming Appointments</span>
                        </div>
                        <span className='home-stat-link'>View all →</span>
                    </div>

                    <div
                        className='home-stat-card'
                        onClick={ () => navigate( '/courses' ) }
                    >
                        <div className='home-stat-icon courses'>
                            <FontAwesomeIcon icon={faBookOpen} />
                        </div>
                        <div className='home-stat-info'>
                            <span className='home-stat-number'>{ courses.length }</span>
                            <span className='home-stat-label'>Enrolled Courses</span>
                        </div>
                        <span className='home-stat-link'>View all →</span>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default StudentHome