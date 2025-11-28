import React from "react"
import { Users, Calendar, MapPin, Clock, MessageSquare, User, Mail, Phone, X, LogOut, CheckCircle, XCircle, MoreHorizontal } from "lucide-react"

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

function StatusBadge({ status }) {
  const statusConfig = {
    active: { color: "bg-green-100 text-green-800 border-green-200", label: "Active" },
    pending: { color: "bg-yellow-100 text-yellow-800 border-yellow-200", label: "Pending" },
    full: { color: "bg-blue-100 text-blue-800 border-blue-200", label: "Full" },
    cancelled: { color: "bg-red-100 text-red-800 border-red-200", label: "Cancelled" }
  }

  const config = statusConfig[status] || statusConfig.active

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${config.color}`}>
      {config.label}
    </span>
  )
}

function PlayerCountBadge({ current, required }) {
  const isFull = current >= required

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${isFull
        ? "bg-purple-100 text-purple-800 border-purple-200"
        : "bg-orange-100 text-orange-800 border-orange-200"
      }`}>
      <Users className="w-3 h-3 mr-1" />
      {current}/{required}
    </span>
  )
}

function GroupDetails({
  group,
  activeTab,
  setActiveTab,
  requests = [],
  isOwner,
  onDecision,
  onLeave,
  onRemovePlayer
}) {
  if (!group) {
    return (
      <div className="bg-white p-8 rounded-xl border border-gray-200 text-center text-gray-500">
        <Users className="w-12 h-12 mx-auto mb-3 text-gray-400" />
        <p className="text-lg font-medium">Select a group to view details</p>
        <p className="text-sm text-gray-400 mt-1">Choose a group from the list to get started</p>
      </div>
    )
  }

  const booking = group.bookingId || {}
  const turf = booking.turfId || {}
  const slotTimes = formatSlots(booking.Slot)
  const currentPlayers = group.players?.length || 0
  const requiredPlayers = group.requiredPlayers || 0

  const tabs = [
    { id: "members", icon: Users, label: "Members" },
    { id: "details", icon: Calendar, label: "Details" },
    ...(isOwner ? [{ id: "requests", icon: MessageSquare, label: "Requests" }] : []),
    { id: "chat", icon: MessageSquare, label: "Chat" }
  ]

  return (
    <div className="bg-white rounded-xl border border-gray-200 flex flex-col h-full overflow-hidden">

      <div className="p-6  bg-green-200">
        <div className="flex justify-between items-start mb-3">
          <h2 className="text-2xl font-bold text-gray-900 pr-4">{group.message}</h2>
          <div className="flex gap-2 flex-shrink-0">
            <StatusBadge status={group.status} />
            <PlayerCountBadge current={currentPlayers} required={requiredPlayers} />
          </div>
        </div>

        <div className="flex items-center  text-sm text-gray-600">
          <span className="font-medium">{group.ownerId?.email}</span>
          <span className="mx-2">  </span>
          <span>Group Owner</span>
        </div>
      </div>

      <div className="flex border-b bg-green-200 border-gray-200 px-6 overflow-x-auto no-scrollbar whitespace-nowrap">

        {tabs.map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-2 px-4 py-3 font-semibold border-b-2 transition-colors ${activeTab === id
                ? "text-green-700 border-green-600"
                : "text-gray-500 border-transparent hover:text-gray-700"
              }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-6">

        {activeTab === "members" && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-semibold text-lg text-gray-900">
                Team Members
              </h4>
              <span className="text-sm text-gray-500">
                {currentPlayers} of {requiredPlayers} players
              </span>
            </div>

            {group.players?.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Users className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                <p>No members yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {group.players.map((player) => (
                  <div
                    key={player._id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                        {player.name?.charAt(0).toUpperCase() || <User className="w-5 h-5" />}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-gray-900">{player.name}</p>
                          {player._id === group.ownerId?._id && (
                            <Crown className="w-4 h-4 text-yellow-500" />
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-xs text-gray-500 mt-1">
                          <span className="flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {player.email}
                          </span>
                          {player.phone && (
                            <span className="flex items-center gap-1">
                              <Phone className="w-3 h-3" />
                              {player.phone}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {isOwner && player._id !== group.ownerId?._id && (
                      <button
                        onClick={() => onRemovePlayer(player._id)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Remove player"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}

            {!isOwner && (
              <button
                onClick={() => onLeave(group._id)}
                className="mt-6 w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-50 text-red-700 border border-red-200 rounded-lg hover:bg-red-100 transition-colors font-medium"
              >
                <LogOut className="w-4 h-4" />
                Leave Group
              </button>
            )}
          </div>
        )}

        {activeTab === "details" && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="p-4 border border-gray-200 rounded-lg">
                <p className="text-sm text-gray-500 mb-1">Players Needed</p>
                <p className="text-2xl font-bold text-gray-900">{requiredPlayers}</p>
              </div>
              <div className="p-4 border border-gray-200 rounded-lg">
                <p className="text-sm text-gray-500 mb-1">Current Players</p>
                <p className="text-2xl font-bold text-gray-900">{currentPlayers}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-4 border border-gray-200 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Booking Information
                </h4>

                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <div>
                      <p className="font-medium text-gray-900">{turf.name}</p>
                      <p className="text-sm text-gray-500">{turf.location}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <div>
                      <p className="font-medium text-gray-900">
                        {booking.date ? new Date(booking.date).toDateString() : "—"}
                      </p>
                    </div>
                  </div>

                  {slotTimes.length > 0 && (
                    <div className="flex items-start gap-3">
                      <Clock className="w-4 h-4 text-gray-400 mt-0.5" />
                      <div>
                        <p className="font-medium text-gray-900 mb-2">Time Slots</p>
                        <div className="space-y-1">
                          {slotTimes.map((time, index) => (
                            <div key={index} className="text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded border">
                              {time}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "requests" && isOwner && (
          <div>
            <h4 className="font-semibold text-lg text-gray-900 mb-4">
              Join Requests
            </h4>

            {requests.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <MessageSquare className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                <p>No pending requests</p>
                <p className="text-sm mt-1">Join requests will appear here</p>
              </div>
            ) : (
              <div className="space-y-3">
                {requests.map((request) => (
                  <div
                    key={request._id}
                    className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center text-white font-semibold">
                          {request.requesterId?.name?.charAt(0).toUpperCase() || <User className="w-5 h-5" />}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{request.requesterId?.name}</p>
                          <div className="flex items-center gap-4 text-xs text-gray-500 mt-1">
                            <span className="flex items-center gap-1">
                              <Mail className="w-3 h-3" />
                              {request.requesterId?.email}
                            </span>
                            {request.requesterId?.phone && (
                              <span className="flex items-center gap-1">
                                <Phone className="w-3 h-3" />
                                {request.requesterId?.phone}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {request.status === "pending" ? (
                        <div className="flex gap-2">
                          <button
                            onClick={() => onDecision(request._id, "approved")}
                            className="flex items-center gap-2 px-3 py-2 bg-green-50 text-green-700 border border-green-200 rounded-lg hover:bg-green-100 transition-colors text-sm font-medium"
                          >
                            <CheckCircle className="w-4 h-4" />
                            Approve
                          </button>
                          <button
                            onClick={() => onDecision(request._id, "rejected")}
                            className="flex items-center gap-2 px-3 py-2 bg-red-50 text-red-700 border border-red-200 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium"
                          >
                            <XCircle className="w-4 h-4" />
                            Reject
                          </button>
                        </div>
                      ) : (
                        <StatusBadge status={request.status} />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "chat" && (
          <div className="text-center py-12 text-gray-500">
            <MessageSquare className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h4 className="font-semibold text-lg text-gray-600 mb-2">Chat Feature Coming Soon</h4>
          </div>
        )}

      </div>
    </div>
  )
}

export default GroupDetails;
