import React, { useEffect, useState } from 'react'
import axiosInstance from '../../Config/axiosInstance'
import { Calendar, Clock, MapPin } from 'lucide-react'
import { toast } from 'react-toastify'
import { useDispatch, useSelector } from 'react-redux'
import { setMyBookings, updateBookingStatus } from '../../store/slice/myBookingSlice'

export default function Bookings() {
  const dispatch = useDispatch()
  const bookings = useSelector(state => state.myBooking.myBookings)


  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (bookings.length === 0) fetchBookings()
    else setLoading(false)
  }, [])

  function fetchBookings() {
    setLoading(true)
    axiosInstance({
      method: 'GET',
      url: '/booking/my-bookings'
    })
      .then(res => {
        dispatch(setMyBookings(res?.data?.data || []))
      })
      .catch(err => {
        console.error('Booking Fetch Error:', err)
        toast.error('Failed to load bookings')
      })
      .finally(() => setLoading(false))
  }

  function toggleBooking(id) {
    toast.promise(
      axiosInstance({
        method: 'DELETE',
        url: `/booking/cancel/${id}`
      })
        .then(res => {
          const updated = res?.data?.data
          dispatch(updateBookingStatus(updated))
          toast.success(res?.data?.message || 'Status updated')
        })
        .catch(err => {
          console.error('Cancel Error:', err)
          toast.error(err?.response?.data?.message || 'Server Error')
        }),
      { pending: 'Updating booking...' }
    )
  }

  function formatDate(dateStr) {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-IN', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  function formatTime(slotString) {
    const slots = slotString.split(',').map(Number)
    return slots
      .map(s => {
        const startHour = (s - 1) % 12 === 0 ? 12 : (s - 1) % 12
        const startPeriod = (s - 1) < 12 ? 'AM' : 'PM'
        const endHour = s % 12 === 0 ? 12 : s % 12
        const endPeriod = s < 12 ? 'AM' : 'PM'
        return `${startHour}:00 ${startPeriod} - ${endHour}:00 ${endPeriod}`
      })
      .join(', ')
  }

  return (
    <div className="p-6 flex flex-col gap-8">
      <h1 className="text-4xl font-bold text-center text-gray-900 mb-4">
        My Turf Bookings
      </h1>

      {loading ? (
        <div className="flex justify-center items-center h-48">
          <span className="loading loading-spinner text-primary w-10 h-10" />
        </div>
      ) : bookings.length === 0 ? (
        <p className="text-center text-gray-500 text-lg">
          No turf bookings yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookings.map(b => (
            <div
              key={b._id}
              className={`p-6 rounded-2xl shadow-xl relative 
              ${b.status === 'confirmed'
                  ? 'border-l-8 border-green-500'
                  : ' border-l-8 border-yellow-500'}
              flex flex-col justify-between transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_20px_#00000025]`}
            >
              <div>
                <div className="text-2xl font-bold text-gray-800 mb-1">
                  {b.teamName}
                </div>
                <div className="flex items-center text-gray-700 gap-2">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">{b.turfId}</span>
                </div>
                <div className="mt-4 space-y-2 text-gray-700">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-indigo-600" />
                    <span>{formatDate(b.date)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-indigo-600" />
                    <span className="text-sm">{formatTime(b.Slot)}</span>
                  </div>
                </div>
              </div>
              <div className="mt-6 flex justify-between items-center">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold 
                  ${b.status === 'confirmed'
                      ? 'bg-green-200 text-green-700'
                      : 'bg-yellow-200 text-yellow-700'}`}
                >
                  {b.status.toUpperCase()}
                </span>
                <button
                  onClick={() => toggleBooking(b._id)}
                  className={`px-4 py-2 rounded-lg text-white font-semibold shadow-md transition-all duration-300
                    ${b.status === 'cancelled'
                      ? 'bg-green-600 hover:bg-green-700'
                      : 'bg-red-600 hover:bg-red-700'}`}
                >
                  {b.status === 'cancelled' ? 'Reconfirm' : 'Cancel'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
