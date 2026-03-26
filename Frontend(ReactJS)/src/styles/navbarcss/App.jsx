import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from '../../context/AuthContext.jsx'
import ProtectedRoute from '../../components/ProtectedRoute.jsx'
import StudentLogin from '../../pages/StudentLogin.jsx'
import Register from '../../pages/Register.jsx'
import StudentHome from '../../pages/StudentHome.jsx'
import Landing from "../../pages/Landing.jsx";

function App() {
    return (
        <AuthProvider>
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

                    {/* Default redirect */}
                    <Route path='*' element={<StudentLogin />} />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    )
}

export default App