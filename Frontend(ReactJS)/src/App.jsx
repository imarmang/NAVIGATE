import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { DataProvider } from './context/DataContext'
import ProtectedRoute from './routes/ProtectedRoute.jsx'
import StudentLogin from './pages/StudentLogin'
import Register from './pages/Register'
import StudentHome from './pages/StudentHome'
import Landing from './pages/Landing'
import AppointmentsPage from "./pages/Appointments.jsx";

function App() {
    return (
        <AuthProvider>
            <DataProvider>
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
                                <StudentHome />
                            </ProtectedRoute>
                        } />
                        <Route path='/settings' element={
                            <ProtectedRoute>
                                <StudentHome />
                            </ProtectedRoute>
                        } />

                        {/* Default redirect */}
                        <Route path='*' element={<Landing />} />
                    </Routes>
                </BrowserRouter>
            </DataProvider>
        </AuthProvider>
    )
}

export default App