import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function SplashScreen() {
  const navigate = useNavigate();
  const [startAnimation, setStartAnimation] = useState(false);

  useEffect(() => {
    // Start animation as soon as the component mounts
    setStartAnimation(true);

    const timer = setTimeout(() => {
      navigate('/');
    }, 5000); // 5 seconds delay

    return () => clearTimeout(timer); // Cleanup the timer on component unmount
  }, [navigate]);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center overflow-hidden">
      <video
        autoPlay
        muted
        playsInline
        src="/background.mp4"
        className="absolute top-0 left-0 w-full h-full object-cover z-0 opacity-50"
        onError={(e) => { console.error("Video Error:", e); }}
      />
      <div className="flex items-center gap-3">
        {/* 1. Logo from public folder */}
        <img
          src="/Inara Logo.svg"
          alt="Inara Logo"
          className={`h-10 w-30 object-scale-down scale-130 ${startAnimation ? 'animate-fade-in-up' : 'opacity-0'}`}
          style={{ animationDelay: "0.5s" }}
          onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/120x40/f1f5f9/334155?text=Logo'; }}
        />

        {/* 2. X */}
        <span
          className={`text-gray-800 text-lg ${startAnimation ? 'animate-fade-in-up' : 'opacity-0'}`}
          style={{ animationDelay: "1.0s" }}
        >
          X
        </span>

        {/* 3. GRWM and Subtitle */}
        <div>
          <h1
            className={`text-lg font-extrabold font-sans ${startAnimation ? 'animate-fade-in-up' : 'opacity-0'}`}
            style={{ animationDelay: "1.5s" }}
          >
            GRWM
          </h1>
          <p
            className={`text-[10px] -mt-1 tracking-wide text-slate-500 ${startAnimation ? 'animate-fade-in-up' : 'opacity-0'}`}
            style={{ animationDelay: "2.0s" }}
          >
            Get Results With Metrics
          </p>
        </div>
      </div>
    </div>
  );
}

export default SplashScreen;
