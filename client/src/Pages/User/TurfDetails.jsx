import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import axiosInstance from '../../Config/axiosInstance'
import { toast } from 'react-toastify'
import { MapPin, Clock, BadgeIndianRupee, Phone, Tag, Image } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { setTurfDetail } from '../../store/slice/turfDetailSlice'

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
    if (closeMinutes < openMinutes) return nowMinutes >= openMinutes || nowMinutes <= closeMinutes
    return nowMinutes >= openMinutes && nowMinutes <= closeMinutes
}

function TurfDetail() {
    const { id } = useParams()
    const dispatch = useDispatch()
    const storedTurf = useSelector(state => state.turfDetail.turfs[id])

    const [turf, setTurf] = useState(storedTurf || null)
    const [loading, setLoading] = useState(!storedTurf)

    useEffect(() => {
        if (turf) return

        setLoading(true)
        axiosInstance({
            method: 'GET',
            url: `/turf/getById/${id}`
        })
            .then(res => {
                setTurf(res.data.data)
                dispatch(setTurfDetail({ id, data: res.data.data }))
            })
            .catch((err) => {
                toast.error(err?.response?.data?.message || 'Failed to fetch turf details')
            })

            .finally(() => setLoading(false))
    }, [id, turf, dispatch])

    if (loading)
        return <div className="flex justify-center items-center h-screen text-xl text-gray-700">Loading turf details...</div>

    if (!turf)
        return <div className="text-center py-16 bg-gray-50 rounded-lg text-xl text-gray-500">Turf not found.</div>

    const isOpen = isTurfOpen(turf.openTime, turf.closeTime);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                <div className="lg:col-span-2">
                    <div className="h-64 md:h-96 w-full bg-gray-200 rounded-xl overflow-hidden flex items-center justify-center shadow-lg">
                        {turf.turfImg
                            ? <img src={turf.turfImg} alt={turf.name} className="h-full w-full object-cover" />
                            : <Image size={64} className="text-gray-400" />}
                    </div>

                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center my-6 ">
                        <h1 className="text-4xl font-bold text-gray-900 ">{turf.name}</h1>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 border-t  relative">
                        <span className={`absolute right-1 top-1 mt-2 sm:mt-0 px-3 py-1.5 rounded-full text-sm font-semibold ${isOpen ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {isOpen ? 'Open Now' : 'Closed'}
                        </span>
                        <div className="flex items-start gap-3 mt-4">
                            <MapPin size={20} className="text-blue-500 mt-1 flex-shrink-0" />
                            <div>
                                <div className="text-sm font-medium text-gray-500">Location</div>
                                <div className="text-lg text-gray-800">{turf.location}</div>
                            </div>
                        </div>
                        <div className="flex items-start gap-3 mt-4">
                            <Tag size={20} className="text-indigo-500 mt-1 flex-shrink-0" />
                            <div>
                                <div className="text-sm font-medium text-gray-500">Turf Type</div>
                                <div className="text-lg text-gray-800">{turf.type}</div>
                            </div>
                        </div>
                        <div className="flex items-start gap-3 mt-4">
                            <Clock size={20} className="text-gray-500 mt-1 flex-shrink-0" />
                            <div>
                                <div className="text-sm font-medium text-gray-500">Hours</div>
                                <div className="text-lg text-gray-800">{turf.openTime} - {turf.closeTime}</div>
                            </div>
                        </div>
                        <div className="flex items-start gap-3 mt-4">
                            <Phone size={20} className="text-green-500 mt-1 flex-shrink-0" />
                            <div>
                                <div className="text-sm font-medium text-gray-500">Contact</div>
                                <div className="text-lg text-gray-800">{turf.phone}</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-1">
                    <div className="bg-white rounded-xl shadow-lg p-6 sticky top-10">
                        <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                            Book this turf
                        </h3>

                        <div className="my-5">
                            <span className="text-4xl font-bold text-green-700">
                                <BadgeIndianRupee size={32} className="inline-block -mt-2 mr-1" />
                                {turf.cost}
                            </span>
                            <span className="text-lg text-gray-600"> / hour</span>
                        </div>

                        <p className="text-gray-600 mb-6">
                            Ready to play? Click the button below to select your date and time.
                        </p>

                        <Link
                            to={`/user/bookturf/${turf._id}`}
                            className="w-full flex justify-center items-center px-6 py-3 bg-gradient-to-tl from-green-600 via-emerald-800 to-emerald-900 text-white text-lg font-bold rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
                        >
                            Book Now
                        </Link>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default TurfDetail