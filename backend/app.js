const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

const connectDB = require('./config/connectDB.js');

const app = express();

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