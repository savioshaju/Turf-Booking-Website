const express = require('express')
const {createTurf} = require('../controllers/turfControllers')

const turfRouter = express.Router()


turfRouter.post('/create',createTurf)



module.exports = turfRouter