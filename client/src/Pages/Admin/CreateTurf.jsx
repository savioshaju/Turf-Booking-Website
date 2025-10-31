import React, { useState } from 'react'
import { toast } from 'react-toastify'
import axiosInstance from '../../Config/axiosInstance'

export default function AddTurfForm({ onCancel, onSuccess }) {
  const [form, setForm] = useState({
    name: '',
    location: '',
    type: '',
    cost: '',
    openTime: '',
    openPeriod: 'AM',
    closeTime: '',
    closePeriod: 'PM',
    phone: '',
    turfImg: null
  })
  const [preview, setPreview] = useState(null)
  const [loading, setLoading] = useState(false)

  function handleChange(e) {
    const { name, value } = e.target

    setForm({
      ...form,
      [name]: name === 'cost' ? Math.max(Number(value), 0) : value
    })
  }


  function handleTimeChange(e) {
    const { name, value } = e.target
    let sanitizedValue = value

    if (value > 12) {
      sanitizedValue = 12
    } else if (value < 1) {
      sanitizedValue = 1
    }

    setForm({ ...form, [name]: sanitizedValue })
  }

  function handleImage(e) {
    const file = e.target.files[0]
    if (file) {
      setForm({ ...form, turfImg: file })
      setPreview(URL.createObjectURL(file))
    }
  }

  function validate() {
    if (!form.name.trim()) return 'Turf name is required'
    if (!form.location.trim()) return 'Location is required'
    if (!form.type.trim()) return 'Turf type is required'
    if (!form.cost || isNaN(form.cost) || form.cost <= 0)
      return 'Valid cost is required'
    if (!form.phone.match(/^\d{10}$/)) return 'Phone number must be 10 digits'
    if (!form.openTime) return 'Opening time required'
    if (!form.closeTime) return 'Closing time required'
    if (!form.turfImg) return 'Turf Image required'
    return null
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const err = validate()
    if (err) {
      toast.error(err)
      return
    }

    const formData = new FormData()
    formData.append('name', form.name.trim())
    formData.append('location', form.location.trim())
    formData.append('type', form.type.trim())
    formData.append('cost', Number(form.cost))
    const formatHour = (hour) => {
      const h = Number(hour)
      return (h < 10 ? '0' + h : h) + ':00'
    }
    formData.append('openTime', `${formatHour(form.openTime)} ${form.openPeriod}`)
    formData.append('closeTime', `${formatHour(form.closeTime)} ${form.closePeriod}`)
    formData.append('phone', form.phone.trim())
    if (form.turfImg) formData.append('image', form.turfImg)

    setLoading(true)
    toast.promise(
      axiosInstance({
        method: 'POST',
        url: '/turf/create',
        data: formData
      })
        .then((res) => {
          toast.success(res?.data?.message || 'Turf added successfully')
          setForm({
            name: '',
            location: '',
            type: '',
            cost: '',
            openTime: '',
            openPeriod: 'AM',
            closeTime: '',
            closePeriod: 'PM',
            phone: '',
            turfImg: null
          })
          setPreview(null)
          onSuccess && onSuccess()
        })
        .catch((err) => {
          console.error('Turf creation error:', err)
          toast.error(err?.response?.data?.message || 'Failed to add turf')
        })
        .finally(() => {
          setLoading(false)
        }),
      {
        pending: 'Creating...'
      }
    )

  }



  return (
    <div className="min-h-screen flex justify-center items-center  p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-2xl rounded-3xl p-6 w-full max-w-4xl border-l-8 border-emerald-500"
      >
        <h2 className="text-2xl md:text-3xl font-bold text-emerald-700 mb-2 text-center">Add New Turf</h2>
        <p className="text-gray-600 mb-6 text-center">Fill in the turf details below</p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div >
              <label className="text-sm font-medium text-gray-700 mb-2 block">Turf Information</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Turf Name"
                className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>

            <div >
              <label className="text-sm font-medium text-gray-700 mb-2 block">Location Details</label>
              <input
                type="text"
                name="location"
                value={form.location}
                onChange={handleChange}
                placeholder="Location"
                className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div >
                <label className="text-sm font-medium text-gray-700 mb-2 block">Turf Type</label>
                <input
                  type="text"
                  name="type"
                  value={form.type}
                  onChange={handleChange}
                  placeholder="5-a-side, 7-a-side"
                  className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>

              <div >
                <label className="text-sm font-medium text-gray-700 mb-2 block">Cost per Hour</label>
                <input
                  type="number"
                  name="cost"
                  value={form.cost}
                  onChange={handleChange}
                  placeholder="Cost"
                  className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>
            </div>

            <div >
              <label className="text-sm font-medium text-gray-700 mb-2 block">Operating Hours</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="flex gap-2">
                  <input
                    type="number"
                    name="openTime"
                    min="1"
                    max="12"
                    value={form.openTime}
                    onChange={handleTimeChange}
                    placeholder="Open"
                    className="flex-1 p-3 border border-gray-300 rounded-xl focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                  <select
                    name="openPeriod"
                    value={form.openPeriod}
                    onChange={handleChange}
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
                    value={form.closeTime}
                    onChange={handleTimeChange}
                    placeholder="Close"
                    className="flex-1 p-3 border border-gray-300 rounded-xl focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                  <select
                    name="closePeriod"
                    value={form.closePeriod}
                    onChange={handleChange}
                    className="p-3 border border-gray-300 rounded-xl focus:outline-none focus:border-emerald-500 transition-colors"
                  >
                    <option>AM</option>
                    <option>PM</option>
                  </select>
                </div>
              </div>
            </div>

            <div >
              <label className="text-sm font-medium text-gray-700 mb-2 block">Contact Information</label>
              <input
                type="text"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="Phone Number"
                className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>
          </div>

          <div >
            <label className="text-sm font-medium text-gray-700 mb-2 block">Turf Image</label>
            <div
              className="border-2 border-dashed border-gray-300 rounded-2xl p-8 bg-gray-50 min-h-[200px] flex flex-col items-center justify-center cursor-pointer hover:border-emerald-400 transition-colors"
              onClick={() => document.getElementById('fileInput').click()}
            >
              <input
                id="fileInput"
                type="file"
                accept="image/*"
                onChange={handleImage}
                className="hidden"
              />
              {preview ? (
                <div className="text-center">
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-32 h-32 md:w-48 md:h-48 object-cover rounded-xl border-2 border-emerald-400 shadow-md mx-auto"
                  />
                  <p className="text-sm text-gray-600 mt-2">Click to change image</p>
                </div>
              ) : (
                <div className="text-center text-gray-500">
                  <svg className="w-12 h-12 mx-auto mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p>Click to upload turf image</p>
                  <p className="text-sm">or drag and drop</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between gap-4 mt-8">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 rounded-xl bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300 transition duration-200 focus:outline-none"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold hover:opacity-90 transition duration-200 shadow-lg focus:outline-none disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Add Turf'}
          </button>
        </div>
      </form>
    </div>
  )
}