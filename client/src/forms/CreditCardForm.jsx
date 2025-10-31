import React, { useState, useEffect } from "react"

const CreditCardForm = ({ onDataChange, errors, initialData }) => {
    const [cardNumber, setCardNumber] = useState(initialData.cardNumber || "")
    const [cardName, setCardName] = useState(initialData.cardName || "")
    const [expiry, setExpiry] = useState(initialData.expiry || "")
    const [cvv, setCvv] = useState(initialData.cvv || "")
    const [cardType, setCardType] = useState("")

    useEffect(() => {
        onDataChange({ cardNumber, cardName, expiry, cvv })
    }, [cardNumber, cardName, expiry, cvv, onDataChange])

    const handleCardNumberChange = (value) => {
        const numbersOnly = value.replace(/\D/g, "")
        if (numbersOnly.length <= 16) {
            const formatted = numbersOnly.replace(/(.{4})/g, "$1 ").trim()
            setCardNumber(formatted)
            
            if (/^4/.test(numbersOnly)) setCardType("visa")
            else if (/^5[1-5]/.test(numbersOnly)) setCardType("mastercard")
            else if (/^3[47]/.test(numbersOnly)) setCardType("amex")
            else if (/^6(?:011|5)/.test(numbersOnly)) setCardType("discover")
            else setCardType("")
        }
    }

    const handleExpiryChange = (value) => {
        const numbersOnly = value.replace(/\D/g, "")
        if (numbersOnly.length <= 4) {
            const formatted = numbersOnly.replace(/(\d{2})(\d)/, "$1/$2")
            setExpiry(formatted)
        }
    }

    const handleCvvChange = (value) => {
        const numbersOnly = value.replace(/\D/g, "")
        if (numbersOnly.length <= (cardType === "amex" ? 4 : 3)) {
            setCvv(numbersOnly)
        }
    }

    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Card number</label>
                <div className="relative">
                    <input
                        type="text"
                        placeholder="1234 5678 9012 3456"
                        value={cardNumber}
                        onChange={e => handleCardNumberChange(e.target.value)}
                        className={`w-full p-3 pr-12 border rounded-lg focus:ring-2 focus:border-transparent transition-colors ${
                            errors.cardNumber ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-green-200'
                        }`}
                        maxLength={19}
                    />
                </div>
                {errors.cardNumber && (
                    <p className="text-red-500 text-sm flex items-center">
                        <span className="mr-1">⚠</span> {errors.cardNumber}
                    </p>
                )}
            </div>

            <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Name on card</label>
                <input
                    type="text"
                    placeholder="David Smith"
                    value={cardName}
                    onChange={e => setCardName(e.target.value)}
                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:border-transparent transition-colors ${
                        errors.cardName ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-green-200'
                    }`}
                />
                {errors.cardName && (
                    <p className="text-red-500 text-sm flex items-center">
                        <span className="mr-1">⚠</span> {errors.cardName}
                    </p>
                )}
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Expiry date</label>
                    <input
                        type="text"
                        placeholder="MM/YY"
                        value={expiry}
                        onChange={e => handleExpiryChange(e.target.value)}
                        className={`w-full p-3 border rounded-lg focus:ring-2 focus:border-transparent transition-colors ${
                            errors.expiry ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-green-200'
                        }`}
                        maxLength={5}
                    />
                    {errors.expiry && (
                        <p className="text-red-500 text-sm flex items-center">
                            <span className="mr-1">⚠</span> {errors.expiry}
                        </p>
                    )}
                </div>
                
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">CVV</label>
                    <div className="relative">
                        <input
                            type="text"
                            placeholder={cardType === "amex" ? "1234" : "123"}
                            value={cvv}
                            onChange={e => handleCvvChange(e.target.value)}
                            className={`w-full p-3 border rounded-lg focus:ring-2 focus:border-transparent transition-colors ${
                                errors.cvv ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-green-200'
                            }`}
                            maxLength={cardType === "amex" ? 4 : 3}
                        />
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        </div>
                    </div>
                    {errors.cvv && (
                        <p className="text-red-500 text-sm flex items-center">
                            <span className="mr-1">⚠</span> {errors.cvv}
                        </p>
                    )}
                </div>
            </div>
        </div>
    )
}

export default CreditCardForm