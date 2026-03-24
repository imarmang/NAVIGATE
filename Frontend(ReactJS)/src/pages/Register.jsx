import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { registerStudent } from '../services/api'

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
        <div>
            <h1>NAVIGATE</h1>
            <h2>Create Account</h2>

            {error && <p>{error}</p>}

            <form onSubmit={handleSubmit}>
                <div>
                    <label>First Name</label>
                    <input
                        type='text'
                        name='first_name'
                        value={formData.first_name}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div>
                    <label>Last Name</label>
                    <input
                        type='text'
                        name='last_name'
                        value={formData.last_name}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div>
                    <label>N-Number</label>
                    <input
                        type='text'
                        name='n_number'
                        value={formData.n_number}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div>
                    <label>Email</label>
                    <input
                        type='email'
                        name='email'
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div>
                    <label>Password</label>
                    <input
                        type='password'
                        name='password'
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </div>

                <button type='submit' disabled={loading}>
                    {loading ? 'Creating account...' : 'Register'}
                </button>
            </form>

            <p>Already have an account? <Link to='/login'>Login</Link></p>
        </div>
    )
}

export default Register