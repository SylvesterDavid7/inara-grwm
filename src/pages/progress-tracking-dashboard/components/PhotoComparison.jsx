import React, { useState, useRef } from 'react';
import Icon from '../../../components/AppIcon';

const PhotoComparison = ({
  beforePhoto,
  afterPhoto,
  date,
  notes,
  onPhotoUpload,
  onPhotoRemove,
  isUploading,
  defaultPhotos,
}) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const fileInputRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  const handleSliderChange = (e) => {
    setSliderPosition(e.target.value);
  };

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      onPhotoUpload(file);
    }
  };

  const handleRemovePhoto = (photoType) => {
    if (onPhotoRemove) {
      onPhotoRemove(photoType);
    }
  };

  const isDefaultPhoto = (photoType) => {
    return defaultPhotos && defaultPhotos[photoType] === (photoType === 'before' ? beforePhoto : afterPhoto);
  };

  return (
    <div 
        className="bg-card border border-border rounded-clinical p-4 sm:p-6 shadow-clinical relative"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
    >
      {isUploading && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10 rounded-clinical">
          <div className="text-white text-center">
            <Icon name="Loader" className="animate-spin h-8 w-8 mx-auto" />
            <p className="mt-2">Uploading...</p>
          </div>
        </div>
      )}
      <div className="flex flex-col sm:flex-row justify-between items-start mb-4">
        <div className="mb-4 sm:mb-0">
          <h3 className="font-heading font-heading-semibold text-lg text-card-foreground">
            Progress Comparison
          </h3>
          <p className="font-caption font-caption-normal text-sm text-muted-foreground mt-1">
            {notes}
          </p>
        </div>
        <div className="flex items-center space-x-2 self-start sm:self-center">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept="image/*"
            disabled={isUploading}
          />
          <button
            onClick={handleUploadClick}
            disabled={isUploading}
            className="flex items-center justify-center h-9 px-4 bg-primary text-primary-foreground rounded-md text-sm font-body-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            <Icon name="Upload" size={16} className="mr-2" />
            Upload
          </button>
        </div>
      </div>

      <div className="relative w-full aspect-[4/3] sm:aspect-video select-none overflow-hidden rounded-lg">
        <div className="absolute inset-0 w-full h-full">
          <img
            src={beforePhoto}
            alt="Before"
            className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          />
          <div
            className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none"
            style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
          >
            <img
              src={afterPhoto}
              alt="After"
              className="absolute inset-0 w-full h-full object-cover pointer-events-none"
            />
          </div>
        </div>
        <input
          type="range"
          min="0"
          max="100"
          value={sliderPosition}
          onChange={handleSliderChange}
          className="absolute inset-0 w-full h-full cursor-pointer opacity-0"
          disabled={isUploading}
        />
        <div
          className="absolute top-0 bottom-0 bg-white w-1 pointer-events-none"
          style={{ left: `${sliderPosition}%` }}
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg">
            <Icon name="ChevronsLeftRight" size={16} className="text-gray-600" />
          </div>
        </div>
        
        {isHovered && !isUploading && (
            <>
                {!isDefaultPhoto('before') && (
                    <button
                        onClick={() => handleRemovePhoto('before')}
                        className="absolute top-2 left-2 bg-red-500 text-white rounded-full p-1.5 transition-opacity"
                        aria-label="Remove before photo"
                    >
                        <Icon name="Trash2" size={16} />
                    </button>
                )}
                {!isDefaultPhoto('after') && (
                    <button
                        onClick={() => handleRemovePhoto('after')}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 transition-opacity"
                        aria-label="Remove after photo"
                    >
                        <Icon name="Trash2" size={16} />
                    </button>
                )}
            </>
        )}
      </div>
      <p className="text-xs text-muted-foreground mt-4 text-center">
        Last updated: {date}
      </p>
    </div>
  );
};

export default PhotoComparison;
