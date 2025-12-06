import React, { useEffect, useState, useCallback } from "react"
import { useSelector } from "react-redux"
import axiosInstance from "../../Config/axiosInstance"
import GroupDetails from "../../Components/User/GroupDetails"
import GroupList from "../../Components/User/GroupList"
import { toast } from "react-toastify"


export default function Group() {
  const user = useSelector((state) => state.user.userData)
  const userId = user?._id

  const [myCreated, setMyCreated] = useState([])
  const [myJoined, setMyJoined] = useState([])
  const [applied, setApplied] = useState([])
  const [selectedGroup, setSelectedGroup] = useState(null)
  const [activeTab, setActiveTab] = useState("chat")
  const [requests, setRequests] = useState([])

  const [loadingList, setLoadingList] = useState(true)
  const [loadingDetails, setLoadingDetails] = useState(false)
  const [showDetailsMobile, setShowDetailsMobile] = useState(false)
  const [initialLoad, setInitialLoad] = useState(true)

  const loadAllGroups = useCallback(() => {
    setLoadingList(true)

    axiosInstance({
      method: "GET",
      url: "/group/my-groups/all"
    })
      .then(res => {
        const data = res?.data?.data || {}
        setMyCreated(data.created || [])
        setMyJoined(data.joined || [])
        setApplied(data.applied || [])
      })
      .catch(err => {
        console.error("All Groups Load Error:", err)
        toast.error("Failed to load groups")
      })
      .finally(() => {
        setLoadingList(false)
        setInitialLoad(false)
      })
  }, [])

  const reloadAll = useCallback(() => {
    loadAllGroups()
  }, [loadAllGroups])


  useEffect(() => {
    reloadAll()
  }, [reloadAll])


  const loadGroupDetails = (groupId) => {
    if (!groupId) return

    setLoadingDetails(true)
    toast(
      axiosInstance({
        method: "GET",
        url: `/group/details/${groupId}`
      })
        .then(res => {
          const data = res?.data?.data || {}
          setSelectedGroup(data.group || null)
          setRequests(data.requests || [])
        })
        .catch(err => {
          console.error("Group Details Error:", err)
          const msg = err?.response?.data?.message || "Failed to get details"
          toast.error(msg)
          setSelectedGroup(null)
          setRequests([])
        })
        .finally(() => {
          setLoadingDetails(false)
        })
    )
  }


  const handleSelect = (g) => {
    if (!g || !g._id) return

    setActiveTab("chat")
    loadGroupDetails(g._id)

    if (window.innerWidth < 1024) {
      setShowDetailsMobile(true)
      window.history.pushState({ group: g._id }, "group-details")
    }
  }

  useEffect(() => {
    const handlePop = () => {
      if (window.innerWidth < 1024) {
        setShowDetailsMobile(false)
        setSelectedGroup(null)
      }
    }

    window.addEventListener("popstate", handlePop)
    return () => window.removeEventListener("popstate", handlePop)
  }, [])

  const handleDecision = (requestId, status) => {
    if (!requestId) return

    toast.promise(
      axiosInstance({
        method: "PATCH",
        url: `/group/request/decide/${requestId}`,
        data: { status }
      })
        .then(res => {
          const msg = res?.data?.message
          toast.success(msg)

          return reloadAll()
        })
        .then(() => {
          if (selectedGroup?._id) {
            return loadGroupDetails(selectedGroup._id)
          }
        })
        .catch(err => {
          const msg = err?.response?.data?.message
          toast.error(msg)
        }),
      {
        pending: "Processing..."
      }
    )
  }



  const handleLeave = (groupId) => {
    if (!groupId) return;

    toast.promise(
      axiosInstance({
        method: "DELETE",
        url: `/group/leave/${groupId}`
      })
        .then(res => {
          const msg = res?.data?.message || "Left group"
          toast.success(msg)

          return reloadAll()
        })
        .then(() => {
          setSelectedGroup(null)
          setRequests([])
        })
        .catch(err => {
          const msg = err?.response?.data?.message || "Failed to leave group"
          toast.error(msg)
        }),
      {
        pending: "Leaving..."
      }
    )
  }


  const handleRemovePlayer = (playerId) => {
    if (!playerId || !selectedGroup?._id) return

    toast.promise(
      axiosInstance({
        method: "DELETE",
        url: `/group/remove-player/${selectedGroup._id}/${playerId}`
      })
        .then(res => {
          const msg = res?.data?.message || "Player removed"
          toast.success(msg)

          return reloadAll()
        })
        .then(() => {
          return loadGroupDetails(selectedGroup._id)
        })
        .catch(err => {
          const msg = err?.response?.data?.message || "Failed to remove player"
          toast.error(msg)
        }),
      {
        pending: "Processing..."
      }
    )
  }


  const myGroups = myCreated
  const isOwner = selectedGroup?.ownerId?._id === userId

  const ListLoadingSkeleton = () => (
    <div className="bg-white rounded-xl border border-gray-200 h-[80vh] flex flex-col">
      <div className="flex border-b border-gray-200 px-6 overflow-x-auto">
      </div>
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {[1, 2, 3, 4].map((item) => (
          <div key={item} className="p-4 rounded-xl border border-gray-200 animate-pulse">
            <div className="flex justify-between items-start mb-2">
              <div className="h-5 bg-gray-200 rounded w-3/4"></div>
              <div className="h-6 bg-gray-200 rounded w-16"></div>
            </div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/3 mb-3"></div>
            <div className="flex justify-between items-center pt-3 border-t border-gray-100">
              <div className="h-6 bg-gray-200 rounded w-20"></div>
              <div className="h-4 bg-gray-200 rounded w-24"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  const DetailsLoadingSkeleton = () => (
    <div className="bg-white rounded-xl border border-gray-200 flex flex-col h-[80vh] overflow-hidden">
      <div className="p-6 bg-green-200">
        <div className="flex justify-between items-start mb-3">
          <div className="h-8 bg-green-300 rounded w-2/3 animate-pulse"></div>
          <div className="flex gap-2">
            <div className="h-6 bg-green-300 rounded w-20 animate-pulse"></div>
          </div>
        </div>
        <div className="h-4 bg-green-300 rounded w-1/3 animate-pulse"></div>
      </div>
      <div className="flex-1 overflow-y-auto p-6">
        <div className="space-y-4">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="p-4 border border-gray-200 rounded-lg animate-pulse">
              <div className="h-5 bg-gray-200 rounded w-1/4 mb-3"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>

              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  return (
    <div className="pt-20 p-6 grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-screen">
      <div className={`${showDetailsMobile ? "hidden" : "block"} lg:block lg:col-span-1`}>
        {loadingList && initialLoad ? (
          <ListLoadingSkeleton />
        ) : (
          <GroupList
            myGroups={myGroups}
            joined={myJoined}
            applied={applied}
            onSelect={handleSelect}
          />
        )}
      </div>

      <div className={`${showDetailsMobile ? "block" : "hidden"} lg:block lg:col-span-2`}>
        {loadingDetails ? (
          <DetailsLoadingSkeleton />
        ) : (
          <GroupDetails
            group={selectedGroup}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            requests={requests}
            isOwner={isOwner}
            onDecision={handleDecision}
            onLeave={handleLeave}
            onRemovePlayer={handleRemovePlayer}
          />
        )}
      </div>
    </div>
  )
}