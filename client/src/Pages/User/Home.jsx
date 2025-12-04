import React, { useState, useEffect } from 'react'
import axiosInstance from '../../Config/axiosInstance'
import { Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight, Users, MapPin, Calendar, Clock, CheckCircle, ExternalLink, Plus } from 'lucide-react'
import { toast } from 'react-toastify'

function Home() {
  const [img, setImg] = useState(1)
  const [groups, setGroups] = useState([])
  const [applied, setApplied] = useState([])

  useEffect(() => {
    const interval = setInterval(() => {
      setImg(prev => (prev + 1) % 4)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    fetchAllGroups()
  }, [])

  const [expanded, setExpanded] = useState(null)

  function toggleExpand(id) {
    setExpanded(prev => (prev === id ? null : id))
  }

  function fetchAllGroups() {
    axiosInstance({
      method: "GET",
      url: "/group/all"
    })
      .then(res => {
        setGroups(res?.data?.data || [])
      })
      .catch(err => {
        console.error("Fetch Groups Error:", err)
      })
  }

  function applyToGroup(groupId) {
    toast.promise(
      axiosInstance({
        method: "POST",
        url: "/group/request",
        data: { groupId }
      })
        .then(res => {
          toast.success("Request Sent")
          setGroups(prev => prev.filter(g => g._id !== groupId))
        })
        .catch(err => {
          toast.error(err?.response?.data?.message || "Failed to apply")
        }),
      { pending: "Applying..." }
    )
  }

  function formatSlots(slotStr) {
    if (!slotStr) return []

    const slots = slotStr.split(",").map(Number)

    return slots.map((s) => {
      const startH = (s - 1) % 12 || 12
      const endH = s % 12 || 12
      const startP = s - 1 < 12 ? "AM" : "PM"
      const endP = s < 12 ? "AM" : "PM"

      return `${startH}:00 ${startP} - ${endH}:00 ${endP}`
    })
  }

  function scrollGroups(direction) {
    const container = document.getElementById("groupScroll")
    if (!container) return
    const scrollAmount = 200
    container.scrollLeft += direction === "left" ? -scrollAmount : scrollAmount
  }

  return (
    <div className="w-full">
      <div className="relative w-full h-screen">
        <div className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(/img${img}.jpg)` }}></div>
        <div className="absolute inset-0 bg-black/50"></div>

        <div className="relative z-10 flex flex-col items-center justify-center h-full text-white px-4 text-center space-y-4">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
            Welcome to TurfBook
          </h1>
          <p className="text-lg md:text-2xl max-w-2xl">
            Your go-to platform for booking turfs, playing sports, and spreading happiness.
          </p>
          <Link
            to='/turf'
            className="mt-4 px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold transition-all duration-300 flex items-center gap-2"
          >
            <ExternalLink size={20} />
            Explore Turfs
          </Link>
        </div>
      </div>

      <div className="relative w-full  px-6 py-10 bg-white ">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Active Groups</h2>

        <div id="groupScroll" className="flex gap-4 scroll-smooth pb-3  py-8 md:px-12 relative  min-h-[300px] md:min-h-[350px]" style={{ overflowX: "auto", overflowY: "visible" }}>
          {groups.length === 0 ? (
            <div className="flex flex-col items-center justify-center w-full py-8 text-gray-500">
              <Users size={48} className="mb-2 opacity-50" />
              <p>No groups available</p>
            </div>
          ) : (
            groups.map(g => (
              <div key={g._id} className="relative">
                <div
                  onClick={() => toggleExpand(g._id)}
                  className={`
                    transition-all duration-300 rounded-xl shadow-lg bg-white p-4 cursor-pointer border border-green-100
                    ${expanded === g._id
                      ? "absolute top-0 left-0 z-50 translate-y-[-20px] min-w-[350px] h-auto scale-[1.05] border-green-300"
                      : "relative z-10 min-w-[220px] h-40 hover:border-green-200"
                    }
                  `}
                  style={{ width: expanded === g._id ? "350px" : "220px" }}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-bold text-gray-900 text-lg flex-1">{g.message}</h3>
                    <Users size={16} className="text-green-600 mt-1" />
                  </div>

                  <div className="flex items-center gap-1 text-sm text-gray-600 mb-1">
                    <Users size={14} className="text-green-500" />
                    <span>Players Needed: {g.requiredPlayers}</span>
                  </div>

                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <CheckCircle size={14} className="text-green-500" />
                    <span>Status: {g.status}</span>
                  </div>

                  {expanded === g._id && (
                    <div className="mt-3 border-t border-green-100 pt-3 flex flex-col gap-2">
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <Users size={16} className="text-green-600" />
                        <span><strong>Team:</strong> {g.bookingId?.teamName}</span>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <MapPin size={16} className="text-green-600" />
                        <span><strong>Turf:</strong> {g.bookingId?.turfId?.name}</span>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <MapPin size={16} className="text-green-600" />
                        <span><strong>Location:</strong> {g.bookingId?.turfId?.location}</span>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <Calendar size={16} className="text-green-600" />
                        <span><strong>Date:</strong> {new Date(g.bookingId?.date).toLocaleDateString()}</span>
                      </div>

                      <div className="flex items-start gap-3">
                        <Clock size={16} className="text-green-600" />
                        <div>
                          <p className="font-medium text-gray-900 mb-2">Time Slots</p>
                          <div className="gap-2 grid grid-cols-2 overflow-y-auto max-h-20">
                            {formatSlots(g.bookingId?.Slot).map((time, index) => (
                              <div key={index} className="text-sm text-gray-600 bg-gray-50 px-1 py-2 rounded border">
                                {time}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          applyToGroup(g._id)
                        }}
                        className="mt-3 px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 font-semibold transition-all duration-200 flex items-center justify-center gap-2"
                      >
                        <Plus size={18} />
                        Apply to Join
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        <button
          onClick={() => scrollGroups('right')}
          className="hidden md:flex absolute left-2 z-50 top-1/2 -translate-y-1/2 bg-white hover:bg-green-50 text-green-600 p-3 rounded-full transition-all duration-200 shadow-lg hover:scale-105 border border-green-200"
        >
          <ChevronLeft size={20} />
        </button>

        <button
          onClick={() => scrollGroups('left')}
          className="hidden md:flex absolute right-2 z-50 top-1/2 -translate-y-1/2 bg-white hover:bg-green-50 text-green-600 p-3 rounded-full transition-all duration-200 shadow-lg hover:scale-105 border border-green-200"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  )
}

export default Home