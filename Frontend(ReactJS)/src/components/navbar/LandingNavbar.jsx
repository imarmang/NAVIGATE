import { useNavigate } from 'react-router-dom'
import '../../styles/navbarcss/LandingNavbar.css'

function LandingNavbar() {
    const navigate = useNavigate()

    return (
        <nav className='navbar'>
            <div className='navbar-left'>
                <span className='navbar-logo'>N.A.V.I.G.A.T.E.</span>
                <span className='navbar-badge'>Nova Southeastern University</span>
            </div>
            <div className='navbar-right'>
                <button className='navbar-btn-outline' onClick={() => navigate('/register')}>
                    Register
                </button>
                <button className='navbar-btn-solid' onClick={() => navigate('/login')}>
                    Log In
                </button>
            </div>
        </nav>
    )
}

export default LandingNavbar