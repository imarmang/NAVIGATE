import { useState, useEffect } from 'react'
import { updateMessage } from '../services/api'

function AppointmentModal({ appointment, onClose }) {
    const [message, setMessage] = useState(appointment.message || '')
    const [saving, setSaving] = useState(false)

    const appDate = new Date(appointment.appointment_date)
    const date = appDate.toISOString().split('T')[0]
    const time = appDate.toTimeString().slice(0, 5)

    const handleSaveMessage = async () => {
        setSaving(true)
        try {
            await updateMessage(appointment.id, { message })
        } catch (err) {
            console.error('Failed to save message')
        } finally {
            setSaving(false)
        }
    }

    return (
        <div className='modal-overlay'>
            <div className='modal-box'>
                <p>Appointment Details</p>
                <p>{appointment.subject} - {appointment.course}</p>
                <p>Date: {date}</p>
                <p>Time: {time}</p>
                <p>Tutor: {appointment.tutor_name}</p>
                <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder='Add a message...'
                />
                <div>
                    <button onClick={handleSaveMessage} disabled={saving}>
                        {saving ? 'Saving...' : 'Save Message'}
                    </button>
                    <button onClick={onClose}>Close</button>
                </div>
            </div>
        </div>
    )
}

export default AppointmentModal