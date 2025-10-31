import React from "react"

const PaymentMethodSelector = ({ paymentMethod, setPaymentMethod }) => {
    const paymentMethods = [
        { 
            id: "creditCard", 
            label: "Credit Card", 
            icon: (
                <div className="w-8 h-6 bg-blue-600 rounded flex items-center justify-center">
                    <span className="text-white font-bold text-xs">VISA</span>
                </div>
            )
        },
        { 
            id: "paypal", 
            label: "PayPal", 
            icon: (
                <div className="w-8 h-6 bg-blue-400 rounded flex items-center justify-center">
                    <span className="text-white font-bold text-xs">PP</span>
                </div>
            )
        },
        { 
            id: "bankTransfer", 
            label: "Bank Transfer", 
            icon: (
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
            )
        }
    ]

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">Select payment method</h3>
            
            <div className="grid grid-cols-3 gap-2">
                {paymentMethods.map(method => (
                    <button
                        key={method.id}
                        onClick={() => setPaymentMethod(method.id)}
                        className={`p-3 border rounded-lg text-center transition-colors ${
                            paymentMethod === method.id 
                                ? 'border-green-500 bg-green-50 text-green-700' 
                                : 'border-gray-300 hover:border-gray-400'
                        }`}
                    >
                        <div className="flex flex-col items-center">
                            {method.icon}
                            <span className="text-xs mt-1">{method.label}</span>
                        </div>
                    </button>
                ))}
            </div>

            <button
                onClick={() => setPaymentMethod("upi")}
                className={`w-full p-3 border rounded-lg text-left transition-colors flex items-center ${
                    paymentMethod === "upi" 
                        ? 'border-green-500 bg-green-50 text-green-700' 
                        : 'border-gray-300 hover:border-gray-400'
                }`}
            >
                <div className="w-8 h-6 bg-purple-500 rounded flex items-center justify-center">
                    <span className="text-white font-bold text-xs">UPI</span>
                </div>
                <span className="ml-3 flex-1">UPI Payment</span>
                {paymentMethod === "upi" && (
                    <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                )}
            </button>
        </div>
    )
}

export default PaymentMethodSelector