import { useState, useEffect } from 'react'
import { getCourses, getStudentCourses, createAppointment } from '../services/api'

function CreateAppointment({ onAppointmentCreated }) {
    const [studentCourses, setStudentCourses] = useState([])
    const [selectedCourse, setSelectedCourse] = useState('')
    const [selectedDate, setSelectedDate] = useState('')
    const [selectedTime, setSelectedTime] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [isOpen, setIsOpen] = useState(false)

    useEffect(() => {
        getStudentCourses()
            .then(res => setStudentCourses(res.data))
            .catch(err => console.error('Failed to fetch courses'))
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        // Parse the course string into subject and course_id
        const [subject, course] = selectedCourse.split(' ')

        // Combine date and time into the format Flask expects
        const appointmentDate = `${selectedDate}T${selectedTime}`

        try {
            await createAppointment({
                subject,
                course,
                appointment_date: appointmentDate,
                tutor_name: 'TBD',
                tutor_email: 'tbd@nsu.edu'
            })
            onAppointmentCreated()
            setIsOpen(false)
            setSelectedCourse('')
            setSelectedDate('')
            setSelectedTime('')
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create appointment')
        } finally {
            setLoading(false)
        }
    }

    if (!isOpen) return (
        <button onClick={() => setIsOpen(true)}>Make an Appointment</button>
    )

    return (
        <div>
            <h3>Create an Appointment</h3>
            {error && <p>{error}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Course</label>
                    <select
                        value={selectedCourse}
                        onChange={(e) => setSelectedCourse(e.target.value)}
                        required
                    >
                        <option value=''>Select a course</option>
                        {studentCourses.map(course => (
                            <option
                                key={course.id}
                                value={`${course.subject} ${course.course_id}`}
                            >
                                {course.subject} {course.course_id}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label>Date</label>
                    <input
                        type='date'
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <label>Time</label>
                    <input
                        type='time'
                        value={selectedTime}
                        onChange={(e) => setSelectedTime(e.target.value)}
                        required
                    />
                </div>

                <button type='submit' disabled={loading}>
                    {loading ? 'Creating...' : 'Create'}
                </button>
                <button type='button' onClick={() => setIsOpen(false)}>
                    Cancel
                </button>
            </form>
        </div>
    )
}

export default CreateAppointment