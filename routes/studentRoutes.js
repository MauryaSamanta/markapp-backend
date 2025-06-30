// routes/theoryRoutes.js
import express from 'express';
import { getAllTStudents, getPStudentsByBatch } from '../controllers/students.js';


const router = express.Router();

// POST /api/theory/mark
router.get('/getlist/theory', getAllTStudents);
router.post('/getlist/practical', getPStudentsByBatch);

export default router;
