import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { registerStudent } from '../services/api'
import nsuBackground from '../assets/nsuBackground.jpeg'
import '../styles/Register.css'

function Register() {
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        n_number: '',
        email: '',
        password: ''
    })
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const navigate = useNavigate()

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        try {
            await registerStudent(formData)
            navigate('/login')
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong')
        } finally {
            setLoading(false)
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
                        Nova Southeastern University's academic guidance and tutoring system.
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