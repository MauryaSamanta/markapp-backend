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
              $trim: {
                input: {
                  $arrayElemAt: [
                    { $split: ["$RollNo", "/"] },
                    -1
                  ]
                }
              }
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
              $trim: {
                input: {
                  $arrayElemAt: [
                    { $split: ["$RollNo", "/"] },
                    -1
                  ]
                }
              }
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