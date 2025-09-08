import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function SplashScreen() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/');
    }, 4000); // 4 seconds delay

    return () => clearTimeout(timer); // Cleanup the timer on component unmount
  }, [navigate]);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center overflow-hidden">
      <video
        autoPlay    // Start playing automatically
        muted       // Mute the video (required for autoplay in most browsers)
        playsInline // Important for iOS to prevent fullscreen
        // IMPORTANT: Replace this src with the path to your video file.
        // Place your video in the project's `public` folder.
        // For example, if your video is at `public/videos/intro.mp4`, the src would be "/videos/intro.mp4"
        src="/background.mp4" // Placeholder video
        className="absolute top-0 left-0 w-full h-full object-cover z-0 opacity-50"
        
        // This video will play once and then pause on the last frame.
      />
      <div className="flex items-center gap-3">
        {/* 1. Logo from public folder */}
        <img
          src="/Inara Logo.svg"
          alt="Inara Logo"
          className="h-10 w-30 object-scale-down scale-130 animate-fade-in-up"
          style={{ animationDelay: "0.5s" }}
          onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/120x40/f1f5f9/334155?text=Logo'; }}
        />

        {/* 2. X */}
        <span
          className="text-gray-800 text-lg animate-fade-in-up"
          style={{ animationDelay: "1.0s" }}
        >
          X
        </span>

        {/* 3. GRWM and Subtitle */}
        <div>
          <h1
            className="text-lg font-extrabold font-sans animate-fade-in-up"
            style={{ animationDelay: "1.5s" }}
          >
            GRWM
          </h1>
          <p
            className="text-[10px] -mt-1 tracking-wide text-slate-500 animate-fade-in-up"
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