import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';


function Home() {
  const [img, setImg] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
      setImg(prev => (prev + 1) % 4);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-screen h-screen">
      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(/img${img}.jpg)` }}></div>
      <div className="absolute inset-0 bg-black/50"></div>

      <div className="relative z-10 flex flex-col items-center justify-center h-full text-white px-4 text-center space-y-4">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
          Welcome to TurfBook
        </h1>
        <p className="text-lg md:text-2xl max-w-2xl">
          Your go-to platform for booking turfs, playing sports, and spreading happiness.
          Find the perfect turf and enjoy every match!
        </p>
        <Link to='/turf' className="mt-4 px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold transition-all duration-300">
          Explore Turfs
        </Link>
      </div>

    </div>
  );
}

export default Home;
