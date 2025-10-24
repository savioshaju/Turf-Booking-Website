const express = require('express')
require('dotenv').config()
const connectDB = require('./config/db.js')

const port = process.env.PORT
connectDB()

const app = express()



app.listen(port, () => {
  console.log(`App running on port ${port}`)
})