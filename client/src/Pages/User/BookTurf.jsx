import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import axiosInstance from '../../Config/axiosInstance'
import { toast } from 'react-toastify'
import { useDispatch, useSelector } from 'react-redux'
import { setTurfDetail } from '../../store/slice/turfDetailSlice'
import { setBookingField } from '../../store/slice/BookingSlice'
import { useNavigate } from 'react-router-dom'

function BookTurf() {
    const { id } = useParams()
    const storedTurf = useSelector(state => state.turfDetail.turfs[id])
    const [booking, setBooking] = useState({
        date: '',
        slots: [],
        teamName: ''
    })
    const dispatch = useDispatch()

    useEffect(() => {
        if (storedTurf) return

        setLoading(true)
        axiosInstance({
            method: 'GET',
            url: `/turf/getById/${id}`
        })
            .then(res => {
                setTurf(res.data.data)
                dispatch(setTurfDetail({ id, data: res.data.data }))
            })
            .catch((err) => {
                toast.error('No data found')
            })
            .finally(() => setLoading(false))
    }, [id, storedTurf, dispatch])

    const [availableSlots, setAvailableSlots] = useState([])
    const [loading, setLoading] = useState(false)

    const fetchSlots = async (selectedDate) => {
        if (!id || !selectedDate) return
        setLoading(true)

        axiosInstance({
            method: 'POST',
            url: `/booking/free-slots/${id}`,
            data: { date: selectedDate }
        })
            .then((res) => {
                setAvailableSlots(res.data.data)
            }).catch((err) => {
                toast.error('Failed to get slots')
            }).finally(() => {
                setLoading(false)
            })
    }

    const handleDateChange = (e) => {
        const date = e.target.value
        const today = new Date()
        const selected = new Date(date)

        today.setHours(0, 0, 0, 0)
        selected.setHours(0, 0, 0, 0)

        if (selected < today) {
            toast.error('Cannot select a past date')
            return
        }

        setBooking({ ...booking, date, slots: [] })
        fetchSlots(date)
    }



    const getCurrentHour = () => new Date().getHours()


    const handleSlotToggle = (slot) => {
        const newSlots = booking.slots.includes(slot)
            ? booking.slots.filter(s => s !== slot)
            : [...booking.slots, slot]
        setBooking({ ...booking, slots: newSlots })
    }

    const navigate = useNavigate()
    const handleBook = () => {
        if (!booking.date || booking.slots.length === 0 || !booking.teamName) {
            toast.error('Please fill all required fields')
            return
        }

        dispatch(setBookingField({ field: 'date', value: booking.date }))
        dispatch(setBookingField({ field: 'slots', value: booking.slots }))
        dispatch(setBookingField({ field: 'teamName', value: booking.teamName }))
        dispatch(setBookingField({ field: 'turfId', value: id }))
        dispatch(setBookingField({ field: 'costPerHour', value: costPerHour }))

        toast.success('Booking successfull. Pay for Conformation')
        setTimeout(() => {
            navigate('/user/payment')
        }, 500)

        setBooking({
            date: '',
            slots: [],
            teamName: ''
        })
    }

    const allSlots = Array.from({ length: 24 }, (_, i) => i + 1)
    const costPerHour = storedTurf?.cost || 0
    const totalAmount = costPerHour * booking.slots.length

    const formatTimeSlot = (slot) => {
        const startHour = (slot - 1) % 12 === 0 ? 12 : (slot - 1) % 12
        const startPeriod = (slot - 1) < 12 ? 'AM' : 'PM'
        const endHour = slot % 12 === 0 ? 12 : slot % 12
        const endPeriod = slot < 12 ? 'AM' : 'PM'

        return `${startHour}:00 ${startPeriod} - ${endHour}:00 ${endPeriod}`
    }
    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            </div>
        )
    }

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <div className="mb-8 text-center">
                <h1 className="text-3xl font-bold text-green-700 mb-2">Book Your Turf</h1>
                <p className="text-gray-600">Select your preferred date and time slots</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <div className="flex items-center mb-4">
                            <div className="w-3 h-6 bg-green-500 rounded-full mr-3"></div>
                            <h2 className="text-xl font-semibold text-gray-800">Select Date</h2>
                        </div>
                        <input
                            type="date"
                            value={booking.date}
                            onChange={handleDateChange}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                        />
                    </div>
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <div className="flex items-center mb-4">
                            <div className="w-3 h-6 bg-green-500 rounded-full mr-3"></div>
                            <h2 className="text-xl font-semibold text-gray-800">Available Time Slots</h2>
                        </div>

                        {loading ? (
                            <div className="flex justify-center py-8">
                                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-green-500"></div>
                            </div>
                        ) : (
                            <>
                                {booking.date ? (
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-60 md:max-h-full overflow-y-auto p-1">
                                        {allSlots.map(slot => {
                                            const isAvailable = availableSlots.includes(slot.toString())
                                            const isSelected = booking.slots.includes(slot)

                                            const isPastSlot = (() => {
                                                if (!booking.date) return false
                                                const selectedDate = new Date(booking.date)
                                                const today = new Date()
                                                return (
                                                    selectedDate.toDateString() === today.toDateString() &&
                                                    slot <= getCurrentHour()
                                                )
                                            })()

                                            const disabled = !isAvailable || isPastSlot

                                            return (
                                                <button
                                                    key={slot}
                                                    disabled={disabled}
                                                    onClick={() => !disabled && handleSlotToggle(slot)}
                                                    className={`
                                                                p-3 rounded-lg text-center transition-all duration-200 text-sm font-medium
                                                                ${disabled
                                                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                            : isSelected
                                                                ? 'bg-green-600 text-white shadow-md transform scale-105'
                                                                : 'bg-gray-50 text-gray-700 hover:bg-green-50 hover:text-green-700 hover:shadow-sm border border-gray-200'
                                                        }`}
                                                >
                                                    {formatTimeSlot(slot)}
                                                </button>
                                            )
                                        })}

                                    </div>
                                ) : (
                                    <div className="text-center py-8 text-gray-500">
                                        Please select a date to view available slots
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
                <div className='flex flex-col gap-y-2'>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <div className="flex items-center mb-6">
                            <div className="w-3 h-6 bg-orange-500 rounded-full mr-3"></div>
                            <h2 className="text-xl font-semibold text-gray-800">Team Details</h2>
                        </div>
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Team Name</label>
                            <input
                                type="text"
                                name="teamName"
                                value={booking.teamName}
                                onChange={(e) => setBooking({ ...booking, teamName: e.target.value })}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                                placeholder="Enter your team name"
                            />
                        </div>
                    </div>

                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-6">
                            <div className="flex items-center mb-6">
                                <div className="w-3 h-6 bg-green-500 rounded-full mr-3"></div>
                                <h2 className="text-xl font-semibold text-gray-800">Booking Summary</h2>
                            </div>

                            <div className="space-y-4 mb-6 p-4 bg-gray-50 rounded-lg">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Cost per hour:</span>
                                    <span className="font-semibold text-green-700">₹{costPerHour}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Selected slots:</span>
                                    <span className="font-semibold">{booking.slots.length}</span>
                                </div>
                                <div className="border-t pt-3 flex justify-between items-center">
                                    <span className="text-lg font-medium text-gray-800">Total Amount:</span>
                                    <span className="text-xl font-bold text-green-700">₹{totalAmount}</span>
                                </div>
                            </div>

                            {booking.slots.length > 0 && (
                                <div className="mb-6">
                                    <h3 className="font-medium text-gray-700 mb-2">Selected Time Slots:</h3>
                                    <div className="space-y-2 max-h-32 overflow-y-auto">
                                        {booking.slots.sort((a, b) => a - b).map(slot => (
                                            <div key={slot} className="text-sm bg-green-50 text-green-700 px-3 py-2 rounded">
                                                {formatTimeSlot(slot)}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <button
                                onClick={handleBook}
                                disabled={!booking.date || booking.slots.length === 0 || !booking.teamName}
                                className={`
                                w-full py-3 px-4 rounded-lg font-semibold text-white transition-all duration-200
                                ${(!booking.date || booking.slots.length === 0 || !booking.teamName)
                                        ? 'bg-gray-400 cursor-not-allowed'
                                        : 'bg-green-600 hover:bg-green-700 shadow-md hover:shadow-lg'
                                    }
                            `}
                            >
                                Book Now
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BookTurf