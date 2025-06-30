// test-theory-attendance.js
import mongoose from 'mongoose';
import axios from 'axios';
import TStudent from '../models/TStudents.js';
import dotenv from 'dotenv';

dotenv.config();

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/Attendance';

async function runTest() {
  await mongoose.connect(MONGO_URI);
  console.log('🔗 Connected to MongoDB');

  // Step 1: Seed test data
  await TStudent.deleteMany({}); // clean test DB
  await TStudent.insertMany([
    {
      NameStud: 'Abdullah',
      RollNo: 'V/2024/001',
      Attper: 0,
      Noclass: 0,
      Present: 0,
      Batch: 'I',
    },
    {
      NameStud: 'Fatima',
      RollNo: 'V/2024/002',
      Attper: 0,
      Noclass: 0,
      Present: 0,
      Batch: 'I',
    },
    {
      NameStud: 'Ravi',
      RollNo: 'V/2024/003',
      Attper: 0,
      Noclass: 0,
      Present: 0,
      Batch: 'I',
    },
  ]);
  console.log('📦 Seeded test students');

  // Step 2: Call the API
  const payload = {
    date: '26-06-2025',
    teacher: 'R Samanta - Livestock prod.systems',
    students: [
      { roll: 'V/2024/001', name: 'Abdullah', status: '1' }, // present
      { roll: 'V/2024/002', name: 'Fatima', status: '0' },   // absent
      { roll: 'V/2024/003', name: 'Ravi', status: '2' },     // not applicable
    ],
  };

  try {
    const res = await axios.post('http://localhost:5000/v1/mark/theory', payload);
    console.log('✅ API responded:', res.data);
  } catch (err) {
    console.error('❌ API error:', err.response?.data || err.message);
    return;
  }

  // Step 3: Validate updated data
  const s1 = await TStudent.findOne({ RollNo: 'V/2024/001' }); // present
  console.log(s1);
  const s2 = await TStudent.findOne({ RollNo: 'V/2024/002' }); // absent
  const s3 = await TStudent.findOne({ RollNo: 'V/2024/003' }); // not applicable

  const assert = (condition, msg) => {
    if (!condition) {
      throw new Error('❌ Assertion failed: ' + msg);
    }
  };

  try {
    assert(s1.Noclass === 1 && s1.Present === 1 && s1.Attper === 100.0, 'Student 1 update failed');
    assert(s2.Noclass === 1 && s2.Present === 0 && s2.Attper === 0.0, 'Student 2 update failed');
    assert(s3.Noclass === 0 && s3.Present === 0 && s3.Attper === 0.0, 'Student 3 should not be updated');
    console.log('✅ All assertions passed');
  } catch (err) {
    console.error(err.message);
  }

  // Optional: cleanup
  await mongoose.disconnect();
  console.log('🧹 Disconnected and test complete');
}

runTest();
