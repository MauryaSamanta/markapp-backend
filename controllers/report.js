import express from "express";
import PDFDocument from "pdfkit";

import PStudent from "../models/PStudents.js";
import PStudentClass from "../models/PStudents_Class.js";
import TStudent from "../models/TStudents.js";
import TStudentClass from "../models/TStudents_Class.js";
const router = express.Router();
const rollWidth = 80;
const nameWidth = 220;
const dateWidth = 75;
const rowHeight = 22;
const headerHeight = 45;
router.get("/attendance-report/:batch", async (req, res) => {
    try {
        const batch = req.params.batch;

        // Fetch students
        const students = await PStudent.find({ Batch: batch })
            .sort({ RollNo: 1 });

        // Fetch attendance
        const attendance = await PStudentClass.find({ Batch: batch });

        // Unique dates sorted chronologically
        const dates = [...new Set(attendance.map(a => a.DATEclass))];

        dates.sort((a, b) => {
            const [da, ma, ya] = a.split("-").map(Number);
            const [db, mb, yb] = b.split("-").map(Number);

            return new Date(ya, ma - 1, da) - new Date(yb, mb - 1, db);
        });

        // Attendance Lookup
        const attendanceMap = {};

        attendance.forEach(a => {
            if (!attendanceMap[a.rollStud])
                attendanceMap[a.rollStud] = {};

            attendanceMap[a.rollStud][a.DATEclass] = a.STATUS;
        });

        // Initialize PDF with autoPageBreaks disabled to gain full layout control
        const doc = new PDFDocument({
            size: "A4",
            layout: "landscape",
            margin: 40,
            autoPageBreaks: false
        });

        res.setHeader("Content-Type", "application/pdf");
        res.setHeader(
            "Content-Disposition",
            "attachment; filename=AttendanceRegister.pdf"
        );

        doc.pipe(res);

        // Reduced from 28 to 15 to fit perfectly on landscape A4
        const studentsPerPage = 15;
        let pageNo = 1;

        for (let d = 0; d < dates.length; d += 5) {
            const currentDates = dates.slice(d, d + 5);

            for (let s = 0; s < students.length; s += studentsPerPage) {
                if (pageNo > 1) {
                    doc.addPage();
                }

                const currentStudents = students.slice(s, s + studentsPerPage);

                //---------------------------------------
                // Title
                //---------------------------------------
                doc
                    .fontSize(17)
                    .text("Practical Attendance Register Department of LPM Faculty of VAS B.VSc.&A.H. First Year", {
                        align: "center"
                    });

                 doc
                    .fontSize(20)
                    .text("Academic Session", 90);

                doc
                    .fontSize(12)
                    .text(`Batch : ${batch}`, {
                        align: "center"
                    });

                // Starting Y position for headers
                let y = 140;

                //---------------------------------------
                // Column headers
                //---------------------------------------
                doc.fontSize(11);
                doc.fontSize(11);

                // Roll header
                doc.rect(40, y, rollWidth, headerHeight).stroke();
                doc.text("Roll", 40, y + 15, {
                    width: rollWidth,
                    align: "center"
                });

                // Name header
                doc.rect(120, y, nameWidth, headerHeight).stroke();
                doc.text("Student Name", 120, y + 15, {
                    width: nameWidth,
                    align: "center"
                });

                currentDates.forEach((date, index) => {
                    const x = 340 + index * 75;

                 doc.save();

doc.rotate(-60, {
    origin: [x, y + 15]
});

doc.text(date, x, y + 50);

doc.restore();
                });

                // Space after headers to prevent overwriting
                y += 45;

                //---------------------------------------
                // Students Rows
                //---------------------------------------
                currentStudents.forEach(student => {
                    doc.fontSize(10);
                    // Roll Cell
                    doc.rect(40, y, rollWidth, rowHeight).stroke();

                    doc.text(student.RollNo, 40, y + 6, {
                        width: rollWidth,
                        align: "center"
                    });

                    // Name Cell
                    doc.rect(120, y, nameWidth, rowHeight).stroke();

                    doc.text(student.NameStud, 125, y + 6, {
                        width: nameWidth - 10
                    });

                    currentDates.forEach((date, index) => {
                        const status = attendanceMap[student.RollNo]?.[date] || "-";
                        const printable =
                            status === "1"
                                ? "P"
                                : status === "0"
                                    ? "A"
                                    : "NA";

                      const cellX = 340 + index * dateWidth;

doc.rect(cellX, y, dateWidth, rowHeight).stroke();

doc.text(printable, cellX, y + 6, {
    width: dateWidth,
    align: "center"
});
                    });

                    y += 22; // Height step for each student record
                });

                //---------------------------------------
                // Footer
                //---------------------------------------
                doc.fontSize(10);
                doc.text(
                    "Computer Generated Report",
                    0,
                    535,
                    { align: "center" }
                );

                doc.text(
                    `Page ${pageNo}`,
                    0,
                    550,
                    { align: "right" }
                );

                pageNo++;
            }
        }

        doc.end();

    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: err.message
        });
    }
});

router.get("/attendance-report/", async (req, res) => {
    try {
        // const batch = req.params.batch;

        // Fetch students
        const students = await TStudent.find()
            .sort({ RollNo: 1 });

        const attendance = await TStudentClass.find();

        // Unique dates sorted chronologically
        const dates = [...new Set(attendance.map(a => a.DATEclass))];

        dates.sort((a, b) => {
            const [da, ma, ya] = a.split("-").map(Number);
            const [db, mb, yb] = b.split("-").map(Number);

            return new Date(ya, ma - 1, da) - new Date(yb, mb - 1, db);
        });

        // Attendance Lookup
        const attendanceMap = {};

        attendance.forEach(a => {
            if (!attendanceMap[a.rollStud])
                attendanceMap[a.rollStud] = {};

            attendanceMap[a.rollStud][a.DATEclass] = a.STATUS;
        });

        // Initialize PDF with autoPageBreaks disabled to gain full layout control
        const doc = new PDFDocument({
            size: "A4",
            layout: "landscape",
            margin: 40,
            autoPageBreaks: false
        });

        res.setHeader("Content-Type", "application/pdf");
        res.setHeader(
            "Content-Disposition",
            "attachment; filename=AttendanceRegister.pdf"
        );

        doc.pipe(res);

        // Reduced from 28 to 15 to fit perfectly on landscape A4
        const studentsPerPage = 15;
        let pageNo = 1;

        for (let d = 0; d < dates.length; d += 5) {
            const currentDates = dates.slice(d, d + 5);

            for (let s = 0; s < students.length; s += studentsPerPage) {
                if (pageNo > 1) {
                    doc.addPage();
                }

                const currentStudents = students.slice(s, s + studentsPerPage);

                //---------------------------------------
                // Title
                //---------------------------------------
                doc
                    .fontSize(17)
                    .text("Theory Attendance Register Department of LPM Faculty of VAS B.VSc.&A.H. First Year", {
                        align: "center"
                    });

                 doc
                    .fontSize(20)
                    .text("Academic Session", 90);

                // doc
                //     .fontSize(12)
                //     .text(`Batch : ${batch}`, {
                //         align: "center"
                //     });

                // Starting Y position for headers
                let y = 140;

                //---------------------------------------
                // Column headers
                //---------------------------------------
                doc.fontSize(11);
                doc.fontSize(11);

                // Roll header
                doc.rect(40, y, rollWidth, headerHeight).stroke();
                doc.text("Roll", 40, y + 15, {
                    width: rollWidth,
                    align: "center"
                });

                // Name header
                doc.rect(120, y, nameWidth, headerHeight).stroke();
                doc.text("Student Name", 120, y + 15, {
                    width: nameWidth,
                    align: "center"
                });

                currentDates.forEach((date, index) => {
                    const x = 340 + index * 75;

                 doc.save();

doc.rotate(-60, {
    origin: [x, y + 15]
});

doc.text(date, x, y + 50);

doc.restore();
                });

                // Space after headers to prevent overwriting
                y += 45;

                //---------------------------------------
                // Students Rows
                //---------------------------------------
                currentStudents.forEach(student => {
                    doc.fontSize(10);
                    // Roll Cell
                    doc.rect(40, y, rollWidth, rowHeight).stroke();

                    doc.text(student.RollNo, 40, y + 6, {
                        width: rollWidth,
                        align: "center"
                    });

                    // Name Cell
                    doc.rect(120, y, nameWidth, rowHeight).stroke();

                    doc.text(student.NameStud, 125, y + 6, {
                        width: nameWidth - 10
                    });

                    currentDates.forEach((date, index) => {
                        const status = attendanceMap[student.RollNo]?.[date] || "-";
                        const printable =
                            status === "1"
                                ? "P"
                                : status === "0"
                                    ? "A"
                                    : "NA";

                      const cellX = 340 + index * dateWidth;

doc.rect(cellX, y, dateWidth, rowHeight).stroke();

doc.text(printable, cellX, y + 6, {
    width: dateWidth,
    align: "center"
});
                    });

                    y += 22; // Height step for each student record
                });

                //---------------------------------------
                // Footer
                //---------------------------------------
                doc.fontSize(10);
                doc.text(
                    "Computer Generated Report",
                    0,
                    535,
                    { align: "center" }
                );

                doc.text(
                    `Page ${pageNo}`,
                    0,
                    550,
                    { align: "right" }
                );

                pageNo++;
            }
        }

        doc.end();

    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: err.message
        });
    }
});

export default router;