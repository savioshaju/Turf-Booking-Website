import React, { useEffect, useState } from 'react'
import axiosInstance from '../../Config/axiosInstance'
import { Calendar, Clock, MapPin } from 'lucide-react'
import { toast } from 'react-toastify'
import { useDispatch, useSelector } from 'react-redux'
import { setMyBookings, updateBookingStatus } from '../../store/slice/myBookingSlice'

export default function Bookings() {
  const dispatch = useDispatch()
  const [tab, setTab] = useState("active")
  const [groups, setGroups] = useState([])

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
  }, [])

  useEffect(() => {
    fetchAllGroups()
  }, [])
  function fetchAllGroups() {
    axiosInstance({
      method: "GET",
      url: "/group/my-groups/created"
    })
      .then(res => {
        setGroups(res?.data?.data || [])
      })
      .catch(err => {
        console.error("Group Fetch Error:", err)
      })
  }
  function hasGroup(bookingId) {
    return groups.some(g => g.bookingId === bookingId)
  }

  function fetchBookings() {
    setLoading(true)
    axiosInstance({
      method: 'GET',
      url: '/booking/my-bookings'
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
          setGroupForm({ bookingId: "", message: "", requiredPlayers: "" })
          fetchAllGroups()
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
    <div className="px-6  flex flex-col gap-8">
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
            <span className="loading loading-spinner text-primary w-10 h-10" />
          </div>
        ) : bookings.length === 0 ? (
          <div className="flex flex-col justify-center items-center h-48 text-gray-500">
            <p className="text-lg font-medium">No turf bookings yet.</p>
          </div>
        ) : (
          <>
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
                  <div className="mt-6 flex justify-between items-center">
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
                        {!hasGroup(b.id) && b.status !== 'cancelled' && (
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
            </div>
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
