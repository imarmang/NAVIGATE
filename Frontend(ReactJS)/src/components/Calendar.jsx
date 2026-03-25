import { useState } from 'react'
import AppointmentModal from './AppointmentModal'

function Calendar({ appointments }) {
    const [currentDate, setCurrentDate] = useState(new Date())
    const [selectedAppointment, setSelectedAppointment] = useState(null)

    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()

    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December']

    const firstDayOfMonth = new Date(year, month, 1).getDay()
    const daysInMonth = new Date(year, month + 1, 0).getDate()

    const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1))
    const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1))
    const goToToday = () => setCurrentDate(new Date())

    const getAppointmentsForDay = (day) => {
        return appointments.filter(appointment => {
            const appDate = new Date(appointment.appointment_date)
            return appDate.getFullYear() === year &&
                appDate.getMonth() === month &&
                appDate.getDate() === day
        })
    }

    const handleEventClick = (appointment) => {
        setSelectedAppointment(appointment)
    }

    const days = []

    // Empty cells before first day
    for (let i = 0; i < firstDayOfMonth; i++) {
        days.push(<div key={`empty-${i}`} className='calendar-day empty'></div>)
    }

    // Day cells
    for (let day = 1; day <= daysInMonth; day++) {
        const dayAppointments = getAppointmentsForDay(day)
        const isToday = new Date().getFullYear() === year &&
            new Date().getMonth() === month &&
            new Date().getDate() === day

        days.push(
            <div key={day} className={`calendar-day ${isToday ? 'today' : ''}`}>
                <span className='day-number'>{day}</span>
                {dayAppointments.map(appointment => (
                    <div
                        key={appointment.id}
                        className='calendar-event'
                        onClick={() => handleEventClick(appointment)}
                    >
                        {appointment.subject} - {appointment.course}
                    </div>
                ))}
            </div>
        )
    }

    return (
        <div className='calendar-container'>
            <div className='calendar-header'>
                <button onClick={prevMonth}>Prev</button>
                <button onClick={goToToday}>Today</button>
                <h2>{monthNames[month]} {year}</h2>
                <button onClick={nextMonth}>Next</button>
            </div>

            <div className='calendar-grid'>
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className='calendar-day-header'>{day}</div>
                ))}
                {days}
            </div>

            {selectedAppointment && (
                <AppointmentModal
                    appointment={selectedAppointment}
                    onClose={() => setSelectedAppointment(null)}
                />
            )}
        </div>
    )
}

export default Calendar