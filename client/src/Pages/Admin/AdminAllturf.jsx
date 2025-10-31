import React, { useEffect, useState } from 'react'
import axiosInstance from '../../Config/axiosInstance'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

const AdminAllturf = () => {
    const [turfs, setTurfs] = useState([])
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()

    useEffect(() => {
        fetchTurfs()
    }, [])

    const fetchTurfs = async () => {
        axiosInstance({
            method: 'GET',
            url: '/turf/allMyTurf'
        })
            .then(res => {
                setTurfs(res.data.data)
            })
            .catch((err) => {

                toast.error(err?.response?.data?.message || 'Failed to fetch turfs')
            })
            .finally(() => setLoading(false))
    }

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this turf?')) return
        toast.promise(
            (axiosInstance({
                method: 'DELETE',
                url: `/turf/delete/${id}`
            })
                .then(res => {
                    toast.success(res?.data?.message || 'Turf deleted successfully')
                    setTurfs((prev) => prev.filter((t) => t._id !== id))
                })
                .catch((err) => {
                    toast.error(err?.response?.data?.message || 'Failed to delete turf')
                })
            ),

            {
                pending: 'Deleting...'
            }
        )
    }

   

    useEffect(() => {
        fetchTurfs()
    }, [])

    return (
        <div className="p-6 bg-gray-50 min-h-screen">


            {loading && (
                <div className="flex justify-center items-center py-16">
                    <div className="animate-spin h-10 w-10 border-4 border-emerald-500 border-t-transparent rounded-full"></div>
                    <p className="ml-3 text-gray-600 font-medium">Loading turfs...</p>
                </div>
            )}

            {!loading && turfs.length === 0 && (
                <div className="bg-white shadow-lg rounded-2xl p-10 text-center">
                    <p className="text-gray-500 text-lg font-medium">No turfs found.</p>
                    <p className="text-gray-400 text-sm mt-2">
                        Once you add a turf, it will appear here.
                    </p>
                </div>
            )}

            {!loading && turfs.length > 0 && (
                <div className="overflow-x-auto bg-white rounded-2xl shadow-lg border border-gray-200">
                    <table className="min-w-full text-left">
                        <thead className="bg-emerald-600 text-white">
                            <tr>
                                <th className="px-6 py-3 text-sm font-medium uppercase">#</th>
                                <th className="px-6 py-3 text-sm font-medium uppercase">Name</th>
                                <th className="px-6 py-3 text-sm font-medium uppercase">Location</th>
                                <th className="px-6 py-3 text-sm font-medium uppercase">Type</th>
                                <th className="px-6 py-3 text-sm font-medium uppercase">Cost</th>
                                <th className="px-6 py-3 text-sm font-medium uppercase">Timing</th>
                                <th className="px-6 py-3 text-sm font-medium uppercase text-center">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {turfs.map((turf, index) => (
                                <tr
                                    key={turf._id}
                                    className="border-t hover:bg-gray-100 transition-colors"
                                >
                                    <td className="px-6 py-3 text-gray-700">{index + 1}</td>
                                    <td className="px-6 py-3 font-semibold text-gray-800">
                                        {turf.name}
                                    </td>
                                    <td className="px-6 py-3 text-gray-600">{turf.location}</td>
                                    <td className="px-6 py-3 text-gray-600">{turf.type}</td>
                                    <td className="px-6 py-3 text-gray-600">₹{turf.cost}</td>
                                    <td className="px-6 py-3 text-gray-600">
                                        {turf.openTime} - {turf.closeTime}
                                    </td>
                                    <td className="px-6 py-3 text-center space-x-2">
                                        <button
                                        onClick={()=>navigate(`/admin/turf-details/${turf._id}`)}
                                            className="px-3 py-1.5 text-sm rounded-lg bg-blue-500 text-white hover:bg-blue-600"
                                        >
                                            View
                                        </button>
                                        <button
                                            onClick={() => handleDelete(turf._id)}
                                            className="px-3 py-1.5 text-sm rounded-lg bg-red-500 text-white hover:bg-red-600"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}

export default AdminAllturf
