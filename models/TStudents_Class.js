// models/TStudentClass.js
import mongoose from 'mongoose';

const TStudentClassSchema = new mongoose.Schema({
  rollStud: { type: String, required: true },
  DATEclass: { type: String, required: true },
  STATUS: { type: String, required: true },
  Teacher: { type: String, required: true },
  Batch: { type: String, required: true }
});

const TStudentClass = mongoose.model('TStudentClass', TStudentClassSchema);
export default TStudentClass;
