import React from "react"

const BankTransferForm = () => {
    return (
        <div className="space-y-4">
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-3">
                <div className="flex justify-between">
                    <span className="text-gray-600">Bank Name:</span>
                    <span className="font-medium">State Bank of India</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-600">Account Number:</span>
                    <span className="font-medium">XXXX XXXX 7890</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-600">IFSC Code:</span>
                    <span className="font-medium">SBIN0000123</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-600">Account Name:</span>
                    <span className="font-medium">Turf Booking Pvt Ltd</span>
                </div>
            </div>
            <p className="text-sm text-gray-600 text-center">
                Please transfer the exact amount and share the transaction details with us.
            </p>
        </div>
    )
}

export default BankTransferForm