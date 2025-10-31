import React from 'react';
import Lottie from 'react-lottie';
import failedAnimationData from '../JSON/Failed.json'

const PayFailed = () => {

  const defaultOptions = {
    loop: false,
    autoplay: true,
    animationData: failedAnimationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice'
    }
  };

  return (
    <div className="w-full flex flex-col items-center justify-center py-12">
      <Lottie 
        options={defaultOptions}
        height={250}
        width={250}
      />
      
      <h2 className="text-2xl font-bold text-red-600 mt-4">
        Payment Failed
      </h2>
      
      <p className="text-lg text-gray-600 mt-2">
        Please try again.
      </p>
    </div>
  );
}

export default PayFailed;