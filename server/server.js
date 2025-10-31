const express = require('express');
require('dotenv').config();
const connectDB = require('./config/db.js');
const router = require('./routes/index.js');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const app = express();

// Dynamic CORS: allow all Vercel frontends (or all Render frontends if you move there)
const corsOptions = {
  origin: function(origin, callback) {
    if (!origin) return callback(null, true); // allow server-to-server requests
    if (/\.vercel\.app$/.test(origin) || /\.onrender\.com$/.test(origin)) {
      console.log(`CORS allowed for origin: ${origin}`);
      return callback(null, true);
    }
    console.log(`CORS blocked for origin: ${origin}`);
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
