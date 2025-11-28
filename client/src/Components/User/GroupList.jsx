import React, { useState } from "react"  
import { Users, MapPin, Clock, CheckCircle } from "lucide-react"  

function GroupList({
  myGroups = [],
  joined = [],
  applied = [],
  onSelect,
}) {
  const [tab, setTab] = useState("all")  

  const tabs = [
    { id: "all", label: "All", count: myGroups.length + joined.length + applied.length },
    { id: "my", label: "My Groups", count: myGroups.length },
    { id: "joined", label: "Joined", count: joined.length },
    { id: "applied", label: "Applied", count: applied.length }
  ]  

  let list = []  
  if (tab === "all") {
    list = [
      ...myGroups.map(g => ({...g, _type: "my"})),
      ...joined.map(g => ({...g, _type: "joined"})),
      ...applied.map(g => ({...g, _type: "applied"}))
    ]  
  } else if (tab === "my") {
    list = myGroups.map(g => ({...g, _type: "my"}))  
  } else if (tab === "joined") {
    list = joined.map(g => ({...g, _type: "joined"}))  
  } else if (tab === "applied") {
    list = applied.map(g => ({...g, _type: "applied"}))  
  }
  console.log(list)


  return (
    <div className="bg-white rounded-xl border border-gray-200 h-[80vh] flex flex-col">

      <div className="flex border-b border-gray-200 px-6 overflow-x-auto no-scrollbar whitespace-nowrap">
        {tabs.map(({ id, label, count }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`flex items-center gap-2 px-4 py-3 font-semibold border-b-2 transition-colors relative ${
              tab === id
                ? "text-green-700 border-green-600"
                : "text-gray-500 border-transparent hover:text-gray-700"
            }`}
          >
            {label}
            {count > 0 && (
              <span className={`inline-flex items-center justify-center min-w-6 h-6 px-1.5 rounded-full text-xs font-medium ${
                tab === id 
                  ? "bg-green-100 text-green-800" 
                  : "bg-gray-100 text-gray-600"
              }`}>
                {count}
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {list.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>No groups found</p>
          </div>
        ) : (
          <div className="space-y-3">
            {list.map((g) => {
              const isApplied = g._type === "applied"  
              const isMyGroup = g._type === "my"  
              const isJoined = g._type === "joined"  
              const isClickable = !isApplied  
              
              const playerCount = g.players?.length || 0  
              const requiredPlayers = g.requiredPlayers || 0  
              const turfName = g.bookingId?.turfId?.name   

              const borderColor = isMyGroup ? 'border-l-green-400' : 
                                isJoined ? 'border-l-blue-400' : 
                                'border-l-yellow-400'  

              return (
                <div
                  key={g._id}
                  onClick={isClickable ? () => onSelect(g) : undefined}
                  className={`p-4 rounded-xl border border-gray-200 border-l-4 transition-all ${borderColor} ${
                    isClickable 
                      ? "bg-white hover:shadow-md cursor-pointer" 
                      : "bg-gray-50 cursor-not-allowed opacity-80"
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-gray-900 pr-4">{g.message}</h3>
                    <div className="flex gap-2 flex-shrink-0">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                        g.status === 'active' ? 'bg-green-100 text-green-800 border-green-200' :
                        g.status === 'pending' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                        'bg-gray-100 text-gray-800 border-gray-200'
                      }`}>
                        {g.status}
                      </span>
                      {isApplied && (
                        <span className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium border border-blue-200">
                          Applied
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center text-sm text-gray-600 mb-2">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span className="font-medium">{turfName}</span>
                  </div>

                  {g.bookingId?.date && (
                    <div className="text-xs text-gray-500 mb-2">
                      {new Date(g.bookingId.date).toLocaleDateString()}    
                    </div>
                  )}

                  <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-100">
                    <span className="inline-flex items-center px-2 py-1 bg-orange-100 text-orange-800 rounded-full text-xs font-medium border border-orange-200">
                      <Users className="w-3 h-3 mr-1" />
                      {playerCount}/{requiredPlayers}
                    </span>
                    
                    {isApplied && (
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="w-4 h-4 mr-1" />
                        Approval Pending
                      </div>
                    )}
                    
                    {isMyGroup && (
                      <div className="flex items-center text-sm text-green-600">
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Owner
                      </div>
                    )}
                    
                    {isJoined && (
                      <div className="flex items-center text-sm text-blue-600">
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Member
                      </div>
                    )}
                  </div>
                </div>
              )  
            })}
          </div>
        )}
      </div>
    </div>
  )  
}

export default GroupList;
