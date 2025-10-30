const Payment = require('../models/paymentModel.js');
const Booking = require('../models/bookingModel.js');

const getFreeSlots = async (req, res) => {
    try {
        const { turfId } = req.params;
        const { date } = req.body;

        if (!date) {
            return res.status(400).json({ success: false, message: 'Date is required in body' });
        }

        const allSlots = Array.from({ length: 24 }, (_, i) => (i + 1).toString());

        const dayStart = new Date(date);
        dayStart.setHours(0, 0, 0, 0);
        const dayEnd = new Date(dayStart);
        dayEnd.setHours(23, 59, 59, 999);

        const bookings = await Booking.find({
            turfId,
            date: { $gte: dayStart, $lte: dayEnd }
        });

        const bookedSlots = [];
        bookings.forEach(booking => {
            if (booking.Slot) {
                booking.Slot.split(',').forEach(slot => bookedSlots.push(slot.trim()));
            }
        });

        const bookedSet = new Set(bookedSlots);

        const freeSlots = allSlots.filter(slot => !bookedSet.has(slot));

        res.status(200).json({ success: true, data: freeSlots });

    } catch (error) {
        console.error('Get Free Slots Error:', error);
        res.status(500).json({ success: false, message: 'Get Free Slots Error: Server error', error: error.message });
    }
};


const createBooking = async (req, res) => {
    try {
        const userId = req.user.id;
        const { turfId, date, Slot, teamName, payment } = req.body;

        if (!turfId || !date || !Slot || !teamName) {
            return res.status(400).json({ success: false, message: 'All booking fields are required' });
        }

        const requestedSlots = Array.isArray(Slot) ? Slot.map(String) : Slot.split(',').map(s => s.trim());

        if (requestedSlots.length === 0 || requestedSlots.some(s => isNaN(s) || s < 1 || s > 24)) {
            return res.status(400).json({ success: false, message: 'Invalid slot numbers' });
        }

        if (!payment || !payment.amount || !payment.paymentMethod) {
            return res.status(400).json({ success: false, message: 'Payment amount and method are required' });
        }

        const dayStart = new Date(date);
        dayStart.setHours(0, 0, 0, 0);
        const dayEnd = new Date(dayStart);
        dayEnd.setHours(23, 59, 59, 999);

        const bookings = await Booking.find({
            turfId,
            date: { $gte: dayStart, $lte: dayEnd }
        });

        const bookedSlots = new Set();
        bookings.forEach(b => {
            if (b.Slot) b.Slot.split(',').forEach(slot => bookedSlots.add(slot.trim()));
        });

        const conflict = requestedSlots.some(slot => bookedSlots.has(slot));
        if (conflict) {
            return res.status(409).json({ success: false, message: 'One or more requested slots are already booked' });
        }

        const newBooking = await Booking.create({
            userId,
            turfId,
            teamName,
            date: dayStart,
            Slot: requestedSlots.join(','),
            status: 'confirmed'
        });

        const newPayment = await Payment.create({
            userId,
            bookingId: newBooking._id,
            turfId,
            amount: payment.amount,
            paymentMethod: payment.paymentMethod,
            paymentDate: payment.paymentDate || Date.now()
        });

        res.status(201).json({
            success: true,
            message: 'Booking and payment created successfully',
            data: { booking: newBooking, payment: newPayment }
        });

    } catch (error) {
        console.error('Create Booking Error:', error);
        res.status(500).json({ success: false, message: 'Create Booking Error: Server error', error: error.message });
    }
};

const deleteBooking = async (req, res) => {
    try {
        const { id } = req.params
        const booking = await Booking.findById(id)
        if (!booking){

            return res.status(404).json({ success: false, message: 'Booking not found', data: null })
        } 
        booking.status = booking.status === 'confirmed' ? 'cancelled' : 'confirmed'

        await booking.save()

        res.status(200).json({ success: true, message: `Booking status updated to '${booking.status}'`, data: booking })

    } catch (error) {
        console.error('Delete Booking Error:', error)
        res.status(500).json({ success: false, message: 'Update Boking Error: Server error', error: error.message })
    }
}

const getAllBookings = async (req, res) => {
    try {
        const userId = req.user.id

        const bookings = await Booking.find({ userId })

        if (!bookings || bookings.length === 0) {
            return res.status(200).json({ success: true, data: {} })
        }

        res.status(200).json({ success: true, data: bookings })

    } catch (error) {
        console.error('Get All Bookings Error:', error)
        res.status(500).json({ success: false, message: 'Get All Bookings Error: Server error', error: error.message })
    }
}


module.exports = { getFreeSlots, createBooking, deleteBooking, getAllBookings };
