import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { loginStudent } from '../services/api'
import { useAuth } from '../hooks/useAuth.js'
import nsuBackground from '../assets/nsuBackground.jpeg'
import '../styles/StudentLogin.css'

function StudentLogin() {
    const [ email, setEmail ]        = useState( '' )
    const [ password, setPassword ]  = useState( '' )
    const [ error, setError ]        = useState( '' )
    const [ loading, setLoading ]  = useState( false )

    const { login } = useAuth()
    const navigate = useNavigate()

    const validate = () => {
        if ( !email.trim() || !password ) {
            return 'Email and password are required'
        }
        return null
    }

    const handleSubmit = async ( e ) => {
        e.preventDefault()
        setError( '' )

        const validationError = validate()
        if ( validationError ) {
            setError( validationError )
            return
        }
        setLoading( true )

        try {
            const res = await loginStudent( { email, password } )
            login( res.data.access_token, res.data.n_number )
            navigate( '/home' )
        } catch ( err ) {
            setError( 'Invalid email or password' )
        } finally {
            setLoading( false )
        }
    }

    return (
        <div
            className='login-wrapper'
            style={{ backgroundImage: `url(${nsuBackground})` }}
        >
            <div className='login-blue-overlay' />
            <div className='login-blur-overlay' />

            <button className='login-back-btn' onClick={() => navigate('/')}>
                ← Back
            </button>

            <div className='login-card'>

                {/* Left Panel */}
                <div className='login-left-panel'>
                    <div className='login-circle-top' />
                    <div className='login-circle-bottom' />
                    <div className='login-logo'>N.A.V.I.G.A.T.E.</div>
                    <div className='login-divider' />
                    <p className='login-tagline'>
                        Nova Southeastern University's academic guidance and tutoring system.
                    </p>
                    <div className='login-nsu-badge'>Nova Southeastern University</div>
                </div>

                {/* Right Panel */}
                <div className='login-right-panel'>
                    <h2 className='login-title'>Welcome back</h2>
                    <p className='login-subtitle'>Sign in to your student account</p>

                    {error && <p className='login-error'>{error}</p>}

                    <form onSubmit={handleSubmit}>
                        <input
                            type='email'
                            placeholder='Email address'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className='login-input'
                        />
                        <input
                            type='password'
                            placeholder='Password'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className='login-input'
                        />
                        <button
                            type='submit'
                            disabled={loading}
                            className='login-btn'
                        >
                            {loading ? 'Logging in...' : 'Login'}
                        </button>
                    </form>

                    <p className='login-footer'>
                        Don't have an account?{' '}
                        <Link to='/register'>Register</Link>
                    </p>
                </div>

            </div>
        </div>
    )
}

export default StudentLogin