import React from 'react';

const Footer = () => {
  return (
    <footer className="w-full px-6 pb-16 pt-6 text-center text-xs text-slate-500 bg-slate-100">
      © {new Date().getFullYear()} <img src="/Inara Logo.svg" alt="Inara Logo" className="pb-1 inline-block h-4 w-auto mx-1 align-middle" /><span className="text-gray-600 text-sm">x</span><span className="text-gray-600 font-bold"> GRWM</span> · Built for evidence-based skincare. This is not medical advice.
    </footer>
  );
};

export default Footer;
