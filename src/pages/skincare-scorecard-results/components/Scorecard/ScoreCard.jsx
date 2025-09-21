import React from 'react';

function ScoreCard({ score, verdict, cuteName, cardImage }) {
  const getScoreColors = (score) => {
    if (score >= 80) {
      return { bg: 'bg-green-100', text: 'text-green-700', ring: 'ring-green-300' };
    }
    if (score >= 60) {
      return { bg: 'bg-yellow-100', text: 'text-yellow-800', ring: 'ring-yellow-300' };
    }
    return { bg: 'bg-red-100', text: 'text-red-700', ring: 'ring-red-300' };
  };

  const colors = getScoreColors(score);

  return (
    <div className="relative w-full h-full bg-gradient-to-br from-black to-slate-800 backdrop-blur-md rounded-2xl p-8 flex flex-col items-center justify-center text-center shadow-lg border border-white/80 overflow-hidden">
      <div className="absolute bottom-0 left-0 w-full h-2 bg-green-500 rounded-full shadow-[0_0_10px_2px_rgba(34,197,94,0.8)]" />

      {/* Main logo and branding on the left */}
      <div className="absolute top-4 left-4 sm:top-5 sm:left-5 flex items-end gap-1.5 sm:gap-2">
        <img
          src="/Inara_Logo_White.svg"
          alt="Inara Logo"
          className="h-8 w-24 sm:h-10 sm:w-30 object-scale-down scale-130"
          onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/120x40/f1f5f9/334155?text=Logo'; }}
        />
        <span className="text-gray-100 text-base sm:text-lg">X</span>
        <div className='text-left'>
          <h1 className="text-base sm:text-lg text-slate-100 font-extrabold">GRWM</h1>
          <p className="text-[8px] sm:text-[10px] -mt-0.5 sm:-mt-1 tracking-wide text-slate-100">Get Results With Metrics</p>
        </div>
      </div>

      {/* This new text is now centered using absolute positioning and `left-1/2` */}
      <p className="pr-5 pl-5 absolute top-20 text-base sm:text-base font-extrabold capitalize font-cursive text-slate-400 opacity-70 mt-1">
        Your Personalized Skincare Insights
      </p>

      <div className="flex flex-col justify-center items-center gap-3">
        <div className="text-6xl font-extrabold text-slate-100 leading-tight">
          {score}
          <span className="text-3xl opacity-50 font-medium">/100</span>
        </div>
        <div className={`inline-flex items-center px-6 py-2 rounded-full font-semibold uppercase text-lg ${colors.bg} ${colors.text} ${colors.ring}`}>
          <span className="rounded-full bg-current/90" />
          <span className='font-bold'>{verdict}</span>
        </div>
      </div>

      <div className="mt-8 text-sm text-slate-400">
        Skincare Routine Analysis for:
      </div>
      <div className="mt-2 text-2xl font-bold text-slate-100">
        {cuteName}
      </div>

      <div className="absolute bottom-6 right-6 text-sm text-slate-500 opacity-80">
        #InaraGRWM
      </div>

      <img
        src={cardImage}
        alt="Inara Smiley"
        className="absolute w-[100%] h-[100%] object-contain rotate-[-15deg] right-[-10%] bottom-[-20%] opacity-5 [filter:invert(1)]"
      />

      <img
        src="/qr.svg"
        alt="QR Code"
        className="absolute bottom-6 left-6 h-16 w-16 object-contain opacity-80"
        onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/160x160/f1f5f9/334155?text=QR'; }}
      />
    </div>
  );
}

export default ScoreCard;
