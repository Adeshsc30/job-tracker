import React from 'react'
import { useContext, useState } from 'react'
import { AuthContext } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const Login = () => {


    const [formData, setFormData] = useState({email:'', password:''})
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const {login} = useContext(AuthContext)
    const navigate = useNavigate()

    const handleChange =(e) =>{
        setFormData({...formData, [e.target.name]: e.target.value})
    }
    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')
        try {
            const res = await axios.post('https://job-tracker-ipg4.onrender.com/api/auth/login', formData)
            login(res.data) //saving user data to global context
            navigate('/dashboard')
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed')
        } finally {
            setLoading(false)
        }
    }
  return (
    <div className='min-h-screen bg-gray-950 flex items-center justify-center px-4'>
      <div className='bg-gray-900 p-8 rounded-2xl shadow-lg w-full max-w-md'>
        <h1 className='text-3xl font-bold text-white mb-2'>Welcome back</h1>
        <p className='text-gray-400 mb-6'>Login to track your applications</p>

        {/* Error message — only shows if there's an error */}
        {error && (
          <div className='bg-red-500/10 border border-red-500 text-red-400 px-4 py-3 rounded-lg mb-4'>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className='space-y-4'>
          <div>
            <label className='text-gray-400 text-sm mb-1 block'>Email</label>
            <input
              type='email'
              name='email'
              value={formData.email}
              onChange={handleChange}
              required
              className='w-full bg-gray-800 text-white px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-500'
            />
          </div>
          <div>
            <label className='text-gray-400 text-sm mb-1 block'>Password</label>
            <input
              type='password'
              name='password'
              value={formData.password}
              onChange={handleChange}
              required
              className='w-full bg-gray-800 text-white px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-500'
            />
          </div>

          {/* Submit button */}
          <button
            type='submit'
            disabled={loading}
            className='w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition duration-200 disabled:opacity-50'
          >
            {/* Show different text based on loading state */}
            {loading ? 'Logging in...' : 'Login'}
          </button>

        </form>

        {/* Link to register page */}
        <p className='text-gray-400 text-sm text-center mt-6'>
          Don't have an account?{' '}
          <a href='/register' className='text-blue-400 hover:underline'>
            Register
          </a>
        </p>

      </div>
    </div>
  )
}

export default Login
