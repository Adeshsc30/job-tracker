// useState to manage jobs list, form data, loading and error states
import { useState, useEffect, useContext } from 'react'

// axios to make HTTP requests to our backend
import axios from 'axios'

// AuthContext to get the logged in user's token
import { AuthContext } from '../context/AuthContext'

// Navbar component
import Navbar from '../components/Navbar'

const Dashboard = () => {
  // Stores the list of all job applications
  const [jobs, setJobs] = useState([])

  // Controls whether the add job form is visible or not
  const [showForm, setShowForm] = useState(false)

  // Stores loading state while fetching jobs
  const [loading, setLoading] = useState(true)

  // Stores error message if something goes wrong
  const [error, setError] = useState('')

  // Stores the new job form data
  const [formData, setFormData] = useState({
    company: '',
    role: '',
    status: 'Applied',
    jobLink: '',
    notes: '',
  })

  // Grab user (which contains the token) from global context
  const { user } = useContext(AuthContext)

  // Create axios headers with the JWT token
  // This is sent with every request to prove the user is logged in
  const config = {
    headers: {
      Authorization: `Bearer ${user?.token}`,
    },
  }

  // Fetch all jobs when the component first loads
  // useEffect with empty [] runs only once on mount
  useEffect(() => {
    fetchJobs()
  }, [])

  // Function to fetch all jobs from the backend
  const fetchJobs = async () => {
    try {
      const res = await axios.get('https://job-tracker-ipg4.onrender.com/api/jobs', config)
      setJobs(res.data)
    } catch (err) {
      setError('Failed to fetch jobs')
    } finally {
      setLoading(false)
    }
  }

  // Called every time user types in the form
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  // Called when user submits the add job form
  const handleAddJob = async (e) => {
    e.preventDefault()
    try {
      // Send POST request to create a new job
      const res = await axios.post('https://job-tracker-ipg4.onrender.com/api/jobs', formData, config)

      // Add the new job to the top of the jobs list
      setJobs([res.data, ...jobs])

      // Reset the form
      setFormData({ company: '', role: '', status: 'Applied', jobLink: '', notes: '' })

      // Hide the form
      setShowForm(false)

    } catch (err) {
      setError('Failed to add job')
    }
  }

  // Called when user changes the status dropdown on a job card
  const handleStatusChange = async (jobId, newStatus) => {
    try {
      // Send PATCH request to update just the status field
      const res = await axios.patch(
        `https://job-tracker-ipg4.onrender.com/api/jobs/${jobId}`,
        { status: newStatus },
        config
      )

      // Update the job in the local state without refetching all jobs
      setJobs(jobs.map(job => job._id === jobId ? res.data : job))

    } catch (err) {
      setError('Failed to update job')
    }
  }

  // Called when user clicks delete on a job card
  const handleDelete = async (jobId) => {
    try {
      await axios.delete(`https://job-tracker-ipg4.onrender.com/api/jobs/${jobId}`, config)

      // Remove the deleted job from local state
      setJobs(jobs.filter(job => job._id !== jobId))

    } catch (err) {
      setError('Failed to delete job')
    }
  }

  // Helper function to get color based on job status
  const getStatusColor = (status) => {
    switch (status) {
      case 'Applied': return 'bg-blue-500/10 text-blue-400 border-blue-500/20'
      case 'Interviewing': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
      case 'Offered': return 'bg-green-500/10 text-green-400 border-green-500/20'
      case 'Rejected': return 'bg-red-500/10 text-red-400 border-red-500/20'
      default: return 'bg-gray-500/10 text-gray-400 border-gray-500/20'
    }
  }

  return (
    <div className='min-h-screen bg-gray-950'>

      {/* Navbar at the top */}
      <Navbar />

      <div className='max-w-6xl mx-auto px-6 py-8'>

        {/* Header row — title and add job button */}
        <div className='flex items-center justify-between mb-8'>
          <div>
            <h2 className='text-2xl font-bold text-white'>My Applications</h2>
            <p className='text-gray-400 text-sm mt-1'>{jobs.length} total applications</p>
          </div>

          {/* Toggle add job form */}
          <button
            onClick={() => setShowForm(!showForm)}
            className='bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition duration-200'
          >
            {showForm ? 'Cancel' : '+ Add Job'}
          </button>
        </div>

        {/* Error message */}
        {error && (
          <div className='bg-red-500/10 border border-red-500 text-red-400 px-4 py-3 rounded-lg mb-6'>
            {error}
          </div>
        )}

        {/* Add job form — only visible when showForm is true */}
        {showForm && (
          <div className='bg-gray-900 rounded-2xl p-6 mb-8 border border-gray-800'>
            <h3 className='text-white font-semibold text-lg mb-4'>Add New Application</h3>

            <form onSubmit={handleAddJob} className='grid grid-cols-1 md:grid-cols-2 gap-4'>

              {/* Company input */}
              <div>
                <label className='text-gray-400 text-sm mb-1 block'>Company</label>
                <input
                  type='text'
                  name='company'
                  value={formData.company}
                  onChange={handleChange}
                  placeholder='Google'
                  required
                  className='w-full bg-gray-800 text-white px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-500'
                />
              </div>

              {/* Role input */}
              <div>
                <label className='text-gray-400 text-sm mb-1 block'>Role</label>
                <input
                  type='text'
                  name='role'
                  value={formData.role}
                  onChange={handleChange}
                  placeholder='Frontend Developer'
                  required
                  className='w-full bg-gray-800 text-white px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-500'
                />
              </div>

              {/* Status dropdown */}
              <div>
                <label className='text-gray-400 text-sm mb-1 block'>Status</label>
                <select
                  name='status'
                  value={formData.status}
                  onChange={handleChange}
                  className='w-full bg-gray-800 text-white px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-500'
                >
                  <option value='Applied'>Applied</option>
                  <option value='Interviewing'>Interview</option>
                  <option value='Offered'>Offer</option>
                  <option value='Rejected'>Rejected</option>
                </select>
              </div>

              {/* Job link input */}
              <div>
                <label className='text-gray-400 text-sm mb-1 block'>Job Link (optional)</label>
                <input
                  type='url'
                  name='jobLink'
                  value={formData.jobLink}
                  onChange={handleChange}
                  placeholder='https://careers.google.com'
                  className='w-full bg-gray-800 text-white px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-500'
                />
              </div>

              {/* Notes input — spans full width */}
              <div className='md:col-span-2'>
                <label className='text-gray-400 text-sm mb-1 block'>Notes (optional)</label>
                <textarea
                  name='notes'
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder='Applied via LinkedIn, referral from John...'
                  rows={3}
                  className='w-full bg-gray-800 text-white px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 resize-none'
                />
              </div>

              {/* Submit button — spans full width */}
              <div className='md:col-span-2'>
                <button
                  type='submit'
                  className='w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition duration-200'
                >
                  Add Application
                </button>
              </div>

            </form>
          </div>
        )}

        {/* Loading state */}
        {loading && (
          <div className='text-center py-20'>
            <p className='text-gray-400'>Loading your applications...</p>
          </div>
        )}

        {/* Empty state — no jobs yet */}
        {!loading && jobs.length === 0 && (
          <div className='text-center py-20'>
            <p className='text-4xl mb-4'>📋</p>
            <p className='text-white font-semibold text-lg'>No applications yet</p>
            <p className='text-gray-400 text-sm mt-1'>Click "+ Add Job" to get started</p>
          </div>
        )}

        {/* Jobs grid */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
          {jobs.map((job) => (
            <div
              key={job._id}
              className='bg-gray-900 rounded-2xl p-5 border border-gray-800 hover:border-gray-700 transition duration-200'
            >
              {/* Company and role */}
              <div className='mb-3'>
                <h3 className='text-white font-semibold text-lg'>{job.company}</h3>
                <p className='text-gray-400 text-sm'>{job.role}</p>
              </div>

              {/* Status badge */}
              <span className={`text-xs font-medium px-3 py-1 rounded-full border ${getStatusColor(job.status)}`}>
                {job.status}
              </span>

              {/* Notes — only show if exists */}
              {job.notes && (
                <p className='text-gray-500 text-sm mt-3 line-clamp-2'>{job.notes}</p>
              )}

              {/* Job link — only show if exists */}
              {job.jobLink && (
                <a
                  href={job.jobLink}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-blue-400 text-sm hover:underline mt-2 block'
                >
                  View Job Posting →
                </a>
              )}

              {/* Applied date */}
              <p className='text-gray-600 text-xs mt-3'>
                Applied: {new Date(job.appliedDate).toLocaleDateString()}
              </p>

              {/* Status update dropdown and delete button */}
              <div className='flex items-center gap-2 mt-4'>

                {/* Change status dropdown */}
                <select
                  value={job.status}
                  onChange={(e) => handleStatusChange(job._id, e.target.value)}
                  className='flex-1 bg-gray-800 text-gray-300 text-sm px-3 py-2 rounded-lg outline-none'
                >
                  <option value='Applied'>Applied</option>
                  <option value='Interviewing'>Interview</option>
                  <option value='Offered'>Offer</option>
                  <option value='Rejected'>Rejected</option>
                </select>

                {/* Delete button */}
                <button
                  onClick={() => handleDelete(job._id)}
                  className='bg-red-500/10 hover:bg-red-500/20 text-red-400 text-sm px-3 py-2 rounded-lg transition duration-200'
                >
                  Delete
                </button>

              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}

export default Dashboard