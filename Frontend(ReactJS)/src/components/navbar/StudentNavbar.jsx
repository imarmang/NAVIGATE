import { useNavigate, useLocation } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHouse, faCalendar, faBook, faGear, faRightFromBracket } from '@fortawesome/free-solid-svg-icons'
import '../../styles/navbarcss/StudentNavbar.css'

function StudentNavbar({ student, onLogout }) {
    const navigate = useNavigate()
    const location = useLocation()

    const navLinks = [
        { label: 'Home', path: '/home', icon: faHouse },
        { label: 'Appointments', path: '/appointments', icon: faCalendar },
        { label: 'Courses', path: '/courses', icon: faBook },
        { label: 'Settings', path: '/settings', icon: faGear },
    ]

    const initials = student
        ? `${student.first_name?.[0]}${student.last_name?.[0]}`
        : ''

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
                            <FontAwesomeIcon icon={link.icon} className='student-nav-icon' />
                            <span className='student-nav-label'>{link.label}</span>
                        </button>
                    ))}
                </div>
            </div>
            <div className='student-navbar-right'>
                <div className='student-navbar-avatar'>{initials}</div>
                <span className='student-navbar-name'>
                    {student?.first_name} {student?.last_name}
                </span>
                <button className='student-navbar-logout' onClick={onLogout} title='Logout'>
                    <FontAwesomeIcon icon={faRightFromBracket} />
                </button>
            </div>
        </nav>
    )
}

export default StudentNavbar