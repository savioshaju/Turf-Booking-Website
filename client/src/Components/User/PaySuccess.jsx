import React from 'react'
import Lottie from 'react-lottie'
import { useNavigate } from 'react-router-dom'
import successAnimationData from '../JSON/Payment Successfull.json'

const PaySuccess = () => {
    const navigate = useNavigate()
    const defaultOptions = {
        loop: false,
        autoplay: true,
        animationData: successAnimationData,
        rendererSettings: {
            preserveAspectRatio: 'xMidYMid slice'
        }
    }

    return (
        <div className="w-full flex flex-col items-center justify-center py-12">
            <Lottie options={defaultOptions} height={250} width={250} />
            <button 
                onClick={() => navigate('/user/mybooking')} 
                className="mt-6 bg-green-600 text-white font-semibold px-6 py-2 rounded-lg hover:bg-green-700 transition-all"
            >
                View My Bookings
            </button>
        </div>
    )
}

export default PaySuccess
