import React, { useState, useRef, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const BeforeAfterComparison = ({ progressData }) => {
  const [selectedTimeframe, setSelectedTimeframe] = useState('1month');
  const [viewMode, setViewMode] = useState('split'); // 'split', 'slider', 'overlay'
  const [selectedAnnotation, setSelectedAnnotation] = useState(null);
  const [isTimeframeDropdownOpen, setIsTimeframeDropdownOpen] = useState(false);
  const timeframeDropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
        if (timeframeDropdownRef.current && !timeframeDropdownRef.current.contains(event.target)) {
            setIsTimeframeDropdownOpen(false);
        }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
        document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const timeframes = [
    { value: '1week', label: '1 Week' },
    { value: '2weeks', label: '2 Weeks' },
    { value: '1month', label: '1 Month' },
    { value: '3months', label: '3 Months' },
    { value: '6months', label: '6 Months' }
  ];

  const viewModes = [
    { value: 'split', label: 'Side by Side', icon: 'Columns' },
    { value: 'slider', label: 'Slider', icon: 'Move' },
    { value: 'overlay', label: 'Overlay', icon: 'Layers' }
  ];

  const currentData = progressData?.find(data => data?.timeframe === selectedTimeframe) || progressData?.[0];

  const openAnnotationModal = (annotation) => {
    setSelectedAnnotation(annotation);
  };

  const closeAnnotationModal = () => {
    setSelectedAnnotation(null);
  };

  return (
    <>
      <div className="bg-card border border-border rounded-clinical p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6 space-y-4 lg:space-y-0">
          <div>
            <h3 className="text-lg font-heading font-heading-semibold text-foreground mb-1">
              Progress Tracking
            </h3>
            <p className="text-sm font-caption font-caption-normal text-muted-foreground">
              Visual comparison of your skin improvement journey
            </p>
          </div>

          <div className="flex items-center justify-between lg:justify-start lg:space-x-2">
            {/* Timeframe Selector */}
            <div className="relative" ref={timeframeDropdownRef}>
              <button
                onClick={() => setIsTimeframeDropdownOpen(!isTimeframeDropdownOpen)}
                className="flex items-center justify-between w-[130px] px-3 py-2 bg-background border border-border rounded-clinical text-sm font-body font-body-normal focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <span>{timeframes.find(t => t.value === selectedTimeframe)?.label}</span>
                <Icon name="ChevronDown" size={16} className={`ml-2 text-muted-foreground transition-transform ${isTimeframeDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              {isTimeframeDropdownOpen && (
                <div className="absolute top-full right-0 mt-1 w-full bg-popover border border-border rounded-clinical shadow-clinical-lg z-10">
                  <div className="py-1">
                    {timeframes.map((timeframe) => (
                      <button
                        key={timeframe.value}
                        onClick={() => {
                          setSelectedTimeframe(timeframe.value);
                          setIsTimeframeDropdownOpen(false);
                        }}
                        className="w-full text-left flex items-center space-x-3 px-3 py-2 text-sm transition-clinical text-popover-foreground hover:bg-secondary/50"
                      >
                        <span>{timeframe.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* View Mode Selector */}
            <div className="flex bg-muted rounded-clinical p-1">
              {viewModes?.map((mode) => (
                <button
                  key={mode?.value}
                  onClick={() => setViewMode(mode?.value)}
                  className={`flex items-center space-x-1 px-3 py-1 rounded-clinical-sm text-xs font-body font-body-medium transition-clinical ${
                    viewMode === mode?.value
                      ? 'bg-background text-foreground shadow-clinical'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Icon name={mode?.icon} size={14} />
                  <span className="hidden sm:inline">{mode?.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Progress Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {currentData?.metrics?.map((metric, index) => (
            <div key={index} className="text-center p-3 bg-secondary/50 rounded-clinical">
              <div className={`text-lg font-heading font-heading-bold ${
                metric?.change > 0 ? 'text-success' : metric?.change < 0 ? 'text-destructive' : 'text-muted-foreground'
              }`}>
                {metric?.change > 0 ? '+' : ''}{metric?.change}%
              </div>
              <div className="text-xs font-caption font-caption-normal text-muted-foreground">
                {metric?.label}
              </div>
            </div>
          ))}
        </div>

        {/* Image Comparison */}
        <div className="relative bg-muted rounded-clinical overflow-hidden" style={{ aspectRatio: '16/9' }}>
          {viewMode === 'split' && (
            <div className="flex h-full">
              <div className="flex-1 relative">
                <Image
                  src={currentData?.beforeImage}
                  alt="Before photo"
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-3 left-3 bg-background/90 backdrop-blur-sm px-3 py-1 rounded-clinical">
                  <span className="text-sm font-body font-body-medium text-foreground">Before</span>
                </div>
                {/* Before Annotations */}
                {currentData?.beforeAnnotations?.map((annotation, index) => (
                  <button
                    key={index}
                    onClick={() => openAnnotationModal(annotation)}
                    className="absolute w-4 h-4 bg-destructive rounded-full border-2 border-background hover:scale-110 transition-clinical"
                    style={{ left: `${annotation?.x}%`, top: `${annotation?.y}%` }}
                  >
                    <span className="sr-only">{annotation?.label}</span>
                  </button>
                ))}
              </div>
              <div className="w-px bg-border"></div>
              <div className="flex-1 relative">
                <Image
                  src={currentData?.afterImage}
                  alt="After photo"
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-3 right-3 bg-background/90 backdrop-blur-sm px-3 py-1 rounded-clinical">
                  <span className="text-sm font-body font-body-medium text-foreground">After</span>
                </div>
                {/* After Annotations */}
                {currentData?.afterAnnotations?.map((annotation, index) => (
                  <button
                    key={index}
                    onClick={() => openAnnotationModal(annotation)}
                    className="absolute w-4 h-4 bg-success rounded-full border-2 border-background hover:scale-110 transition-clinical"
                    style={{ left: `${annotation?.x}%`, top: `${annotation?.y}%` }}
                  >
                    <span className="sr-only">{annotation?.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {viewMode === 'slider' && (
            <div className="relative h-full">
              <Image
                src={currentData?.beforeImage}
                alt="Before photo"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 overflow-hidden">
                <Image
                  src={currentData?.afterImage}
                  alt="After photo"
                  className="w-full h-full object-cover"
                  style={{ clipPath: 'inset(0 50% 0 0)' }}
                />
              </div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1 h-full bg-background shadow-clinical">
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-background border border-border rounded-full flex items-center justify-center">
                  <Icon name="Move" size={16} className="text-muted-foreground" />
                </div>
              </div>
              <div className="absolute bottom-3 left-3 bg-background/90 backdrop-blur-sm px-3 py-1 rounded-clinical">
                <span className="text-sm font-body font-body-medium text-foreground">Before</span>
              </div>
              <div className="absolute bottom-3 right-3 bg-background/90 backdrop-blur-sm px-3 py-1 rounded-clinical">
                <span className="text-sm font-body font-body-medium text-foreground">After</span>
              </div>
            </div>
          )}

          {viewMode === 'overlay' && (
            <div className="relative h-full">
              <Image
                src={currentData?.beforeImage}
                alt="Before photo"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-background/50">
                <Image
                  src={currentData?.afterImage}
                  alt="After photo"
                  className="w-full h-full object-cover opacity-50"
                />
              </div>
              <div className="absolute bottom-3 left-3 bg-background/90 backdrop-blur-sm px-3 py-1 rounded-clinical">
                <span className="text-sm font-body font-body-medium text-foreground">Overlay View</span>
              </div>
            </div>
          )}
        </div>

        {/* Timeline */}
        <div className="mt-6">
          <h4 className="font-heading font-heading-medium text-sm text-foreground mb-3">
            Progress Timeline
          </h4>
          <div className="flex space-x-2 overflow-x-auto pb-2">
            {progressData?.map((data, index) => (
              <button
                key={data?.timeframe}
                onClick={() => setSelectedTimeframe(data?.timeframe)}
                className={`flex-shrink-0 flex flex-col items-center space-y-2 p-3 rounded-clinical transition-clinical ${
                  selectedTimeframe === data?.timeframe
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                }`}
              >
                <div className="w-12 h-12 rounded-clinical overflow-hidden">
                  <Image
                    src={data?.afterImage}
                    alt={`Progress at ${data?.timeframe}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="text-xs font-caption font-caption-normal">
                  {timeframes?.find(t => t?.value === data?.timeframe)?.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 mt-6">
          <button className="flex items-center justify-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-clinical hover:bg-primary/90 transition-clinical">
            <Icon name="Camera" size={16} />
            <span className="font-body font-body-medium text-sm">Take New Photo</span>
          </button>
          <button className="flex items-center justify-center space-x-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-clinical hover:bg-secondary/80 transition-clinical">
            <Icon name="Download" size={16} />
            <span className="font-body font-body-medium text-sm">Export Comparison</span>
          </button>
          <button className="flex items-center justify-center space-x-2 px-4 py-2 bg-accent text-accent-foreground rounded-clinical hover:bg-accent/90 transition-clinical">
            <Icon name="Share2" size={16} />
            <span className="font-body font-body-medium text-sm">Share Progress</span>
          </button>
        </div>
      </div>
      {/* Annotation Modal */}
      {selectedAnnotation && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-modal flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-clinical max-w-sm w-full">
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-heading font-heading-semibold text-sm text-foreground">
                  {selectedAnnotation?.label}
                </h3>
                <button
                  onClick={closeAnnotationModal}
                  className="p-1 hover:bg-secondary rounded-clinical transition-clinical"
                >
                  <Icon name="X" size={16} className="text-muted-foreground" />
                </button>
              </div>
              <p className="text-sm font-body font-body-normal text-muted-foreground mb-3">
                {selectedAnnotation?.description}
              </p>
              {selectedAnnotation?.improvement && (
                <div className="flex items-center space-x-2 p-2 bg-success/10 rounded-clinical">
                  <Icon name="TrendingUp" size={16} className="text-success" />
                  <span className="text-sm font-body font-body-medium text-success">
                    {selectedAnnotation?.improvement}% improvement
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BeforeAfterComparison;