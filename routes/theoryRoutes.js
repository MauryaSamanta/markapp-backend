// routes/theoryRoutes.js
import express from 'express';
import { getall, markTheoryAttendance } from '../controllers/theory.js';
import { getallprac, markPracticalAttendance } from '../controllers/practical.js';

const router = express.Router();

// POST /api/theory/mark
router.get('/getall/theory',getall)
router.get('/getall/practical', getallprac); 
router.post('/mark/theory', markTheoryAttendance);
router.post('/mark/practical', markPracticalAttendance);

export default router;
