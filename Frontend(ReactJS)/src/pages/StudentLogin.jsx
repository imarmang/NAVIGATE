import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { loginStudent } from '../services/api'
import { useAuth } from '../context/AuthContext'
import nsuBackground from '../assets/nsuBackground.jpeg'

function StudentLogin() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const { login } = useAuth()
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        try {
            const res = await loginStudent({ email, password })
            login(res.data.access_token)
            navigate('/home')
        } catch (err) {
            setError('Invalid email or password')
        } finally {
            setLoading(false)
        }
    }

    return (
     <div style={{
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundImage: `url(${nsuBackground})`,
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundAttachment: 'fixed',
    fontFamily: "'Poppins', sans-serif"
}}>
    {/* Blur overlay */}
    <div style={{
        position: 'fixed',
        inset: 0,
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
        background: 'rgba(0,0,0,0.25)'
    }} />

    {/* Card */}
    <div style={{
        display: 'flex',
        width: '860px',
        height: '560px',
        borderRadius: '16px',
        overflow: 'hidden',
        boxShadow: '0 20px 60px rgba(0,0,0,0.12)',
        position: 'relative',
        zIndex: 1
    }}>
                {/* Left Panel */}
                 <div style={{
    width: '45%',
    background: 'rgba(255,255,255,0.15)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    borderRight: '1px solid rgba(255,255,255,0.2)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
    padding: '48px',
    position: 'relative',
    overflow: 'hidden'
}}>
                    <div style={{
                        position: 'absolute',
                        top: '-80px',
                        right: '-80px',
                        width: '280px',
                        height: '280px',
                        borderRadius: '50%',
                        background: 'rgba(255,255,255,0.05)'
                    }} />
                    <div style={{
                        position: 'absolute',
                        bottom: '-60px',
                        left: '-40px',
                        width: '200px',
                        height: '200px',
                        borderRadius: '50%',
                        background: 'rgba(255,255,255,0.04)'
                    }} />

                    <div style={{
                        fontSize: '26px',
                        fontWeight: 700,
                        color: '#fff',
                        letterSpacing: '2px',
                        marginBottom: '12px'
                    }}>
                        N.A.V.I.G.A.T.E.
                    </div>

                    <div style={{
                        width: '40px',
                        height: '2px',
                        background: 'rgba(255,255,255,0.3)',
                        margin: '20px 0'
                    }} />

                    <p style={{
                        fontSize: '13px',
                        color: 'rgba(255,255,255,0.6)',
                        fontWeight: 300,
                        lineHeight: 1.7,
                        maxWidth: '220px'
                    }}>
                        Nova Southeastern University's academic guidance and tutoring system.
                    </p>

                    <div style={{
                        display: 'inline-block',
                        background: 'rgba(255,255,255,0.12)',
                        border: '1px solid rgba(255,255,255,0.2)',
                        borderRadius: '20px',
                        padding: '6px 14px',
                        fontSize: '12px',
                        color: 'rgba(255,255,255,0.8)',
                        marginTop: '32px'
                    }}>
                        Nova Southeastern University
                    </div>
                </div>

                {/* Right Panel */}
                <div style={{
    width: '55%',
    background: 'rgba(255,255,255,0.85)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    padding: '48px 52px'
}}>
                    <h2 style={{
                        fontSize: '22px',
                        fontWeight: 600,
                        color: '#1a1a2e',
                        marginBottom: '6px'
                    }}>
                        Welcome back
                    </h2>
                    <p style={{
                        fontSize: '13px',
                        color: '#888',
                        marginBottom: '32px'
                    }}>
                        Sign in to your student account
                    </p>

                    {error && (
                        <p style={{
                            fontSize: '13px',
                            color: '#e74c3c',
                            marginBottom: '16px',
                            background: '#fdf0f0',
                            padding: '10px 14px',
                            borderRadius: '8px'
                        }}>
                            {error}
                        </p>
                    )}

                    <form onSubmit={handleSubmit}>
                        <input
                            type='email'
                            placeholder='Email address'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            style={{
                                width: '100%',
                                height: '46px',
                                border: '1.5px solid #e8e8e8',
                                borderRadius: '10px',
                                padding: '0 16px',
                                fontSize: '14px',
                                fontFamily: "'Poppins', sans-serif",
                                color: '#333',
                                outline: 'none',
                                marginBottom: '14px',
                                background: '#fafafa'
                            }}
                        />

                        <input
                            type='password'
                            placeholder='Password'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            style={{
                                width: '100%',
                                height: '46px',
                                border: '1.5px solid #e8e8e8',
                                borderRadius: '10px',
                                padding: '0 16px',
                                fontSize: '14px',
                                fontFamily: "'Poppins', sans-serif",
                                color: '#333',
                                outline: 'none',
                                marginBottom: '14px',
                                background: '#fafafa'
                            }}
                        />

                        <button
                            type='submit'
                            disabled={loading}
                            style={{
                                width: '100%',
                                height: '46px',
                                background: loading ? '#506B90' : '#2F4263',
                                border: 'none',
                                borderRadius: '10px',
                                fontSize: '15px',
                                fontWeight: 500,
                                color: '#fff',
                                fontFamily: "'Poppins', sans-serif",
                                cursor: loading ? 'not-allowed' : 'pointer',
                                marginTop: '8px',
                                transition: 'background .2s'
                            }}
                        >
                            {loading ? 'Logging in...' : 'Login'}
                        </button>
                    </form>

                    <p style={{
                        marginTop: '20px',
                        fontSize: '13px',
                        color: '#888',
                        textAlign: 'center'
                    }}>
                        Don't have an account?{' '}
                        <Link to='/register' style={{
                            color: '#2F4263',
                            fontWeight: 500,
                            textDecoration: 'none'
                        }}>
                            Register
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default StudentLogin