import React from "react"

const BookingSummary = ({ booking }) => {
    const formatTimeSlot = (slot) => {
        const startHour = (slot - 1) % 12 === 0 ? 12 : (slot - 1) % 12
        const startPeriod = (slot - 1) < 12 ? 'AM' : 'PM'
        const endHour = slot % 12 === 0 ? 12 : slot % 12
        const endPeriod = slot < 12 ? 'AM' : 'PM'
        return `${startHour}:00 ${startPeriod} - ${endHour}:00 ${endPeriod}`
    }

    return (
        <div className="bg-white rounded-xl shadow-lg p-6 sticky top-6 h-fit">
            <div className="border-b pb-4 mb-4">
                <h2 className="text-xl font-bold text-gray-800">Booking Summary</h2>
                <p className="text-gray-600 text-sm mt-1">Turf Reservation Details</p>
            </div>

            <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-center">
                    <span className="text-gray-600">Cost per hour:</span>
                    <span className="font-semibold text-green-700">₹{booking.costPerHour}</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-gray-600">Selected slots:</span>
                    <span className="font-semibold">{booking.slots.length}</span>
                </div>
                <div className="border-t pt-3 flex justify-between items-center">
                    <span className="text-lg font-medium text-gray-800">Total Amount:</span>
                    <span className="text-xl font-bold text-green-700">₹{booking.slots.length * booking.costPerHour}</span>
                </div>
            </div>

            {booking.slots.length > 0 && (
                <div className="mt-6">
                    <h3 className="font-medium text-gray-700 mb-3">Selected Time Slots:</h3>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                        {[...booking.slots].sort((a, b) => a - b).map(slot => (
                            <div
                                key={slot}
                                className="text-sm bg-green-50 text-green-700 px-3 py-2 rounded-lg flex items-center"
                            >
                                <svg
                                    className="w-4 h-4 mr-2 text-green-500"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                                {formatTimeSlot(slot)}
                            </div>
                        ))}
                    </div>
                </div>
            )}

        </div>
    )
}

export default BookingSummary