const express = require('express')
const router = express.Router()
const Job = require('../models/Job')


const authMiddleware = require('../middleware/authMiddleware')


router.get('/', authMiddleware, async (req, res) => {
  try {
    const jobs = await Job.find({ user: req.user.userId })
    res.status(200).json(jobs)

  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Server error' })
  }
})


router.post('/', authMiddleware, async (req, res) => {
  try {
    const { company, role, status, jobLink, notes, appliedDate } = req.body
    const job = new Job({
      user: req.user.userId,
      company,
      role,
      status,
      jobLink,
      notes,
      appliedDate,
    })
    await job.save()
    res.status(201).json(job)

  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Server error' })
  }
})


router.patch('/:id', authMiddleware, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
    if (!job) {
      return res.status(404).json({ message: 'Job not found' })
    }
    if (job.user.toString() !== req.user.userId) {
      return res.status(401).json({ message: 'Not authorized' })
    }
    const updatedJob = await Job.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )

    res.status(200).json(updatedJob)

  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Server error' })
  }
})


router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
    if (!job) {
      return res.status(404).json({ message: 'Job not found' })
    }
    if (job.user.toString() !== req.user.userId) {
      return res.status(401).json({ message: 'Not authorized' })
    }
    await job.deleteOne()
    res.status(200).json({ message: 'Job deleted successfully' })

  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Server error' })
  }
})

module.exports = router