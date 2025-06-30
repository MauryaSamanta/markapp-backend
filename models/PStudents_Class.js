// models/PStudentClass.js
import mongoose from 'mongoose';

const PStudentClassSchema = new mongoose.Schema({
  rollStud: { type: String, required: true },
  DATEclass: { type: String, required: true }, // or Date, if you plan to store as Date
  STATUS: { type: String, required: true }, // Use Boolean if it's always 0/1
  Teacher: { type: String, required: true },
  Batch: { type: String, required: true },
});

const PStudentClass = mongoose.model('PStudents_Class', PStudentClassSchema);
export default PStudentClass;
