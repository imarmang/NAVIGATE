import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import StudentLogin from './pages/StudentLogin'
import Register from './pages/Register'
import StudentHome from './pages/StudentHome'

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    {/* Public routes */}
                    <Route path='/login' element={<StudentLogin />} />
                    <Route path='/register' element={<Register />} />

                    {/* Protected routes */}
                    <Route path='/home' element={
                        <ProtectedRoute>
                            <StudentHome />
                        </ProtectedRoute>
                    } />

                    {/* Default redirect */}
                    <Route path='*' element={<StudentLogin />} />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    )
}

export default App