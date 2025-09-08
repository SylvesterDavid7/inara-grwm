import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const PhotoComparison = ({ beforePhoto, afterPhoto, date, notes, className = "" }) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);

  const handleSliderChange = (e) => {
    const rect = e?.currentTarget?.getBoundingClientRect();
    const x = e?.clientX - rect?.left;
    const percentage = (x / rect?.width) * 100;
    setSliderPosition(Math.max(0, Math.min(100, percentage)));
  };

  const handleMouseDown = () => {
    setIsDragging(true);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      handleSliderChange(e);
    }
  };

  return (
    <div className={`bg-card border border-border rounded-clinical p-4 sm:p-6 shadow-clinical ${className}`}>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4">
        <h3 className="font-heading font-heading-semibold text-lg text-card-foreground mb-2 sm:mb-0">
          Progress Comparison
        </h3>
        <div className="flex items-center space-x-2">
          <span className="font-caption font-caption-normal text-sm text-muted-foreground">
            {date}
          </span>
          <Button variant="outline" size="sm" iconName="Upload" iconSize={16}>
            Upload New
          </Button>
        </div>
      </div>
      {/* Photo Comparison Slider */}
      <div className="relative mb-4">
        <div 
          className="relative w-full h-56 sm:h-64 md:h-80 overflow-hidden rounded-clinical cursor-col-resize"
          onMouseMove={handleMouseMove}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {/* Before Photo */}
          <div className="absolute inset-0">
            <Image
              src={beforePhoto}
              alt="Before progress photo"
              className="w-full h-full object-cover"
            />
            <div className="absolute top-2 left-2 sm:top-4 sm:left-4 bg-background/90 px-2 py-1 sm:px-3 rounded-clinical">
              <span className="font-body font-body-medium text-xs sm:text-sm text-foreground">Before</span>
            </div>
          </div>

          {/* After Photo */}
          <div 
            className="absolute inset-0 overflow-hidden"
            style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
          >
            <Image
              src={afterPhoto}
              alt="After progress photo"
              className="w-full h-full object-cover"
            />
            <div className="absolute top-2 right-2 sm:top-4 sm:right-4 bg-background/90 px-2 py-1 sm:px-3 rounded-clinical">
              <span className="font-body font-body-medium text-xs sm:text-sm text-foreground">After</span>
            </div>
          </div>

          {/* Slider Line */}
          <div 
            className="absolute top-0 bottom-0 w-0.5 bg-primary cursor-col-resize z-10"
            style={{ left: `${sliderPosition}%` }}
          >
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-primary rounded-full flex items-center justify-center shadow-clinical-lg">
              <Icon name="Move" size={16} className="text-primary-foreground" />
            </div>
          </div>
        </div>

        {/* Slider Control */}
        <div className="mt-4">
          <input
            type="range"
            min="0"
            max="100"
            value={sliderPosition}
            onChange={(e) => setSliderPosition(e?.target?.value)}
            className="w-full h-2 bg-muted rounded-clinical appearance-none cursor-pointer slider"
            style={{
              background: `linear-gradient(to right, #2D5A87 0%, #2D5A87 ${sliderPosition}%, #F8F9FA ${sliderPosition}%, #F8F9FA 100%)`
            }}
          />
        </div>
      </div>
      {/* Notes Section */}
      {notes && (
        <div className="bg-muted rounded-clinical p-3 sm:p-4">
          <h4 className="font-body font-body-medium text-sm text-foreground mb-2">Progress Notes</h4>
          <p className="font-body font-body-normal text-sm text-muted-foreground">
            {notes}
          </p>
        </div>
      )}
      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between mt-4 pt-4 border-t border-border">
        <div className="flex items-center space-x-2 mb-2 sm:mb-0">
          <Button variant="outline" size="sm" iconName="Download" iconSize={16} className="flex-grow sm:flex-grow-0">
            Export
          </Button>
          <Button variant="outline" size="sm" iconName="Share2" iconSize={16} className="flex-grow sm:flex-grow-0">
            Share
          </Button>
        </div>
        <Button variant="outline" size="sm" iconName="Edit3" iconSize={16}>
          Add Notes
        </Button>
      </div>
    </div>
  );
};

export default PhotoComparison;