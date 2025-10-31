import React, { useState, useEffect } from 'react';

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
      <div className="absolute inset-0 bg-cover bg-center"style={{ backgroundImage: `url(/img${img}.jpg)` }}></div>
      <div className="absolute inset-0 bg-black/50"></div>

      <div className="relative z-10 flex items-center justify-center h-full text-white">
        <h1 className="text-4xl font-bold">Welcome</h1>
      </div>
    </div>
  );
}

export default Home;
