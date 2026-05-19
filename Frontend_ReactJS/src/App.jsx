import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './routes/ProtectedRoute'
import StudentLogin from './pages/StudentLogin'
import Register from './pages/Register'
import StudentHome from './pages/StudentHome'
import AppointmentsPage from './pages/Appointments'
import CoursesPage from './pages/Courses'
import Landing from './pages/Landing'

const queryClient = new QueryClient( {
    defaultOptions: {
        queries: {
            retry:              1,
            refetchOnWindowFocus: false,
        }
    }
} )

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <AuthProvider queryClient={queryClient}>
                <BrowserRouter>
                    <Routes>
                        {/* Public routes */}
                        <Route path='/' element={<Landing />} />
                        <Route path='/login' element={<StudentLogin />} />
                        <Route path='/register' element={<Register />} />

                        {/* Protected routes */}
                        <Route path='/home' element={
                            <ProtectedRoute>
                                <StudentHome />
                            </ProtectedRoute>
                        } />
                        <Route path='/appointments' element={
                            <ProtectedRoute>
                                <AppointmentsPage />
                            </ProtectedRoute>
                        } />
                        <Route path='/courses' element={
                            <ProtectedRoute>
                                <CoursesPage />
                            </ProtectedRoute>
                        } />
                        <Route path='/settings' element={
                            <ProtectedRoute>
                                <StudentHome />
                            </ProtectedRoute>
                        } />

                        {/* Fallback */}
                        <Route path='*' element={<Landing />} />
                    </Routes>
                </BrowserRouter>
            </AuthProvider>
        </QueryClientProvider>
    )
}

export default App