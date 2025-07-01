// controllers/studentController.js

import TStudent from '../models/TStudents.js';
import PStudent from '../models/PStudents.js';

// GET all theory students
export const getAllTStudents = async (req, res) => {
  try {
    const students = await TStudent.find({});
    // console.log(students)
    res.status(200).json(students);
  } catch (err) {
    console.error('Error fetching TStudents:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// controllers/studentController.js (same file as above)

// POST with { batch: "I" } in req.body
export const getPStudentsByBatch = async (req, res) => {
  try {
    const { batch } = req.body;
    if (!batch) {
      return res.status(400).json({ error: 'Batch is required in request body' });
    }

    const students = await PStudent.find({ Batch: batch });
    res.status(200).json(students);
  } catch (err) {
    console.error('Error fetching PStudents by batch:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
