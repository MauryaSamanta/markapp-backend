// app.js
import express, { application } from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import theoryRoutes from "./routes/theoryRoutes.js"
import studentRoutes from "./routes/studentRoutes.js"
import cors from "cors"
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors())
// Middleware
app.use(express.json());

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI,{
  useNewUrlParser: true,
  useUnifiedTopology: true,
  dbName: 'Attendance',
})
  .then(() => { const dbName = mongoose.connection.name;
    console.log(`✅ MongoDB Connected to database: ${dbName}`);})
  .catch((err) => console.error('❌ MongoDB Error:', err));

// Routes
app.get('/', (req, res) => {
  res.send('API is running...');
});

app.use("/v1/attend",theoryRoutes)
app.use("/v1/students", studentRoutes)

// Server Start
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
