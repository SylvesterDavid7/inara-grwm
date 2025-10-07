
import React, { forwardRef, useEffect, useState } from 'react';
import Webcam from 'react-webcam';

const getWindowDimensions = () => {
  if (typeof window === 'undefined') {
    return { width: 1920 }; // Default to desktop during SSR or build
  }
  const { innerWidth: width } = window;
  return {
    width
  };
};

const useWindowDimensions = () => {
  const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());

  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowDimensions;
};


export const WebcamCapture = forwardRef((props, ref) => {
    const { width } = useWindowDimensions();
    const isDesktop = width > 768; // md breakpoint

    const videoConstraints = {
        facingMode: "user",
        aspectRatio: isDesktop ? 16/9 : 9/16,
        width: { ideal: isDesktop ? 1920 : 720 },
        height: { ideal: isDesktop ? 1080 : 1280 },
    };

    return (
        <Webcam
            audio={false}
            ref={ref}
            screenshotFormat="image/jpeg"
            videoConstraints={videoConstraints}
            className="w-full h-full object-cover"
            {...props}
        />
    )
});

WebcamCapture.displayName = 'WebcamCapture';
