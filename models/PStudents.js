// models/PStudent.js
import mongoose from 'mongoose';

const PStudentSchema = new mongoose.Schema({
 NameStud: { type: String, required: true },
  RollNo: { type: String, required: true },
  Attper: { type: Number, required: true },
  Noclass: { type: Number, required: true },
  Present: { type: Number, required: true },
  Batch: { type: String, required: true }
});

const PStudent = mongoose.model('PStudents', PStudentSchema);
export default PStudent;
