import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axiosInstance from '../../Config/axiosInstance'
import { toast } from 'react-toastify'
import { MapPin, Clock, BadgeIndianRupee, Phone, Tag, Edit } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { setTurfDetail } from '../../store/slice/turfDetailSlice'

const AdminTurfDetails = () => {
    const { id } = useParams();
    const [bookings, setBookings] = useState([]);
    const [showEditModal, setShowEditModal] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);

    const [editForm, setEditForm] = useState({
        name: '',
        location: '',
        type: '',
        cost: '',
        openTime: '',
        openPeriod: 'AM',
        closeTime: '',
        closePeriod: 'PM',
        phone: ''
    });

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

    useEffect(() => {
        fetchBookings();
    }, []);

    useEffect(() => {
        if (turf) {
            const openTimeParts = turf.openTime?.split(' ') || ['', ''];
            const closeTimeParts = turf.closeTime?.split(' ') || ['', ''];

            setEditForm({
                name: turf.name || '',
                location: turf.location || '',
                type: turf.type || '',
                cost: turf.cost || '',
                openTime: openTimeParts[0]?.split(':')[0] || '',
                openPeriod: openTimeParts[1] || 'AM',
                closeTime: closeTimeParts[0]?.split(':')[0] || '',
                closePeriod: closeTimeParts[1] || 'PM',
                phone: turf.phone || ''
            });
        }
    }, [turf]);

    const fetchBookings = () => {
        axiosInstance({
            method: 'GET',
            url: `booking/turfbookings/${id}`
        })
            .then(res => {
                setBookings(res.data.bookings || []);
            })
            .catch(err => {
                toast.error(err?.response?.data?.message || 'Failed to fetch bookings');
            })
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target
        setEditForm({
            ...editForm,
            [name]: name === 'cost' ? Math.max(Number(value), 0) : value
        })
    }

    const handleTimeChange = (e) => {
        const { name, value } = e.target
        let sanitizedValue = value

        if (value > 12) {
            sanitizedValue = 12
        } else if (value < 1) {
            sanitizedValue = 1
        }

        setEditForm({ ...editForm, [name]: sanitizedValue })
    }

    const validateEditForm = () => {
        if (!editForm.name.trim()) return 'Turf name is required'
        if (!editForm.location.trim()) return 'Location is required'
        if (!editForm.type.trim()) return 'Turf type is required'
        if (!editForm.cost || isNaN(editForm.cost) || editForm.cost <= 0)
            return 'Valid cost is required'
        if (!editForm.phone.match(/^\d{10}$/)) return 'Phone number must be 10 digits'
        if (!editForm.openTime) return 'Opening time required'
        if (!editForm.closeTime) return 'Closing time required'
        return null
    }

    const handleUpdateTurf = async (e) => {
        e.preventDefault();
        const err = validateEditForm();
        if (err) {
            toast.error(err);
            return;
        }

        const formData = {
            name: editForm.name.trim(),
            location: editForm.location.trim(),
            type: editForm.type.trim(),
            cost: Number(editForm.cost),
            openTime: `${editForm.openTime.padStart(2, '0')}:00 ${editForm.openPeriod}`,
            closeTime: `${editForm.closeTime.padStart(2, '0')}:00 ${editForm.closePeriod}`,
            phone: editForm.phone.trim()
        }

        toast.promise(
            axiosInstance({
                method: 'PATCH',
                url: `/turf/update/${id}`,
                data: formData
            })
                .then(res => {
                    setTurf(res.data.data)
                    dispatch(setTurfDetail({ id, data: res.data.data }))
                    setShowEditModal(false)
                    return 'Turf updated successfully'
                })
                .catch(err => {
                    console.error(err);
                    throw new Error(err?.response?.data?.message || 'Failed to update turf')
                }),
            {
                pending: 'Updating...',
                success: 'Turf updated successfully',
                error: 'Failed to update turf'
            }
        )
    }

    useEffect(() => {
        if (showEditModal && turf) {
            const openTimeParts = turf.openTime?.split(' ') || ['', ''];
            const closeTimeParts = turf.closeTime?.split(' ') || ['', ''];

            setEditForm({
                name: turf.name || '',
                location: turf.location || '',
                type: turf.type || '',
                cost: turf.cost || '',
                openTime: openTimeParts[0]?.split(':')[0] || '',
                openPeriod: openTimeParts[1] || 'AM',
                closeTime: closeTimeParts[0]?.split(':')[0] || '',
                closePeriod: closeTimeParts[1] || 'PM',
                phone: turf.phone || ''
            });
        }
    }, [showEditModal, turf]);



    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        )
    }



    return (
        <div className="p-6 space-y-8">
            {turf && (
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                    <div className="relative">
                        <img
                            src={turf.turfImg}
                            alt={turf.name}
                            className="w-full h-64 object-cover"
                        />
                        <button
                            onClick={() => setShowEditModal(true)}
                            className="absolute top-4 right-4 bg-white hover:bg-gray-100 text-gray-800 p-2 rounded-lg shadow-md transition-colors flex items-center gap-2"
                        >
                            <Edit size={18} />
                            Edit Details
                        </button>
                    </div>

                    <div className="p-6">
                        <div className="flex justify-between items-start mb-4">
                            <h1 className="text-3xl font-bold text-gray-800">{turf.name}</h1>
                            <div className={`px-3 py-1 rounded-full text-sm font-semibold ${isTurfOpen(turf.openTime, turf.closeTime)
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                                }`}>
                                {isTurfOpen(turf.openTime, turf.closeTime) ? 'OPEN NOW' : 'CLOSED'}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                            <div className="flex items-center gap-3">
                                <MapPin className="text-green-600" size={20} />
                                <div>
                                    <p className="text-sm text-gray-600">Location</p>
                                    <p className="font-medium">{turf.location}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <Tag className="text-green-600" size={20} />
                                <div>
                                    <p className="text-sm text-gray-600">Turf Type</p>
                                    <p className="font-medium">{turf.type}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <BadgeIndianRupee className="text-green-600" size={20} />
                                <div>
                                    <p className="text-sm text-gray-600">Cost per Hour</p>
                                    <p className="font-medium">₹{turf.cost}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <Clock className="text-green-600" size={20} />
                                <div>
                                    <p className="text-sm text-gray-600">Operating Hours</p>
                                    <p className="font-medium">{turf.openTime} - {turf.closeTime}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <Phone className="text-green-600" size={20} />
                                <div>
                                    <p className="text-sm text-gray-600">Contact</p>
                                    <p className="font-medium">{turf.phone}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-2xl font-semibold mb-4">Today's Turf Bookings</h2>
                {bookings.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No bookings found for today.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white">
                            <thead className="bg-green-600 text-white">
                                <tr>
                                    <th className="px-6 py-3 text-left">#</th>
                                    <th className="px-6 py-3 text-left">User Name</th>
                                    <th className="px-6 py-3 text-left">Team Name</th>
                                    <th className="px-6 py-3 text-left">Status</th>
                                    <th className="px-6 py-3 text-left">Date</th>
                                    <th className="px-6 py-3 text-left">Slots</th>
                                </tr>
                            </thead>
                            <tbody>
                                {bookings.map((booking, index) => (
                                    <tr key={booking._id} className="border-t hover:bg-green-50 transition-colors">
                                        <td className="px-6 py-3">{index + 1}</td>
                                        <td className="px-6 py-3">{booking.userId?.name}</td>
                                        <td className="px-6 py-3">{booking.teamName}</td>
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
                                        <td className="px-6 py-3">{new Date(booking.date).toLocaleDateString()}</td>
                                        <td className="px-6 py-3">{booking.Slot}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {showEditModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <form onSubmit={handleUpdateTurf} className="p-6">
                            <h2 className="text-2xl font-bold text-emerald-700 mb-4">Edit Turf Details</h2>

                            <div className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium text-gray-700 mb-2 block">Turf Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={editForm.name}
                                        onChange={handleEditChange}
                                        placeholder="Turf Name"
                                        className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:border-emerald-500 transition-colors"
                                    />
                                </div>

                                <div>
                                    <label className="text-sm font-medium text-gray-700 mb-2 block">Location</label>
                                    <input
                                        type="text"
                                        name="location"
                                        value={editForm.location}
                                        onChange={handleEditChange}
                                        placeholder="Location"
                                        className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:border-emerald-500 transition-colors"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium text-gray-700 mb-2 block">Turf Type</label>
                                        <input
                                            type="text"
                                            name="type"
                                            value={editForm.type}
                                            onChange={handleEditChange}
                                            placeholder="5-a-side, 7-a-side"
                                            className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:border-emerald-500 transition-colors"
                                        />
                                    </div>

                                    <div>
                                        <label className="text-sm font-medium text-gray-700 mb-2 block">Cost per Hour</label>
                                        <input
                                            type="number"
                                            name="cost"
                                            value={editForm.cost}
                                            onChange={handleEditChange}
                                            placeholder="Cost"
                                            className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:border-emerald-500 transition-colors"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="text-sm font-medium text-gray-700 mb-2 block">Operating Hours</label>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        <div className="flex gap-2">
                                            <input
                                                type="number"
                                                name="openTime"
                                                min="1"
                                                max="12"
                                                value={editForm.openTime}
                                                onChange={handleTimeChange}
                                                placeholder="Open"
                                                className="flex-1 p-3 border border-gray-300 rounded-xl focus:outline-none focus:border-emerald-500 transition-colors"
                                            />
                                            <select
                                                name="openPeriod"
                                                value={editForm.openPeriod}
                                                onChange={handleEditChange}
                                                className="p-3 border border-gray-300 rounded-xl focus:outline-none focus:border-emerald-500 transition-colors"
                                            >
                                                <option>AM</option>
                                                <option>PM</option>
                                            </select>
                                        </div>
                                        <div className="flex gap-2">
                                            <input
                                                type="number"
                                                name="closeTime"
                                                min="1"
                                                max="12"
                                                value={editForm.closeTime}
                                                onChange={handleTimeChange}
                                                placeholder="Close"
                                                className="flex-1 p-3 border border-gray-300 rounded-xl focus:outline-none focus:border-emerald-500 transition-colors"
                                            />
                                            <select
                                                name="closePeriod"
                                                value={editForm.closePeriod}
                                                onChange={handleEditChange}
                                                className="p-3 border border-gray-300 rounded-xl focus:outline-none focus:border-emerald-500 transition-colors"
                                            >
                                                <option>AM</option>
                                                <option>PM</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="text-sm font-medium text-gray-700 mb-2 block">Contact Number</label>
                                    <input
                                        type="text"
                                        name="phone"
                                        value={editForm.phone}
                                        onChange={handleEditChange}
                                        placeholder="Phone Number"
                                        className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:border-emerald-500 transition-colors"
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end gap-4 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setShowEditModal(false)}
                                    disabled={isUpdating}
                                    className="px-6 py-3 rounded-xl bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300 transition duration-200 focus:outline-none disabled:opacity-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isUpdating}
                                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold hover:opacity-90 transition duration-200 shadow-lg focus:outline-none disabled:opacity-50"
                                >
                                    {isUpdating ? 'Updating...' : 'Update Turf'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminTurfDetails;