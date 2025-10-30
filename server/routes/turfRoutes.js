const express = require('express')
const {createTurf,deleteTurf,updateTurf,getAllTurfs,getTurfById, getMyTurfs} = require('../controllers/turfControllers.js')
const authAdmin = require('../middlewares/authAdmin.js')

const turfRouter = express.Router()


// Create new turf
turfRouter.post('/create',authAdmin, createTurf);
// Get all turfs
turfRouter.get('/all', getAllTurfs);
// Get single turf by ID
turfRouter.get('/getById/:id', getTurfById);
// Get all My turfs
turfRouter.get('/allMyTurf',authAdmin, getMyTurfs);
// Update turf by ID
turfRouter.patch('/update/:id',authAdmin, updateTurf);
// Delete turf by ID
turfRouter.delete('/delete/:id',authAdmin, deleteTurf);

module.exports = turfRouter