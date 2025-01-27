import express, { Router } from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import router from './routes/index.js';
import cookieParser from 'cookie-parser';
// import dbClient from './db.js';

dotenv.config();

const app = express();

app.use(express.json());
app.use(cookieParser());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected!'))
  .catch((error) => console.error('MongoDB connection error:', error));


  app.use('/api', router);
  
  app.get('/', (req, res) => {
  res.send('Welcome to Event Planning App Backend!');
});

const PORT = process.env.PORT
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
