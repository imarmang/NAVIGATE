import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { registerStudent } from '../services/api'
import nsuBackground from '../assets/nsuBackground.jpeg'

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

    const inputStyle = {
        width: '100%',
        height: '50px',
        background: 'rgba(255,255,255,0.2)',
        border: 'none',
        borderRadius: '30px',
        padding: '0 20px',
        color: '#fff',
        fontSize: '15px',
        outline: 'none',
        marginBottom: '16px'
    }

    return (
        <div style={{
            backgroundImage: `url(${nsuBackground})`,
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            backgroundAttachment: 'fixed',
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            <div style={{
                position: 'absolute',
                inset: 0,
                background: 'rgba(39, 39, 39, 0.5)'
            }} />

            <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
                <h1 style={{ color: '#fff', fontSize: '32px', fontWeight: 700, marginBottom: '30px' }}>
                    N.A.V.I.G.A.T.E.
                </h1>

                <div style={{
                    width: '450px',
                    background: 'transparent',
                    border: '2px solid #fff',
                    borderRadius: '20px',
                    backdropFilter: 'blur(20px)',
                    padding: '40px'
                }}>
                    <h2 style={{ color: '#fff', marginBottom: '24px' }}>Create Account</h2>

                    {error && (
                        <p style={{ color: '#ff6b6b', marginBottom: '16px', fontSize: '14px' }}>
                            {error}
                        </p>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <input
                                type='text'
                                name='first_name'
                                placeholder='First Name'
                                value={formData.first_name}
                                onChange={handleChange}
                                required
                                style={inputStyle}
                            />
                            <input
                                type='text'
                                name='last_name'
                                placeholder='Last Name'
                                value={formData.last_name}
                                onChange={handleChange}
                                required
                                style={inputStyle}
                            />
                        </div>

                        <input
                            type='text'
                            name='n_number'
                            placeholder='N-Number'
                            value={formData.n_number}
                            onChange={handleChange}
                            required
                            style={inputStyle}
                        />

                        <input
                            type='email'
                            name='email'
                            placeholder='Email'
                            value={formData.email}
                            onChange={handleChange}
                            required
                            style={inputStyle}
                        />

                        <input
                            type='password'
                            name='password'
                            placeholder='Password'
                            value={formData.password}
                            onChange={handleChange}
                            required
                            style={inputStyle}
                        />

                        <button
                            type='submit'
                            disabled={loading}
                            style={{
                                width: '100%',
                                height: '45px',
                                background: 'rgba(255,255,255,0.7)',
                                border: 'none',
                                borderRadius: '30px',
                                fontSize: '15px',
                                fontWeight: 500,
                                cursor: 'pointer',
                                transition: '.3s'
                            }}
                        >
                            {loading ? 'Creating account...' : 'Register'}
                        </button>
                    </form>

                    <p style={{ color: '#fff', marginTop: '20px', fontSize: '14px' }}>
                        Already have an account?{' '}
                        <Link to='/login' style={{ color: '#fff', fontWeight: 600 }}>
                            Login
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Register