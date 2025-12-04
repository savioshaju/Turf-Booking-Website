const express = require('express');
require('dotenv').config();
const connectDB = require('./config/db.js');
const router = require('./routes/index.js');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const app = express();

/* ---------------------- CORS CONFIG ---------------------- */
const corsOptions = {
  origin: function (origin, callback) {
    // Allow server-to-server, Postman, ThunderClient
    if (!origin) return callback(null, true);

    const allowedOrigins = [
      'http://localhost:5173',
      'http://127.0.0.1:5173',
      'http://localhost:3000',
      'http://127.0.0.1:3000'
    ];

    // Check local dev domains OR hosted domains
    if (
      allowedOrigins.includes(origin) ||
      /\.vercel\.app$/.test(origin) ||
      /\.onrender\.com$/.test(origin)
    ) {
      console.log(`CORS allowed for origin: ${origin}`);
      return callback(null, true);
    }

    console.log(`CORS blocked for origin: ${origin}`);
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

/* ---------------------- DATABASE ---------------------- */
connectDB();

/* ---------------------- ROUTES ------------------------ */
app.use('/api', router);

/* ---------------------- START SERVER ------------------ */
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
