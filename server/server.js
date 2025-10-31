const express = require('express')
require('dotenv').config()
const connectDB = require('./config/db.js')
const router = require('./routes/index.js')
const cookieParser = require('cookie-parser')
const cors = require('cors')

const port = process.env.PORT
const app = express()

app.use(cors({
    origin: process.env.BASE_URL,
    methods: ['GET', 'POST', 'DELETE', 'PUT','PATCH'],
    credentials: true
}))


connectDB()


app.use(express.json())

app.use(cookieParser())

//http://localhost:3000/api
app.use('/api',router)


app.listen(port, () => {
  console.log(`App running on port ${port}`)
})