import React from 'react';

const FlippableCard = ({ frontContent, backContent, isFlipped, onFlip, frontRef, backRef }) => {
  return (
    <div className="w-full h-full [perspective:1000px] cursor-pointer" onClick={onFlip}>
      <div
        className={`relative w-full h-full text-center transition-transform duration-700 [transform-style:preserve-3d] ${
          isFlipped ? '[transform:rotateY(180deg)]' : ''
        }`}
      >
        {/* Front of the card */}
        <div ref={frontRef} className="absolute w-full h-full rounded-2xl shadow-lg [backface-visibility:hidden]">
          {frontContent}
        </div>

        {/* Back of the card */}
        <div ref={backRef} className="absolute w-full h-full rounded-2xl shadow-lg [transform:rotateY(180deg)] [backface-visibility:hidden]">
          {backContent}
        </div>
      </div>
    </div>
  );
};

export default FlippableCard;
