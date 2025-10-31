import React, { useState, useEffect } from "react"

const UPIForm = ({ onDataChange, errors, initialData }) => {
    const [upiId, setUpiId] = useState(initialData.upiId || "")

    useEffect(() => {
        onDataChange({ upiId })
    }, [upiId, onDataChange])

    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">UPI ID</label>
                <input
                    type="text"
                    placeholder="yourname@upi"
                    value={upiId}
                    onChange={e => setUpiId(e.target.value)}
                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:border-transparent transition-colors ${
                        errors.upiId ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-green-200'
                    }`}
                />
                {errors.upiId && (
                    <p className="text-red-500 text-sm flex items-center">
                        <span className="mr-1">⚠</span> {errors.upiId}
                    </p>
                )}
            </div>
        </div>
    )
}

export default UPIForm