import { useNavigate, useLocation } from 'react-router-dom'
import '../../styles/navbarcss/LandingNavbar.css'

function StudentNavbar({ student, onLogout }) {
    const navigate = useNavigate()
    const location = useLocation()

    const navLinks = [
        { label: 'Home', path: '/home' },
        { label: 'Appointments', path: '/appointments' },
        { label: 'Courses', path: '/courses' },
        { label: 'Settings', path: '/settings' },
    ]

    return (
        <nav className='student-navbar'>
            <div className='student-navbar-left'>
                <div className='student-navbar-brand' onClick={() => navigate('/home')}>
                    <span className='student-navbar-logo'>N.A.V.I.G.A.T.E.</span>
                    <span className='student-navbar-badge'>Nova Southeastern University</span>
                </div>
                <div className='student-navbar-links'>
                    {navLinks.map(link => (
                        <button
                            key={link.path}
                            className={`student-nav-link ${location.pathname === link.path ? 'active' : ''}`}
                            onClick={() => navigate(link.path)}
                        >
                            {link.label}
                        </button>
                    ))}
                </div>
            </div>
            <div className='student-navbar-right'>
                <span className='student-navbar-name'>
                    {student?.first_name} {student?.last_name}
                </span>
                <button className='student-navbar-logout' onClick={onLogout}>
                    Logout
                </button>
            </div>
        </nav>
    )
}

export default StudentNavbar