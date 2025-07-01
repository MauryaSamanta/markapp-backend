// controllers/markTheoryAttendance.js
import TStudentClass from '../models/TStudents_Class.js';
import TStudent from '../models/TStudents.js';

export const getall=async(req,res)=>{
  try {
    const students = await TStudent.find({});
    console.log(students);
    res.status(200).json(students);
  } catch (error) {
    
  }
}

export const markTheoryAttendance = async (req, res) => {
  try {
    const { date, teacher, students } = req.body;

    if (!date || !teacher || !students || !Array.isArray(students)) {
      return res.status(400).json({ error: 'Invalid request body' });
    }

    for (const student of students) {
      const { roll, name, status } = student;

      // 1. Insert into TStudentClass
      await TStudentClass.create({
        rollStud: roll,
        DATEclass: date,
        STATUS: status,
        Teacher: teacher,
        Batch: 'I', // Always Batch I for theory
      });

      if (status === '2') continue; // Not applicable, skip attendance updates

      const existingStudent = await TStudent.findOne({ RollNo: roll });

      if (!existingStudent) {
        // If student doesn't exist, optionally skip or throw
        console.warn(`Student with roll ${roll} not found.`);
        continue;
      }

      // 2. Update attendance stats
      let updatedNoclass = existingStudent.Noclass + 1;
      let updatedPresent = status === '1' ? existingStudent.Present + 1 : existingStudent.Present;
      let updatedAttper = Math.round((updatedPresent / updatedNoclass) * 1000) / 10; // 1 decimal

      await TStudent.updateOne(
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
