const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const connectDB = require('./config/connectDB.js');
const journalRouter = require('./routes/journalRoutes.js');
const authRouter = require('./routes/authRoutes.js');
const commentRouter = require('./routes/commentRoutes.js');
const imageRouter = require('./routes/imageRoutes.js');
const userRouter = require('./routes/userRoutes.js');

const app = express();

app.use(cors(
  {
    origin: "http://localhost:5173",
    credentials: true,
  }
));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



app.use('/api/journals', journalRouter);
app.use('/api/auth', authRouter);
app.use('/api/comments', commentRouter);
app.use('/api/images', imageRouter);
app.use('/api/users', userRouter);

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

// Handle 404 routes
app.use('*', (req, res) => {
  res.status(404).json({ message: "Route not found" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB();
});