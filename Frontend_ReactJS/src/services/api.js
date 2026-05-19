import axios from 'axios'

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000'
})

// Automatically attach the JWT token to every request
api.interceptors.request.use( ( config ) => {
    const token = localStorage.getItem( 'access_token' )
    if ( token ) {
        config.headers.Authorization = `Bearer ${ token }`
    }
    return config
} )

// Log errors
api.interceptors.response.use(
    ( response ) => response,
    ( error ) => {
        console.error( 'API Error:', error.response?.status, error.response?.data )
        return Promise.reject( error )
    }
)

// Auth
export const registerStudent  = ( data ) => api.post( '/auth/register', data )
export const loginStudent     = ( data ) => api.post( '/auth/login', data )
export const logoutStudent    = ()       => api.post( '/auth/logout' )
export const getMe            = ()       => api.get( '/auth/me' )

// Appointments
export const getAppointments    = ()                   => api.get( '/appointments/' )
export const getBookedSlots     = ( tutor_email, date ) => api.get( '/appointments/booked-slots', { params: { tutor_email, date } } )
export const createAppointment  = ( data )             => api.post( '/appointments/', data )
export const deleteAppointment  = ( id )               => api.delete( `/appointments/${ id }` )
export const updateMessage      = ( id, data )         => api.put( `/appointments/${ id }/message`, data )

// Courses
export const getCourses           = ()       => api.get( '/courses/' )
export const getStudentCourses    = ()       => api.get( '/courses/my-courses' )
export const updateStudentCourses = ( data ) => api.put( '/courses/my-courses', data )

// Staff
export const getStaffByCourse = ( courseId ) => api.get( '/staff/', { params: { course_id: courseId } } )