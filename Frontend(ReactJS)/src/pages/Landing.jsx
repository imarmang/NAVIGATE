import { useNavigate } from 'react-router-dom'
import nsuBackground from '../assets/nsuBackground.jpeg'

const FAKE_TUTORS = [
    { id: 1, name: 'Brandon DeCelle', subjects: ['CSIS', 'MATH'], availability: 'Mon, Wed, Fri' },
    { id: 2, name: 'Carlos Acacio', subjects: ['CSIS', 'PHYS'], availability: 'Tue, Thu' },
    { id: 3, name: 'Maria Lopez', subjects: ['MATH', 'STAT'], availability: 'Mon, Tue, Wed' },
    { id: 4, name: 'James Wright', subjects: ['CSIS', 'CEN'], availability: 'Wed, Fri' },
]

const NSU_RESOURCES = [
    { name: 'SharkLink', url: 'https://sharklinkportal.nova.edu', description: 'NSU student portal' },
    { name: 'NSU Libraries', url: 'https://library.nova.edu', description: 'Research and resources' },
    { name: 'SharkIT', url: 'https://sharkit.nova.edu', description: 'Tech support' },
    { name: 'Canvas', url: 'https://nova.instructure.com', description: 'Course management' },
]

const HOW_TO_STEPS = [
    { step: '01', title: 'Create an Account', description: 'Register with your NSU email and N-Number to get started.' },
    { step: '02', title: 'Select Your Courses', description: 'Add the courses you are currently enrolled in.' },
    { step: '03', title: 'Book an Appointment', description: 'Choose a tutor, pick a date and time, and confirm your session.' },
]

function Landing() {
    const navigate = useNavigate()

    const navStyle = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 40px',
        height: '64px',
        background: '#2F4263',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        fontFamily: "'Poppins', sans-serif"
    }

    const cardStyle = {
        background: '#fff',
        borderRadius: '12px',
        padding: '24px',
        boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
        border: '1px solid #f0f0f0'
    }

    return (
        <div style={{ fontFamily: "'Poppins', sans-serif", background: '#f5f6fa', minHeight: '100vh' }}>

            {/* Navbar */}
            <nav style={navStyle}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ color: '#fff', fontSize: '18px', fontWeight: 700, letterSpacing: '1px' }}>
                        N.A.V.I.G.A.T.E.
                    </span>
                    <span style={{
                        background: 'rgba(255,255,255,0.15)',
                        color: 'rgba(255,255,255,0.8)',
                        fontSize: '11px',
                        padding: '2px 10px',
                        borderRadius: '20px'
                    }}>
                        Nova Southeastern University
                    </span>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button
                        onClick={() => navigate('/register')}
                        style={{
                            height: '36px',
                            padding: '0 20px',
                            background: 'transparent',
                            border: '1px solid rgba(255,255,255,0.4)',
                            borderRadius: '8px',
                            color: '#fff',
                            fontSize: '13px',
                            fontFamily: "'Poppins', sans-serif",
                            cursor: 'pointer'
                        }}
                    >
                        Register
                    </button>
                    <button
                        onClick={() => navigate('/login')}
                        style={{
                            height: '36px',
                            padding: '0 20px',
                            background: '#fff',
                            border: 'none',
                            borderRadius: '8px',
                            color: '#2F4263',
                            fontSize: '13px',
                            fontWeight: 600,
                            fontFamily: "'Poppins', sans-serif",
                            cursor: 'pointer'
                        }}
                    >
                        Log In
                    </button>
                </div>
            </nav>

            {/* Hero */}
            <div style={{
                marginTop: '64px',
                height: '320px',
                backgroundImage: `url(${nsuBackground})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                padding: '0 40px'
            }}>
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'rgba(47,66,99,0.65)'
                }} />
                <div style={{ position: 'relative', zIndex: 1 }}>
                    <h1 style={{ color: '#fff', fontSize: '36px', fontWeight: 700, marginBottom: '12px' }}>
                        Your Academic Support Hub
                    </h1>
                    <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '16px', maxWidth: '500px', lineHeight: 1.6 }}>
                        Book tutoring appointments, manage your courses, and track your sessions — all in one place.
                    </p>
                    <button
                        onClick={() => navigate('/register')}
                        style={{
                            marginTop: '24px',
                            height: '44px',
                            padding: '0 28px',
                            background: '#fff',
                            border: 'none',
                            borderRadius: '8px',
                            color: '#1B4332',
                            fontSize: '14px',
                            fontWeight: 600,
                            fontFamily: "'Poppins', sans-serif",
                            cursor: 'pointer'
                        }}
                    >
                        Get Started
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>

                {/* How it works */}
                <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#1a1a2e', marginBottom: '20px' }}>
                    How It Works
                </h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '40px' }}>
                    {HOW_TO_STEPS.map(item => (
                        <div key={item.step} style={cardStyle}>
                            <div style={{
                                fontSize: '28px',
                                fontWeight: 700,
                                color: '#1B4332',
                                opacity: 0.3,
                                marginBottom: '8px'
                            }}>
                                {item.step}
                            </div>
                            <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#1a1a2e', marginBottom: '8px' }}>
                                {item.title}
                            </h3>
                            <p style={{ fontSize: '13px', color: '#888', lineHeight: 1.6 }}>
                                {item.description}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Two column layout */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '40px' }}>

                    {/* Available Tutors */}
                    <div style={cardStyle}>
                        <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#1a1a2e', marginBottom: '16px' }}>
                            Available Tutors
                        </h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {FAKE_TUTORS.map(tutor => (
                                <div key={tutor.id} style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px',
                                    padding: '12px',
                                    background: '#f9f9f9',
                                    borderRadius: '8px'
                                }}>
                                    <div style={{
                                        width: '40px',
                                        height: '40px',
                                        borderRadius: '50%',
                                        background: '#2F4263',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: '#fff',
                                        fontSize: '14px',
                                        fontWeight: 600,
                                        flexShrink: 0
                                    }}>
                                        {tutor.name.split(' ').map(n => n[0]).join('')}
                                    </div>
                                    <div>
                                        <p style={{ fontSize: '14px', fontWeight: 500, color: '#1a1a2e', margin: 0 }}>
                                            {tutor.name}
                                        </p>
                                        <p style={{ fontSize: '12px', color: '#888', margin: 0 }}>
                                            {tutor.subjects.join(', ')} · {tutor.availability}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button
                            onClick={() => navigate('/login')}
                            style={{
                                marginTop: '16px',
                                width: '100%',
                                height: '40px',
                                background: '#2F4263',
                                border: 'none',
                                borderRadius: '8px',
                                color: '#fff',
                                fontSize: '13px',
                                fontWeight: 500,
                                fontFamily: "'Poppins', sans-serif",
                                cursor: 'pointer'
                            }}
                        >
                            Book an Appointment
                        </button>
                    </div>

                    {/* NSU Resources */}
                    <div style={cardStyle}>
                        <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#1a1a2e', marginBottom: '16px' }}>
                            NSU Resources
                        </h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {NSU_RESOURCES.map(resource => (
                                <a
                                    key={resource.name}
                                    href={resource.url}
                                    target='_blank'
                                    rel='noreferrer'
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        padding: '12px 16px',
                                        background: '#f9f9f9',
                                        borderRadius: '8px',
                                        textDecoration: 'none',
                                        transition: 'background .2s'
                                    }}
                                >
                                    <div>
                                        <p style={{ fontSize: '14px', fontWeight: 500, color: '#1a1a2e', margin: 0 }}>
                                            {resource.name}
                                        </p>
                                        <p style={{ fontSize: '12px', color: '#888', margin: 0 }}>
                                            {resource.description}
                                        </p>
                                    </div>
                                    <span style={{ color: '#1B4332', fontSize: '18px' }}>→</span>
                                </a>
                            ))}
                        </div>
                    </div>

                </div>

                {/* Footer */}
                <div style={{
                    textAlign: 'center',
                    padding: '24px 0',
                    borderTop: '1px solid #e8e8e8',
                    color: '#aaa',
                    fontSize: '13px'
                }}>
                    N.A.V.I.G.A.T.E. — Nova Southeastern University Academic Guidance System
                </div>

            </div>
        </div>
    )
}

export default Landing