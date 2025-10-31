import React, { useEffect, useState } from 'react'
import axiosInstance from '../../Config/axiosInstance'
import { toast } from 'react-toastify'
import { MapPin, Clock, BadgeIndianRupee, Phone, Tag, Image } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { setTurfs } from '../../store/slice/turfSlice'

function Turf() {
    const dispatch = useDispatch()
    const turfs = useSelector(state => state.turfs.allTurfs)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (turfs.length === 0) {

            axiosInstance.get('/turf/all')
                .then(res => {
                    dispatch(setTurfs(res.data.data))
                })
                .catch((err) => {

                    toast.error(err?.response?.data?.message || 'Failed to fetch turfs')
                })
                .finally(() => setLoading(false))
        }
        else {
            setLoading(false)
        }
    }, [dispatch])


    const timeToMinutes = timeStr => {
        const [time, meridian] = timeStr.split(' ')
        let [hours, minutes] = time.split(':').map(Number)
        if (meridian === 'PM' && hours !== 12) hours += 12
        if (meridian === 'AM' && hours === 12) hours = 0
        return hours * 60 + minutes
    }

    const isTurfOpen = (openTime, closeTime) => {
        const now = new Date()
        const nowMinutes = now.getHours() * 60 + now.getMinutes()
        const openMinutes = timeToMinutes(openTime)
        const closeMinutes = timeToMinutes(closeTime)
        return nowMinutes >= openMinutes && nowMinutes <= closeMinutes
    }

    if (loading)
        return <div className="flex justify-center items-center h-screen text-xl text-gray-700">Loading turfs...</div>

    if (turfs.length === 0)
        return <div className="text-center py-16 bg-gray-50 rounded-lg text-xl text-gray-500">No turfs found.</div>

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <h2 className="text-3xl font-bold  text-gray-900 mb-8">Available Turfs</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {turfs.map(turf => (
                    <div key={turf._id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl flex flex-col transition-all duration-300">
                        <div className="h-48 w-full bg-gray-200 flex items-center justify-center">
                            {turf.turfImg
                                ? <img src={turf.turfImg} alt={turf.name} className="h-full w-full object-cover" />
                                : <Image size={48} className="text-gray-400" />}
                        </div>
                        <div className="p-6 flex-grow">
                            <h3 className="text-2xl font-semibold text-gray-800 mb-4">{turf.name}</h3>
                            <div className="space-y-3 text-gray-600">
                                <div className="flex items-center"><MapPin size={16} className="mr-2 text-blue-500" />{turf.location}</div>
                                <div className="flex items-center"><Tag size={16} className="mr-2 text-indigo-500" />{turf.type}</div>
                                <div className="flex items-center"><Phone size={16} className="mr-2 text-green-500" />{turf.phone}</div>
                                <div className="flex items-center gap-2">
                                    <Clock size={16} className="text-gray-500" />
                                    <span className={`px-2 py-1 rounded-full text-sm font-medium ${isTurfOpen(turf.openTime, turf.closeTime) ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                        {turf.openTime} - {turf.closeTime} | {isTurfOpen(turf.openTime, turf.closeTime) ? 'Open' : 'Closed'}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
                            <div className="flex items-center text-xl font-semibold text-green-700">
                                <BadgeIndianRupee size={20} className="mr-1" />
                                <span className="font-bold">{turf.cost}</span>
                                <span className="text-sm text-gray-600 ml-1">/ hour</span>
                            </div>
                            <Link to={`/turf-details/${turf._id}`} className="px-4 py-2 bg-gradient-to-tl from-green-600 via-emerald-800 to-emerald-900 text-white text-sm font-semibold rounded-lg transition-colors">
                                View Details
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Turf
