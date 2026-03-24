import axios from 'axios'

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000'
})

// Automatically attach the JWT token to every request
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('access_token')
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

// Auth
export const registerStudent = (data) => api.post('/auth/register', data)
export const loginStudent = (data) => api.post('/auth/login', data)
export const getMe = () => api.get('/auth/me')

// Appointments
export const getAppointments = () => api.get('/appointments/')
export const createAppointment = (data) => api.post('/appointments/', data)
export const deleteAppointment = (id) => api.delete(`/appointments/${id}`)
export const updateMessage = (id, data) => api.put(`/appointments/${id}/message`, data)

// Courses
export const getCourses = () => api.get('/courses/')
export const getStudentCourses = () => api.get('/courses/my-courses')
export const updateStudentCourses = (data) => api.put('/courses/my-courses', data)