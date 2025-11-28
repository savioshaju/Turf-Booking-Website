const express = require('express')
const userRouter = require('./userRoutes.js')
const turfRouter = require('./turfRoutes.js')
const bookingRouter = require('./bookingRoutes.js')
const groupRouter = require('./groupRoutes.js'); 
const router = express.Router()

router.use('/user',userRouter)
router.use('/turf',turfRouter)
router.use('/booking',bookingRouter)
router.use('/group', groupRouter);

module.exports = router