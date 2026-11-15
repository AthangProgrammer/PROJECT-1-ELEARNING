const express = require('express');
const mongoose = require('mongoose');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const auth = require('../middleware/auth');

const router = express.Router();

// Enroll the logged-in user in a course
router.post('/', auth, async (req, res) => {
  const { courseId } = req.body || {};
  if (!mongoose.isValidObjectId(courseId))
    return res.status(400).json({ error: 'A valid courseId is required' });
  if (!(await Course.exists({ _id: courseId })))
    return res.status(404).json({ error: 'Course not found' });

  try {
    const enrollment = await Enrollment.create({ user: req.user.id, course: courseId });
    res.status(201).json(await enrollment.populate('course'));
  } catch (err) {
    if (err.code === 11000) // unique index on (user, course)
      return res.status(409).json({ error: 'You are already enrolled in this course' });
    throw err;
  }
});

// Enrollments of the logged-in user, with course details
router.get('/', auth, async (req, res) => {
  res.json(await Enrollment.find({ user: req.user.id }).populate('course').sort({ createdAt: -1 }));
});

module.exports = router;
