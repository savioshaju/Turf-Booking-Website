import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axiosInstance from '../../Config/axiosInstance'
import { toast } from 'react-toastify'

function BookTurf() {
  const { id } = useParams()
  const [booking, setBooking] = useState({})
  const [slots, setSlots] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return

    axiosInstance({
      method: 'GET',
      url: `/booking/free-slots/${id}`
    })
      .then((res) => {
        setSlots(res.data.data)
      })
      .catch((err) => {
        toast.error(err?.response?.data?.message || 'Failed to fetch turf details')
      })
      .finally(() => {
        setLoading(false)
      })

  }, [id])

  if (loading) return <div>Loading slots...</div>

  return (
    <div>
      {slots.length === 0 ? (
        <p>No available slots</p>
      ) : (
        <ul>
          {slots.map((slot) => (
            <li key={slot}>{slot}</li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default BookTurf
