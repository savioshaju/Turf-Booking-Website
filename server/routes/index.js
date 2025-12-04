const express = require('express')
const userRouter = require('./userRoutes.js')
const turfRouter = require('./turfRoutes.js')
const bookingRouter = require('./bookingRoutes.js')
const groupRouter = require('./groupRoutes.js')
const messageRouter = require('./messageRoutes.js')

const router = express.Router()

router.use('/user',userRouter)
router.use('/turf',turfRouter)
router.use('/booking',bookingRouter)
router.use('/group', groupRouter);
router.use('/messages', messageRouter)

module.exports = router