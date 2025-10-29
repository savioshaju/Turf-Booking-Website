const Turf = require('../models/turfModel.js')


const createTurf = async (req, res) => {
    
    const { name, location, type, cost, openTime, closeTime, phone, turfImg } = req.body||{}
    console.log(name,location,type)

}


module.exports = { createTurf }