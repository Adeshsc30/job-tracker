import { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'

const Navbar = () => {
  const { user, logout } = useContext(AuthContext)

  const navigate = useNavigate()
  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className='bg-gray-900 border-b border-gray-800 px-6 py-4'>
      <div className='max-w-6xl mx-auto flex items-center justify-between'>
        <h1 className='text-white text-xl font-bold'>
          Job <span className='text-blue-500'>Tracker</span>
        </h1>
        <div className='flex items-center gap-4'>
          <span className='text-gray-400 text-sm'>
            👋 Hey, <span className='text-white font-medium'>{user?.user?.name}</span>
          </span>
          <button
            onClick={handleLogout}
            className='bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white text-sm px-4 py-2 rounded-lg transition duration-200'
          >
            Logout
          </button>

        </div>
      </div>
    </nav>
  )
}

export default Navbar