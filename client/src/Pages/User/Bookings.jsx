import React, { useEffect, useState } from 'react'
import axiosInstance from '../../Config/axiosInstance'
import { Calendar, Clock, MapPin } from 'lucide-react'
import { toast } from 'react-toastify'
import { useDispatch, useSelector } from 'react-redux'
import { setMyBookings, updateBookingStatus, updateAvlGrp } from '../../store/slice/myBookingSlice'

export default function Bookings() {
  const dispatch = useDispatch()
  const [tab, setTab] = useState("active")

  const bookings = useSelector(state => state.myBooking.myBookings?.[tab] || [])

  const [loading, setLoading] = useState(true)

  const [showGroupModal, setShowGroupModal] = useState(false)

  const [groupForm, setGroupForm] = useState({
    bookingId: "",
    message: "",
    requiredPlayers: ""
  })


  useEffect(() => {
    if (bookings.length === 0) fetchBookings()
    else setLoading(false)
  }, [tab])

  const [past, setPast] = useState(false)

  function fetchBookings() {
    setLoading(true)
    axiosInstance({
      method: 'GET',
      url: `/booking/my-bookings/?past=${tab === "past"}`
    })
      .then(res => {
        dispatch(setMyBookings(res?.data?.data || { active: [], past: [] }))
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

  function createGroup() {

    if (!groupForm.message || !groupForm.requiredPlayers) {
      toast.error("All fields required")
      return
    }

    toast.promise(
      axiosInstance({
        method: "POST",
        url: "/group/create",
        data: groupForm
      })
        .then(res => {
          toast.success(res?.data?.message || "Group created successfully")
          setShowGroupModal(false)
          dispatch(updateAvlGrp(groupForm.bookingId))
          setGroupForm({ bookingId: "", message: "", requiredPlayers: "" })
        })
        .catch(err => {
          console.error("Create Group Error:", err)
          toast.error(err?.response?.data?.message || "Server Error")
        }),
      { pending: "Creating group..." }
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
  }

  return (
    <div className="px-6  pb-8 flex flex-col gap-8">
      <h1 className="text-4xl font-bold text-start text-gray-900 mb-4">
        My Turf Bookings
      </h1>
      <div className="min-h-[70vh] ">
        <div className="flex gap-6 mb-6">
          <button
            onClick={() => setTab("active")}
            className={`px-4 py-2 font-semibold transition-all
              ${tab === "active" ? "text-green-700 border-b-4 border-green-600" : "text-gray-500"}`} >
            Active
          </button>

          <button
            onClick={() => setTab("past")}
            className={`px-4 py-2 font-semibold transition-all
              ${tab === "past" ? "text-green-700 border-b-4 border-green-600" : "text-gray-500"}`}>
            Past
          </button>
        </div>
        {loading ? (
          <div className="flex justify-center items-center h-48">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          </div>
        ) : bookings.length === 0 ? (
          <div className="flex flex-col justify-center items-center h-48 text-gray-500">
            <p className="text-lg font-medium">No turf bookings yet.</p>
          </div>
        ) : (
          <>
            {tab === "active" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mx-auto px-4">
                {bookings?.map(b => (
                  <div
                    key={b.id}
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
                        <span className="text-sm">{b.turfName}</span>
                      </div>
                      <div className="mt-4 space-y-2 text-gray-700">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-indigo-600" />
                          <span>{formatDate(b.date)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-indigo-600" />
                          <div className="text-sm max-h-10 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-1">
                            {formatTime(b.Slot).map((slot, i) => (
                              <div key={i}>{slot}</div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-6 flex flex-col items-start gap-2">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold 
                  ${b.status === 'confirmed'
                            ? 'bg-green-200 text-green-700'
                            : 'bg-yellow-200 text-yellow-700'}`}
                      >
                        {b.status.toUpperCase()}
                      </span>
                      {tab === "active" && (
                        <div className="flex gap-3">
                          {!b.groupAvailable && b.status !== "cancelled" && (
                            <button
                              onClick={() => {
                                setGroupForm({ ...groupForm, bookingId: b.id })
                                setShowGroupModal(true)
                              }}
                              className="px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold shadow-md hover:bg-blue-700 transition-all"
                            >
                              Create Group
                            </button>
                          )}

                          <button
                            onClick={() => toggleBooking(b.id)}
                            className={`px-4 py-2 rounded-lg text-white font-semibold shadow-md transition-all duration-300
                            ${b.status === 'cancelled'
                                ? 'bg-green-600 hover:bg-green-700'
                                : 'bg-red-600 hover:bg-red-700'}`}
                          >
                            {b.status === 'cancelled' ? 'Reconfirm' : 'Cancel'}
                          </button>

                        </div>
                      )}

                    </div>
                  </div>
                ))}
              </div>)
              :
              (<div>
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white">
                    <thead className="bg-green-600 text-white">
                      <tr>
                        <th className="px-6 py-3 text-left">#</th>
                        <th className="px-6 py-3 text-left">Team Name</th>
                        <th className="px-6 py-3 text-left">Turf Name</th>
                        <th className="px-6 py-3 text-left">Status</th>
                        <th className="px-6 py-3 text-left">Date</th>
                        <th className="px-6 py-3 text-left">Slots</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookings.map((booking, index) => (
                        <tr key={booking._id} className="border-t hover:bg-green-50 transition-colors">
                          <td className="px-6 py-3">{index + 1}</td>
                          <td className="px-6 py-3">{booking.teamName}</td>
                          <td className="px-6 py-3">{booking.turfName}</td>
                          <td className="px-6 py-3 capitalize">
                            <span className={`px-2 py-1 rounded-full text-xs ${booking.status === 'confirmed'
                              ? 'bg-green-100 text-green-800'
                              : booking.status === 'pending'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                              }`}>
                              {booking.status}
                            </span>
                          </td>
                          <td className="px-6 py-3"><span>{formatDate(booking.date)}</span></td>
                          <td className="px-6 py-3">
                            <div className='max-w-[400px] px-1 flex  overflow-x-auto gap-2 no-scrollbar'>
                              {formatTime(booking.Slot).map((time, index) => (
                                <div key={index} className="text-sm text-gray-600 bg-gray-50 px-1 py-2  whitespace-nowrap rounded border">
                                  {time}
                                </div>
                              ))}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>)
            }
          </>
        )}
      </div>
      {showGroupModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-md">

            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Create Group
            </h2>

            <div className="flex flex-col gap-4">

              <input
                type="text"
                placeholder="Message (e.g., Need 3 players)"
                className="border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
                value={groupForm.message}
                onChange={(e) =>
                  setGroupForm({ ...groupForm, message: e.target.value })
                }
              />

              <input
                type="number"
                placeholder="Required Players"
                min="1"
                className="border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
                value={groupForm.requiredPlayers}
                onChange={(e) => {
                  let value = Number(e.target.value)
                  if (value < 1 || isNaN(value)) value = 1
                  setGroupForm({ ...groupForm, requiredPlayers: value })
                }}
              />


              <div className="flex justify-end gap-3 mt-2">
                <button
                  onClick={(e) => {
                    setGroupForm({
                      ...groupForm, requiredPlayers: "", message: ""
                    })
                    setShowGroupModal(false)
                  }}
                  className="px-4 py-2 rounded-xl bg-gray-200 text-gray-800 hover:bg-gray-300 transition-all"
                >
                  Cancel
                </button>

                <button
                  onClick={createGroup}
                  className="px-5 py-2 rounded-xl bg-green-600 text-white hover:bg-green-700 shadow-md transition-all"
                >
                  Create
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  )
}
