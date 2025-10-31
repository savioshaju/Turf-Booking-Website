import React from 'react';
import Lottie from 'react-lottie';

import animationData from '../JSON/Payment Done Character Animation.json'; 

const Paying = () => {

  
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData, 
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
      <h2>Processing Your Payment...</h2>
    </div>
  );
}

export default Paying;