import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getBookedSlots, createAppointment } from '../services/api'
import { useData } from '../hooks/useData'
import '../styles/CreateAppointment.css'

// Hardcoded instructors per course — replace with API call once Staff model is built
const INSTRUCTORS = {
    'COP3530': [
        { name: 'Dr. Simmonds',   email: 'simmonds@nova.edu',      role: 'Professor' },
        { name: 'Alex Rivera',    email: 'arivera@mynsu.nova.edu',  role: 'SI'        },
    ],
    'COP3337': [
        { name: 'Dr. Leinecker', email: 'leinecker@nova.edu',      role: 'Professor' },
        { name: 'Maria Chen',    email: 'mchen@mynsu.nova.edu',     role: 'SI'        },
    ],
    'MAD2104': [
        { name: 'Dr. Chikkamath', email: 'chikkamath@nova.edu',    role: 'Professor' },
        { name: 'Jordan Lee',     email: 'jlee@mynsu.nova.edu',     role: 'SI'        },
    ],
}

// Generate 30-min slots 8:00 AM – 5:30 PM
const generateTimeSlots = () => {
    const slots = []
    for ( let hour = 8; hour <= 17; hour++ ) {
        for ( let min = 0; min < 60; min += 30 ) {
            if ( hour === 17 && min === 30 ) break
            const h       = hour.toString().padStart( 2, '0' )
            const m       = min.toString().padStart( 2, '0' )
            const value   = `${ h }:${ m }`
            const display = new Date( `2000-01-01T${ value }` )
                .toLocaleTimeString( [], { hour: 'numeric', minute: '2-digit' } )
            slots.push( { value, display } )
        }
    }
    return slots
}

const TIME_SLOTS = generateTimeSlots()

const isWeekday = ( dateStr ) => {
    const day = new Date( dateStr + 'T12:00:00' ).getDay()
    return day !== 0 && day !== 6
}

const getMinDate = () => {
    const today = new Date()
    const day   = today.getDay()
    if ( day === 6 ) today.setDate( today.getDate() + 2 )
    if ( day === 0 ) today.setDate( today.getDate() + 1 )
    today.setMinutes( today.getMinutes() - today.getTimezoneOffset() )
    return today.toISOString().split( 'T' )[ 0 ]
}

function CreateAppointment( { onAppointmentCreated, onClose } ) {
    const { courses }                                           = useData()
    const navigate                                              = useNavigate()

    const [ selectedCourse, setSelectedCourse ]                 = useState( null )
    const [ selectedInstructor, setSelectedInstructor ]         = useState( null )
    const [ selectedDate, setSelectedDate ]                     = useState( '' )
    const [ selectedTime, setSelectedTime ]                     = useState( '' )
    const [ message, setMessage ]                               = useState( '' )
    const [ bookedSlots, setBookedSlots ]                       = useState( [] )
    const [ loadingSlots, setLoadingSlots ]                     = useState( false )
    const [ showConfirm, setShowConfirm ]                       = useState( false )
    const [ submitting, setSubmitting ]                         = useState( false )
    const [ error, setError ]                                   = useState( '' )

    const instructorsForCourse = selectedCourse
        ? ( INSTRUCTORS[ selectedCourse.course_id ] || [] )
        : []

    // Fetch booked slots when instructor + date are both selected
    useEffect( () => {
        if ( !selectedInstructor || !selectedDate ) return

        setLoadingSlots( true )
        setSelectedTime( '' )

        getBookedSlots( selectedInstructor.email, selectedDate )
            .then( res => setBookedSlots( res.data.booked_slots ) )
            .catch( () => setBookedSlots( [] ) )
            .finally( () => setLoadingSlots( false ) )

    }, [ selectedInstructor, selectedDate ] )

    const handleCourseSelect = ( course ) => {
        setSelectedCourse( course )
        setSelectedInstructor( null )
        setSelectedDate( '' )
        setSelectedTime( '' )
        setBookedSlots( [] )
        setError( '' )
    }

    const handleInstructorSelect = ( instructor ) => {
        setSelectedInstructor( instructor )
        setSelectedDate( '' )
        setSelectedTime( '' )
        setBookedSlots( [] )
    }

    const handleDateChange = ( e ) => {
        const val = e.target.value
        if ( !isWeekday( val ) ) {
            setError( 'Please select a weekday (Monday – Friday)' )
            setSelectedDate( '' )
            return
        }
        setError( '' )
        setSelectedDate( val )
        setSelectedTime( '' )
    }

    const handleSubmit = async () => {
        setSubmitting( true )
        setError( '' )

        try {
            await createAppointment( {
                course:           selectedCourse.course_id,
                subject:          selectedCourse.subject,
                tutor_name:       selectedInstructor.name,
                tutor_email:      selectedInstructor.email,
                appointment_date: `${ selectedDate }T${ selectedTime }`,
                message:          message.trim()
            } )
            onAppointmentCreated()
        } catch ( err ) {
            setError( err.response?.data?.message || 'Failed to book appointment' )
            setShowConfirm( false )
        } finally {
            setSubmitting( false )
        }
    }

    const canShowInstructor = !!selectedCourse
    const canShowDate       = !!selectedInstructor
    const canShowTime       = !!selectedDate && !error
    const canShowMessage    = !!selectedTime
    const canConfirm        = !!selectedTime

    // No courses enrolled
    if ( courses.length === 0 ) {
        return (
            <div className='ca-wrapper'>
                <div className='ca-header'>
                    <h3 className='ca-title'>New Appointment</h3>
                    { onClose && <button className='ca-close' onClick={onClose}>✕</button> }
                </div>
                <div className='ca-no-courses'>
                    <p className='ca-no-courses-text'>
                        You have no courses enrolled. Add your courses before booking a session.
                    </p>
                    <button
                        className='ca-no-courses-btn'
                        onClick={ () => { if ( onClose ) onClose(); navigate( '/courses' ) } }
                    >
                        Go to Courses
                    </button>
                </div>
            </div>
        )
    }

    // Confirmation screen
    if ( showConfirm ) {
        return (
            <div className='ca-wrapper'>
                <div className='ca-header'>
                    <h3 className='ca-title'>Confirm Appointment</h3>
                </div>
                <div className='ca-confirm'>
                    <div className='ca-confirm-row'>
                        <span className='ca-confirm-label'>Course</span>
                        <span className='ca-confirm-value'>{ selectedCourse.subject } { selectedCourse.course_id }</span>
                    </div>
                    <div className='ca-confirm-row'>
                        <span className='ca-confirm-label'>{ selectedInstructor.role }</span>
                        <span className='ca-confirm-value'>{ selectedInstructor.name }</span>
                    </div>
                    <div className='ca-confirm-row'>
                        <span className='ca-confirm-label'>Date</span>
                        <span className='ca-confirm-value'>{ selectedDate }</span>
                    </div>
                    <div className='ca-confirm-row'>
                        <span className='ca-confirm-label'>Time</span>
                        <span className='ca-confirm-value'>
                            { TIME_SLOTS.find( s => s.value === selectedTime )?.display }
                        </span>
                    </div>
                    <div className='ca-confirm-row'>
                        <span className='ca-confirm-label'>Duration</span>
                        <span className='ca-confirm-value'>30 minutes</span>
                    </div>
                    { message && (
                        <div className='ca-confirm-row'>
                            <span className='ca-confirm-label'>Message</span>
                            <span className='ca-confirm-value ca-confirm-message'>{ message }</span>
                        </div>
                    ) }
                </div>

                { error && <p className='ca-error'>{ error }</p> }

                <div className='ca-confirm-actions'>
                    <button
                        className='ca-btn-back'
                        onClick={ () => setShowConfirm( false ) }
                        disabled={submitting}
                    >
                        ← Edit
                    </button>
                    <button
                        className='ca-btn-confirm'
                        onClick={handleSubmit}
                        disabled={submitting}
                    >
                        { submitting ? 'Booking...' : 'Confirm Booking' }
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className='ca-wrapper'>
            <div className='ca-header'>
                <h3 className='ca-title'>New Appointment</h3>
                { onClose && <button className='ca-close' onClick={onClose}>✕</button> }
            </div>

            { error && <p className='ca-error'>{ error }</p> }

            {/* Step 1 — Course */}
            <div className='ca-step'>
                <p className='ca-step-label'>
                    <span className='ca-step-num'>1</span> Select a course
                </p>
                <div className='ca-options'>
                    { courses.map( course => (
                        <button
                            key={course.id}
                            className={`ca-option-btn ${ selectedCourse?.id === course.id ? 'active' : '' }`}
                            onClick={ () => handleCourseSelect( course ) }
                        >
                            { course.subject } { course.course_id }
                        </button>
                    ) ) }
                </div>
            </div>

            {/* Step 2 — Instructor */}
            { canShowInstructor && (
                <div className='ca-step'>
                    <p className='ca-step-label'>
                        <span className='ca-step-num'>2</span> Select a Professor or SI
                    </p>
                    { instructorsForCourse.length === 0 ? (
                        <p className='ca-step-empty'>No instructors available for this course yet.</p>
                    ) : (
                        <div className='ca-options'>
                            { instructorsForCourse.map( instructor => (
                                <button
                                    key={instructor.email}
                                    className={`ca-option-btn instructor ${ selectedInstructor?.email === instructor.email ? 'active' : '' }`}
                                    onClick={ () => handleInstructorSelect( instructor ) }
                                >
                                    <span className='ca-instructor-name'>{ instructor.name }</span>
                                    <span className={`ca-instructor-role ${ instructor.role === 'SI' ? 'si' : 'prof' }`}>
                                        { instructor.role }
                                    </span>
                                </button>
                            ) ) }
                        </div>
                    ) }
                </div>
            ) }

            {/* Step 3 — Date */}
            { canShowDate && (
                <div className='ca-step'>
                    <p className='ca-step-label'>
                        <span className='ca-step-num'>3</span> Select a date
                        <span className='ca-step-hint'>Monday – Friday only</span>
                    </p>
                    <input
                        type='date'
                        value={selectedDate}
                        onChange={handleDateChange}
                        min={ getMinDate() }
                        className='ca-date-input'
                    />
                </div>
            ) }

            {/* Step 4 — Time */}
            { canShowTime && (
                <div className='ca-step'>
                    <p className='ca-step-label'>
                        <span className='ca-step-num'>4</span> Select a time
                        <span className='ca-step-hint'>30-min sessions · 8:00 AM – 5:30 PM</span>
                    </p>
                    { loadingSlots ? (
                        <p className='ca-step-empty'>Loading availability...</p>
                    ) : (
                        <div className='ca-time-grid'>
                            { TIME_SLOTS.map( slot => {
                                const isBooked   = bookedSlots.includes( slot.value )
                                const isSelected = selectedTime === slot.value
                                return (
                                    <button
                                        key={slot.value}
                                        disabled={isBooked}
                                        className={`ca-time-btn ${ isSelected ? 'active' : '' } ${ isBooked ? 'booked' : '' }`}
                                        onClick={ () => !isBooked && setSelectedTime( slot.value ) }
                                    >
                                        { slot.display }
                                    </button>
                                )
                            } ) }
                        </div>
                    ) }
                </div>
            ) }

            {/* Step 5 — Message */}
            { canShowMessage && (
                <div className='ca-step'>
                    <p className='ca-step-label'>
                        <span className='ca-step-num'>5</span> Message
                        <span className='ca-step-hint'>Optional</span>
                    </p>
                    <textarea
                        value={message}
                        onChange={ e => setMessage( e.target.value ) }
                        placeholder='What do you need help with?'
                        className='ca-textarea'
                        rows={3}
                    />
                </div>
            ) }

            {/* Review button */}
            { canConfirm && (
                <div className='ca-actions'>
                    <button
                        className='ca-btn-continue'
                        onClick={ () => setShowConfirm( true ) }
                    >
                        Review Booking →
                    </button>
                </div>
            ) }
        </div>
    )
}

export default CreateAppointment