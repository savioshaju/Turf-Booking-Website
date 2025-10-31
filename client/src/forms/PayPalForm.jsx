import React, { useState, useEffect } from "react"

const PayPalForm = ({ onDataChange, errors, initialData }) => {
    const [paypalEmail, setPaypalEmail] = useState(initialData.paypalEmail || "")

    useEffect(() => {
        onDataChange({ paypalEmail })
    }, [paypalEmail, onDataChange])

    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">PayPal Email</label>
                <input
                    type="email"
                    placeholder="your.email@example.com"
                    value={paypalEmail}
                    onChange={e => setPaypalEmail(e.target.value)}
                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:border-transparent transition-colors ${
                        errors.paypalEmail ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-green-200'
                    }`}
                />
                {errors.paypalEmail && (
                    <p className="text-red-500 text-sm flex items-center">
                        <span className="mr-1">⚠</span> {errors.paypalEmail}
                    </p>
                )}
            </div>
        </div>
    )
}

export default PayPalForm