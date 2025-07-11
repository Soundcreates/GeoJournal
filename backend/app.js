const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

const connectDB = require('./config/connectDB.js');
const journalRouter = require('./routes/journalRoutes.js');
const authRouter = require('./routes/authRoutes.js');
const commentRouter = require('./routes/commentRoutes.js');
const imageRouter = require('./routes/imageRoutes.js');

const app = express();
app.use('/api/journals', journalRouter);
app.use('/api/auth', authRouter);
app.use('/api/comments', commentRouter);
app.use('/api/images', imageRouter);

dotenv.config();
app.use(cors(
  {
    origin: "http://localhost:5173",
    credentials: true,
  }
));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`)
  connectDB();
});