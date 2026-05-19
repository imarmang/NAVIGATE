import { useState } from 'react'
import { deleteAppointment } from '../services/api'
import '../styles/AppointmentModal.css'

function AppointmentModal( { appointment, onClose, onDeleted, isPast } ) {
    const [ confirmDelete, setConfirmDelete ] = useState( false )
    const [ deleting, setDeleting ]           = useState( false )
    const [ error, setError ]                 = useState( '' )

    const [ date, time ] = appointment.appointment_date.split( 'T' )
    const message                      = appointment.message

    const handleDelete = async () => {
        if ( !confirmDelete ) {
            setConfirmDelete( true )
            return
        }

        setDeleting( true )

        try {
            await deleteAppointment( appointment.id )
            onDeleted()
        } catch ( err ) {
            setError( 'Failed to cancel appointment. Please try again.' )
            setDeleting( false )
            setConfirmDelete( false )
        }
    }

    return (
        <div className='modal-overlay' onClick={onClose}>
            <div className='modal-box' onClick={ e => e.stopPropagation() }>

                <div className='modal-header'>
                    <h3 className='modal-title'>{ appointment.subject } { appointment.course }</h3>
                    <button className='modal-close-btn' onClick={onClose}>✕</button>
                </div>

                <div className='modal-details'>
                    <div className='modal-detail-row'>
                        <span className='modal-detail-label'>Instructor</span>
                        <span className='modal-detail-value'>{ appointment.tutor_name }</span>
                    </div>
                    <div className='modal-detail-row'>
                        <span className='modal-detail-label'>Date</span>
                        <span className='modal-detail-value'>{ date }</span>
                    </div>
                    <div className='modal-detail-row'>
                        <span className='modal-detail-label'>Time</span>
                        <span className='modal-detail-value'>{ time }</span>
                    </div>
                    { message && (
                    <div className='modal-detail-row'>
                        <span className='modal-detail-label'>Message</span>
                        <span className='modal-detail-value modal-detail-message'>{ message }</span>
                    </div>
                    ) }
                </div>

                { error && <p className='modal-error'>{ error }</p> }
                { !isPast && (
                    <div className='modal-actions'>
                        { confirmDelete ? (
                            <div className='modal-confirm-delete'>
                                <span className='modal-confirm-text'>Cancel this appointment?</span>
                                <button
                                    className='modal-btn-confirm-yes'
                                    onClick={handleDelete}
                                    disabled={deleting}
                                >
                                    { deleting ? 'Cancelling...' : 'Yes, cancel it' }
                                </button>
                                <button
                                    className='modal-btn-confirm-no'
                                    onClick={ () => setConfirmDelete( false ) }
                                >
                                    No
                                </button>
                            </div>
                        ) : (
                            <button
                                className='modal-btn-delete'
                                onClick={handleDelete}
                            >
                                Cancel Appointment
                            </button>
                        ) }
                    </div>
                )}
            </div>
        </div>
    )
}

export default AppointmentModal