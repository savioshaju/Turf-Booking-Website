const Turf = require('../models/turfModel')

const createTurf = async (req, res) => {
    try {
        const { name, location, type, cost, openTime, closeTime, phone, turfImg } = req.body

        if (!name || !location || !type || !cost || !openTime || !closeTime || !phone) {
            return res.status(400).json({ success: false, message: 'All required fields must be provided' })
        }
        const adminId = req.user.id

        const turf = await Turf.create({
            name,
            location,
            type,
            cost,
            openTime,
            closeTime,
            phone,
            turfImg: turfImg || null,
            adminId
        })

        if (!turf) {
            return res.status(500).json({ success: false, message: 'Turf creation failed' })
        }

        res.status(201).json({ success: true, message: 'Turf created successfully', data: turf })
    } catch (error) {
        console.error('Turf Creating Error :', error);
        res.status(500).json({ success: false, message: 'Turf Creating Error : Server error', error: error.message })
    }
}


const getAllTurfs = async (req, res) => {
    try {
        const turfs = await Turf.find()
        if (turfs.length === 0) {
            return res.status(404).json({ success: false, message: 'No turfs found' })
        }
        res.status(200).json({ success: true, data: turfs })
    } catch (error) {
        console.error('fetch turfs Error :', error)
        res.status(500).json({ success: false, message: 'Fetch turf Error  :Server Error', error: error.message })
    }
}
const getTurfById = async (req, res) => {
    try {
        const { id } = req.params;
        const turf = await Turf.findById(id)

        if (!turf) {
            return res.status(404).json({ success: false, message: 'Turf not found' })
        }

        res.status(200).json({ success: true, data: turf })
    } catch (error) {
        console.error('Fetch turf by ID Error :', error)
        res.status(500).json({ success: false, message: 'Fetch turf by ID Error : Server error', error: error.message })
    }
}
const getMyTurfs = async (req, res) => {
    try {
        const adminId = req.user.id
        const myTurfs = await Turf.find({ adminId })
        console.log(adminId)
        if (myTurfs.length === 0) {
            return res.status(404).json({ success: false, message: 'No turfs found for this admin' })
        }

        res.status(200).json({ success: true, data: myTurfs })
    } catch (error) {
        console.error('Fetch My Turfs Error :', error)
        res.status(500).json({ success: false, message: 'Fetch My Turf Error : Server error ', error: error.message })
    }
}

const updateTurf = async (req, res) => {
    try {
        const { id } = req.params
        const adminId = req.user.id

        console.log(req.body);


        const turf = await Turf.findById(id)
        if (!turf) {
            return res.status(404).json({ success: false, message: 'Turf not found' })
        }
        if (turf.adminId.toString() !== adminId.toString()) {
            return res.status(403).json({ success: false, message: 'Unauthorized: You can update only your own turfs' })
        }
        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({ success: false, message: 'No fields provided for update' })
        }
        const updatedTurf = await Turf.findByIdAndUpdate(
            id,
            { $set: req.body },
            { new: true, runValidators: true, context: 'query' }
        )

        if (!updatedTurf) {
            return res.status(500).json({ success: false, message: 'Turf update failed' })
        }
        res.status(200).json({ success: true, message: 'Turf updated successfully', data: updatedTurf })
    } catch (error) {
        console.error('Update Turf Error :', error)
        res.status(500).json({ success: false, message: 'Update Turf Error : Server error', error: error.message })
    }
}


const deleteTurf = async (req, res) => {
    try {
        const { id } = req.params
        const adminId = req.user.id
        console.log(adminId)

        const turf = await Turf.findById(id)

        if (!turf) {
            return res.status(404).json({ success: false, message: 'Turf not found' })
        }

        if (turf.adminId.toString() !== adminId.toString()) {
            return res.status(403).json({ success: false, message: 'Unauthorized: You can delete only your own turfs' })
        }

        const deletedTurf = await Turf.findByIdAndDelete(id)
        if (!deletedTurf) {
            return res.status(500).json({ success: false, message: 'Turf deletion failed' })
        }

        res.status(200).json({ success: true, message: 'Turf deleted successfully' })
    } catch (error) {
        console.error('Delete Turf Error :', error)
        res.status(500).json({ success: false, message: 'Delete Turf Error :Server error', error: error.message })
    }
}


module.exports = { createTurf, deleteTurf, updateTurf, getAllTurfs, getTurfById, getMyTurfs }