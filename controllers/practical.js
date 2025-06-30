// controllers/markTheoryAttendance.js
import PStudentClass from '../models/PStudents_Class.js';
import PStudent from '../models/PStudents.js';

export const getallprac=async(req,res)=>{
  try {
    const students = await PStudent.find({});
    res.status(200).json(students);
  } catch (error) {
    
  }
}
export const markPracticalAttendance = async (req, res) => {
  try {
    const { date, teacher, students } = req.body;

    if (!date || !teacher || !students || !Array.isArray(students)) {
      return res.status(400).json({ error: 'Invalid request body' });
    }

    for (const student of students) {
      const { roll, name, status, batch } = student;

      // 1. Insert into TStudentClass
      await PStudentClass.create({
        rollStud: roll,
        DATEclass: date,
        STATUS: status,
        Teacher: teacher,
        Batch: batch, // Always Batch I for theory
      });

      if (status === '2') continue; // Not applicable, skip attendance updates

      const existingStudent = await PStudent.findOne({ RollNo: roll });

      if (!existingStudent) {
        // If student doesn't exist, optionally skip or throw
        console.warn(`Student with roll ${roll} not found.`);
        continue;
      }

      // 2. Update attendance stats
      let updatedNoclass = existingStudent.Noclass + 1;
      let updatedPresent = status === '1' ? existingStudent.Present + 1 : existingStudent.Present;
      let updatedAttper = Math.round((updatedPresent / updatedNoclass) * 1000) / 10; // 1 decimal

      await PStudent.updateOne(
        { RollNo: roll },
        {
          $set: {
            Noclass: updatedNoclass,
            Present: updatedPresent,
            Attper: updatedAttper,
          },
        }
      );
    }

    return res.status(200).json({ message: 'Attendance marked successfully' });
  } catch (err) {
    console.error('Attendance marking error:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};
