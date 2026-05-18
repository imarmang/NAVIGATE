import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { registerStudent } from '../services/api'
import nsuBackground from '../assets/nsuBackground.jpeg'
import '../styles/Register.css'

const VALID_EMAIL_DOMAINS = [ '@mynsu.nova.edu', '@nova.edu' ]
const N_NUMBER_PATTERN = /^N\d{8}$/

function Register() {
    const [ formData, setFormData ] = useState( {
        first_name: '',
        last_name: '',
        n_number: '',
        email: '',
        password: ''
    } )
    const [ error, setError ] = useState( '' )
    const [ loading, setLoading ] = useState( false )

    const navigate = useNavigate()

    const handleChange = ( e ) => {
        setFormData({ ...formData, [ e.target.name ]: e.target.value } )
    }

    const validate = () => {
        const { first_name, last_name, n_number, email, password } = formData

        // Check all the fields are filled
        if ( !first_name.trim() || !last_name.trim() || !n_number.trim() || !email.trim() || !password ) {
            return 'All fields are required'
        }

        // Check that the email is an NSU email
        if ( !VALID_EMAIL_DOMAINS.some( domain => email.endsWith( domain ) ) ) {
            return 'Email must be an NSU email address'
        }

        // Check that the N number starts with N  followed by 8 digits
        if ( !N_NUMBER_PATTERN.test( n_number.trim() ) ) {
            return 'N-Number must be followed by 8 digits (e.g. N01234567)'
        }

        // Check the password length
        if ( password.length < 8 ) {
             return 'Password must be at least 8 characters'
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
            await registerStudent( formData )
            navigate( '/login' )
        } catch ( err ) {
            setError( err.response?.data?.message || 'Something went wrong' )
        } finally {
            setLoading( false )
        }
    }

    return (
        <div
            className='register-wrapper'
            style={{ backgroundImage: `url(${nsuBackground})` }}
        >
            <div className='register-blue-overlay' />
            <div className='register-blur-overlay' />

            <button className='register-back-btn' onClick={() => navigate('/')}>
                ← Back
            </button>

            <div className='register-card'>

                {/* Left Panel */}
                <div className='register-left-panel'>
                    <div className='register-circle-top' />
                    <div className='register-circle-bottom' />
                    <div className='register-logo'>N.A.V.I.G.A.T.E.</div>
                    <div className='register-divider' />
                    <p className='register-tagline'>
                        Network for Academic Visits, Instruction, Guidance, Advising, Tutoring, and Engagement.
                    </p>
                    <div className='register-nsu-badge'>Nova Southeastern University</div>
                </div>

                {/* Right Panel */}
                <div className='register-right-panel'>
                    <h2 className='register-title'>Create Account</h2>
                    <p className='register-subtitle'>Register with your NSU email and N-Number</p>

                    {error && <p className='register-error'>{error}</p>}

                    <form onSubmit={handleSubmit}>
                        <div className='register-name-row'>
                            <input
                                type='text'
                                name='first_name'
                                placeholder='First Name'
                                value={formData.first_name}
                                onChange={handleChange}
                                required
                                className='register-input'
                            />
                            <input
                                type='text'
                                name='last_name'
                                placeholder='Last Name'
                                value={formData.last_name}
                                onChange={handleChange}
                                required
                                className='register-input'
                            />
                        </div>

                        <input
                            type='text'
                            name='n_number'
                            placeholder='N-Number'
                            value={formData.n_number}
                            onChange={handleChange}
                            required
                            className='register-input'
                        />

                        <input
                            type='email'
                            name='email'
                            placeholder='Email'
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className='register-input'
                        />

                        <input
                            type='password'
                            name='password'
                            placeholder='Password'
                            value={formData.password}
                            onChange={handleChange}
                            required
                            className='register-input'
                        />

                        <button
                            type='submit'
                            disabled={loading}
                            className='register-btn'
                        >
                            {loading ? 'Creating account...' : 'Register'}
                        </button>
                    </form>

                    <p className='register-footer'>
                        Already have an account?{' '}
                        <Link to='/login'>Login</Link>
                    </p>
                </div>

            </div>
        </div>
    )
}

export default Register