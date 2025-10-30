const Turf = require('../models/turfModel.js')


const createTurf = async (req, res) => {
    try {
        const { name, location, type, cost, openTime, closeTime, phone, turfImg } = req.body || {}
        console.log(name, location, type)

    } catch (error) {

    }

}


module.exports = { createTurf }