import React, { useEffect, useState, useCallback } from "react"  
import { useSelector } from "react-redux"  
import axiosInstance from "../../Config/axiosInstance"  
import GroupDetails from "../../Components/User/GroupDetails"  
import GroupList from "../../Components/User/GroupList"  

export default function Group() {
  const user = useSelector((state) => state.user.userData)  
  const userId = user?._id  

  const [myCreated, setMyCreated] = useState([])  
  const [myJoined, setMyJoined] = useState([])  


  const [applied, setApplied] = useState([])  
  const [discover, setDiscover] = useState([])  

  const [selectedGroup, setSelectedGroup] = useState(null)  
  const [activeTab, setActiveTab] = useState("members")  
  const [requests, setRequests] = useState([])  

  const [loadingList, setLoadingList] = useState(true)  
  const [loadingDetails, setLoadingDetails] = useState(false)  

  const loadCreated = useCallback(() => {
    axiosInstance({
      method: "GET",
      url: "/group/my-groups/created"
    })
      .then(res => {
        setMyCreated(res.data?.data || [])
      })
      .catch(err => {
        setMyCreated([])
      })
  }, [])

  const loadJoined = useCallback(() => {
    axiosInstance({
      method: "GET",
      url: "/group/my-groups/joined"
    })
      .then(res => {
        setMyJoined(res.data?.data || [])
      })
      .catch(err => {
        setMyJoined([])
      })
  }, [])

  const loadApplied = useCallback(() => {
    axiosInstance({
      method: "GET",
      url: "/group/my-groups/applied"
    })
      .then(res => {
        setApplied(res.data?.data || [])
      })
      .catch(err => {
        setApplied([])
      })
  }, [])

  const loadDiscover = useCallback(() => {
    axiosInstance({
      method: "GET",
      url: "/group/all"
    })
      .then(res => {
        setDiscover(res.data?.data || [])
      })
      .catch(err => {
        setDiscover([])
      })
  }, [])

  const reloadAll = useCallback(async () => {
    setLoadingList(true)
    await Promise.all([loadCreated(), loadJoined(), loadApplied(), loadDiscover()])
    setLoadingList(false)
  }, [loadCreated, loadJoined, loadApplied, loadDiscover])

  useEffect(() => {
    reloadAll()
  }, [reloadAll])

  const loadGroupDetails = async (groupId) => {
    if (!groupId) return
    setLoadingDetails(true)

    axiosInstance({
      method: "GET",
      url: `/group/details/${groupId}`
    })
      .then(res => {
        const data = res.data?.data || {}
        setSelectedGroup(data.group || null)
        setRequests(data.requests || [])
      })
      .catch(err => {
        setSelectedGroup(null)
        setRequests([])
      })
      .finally(() => {
        setLoadingDetails(false)
      })
  }

  const handleSelect = (g) => {
    setActiveTab("members")
    loadGroupDetails(g._id)
  }

  const handleDecision = async (requestId, status) => {
    axiosInstance({
      method: "PATCH",
      url: `/group/request/decide/${requestId}`,
      data: { status }
    })
      .then(res => {
        reloadAll()
        loadGroupDetails(selectedGroup?._id)
      })
      .catch(err => {
        console.error(err)
      })
  }

  const handleLeave = async (groupId) => {
    axiosInstance({
      method: "DELETE",
      url: `/group/leave/${groupId}`
    })
      .then(res => {
        reloadAll()
        setSelectedGroup(null)
        setRequests([])
      })
      .catch(err => {
        console.error(err)
      })
  }

  const handleRemovePlayer = async (playerId) => {
    axiosInstance({
      method: "DELETE",
      url: `/group/remove-player/${selectedGroup._id}/${playerId}`
    })
      .then(res => {
        reloadAll()
        loadGroupDetails(selectedGroup._id)
      })
      .catch(err => {
        console.error(err)
      })
  }

  const myGroups = myCreated  


  const isOwner = selectedGroup?.ownerId?._id === userId

  return (
    <div className="pt-20 p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-1">
        {loadingList ? (
          <div className="flex justify-center items-center h-40">
            <span className="loading loading-spinner w-10 h-10 text-primary" />
          </div>
        ) : (
          <GroupList
            myGroups={myGroups}
            joined={myJoined}
            applied={applied}
            onSelect={handleSelect}
          />
        )}
      </div>

      <div className="lg:col-span-2">
        {loadingDetails ? (
          <div className="bg-white p-6 rounded shadow h-[80vh] flex justify-center items-center">
            <span className="loading loading-spinner w-10 h-10 text-primary"></span>
          </div>
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