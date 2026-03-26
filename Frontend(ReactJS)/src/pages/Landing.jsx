import { useNavigate } from 'react-router-dom'
import nsuBackground from '../assets/nsuBackground.jpeg'
import '../styles/Landing.css'

const FAKE_PROFESSORS = [
    { id: 1, name: 'Dr. Maxim Reza', subjects: ['CSIS', 'CEN'], availability: 'Mon, Wed', role: 'Professor' },
    { id: 2, name: 'Dr. Yujian Fu', subjects: ['CSIS', 'MATH'], availability: 'Tue, Thu', role: 'Professor' },
    { id: 3, name: 'Dr. Sumitra Mukherjee', subjects: ['CSIS', 'MATH'], availability: 'Mon, Fri', role: 'Professor' },
    { id: 4, name: 'Brandon DeCelle', subjects: ['CSIS', 'MATH'], availability: 'Mon, Wed, Fri', role: 'SI' },
    { id: 5, name: 'Carlos Acacio', subjects: ['CSIS', 'PHYS'], availability: 'Tue, Thu', role: 'SI' },
]

const NSU_RESOURCES = [
    { name: 'SharkLink', url: 'https://sharklinkportal.nova.edu', description: 'NSU Student Portal' },
    { name: 'NSU Libraries', url: 'https://library.nova.edu', description: 'Research and Resources' },
    { name: 'DegreeWorks', url: 'https://dw.nova.edu/ResponsiveDashboard/worksheets/WEB31', description: 'Check out your 4 year plan' },
    { name: 'Canvas', url: 'https://nsu.instructure.com', description: 'Course management' },
]

const HOW_TO_STEPS = [
    { step: '01', title: 'Create an Account', description: 'Register with your NSU email and N-Number to get started.' },
    { step: '02', title: 'Select Your Courses', description: 'Add the Computer Science courses you are currently enrolled in.' },
    { step: '03', title: 'Book an Appointment', description: 'Choose a professor or SI, pick a date and time, and confirm your session.' },
]

function Landing() {
    const navigate = useNavigate()

    return (
        <div className='landing-wrapper'>

            {/* Navbar */}
            <nav className='landing-navbar'>
                <div className='landing-navbar-left'>
                    <span className='landing-logo'>N.A.V.I.G.A.T.E.</span>
                    <span className='landing-nsu-badge'>Nova Southeastern University</span>
                </div>
                <div className='landing-navbar-right'>
                    <button className='btn-register' onClick={() => navigate('/register')}>Register</button>
                    <button className='btn-login' onClick={() => navigate('/login')}>Log In</button>
                </div>
            </nav>

            {/* Hero */}
            <div
                className='landing-hero'
                style={{ backgroundImage: `url(${nsuBackground})` }}
            >
                <div className='landing-hero-overlay' />
                <div className='landing-hero-content'>
                    <h1>Academic Support for CS Students</h1>
                    <p>
                        Book office hours and tutoring sessions with your Computer Science
                        professors and Student Instructors at Nova Southeastern University.
                    </p>
                    <button className='btn-get-started' onClick={() => navigate('/register')}>
                        Get Started
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className='landing-content'>

                {/* How it works */}
                <h2 className='landing-section-title'>How It Works</h2>
                <div className='how-it-works-grid'>
                    {HOW_TO_STEPS.map(item => (
                        <div key={item.step} className='landing-card'>
                            <div className='step-number'>{item.step}</div>
                            <h3 className='step-title'>{item.title}</h3>
                            <p className='step-description'>{item.description}</p>
                        </div>
                    ))}
                </div>

                {/* Two column layout */}
                <div className='two-col-grid'>

                    {/* Professors & SIs */}
                    <div className='landing-card'>
                        <h2 className='card-title'>Professors & Student Instructors</h2>
                        <div className='professor-list'>
                            {FAKE_PROFESSORS.map(professor => (
                                <div key={professor.id} className='professor-item'>
                                    <div className='professor-avatar'>
{professor.name.split(' ').slice(-2).map(n => n[0]).join('')}
                                    </div>
                                    <div className='professor-info'>
                                        <div className='professor-name-row'>
                                            <p className='professor-name'>{professor.name}</p>
                                            <span className={professor.role === 'Professor' ? 'role-badge-professor' : 'role-badge-si'}>
                                                {professor.role}
                                            </span>
                                        </div>
                                        <p className='professor-meta'>
                                            {professor.subjects.join(', ')} · {professor.availability}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button className='btn-book' onClick={() => navigate('/login')}>
                            Book an Appointment
                        </button>
                    </div>

                    {/* NSU Resources */}
                    <div className='landing-card'>
                        <h2 className='card-title'>NSU Resources</h2>
                        <div className='resource-list'>
                            {NSU_RESOURCES.map(resource => (
                                <a
                                    key={resource.name}
                                    href={resource.url}
                                    target='_blank'
                                    rel='noreferrer'
                                    className='resource-item'
                                >
                                    <div>
                                        <p className='resource-name'>{resource.name}</p>
                                        <p className='resource-description'>{resource.description}</p>
                                    </div>
                                    <span className='resource-arrow'>→</span>
                                </a>
                            ))}
                        </div>
                    </div>

                </div>

                {/* Footer */}
                <div className='landing-footer'>
                    <p>N.A.V.I.G.A.T.E. — Nova Southeastern University Academic Guidance System for CS Students</p>
                    <p className='landing-footer-sub'>
                        This is a portfolio project built by{' '}
                        <a href='https://github.com/imarmang' target='_blank' rel='noreferrer'>
                            Arman Gasparyan
                        </a>
                        {' '}— NSU CS Graduate 2026. NOT AN OFFICIAL NSU PRODUCT.
                    </p>
                </div>

            </div>
        </div>
    )
}

export default Landing