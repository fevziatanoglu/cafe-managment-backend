import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoute.js';
import workerRoutes from './routes/workerRoute.js';
import cors from 'cors';
import connectDB from './utils/connectMongo.js';

dotenv.config();
connectDB();

const app = express();
app.use(cors({
    origin: process.env.FE_URL,
    credentials: true
}));
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/workers', workerRoutes);
const PORT = process.env.PORT || process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
