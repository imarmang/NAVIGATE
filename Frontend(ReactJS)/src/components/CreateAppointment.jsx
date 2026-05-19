import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getStudentCourses, getBookedSlots, getStaffByCourse, getAppointments, createAppointment } from '../services/api'
import '../styles/CreateAppointment.css'

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
    const navigate = useNavigate()

    const [ selectedCourse, setSelectedCourse ]         = useState( null )
    const [ selectedInstructor, setSelectedInstructor ] = useState( null )
    const [ selectedDate, setSelectedDate ]             = useState( '' )
    const [ selectedTime, setSelectedTime ]             = useState( '' )
    const [ message, setMessage ]                       = useState( '' )
    const [ showConfirm, setShowConfirm ]               = useState( false )
    const [ submitting, setSubmitting ]                 = useState( false )
    const [ error, setError ]                           = useState( '' )

    // Enrolled courses
    const { data: courses = [] } = useQuery( {
        queryKey:  [ 'my-courses' ],
        queryFn:   () => getStudentCourses().then( res => res.data ),
        staleTime: Infinity,
    } )

    // Staff for selected course
    const { data: instructorsForCourse = [], isLoading: loadingInstructors } = useQuery( {
        queryKey:  [ 'staff', selectedCourse?.id ],
        queryFn:   () => getStaffByCourse( selectedCourse.id ).then( res => res.data ),
        enabled:   !!selectedCourse,
        staleTime: Infinity,
    } )

    // Instructor's booked slots for selected date — always fresh
    const { data: bookedSlotsData = [], isLoading: loadingSlots } = useQuery( {
        queryKey:  [ 'booked-slots', selectedInstructor?.email, selectedDate ],
        queryFn:   () => getBookedSlots( selectedInstructor.email, selectedDate )
                            .then( res => res.data.booked_slots ),
        enabled:   !!selectedInstructor && !!selectedDate,
        staleTime: 0,
        refetchInterval: 30000,
    } )

    // Student's own appointments — to block their own taken slots
    const { data: myAppointments = [] } = useQuery( {
        queryKey:  [ 'appointments' ],
        queryFn:   () => getAppointments().then( res => res.data ),
        staleTime: 5 * 60 * 1000,
    } )

    // Student's own booked slots on the selected date
    const myBookedSlots = selectedDate
        ? myAppointments
            .filter( a => a.appointment_date.split( 'T' )[ 0 ] === selectedDate )
            .map( a => a.appointment_date.split( 'T' )[ 1 ].slice( 0, 5 ) )
        : []

    const handleCourseSelect = ( course ) => {
        setSelectedCourse( course )
        setSelectedInstructor( null )
        setSelectedDate( '' )
        setSelectedTime( '' )
        setError( '' )
    }

    const handleInstructorSelect = ( instructor ) => {
        setSelectedInstructor( instructor )
        setSelectedDate( '' )
        setSelectedTime( '' )
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
                tutor_name:       `${ selectedInstructor.first_name } ${ selectedInstructor.last_name }`,
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
                        <span className='ca-confirm-value'>{ selectedInstructor.first_name } { selectedInstructor.last_name }</span>
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
                    { loadingInstructors ? (
                        <p className='ca-step-empty'>Loading instructors...</p>
                    ) : instructorsForCourse.length === 0 ? (
                        <p className='ca-step-empty'>No instructors available for this course yet.</p>
                    ) : (
                        <div className='ca-options'>
                            { instructorsForCourse.map( instructor => (
                                <button
                                    key={instructor.email}
                                    className={`ca-option-btn instructor
                                        ${ selectedInstructor?.email === instructor.email ? 'active' : '' }
                                        ${ selectedInstructor?.email === instructor.email && instructor.role === 'SI' ? 'si-selected' : '' }
                                    `}                                    onClick={ () => handleInstructorSelect( instructor ) }
                                >
                                    <span className='ca-instructor-name'>{ instructor.first_name } { instructor.last_name }</span>
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
                                const isBooked   = bookedSlotsData.includes( slot.value ) || myBookedSlots.includes( slot.value )
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