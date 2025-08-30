import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const SectionContextMenu = ({ className = "" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const location = useLocation();

  const getContextActions = () => {
    const path = location?.pathname;
    
    switch (path) {
      case '/skincare-scorecard-results':
        return [
          { 
            label: 'Export PDF', 
            icon: 'Download', 
            action: () => console.log('Export PDF'),
            description: 'Download detailed scorecard report'
          },
          { 
            label: 'Share Results', 
            icon: 'Share2', 
            action: () => console.log('Share Results'),
            description: 'Share your skincare analysis'
          },
          { 
            label: 'Save to Profile', 
            icon: 'Bookmark', 
            action: () => console.log('Save to Profile'),
            description: 'Save results for future reference'
          },
          { 
            label: 'Compare Previous', 
            icon: 'GitCompare', 
            action: () => console.log('Compare Previous'),
            description: 'Compare with past assessments'
          }
        ];
      
      case '/product-recommendations':
        return [
          { 
            label: 'Create Routine', 
            icon: 'Plus', 
            action: () => console.log('Create Routine'),
            description: 'Build routine from recommendations'
          },
          { 
            label: 'Save Favorites', 
            icon: 'Heart', 
            action: () => console.log('Save Favorites'),
            description: 'Save recommended products'
          },
          { 
            label: 'Share List', 
            icon: 'Share2', 
            action: () => console.log('Share List'),
            description: 'Share product recommendations'
          },
          { 
            label: 'Price Alerts', 
            icon: 'Bell', 
            action: () => console.log('Price Alerts'),
            description: 'Get notified of price changes'
          }
        ];
      
      case '/progress-tracking-dashboard':
        return [
          { 
            label: 'Export Data', 
            icon: 'Download', 
            action: () => console.log('Export Data'),
            description: 'Download progress data'
          },
          { 
            label: 'Set Goals', 
            icon: 'Target', 
            action: () => console.log('Set Goals'),
            description: 'Define skincare goals'
          },
          { 
            label: 'Schedule Reminder', 
            icon: 'Calendar', 
            action: () => console.log('Schedule Reminder'),
            description: 'Set routine reminders'
          }
        ];
      
      case '/ingredient-education-hub':
        return [
          { 
            label: 'Bookmark Article', 
            icon: 'Bookmark', 
            action: () => console.log('Bookmark Article'),
            description: 'Save for later reading'
          },
          { 
            label: 'Share Knowledge', 
            icon: 'Share2', 
            action: () => console.log('Share Knowledge'),
            description: 'Share educational content'
          },
          { 
            label: 'Print Guide', 
            icon: 'Printer', 
            action: () => console.log('Print Guide'),
            description: 'Print ingredient guide'
          }
        ];
      
      default:
        return [];
    }
  };

  const actions = getContextActions();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef?.current && !menuRef?.current?.contains(event?.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleActionClick = (action) => {
    action?.action();
    setIsOpen(false);
  };

  if (actions?.length === 0) {
    return null;
  }

  return (
    <div className={`relative ${className}`} ref={menuRef}>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        iconName="MoreVertical"
        iconSize={16}
        className="h-8 w-8 p-0"
      >
        <span className="sr-only">More actions</span>
      </Button>
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-64 bg-popover border border-border rounded-clinical shadow-clinical-lg z-secondary-nav">
          <div className="py-2">
            {actions?.map((action, index) => (
              <button
                key={index}
                onClick={() => handleActionClick(action)}
                className="w-full flex items-start space-x-3 px-4 py-3 text-left hover:bg-secondary/50 transition-clinical group"
              >
                <Icon 
                  name={action?.icon} 
                  size={16} 
                  className="text-muted-foreground group-hover:text-primary mt-0.5 flex-shrink-0" 
                />
                <div className="flex-1 min-w-0">
                  <div className="font-body font-body-medium text-sm text-popover-foreground group-hover:text-primary">
                    {action?.label}
                  </div>
                  {action?.description && (
                    <div className="font-caption font-caption-normal text-xs text-muted-foreground mt-0.5">
                      {action?.description}
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SectionContextMenu;