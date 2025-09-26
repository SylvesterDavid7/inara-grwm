import React, { useState, useEffect } from 'react';
import '../../styles/HeroSection.css';

const HeroSection = () => {
  const [text, setText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  const [typingSpeed, setTypingSpeed] = useState(150);
  const [videoSrc, setVideoSrc] = useState(window.innerWidth < 768 ? '/INARA HERO Mobile 1.mp4' : '/INARA HERO.mp4');

  const toRotate = ["Skincare, Simplified", "Your Perfect Routine", "Get Results With Metrics"];

  useEffect(() => {
    const handleResize = () => {
      setVideoSrc(window.innerWidth < 768 ? '/INARA HERO Mobile 1.mp4' : '/INARA HERO.mp4');
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const handleType = () => {
      const i = loopNum % toRotate.length;
      const fullText = toRotate[i];

      setText(isDeleting ? fullText.substring(0, text.length - 1) : fullText.substring(0, text.length + 1));

      setTypingSpeed(isDeleting ? 80 : 150);

      if (!isDeleting && text === fullText) {
        setTimeout(() => setIsDeleting(true), 2000);
      } else if (isDeleting && text === '') {
        setIsDeleting(false);
        setLoopNum(loopNum + 1);
      }
    };

    const timer = setTimeout(handleType, typingSpeed);
    return () => clearTimeout(timer);
  }, [text, isDeleting, loopNum, typingSpeed, toRotate]);

  const handleScroll = () => {
    window.scrollBy({
      top: window.innerHeight,
      behavior: 'smooth'
    });
  };

  return (
    <div className="hero-container font-heading">
      <video
        key={videoSrc} // This is the new line
        autoPlay
        loop
        muted
        playsInline
        className={`hero-video z-index-1000 opacity-100 ${window.innerWidth < 768 ? 'mobile-video' : ''}`}
      >
        <source src={videoSrc} type="video/mp4" />
      </video>
      <div className="hero-content font-heading">
        <h1 className='font-heading'>{text}</h1>
        <p>Your journey to radiant skin starts here.</p>
        <div className="arrow-container" onClick={handleScroll}>
          <div className="arrow"></div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
