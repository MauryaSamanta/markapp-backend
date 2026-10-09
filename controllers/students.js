// controllers/studentController.js

import TStudent from '../models/TStudents.js';
import PStudent from '../models/PStudents.js';

export const getAllTStudents = async (req, res) => {
  try {
    const students = await TStudent.aggregate([
      {
        $addFields: {
          rollDigits: {
            $toInt: {
              $arrayElemAt: [
                { $split: ["$RollNo", "/"] },
                -1
              ]
            }
          }
        }
      },
      {
        $sort: { rollDigits: 1 }
      },
      {
        $project: { rollDigits: 0 }
      }
    ]);

    res.status(200).json(students);
  } catch (err) {
    console.error('Error fetching TStudents:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// controllers/studentController.js (same file as above)

export const getPStudentsByBatch = async (req, res) => {
  try {
    const { batch } = req.body;

    if (!batch) {
      return res.status(400).json({ error: 'Batch is required in request body' });
    }

    const students = await PStudent.aggregate([
      {
        $match: { Batch: batch }
      },
      {
        $addFields: {
          rollDigits: {
            $toInt: {
              $arrayElemAt: [
                { $split: ["$RollNo", "/"] },
                -1
              ]
            }
          }
        }
      },
      {
        $sort: { rollDigits: 1 }
      },
      {
        $project: { rollDigits: 0 }
      }
    ]);

    res.status(200).json(students);
  } catch (err) {
    console.error('Error fetching PStudents by batch:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
