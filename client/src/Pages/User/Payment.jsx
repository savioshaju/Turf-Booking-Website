import React, { useState } from "react"
import { useSelector } from "react-redux"
import PaymentMethodSelector from "../../Components/User/PaymentMethodSelector"
import CreditCardForm from "../../forms/CreditCardForm"
import PayPalForm from "../../forms/PayPalForm"
import UPIForm from "../../forms/UPIForm"
import BankTransferForm from "../../forms/BankTransferForm"
import BookingSummary from "../../Components/User/BookingSummary"
import Paying from "../../Components/User/Paying"
import PayFailed from "../../Components/User/PayFailed"
import PaySuccess from "../../Components/User/PaySuccess"
import axiosInstance from "../../Config/axiosInstance"
import { resetBooking } from "../../store/slice/BookingSlice"
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { useEffect } from "react"


const Payment = () => {
    const booking = useSelector(state => state.booking)
    const [paymentMethod, setPaymentMethod] = useState("creditCard")
    const [paymentData, setPaymentData] = useState({})
    const [errors, setErrors] = useState({})
    const [payStatus, setPayStatus] = useState("idle")

    const dispatch = useDispatch()

    const handlePaymentDataChange = (data) => {
        setPaymentData(prev => ({ ...prev, ...data }))
        if (Object.keys(errors).length > 0) {
            setErrors({})
        }
    }

    const navigate = useNavigate()


    useEffect(() => {
        if (payStatus !== "idle") return
        if (
            !booking ||
            !booking.turfId ||
            !booking.date ||
            !booking.slots ||
            booking.slots.length === 0
        ) {
            navigate(-1)
        }
    }, [booking, navigate])


    const validateForm = () => {
        const newErrors = {}

        switch (paymentMethod) {
            case "creditCard":
                if (!paymentData.cardNumber?.replace(/\D/g, "")) {
                    newErrors.cardNumber = "Card number is required"
                } else if (paymentData.cardNumber.replace(/\D/g, "").length !== 16) {
                    newErrors.cardNumber = "Card number must be 16 digits"
                }
                if (!paymentData.cardName?.trim()) {
                    newErrors.cardName = "Cardholder name is required"
                }
                if (!paymentData.expiry) {
                    newErrors.expiry = "Expiry date is required"
                } else if (!/^\d{2}\/\d{2}$/.test(paymentData.expiry)) {
                    newErrors.expiry = "Invalid expiry format (MM/YY)"
                }
                if (!paymentData.cvv) {
                    newErrors.cvv = "CVV is required"
                } else if (paymentData.cvv.length < 3) {
                    newErrors.cvv = "CVV must be 3-4 digits"
                }
                break

            case "upi":
                if (!paymentData.upiId?.trim()) {
                    newErrors.upiId = "UPI ID is required"
                } else if (!/^[a-zA-Z0-9.\-_]{2,49}@[a-zA-Z]{2,}$/.test(paymentData.upiId)) {
                    newErrors.upiId = "Invalid UPI ID format"
                }
                break

            case "paypal":
                if (!paymentData.paypalEmail?.trim()) {
                    newErrors.paypalEmail = "PayPal email is required"
                } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(paymentData.paypalEmail)) {
                    newErrors.paypalEmail = "Invalid email format"
                }
                break
        }

        return newErrors
    }

    const handleSubmit = () => {
        const validationErrors = validateForm();

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        const payload = {
            turfId: booking.turfId,
            date: booking.date,
            Slot: booking.slots,
            teamName: booking.teamName,
            payment: {
                amount: booking.slots.length * booking.costPerHour,
                paymentMethod,
                paymentDate: new Date().toISOString()
            }
        };

        setPayStatus("paying");

        axiosInstance({
            method: "POST",
            url: "/booking/create",
            data: payload
        })
            .then((res) => {
                if (res.data && res.data.success) {
                    setPayStatus("success")
                    dispatch(resetBooking())
                } else {
                    setPayStatus("failed")
                }
            })
            .catch((err) => {
                console.error("Booking Creation Error:", err)
                setPayStatus("failed")
            })

        setPaymentData({})
        setErrors({})
    }

    const getButtonText = () => {
        const totalAmount = booking.slots.length * booking.costPerHour
        const texts = {
            creditCard: `Pay ₹${totalAmount}`,
            paypal: `Pay with PayPal - ₹${totalAmount}`,
            upi: `Pay with UPI - ₹${totalAmount}`,
            bankTransfer: `Confirm Bank Transfer - ₹${totalAmount}`
        }
        return texts[paymentMethod] || `Pay ₹${totalAmount}`
    }

    const renderPaymentForm = () => {
        const formProps = {
            onDataChange: handlePaymentDataChange,
            errors: errors,
            initialData: paymentData
        }

        switch (paymentMethod) {
            case "creditCard":
                return <CreditCardForm {...formProps} />
            case "paypal":
                return <PayPalForm {...formProps} />
            case "upi":
                return <UPIForm {...formProps} />
            case "bankTransfer":
                return <BankTransferForm {...formProps} />
            default:
                return <CreditCardForm {...formProps} />
        }
    }
    if (payStatus === "paying") return <Paying />
    if (payStatus === "success") return <PaySuccess />
    if (payStatus === "failed") return <PayFailed />
    return (
        <div className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6 space-y-6">
                <div className="border-b pb-4">
                    <h2 className="text-2xl font-bold text-gray-800">Payment Details</h2>
                    <p className="text-gray-600 mt-1">Complete your booking with secure payment</p>
                </div>

                <PaymentMethodSelector
                    paymentMethod={paymentMethod}
                    setPaymentMethod={setPaymentMethod}
                />

                {renderPaymentForm()}

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start">
                    <svg className="w-5 h-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                    <p className="text-blue-700 text-sm">Your payment information is encrypted and secure. We don't store your payment details.</p>
                </div>

                <button
                    onClick={handleSubmit}
                    className="w-full py-4 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors shadow-md hover:shadow-lg flex items-center justify-center disabled:bg-gray-400 disabled:cursor-not-allowed"
                    disabled={Object.keys(errors).length > 0}
                >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {getButtonText()}
                </button>
            </div>

            <BookingSummary booking={booking} />
        </div>
    )
}

export default Payment