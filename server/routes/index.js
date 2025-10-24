const express = require('express')
const userRouter = require('./userRoutes.js')
const router = express.Router()

router.use('/user',userRouter)


module.exports = router