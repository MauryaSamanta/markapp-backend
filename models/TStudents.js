// models/TStudent.js
import mongoose from 'mongoose';

const TStudentSchema = new mongoose.Schema({
  NameStud: { type: String, required: true },
  RollNo: { type: String, required: true },
  Attper: { type: Number, required: true },
  Noclass: { type: Number, required: true },
  Present: { type: Number, required: true },
  Batch: { type: String, required: true }
}, {
  collection: "TStudents"  
});

const TStudent = mongoose.model("TStudents", TStudentSchema);
export default TStudent;
