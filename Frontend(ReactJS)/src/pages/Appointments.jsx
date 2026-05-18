import {useEffect, useState} from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useData } from '../hooks/useData'
import StudentNavbar from '../components/navbar/StudentNavbar'
import Calendar from '../components/Calendar'
import CreateAppointment from '../components/CreateAppointment'
import AppointmentModal from '../components/AppointmentModal'
import LoadingScreen from '../components/LoadingScreen'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCalendarXmark, faPlus, faList, faCalendar } from '@fortawesome/free-solid-svg-icons'
import '../styles/Appointments.css'

function AppointmentsPage() {
    const { logout }                                    = useAuth()
    const { student, appointments, loading, fetchAll,
            refreshAppointments }                       = useData()
    const navigate                                      = useNavigate()

    const [ showForm, setShowForm ]                     = useState( false )
    const [ selectedAppointment, setSelectedAppointment ] = useState( null )
    const [ view, setView ]                             = useState( 'list' ) // 'list' | 'calendar'

    const handleLogout = async() => {
        await logout()
        navigate( '/login' )
    }

    const upcomingAppointments = appointments
        .filter( a => new Date( a.appointment_date ) >= new Date() )
        .sort( ( a, b ) => new Date( a.appointment_date ) - new Date( b.appointment_date ) )

    const pastAppointments = appointments
        .filter( a => new Date( a.appointment_date ) < new Date() )
        .sort( ( a, b ) => new Date( b.appointment_date ) - new Date( a.appointment_date ) )

    useEffect( () => {
        fetchAll().catch( () => {
            logout()
            navigate( '/login' )
        } )
    }, [] )

    if ( loading ) return <LoadingScreen message='Loading appointments...' />

    return (
        <div className='appointments-wrapper'>
            <StudentNavbar student={student} onLogout={handleLogout} />

            <div className='appointments-content'>

                {/* Header */}
                <div className='appointments-header'>
                    <div className='appointments-header-left'>
                        <h1 className='appointments-title'>Appointments</h1>
                        <p className='appointments-subtitle'>
                            { upcomingAppointments.length } upcoming · { pastAppointments.length } past
                        </p>
                    </div>
                    <div className='appointments-header-right'>

                        {/* View toggle */}
                        <div className='appointments-view-toggle'>
                            <button
                                className={`toggle-btn ${ view === 'list' ? 'active' : '' }`}
                                onClick={ () => setView( 'list' ) }
                            >
                                <FontAwesomeIcon icon={faList} />
                                <span>List</span>
                            </button>
                            <button
                                className={`toggle-btn ${ view === 'calendar' ? 'active' : '' }`}
                                onClick={ () => setView( 'calendar' ) }
                            >
                                <FontAwesomeIcon icon={faCalendar} />
                                <span>Calendar</span>
                            </button>
                        </div>

                        <button
                            className='appointments-new-btn'
                            onClick={ () => setShowForm( !showForm ) }
                        >
                            <FontAwesomeIcon icon={faPlus} />
                            New Appointment
                        </button>
                    </div>
                </div>

                {/* Create Appointment Form */}
                { showForm && (
                    <CreateAppointment onAppointmentCreated={ () => {
                        refreshAppointments()
                        setShowForm( false )
                    }} />
                )}

                {/* Calendar View */}
                { view === 'calendar' && (
                    <div className='appointments-card'>
                        <Calendar
                            appointments={appointments}
                            onAppointmentDeleted={ () => refreshAppointments() }
                        />
                    </div>
                )}

                {/* List View */}
                { view === 'list' && (
                    <>
                        {/* Upcoming */}
                        <div className='appointments-card'>
                            <h2 className='appointments-section-title'>Upcoming</h2>
                            { upcomingAppointments.length === 0 ? (
                                <div className='appointments-empty'>
                                    <FontAwesomeIcon icon={faCalendarXmark} className='appointments-empty-icon' />
                                    <p>No upcoming appointments.</p>
                                </div>
                            ) : (
                                <div className='appointments-list'>
                                    { upcomingAppointments.map( appointment => (
                                        <div
                                            key={appointment.id}
                                            className='appointment-row'
                                            onClick={ () => setSelectedAppointment( appointment ) }
                                        >
                                            <div className='appointment-row-badge'>
                                                <span className='appointment-row-month'>
                                                    { appointment.appointment_date.split( 'T' )[ 0 ].split( '-' )[ 1 ] }
                                                </span>
                                                <span className='appointment-row-day'>
                                                    { appointment.appointment_date.split( 'T' )[ 0 ].split( '-' )[ 2 ] }
                                                </span>
                                            </div>
                                            <div className='appointment-row-info'>
                                                <p className='appointment-row-course'>
                                                    { appointment.subject } { appointment.course }
                                                </p>
                                                <p className='appointment-row-tutor'>
                                                    { appointment.tutor_name }
                                                </p>
                                            </div>
                                            <span className='appointment-row-time'>
                                                { appointment.appointment_date.split( 'T' )[ 1 ] }
                                            </span>
                                            <span className='appointment-row-status upcoming'>Upcoming</span>
                                        </div>
                                    ) ) }
                                </div>
                            ) }
                        </div>

                        {/* Past */}
                        <div className='appointments-card'>
                            <h2 className='appointments-section-title'>Past</h2>
                            { pastAppointments.length === 0 ? (
                                <div className='appointments-empty'>
                                    <FontAwesomeIcon icon={faCalendarXmark} className='appointments-empty-icon' />
                                    <p>No past appointments.</p>
                                </div>
                            ) : (
                                <div className='appointments-list'>
                                    { pastAppointments.map( appointment => (
                                        <div
                                            key={appointment.id}
                                            className='appointment-row'
                                            onClick={ () => setSelectedAppointment( appointment ) }
                                        >
                                            <div className='appointment-row-badge past'>
                                                <span className='appointment-row-month'>
                                                    { appointment.appointment_date.split( 'T' )[ 0 ].split( '-' )[ 1 ] }
                                                </span>
                                                <span className='appointment-row-day'>
                                                    { appointment.appointment_date.split( 'T' )[ 0 ].split( '-' )[ 2 ] }
                                                </span>
                                            </div>
                                            <div className='appointment-row-info'>
                                                <p className='appointment-row-course'>
                                                    { appointment.subject } { appointment.course }
                                                </p>
                                                <p className='appointment-row-tutor'>
                                                    { appointment.tutor_name }
                                                </p>
                                            </div>
                                            <span className='appointment-row-time'>
                                                { appointment.appointment_date.split( 'T' )[ 1 ] }
                                            </span>
                                            <span className='appointment-row-status past'>Past</span>
                                        </div>
                                    ) ) }
                                </div>
                            ) }
                        </div>
                    </>
                ) }
            </div>

            {/* Modal */}
            { selectedAppointment && (
                <AppointmentModal
                    appointment={selectedAppointment}
                    onClose={ () => setSelectedAppointment( null ) }
                    onDeleted={ () => {
                        refreshAppointments()
                        setSelectedAppointment( null )
                    }}
                />
            )}
        </div>
    )
}

export default AppointmentsPage