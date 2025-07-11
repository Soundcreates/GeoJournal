const mongoose = require('mongoose');


const connectDB = async () => {
  try {
    const connectDB = await mongoose.connect(process.env.MONGO_URI);
    if (connectDB) console.log('Db connected successfully');
  } catch (err) {
    console.log(err.message);

  }
}

module.exports = connectDB;