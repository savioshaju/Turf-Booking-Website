const express = require('express');
require('dotenv').config();
const connectDB = require('./config/db.js');
const router = require('./routes/index.js');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const app = express();

const FRONTEND = process.env.BASE_URL;

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (origin === FRONTEND) {
      console.log(`CORS allowed for origin: ${origin}`);
      return callback(null, true);
    }
    console.log('CORS BLOCKED ');
    console.log('from:', origin);
    console.log('frontend URL:', FRONTEND);
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
};

// Middlewares
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Database
connectDB();

// Routes
app.use('/api', router);

// Start server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});