import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const IngredientDetailModal = ({ ingredient, isOpen, onClose, onBookmark, isBookmarked = false }) => {
  const [activeTab, setActiveTab] = useState('overview');

  if (!isOpen || !ingredient) return null;

  const getSafetyColor = (rating) => {
    switch (rating) {
      case 'excellent': return 'text-success bg-success/10';
      case 'good': return 'text-accent bg-accent/10';
      case 'moderate': return 'text-warning bg-warning/10';
      case 'caution': return 'text-destructive bg-destructive/10';
      default: return 'text-muted-foreground bg-muted';
    }
  };

  const getConcernBadgeColor = (concern) => {
    const colors = {
      'acne': 'bg-blue-100 text-blue-800',
      'aging': 'bg-purple-100 text-purple-800',
      'hyperpigmentation': 'bg-amber-100 text-amber-800',
      'sensitivity': 'bg-red-100 text-red-800',
      'dryness': 'bg-cyan-100 text-cyan-800',
      'oiliness': 'bg-green-100 text-green-800'
    };
    return colors?.[concern] || 'bg-gray-100 text-gray-800';
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'Info' },
    { id: 'benefits', label: 'Benefits', icon: 'Heart' },
    { id: 'usage', label: 'Usage', icon: 'Clock' },
    { id: 'compatibility', label: 'Compatibility', icon: 'GitCompare' },
    { id: 'studies', label: 'Studies', icon: 'FileText' }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            <div>
              <h4 className="font-heading font-heading-semibold text-base text-foreground mb-3">
                What is {ingredient?.name}?
              </h4>
              <p className="font-body font-body-normal text-sm text-foreground leading-relaxed">
                {ingredient?.detailedDescription}
              </p>
            </div>
            <div>
              <h4 className="font-heading font-heading-semibold text-base text-foreground mb-3">
                Key Properties
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-muted rounded-clinical p-3">
                  <div className="font-body font-body-medium text-sm text-foreground mb-1">pH Level</div>
                  <div className="font-data font-data-normal text-sm text-muted-foreground">{ingredient?.phLevel}</div>
                </div>
                <div className="bg-muted rounded-clinical p-3">
                  <div className="font-body font-body-medium text-sm text-foreground mb-1">Molecular Weight</div>
                  <div className="font-data font-data-normal text-sm text-muted-foreground">{ingredient?.molecularWeight}</div>
                </div>
                <div className="bg-muted rounded-clinical p-3">
                  <div className="font-body font-body-medium text-sm text-foreground mb-1">Solubility</div>
                  <div className="font-data font-data-normal text-sm text-muted-foreground">{ingredient?.solubility}</div>
                </div>
                <div className="bg-muted rounded-clinical p-3">
                  <div className="font-body font-body-medium text-sm text-foreground mb-1">Stability</div>
                  <div className="font-data font-data-normal text-sm text-muted-foreground">{ingredient?.stability}</div>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'benefits':
        return (
          <div className="space-y-6">
            <div>
              <h4 className="font-heading font-heading-semibold text-base text-foreground mb-3">
                Primary Benefits
              </h4>
              <div className="space-y-3">
                {ingredient?.benefits?.map((benefit, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <Icon name="Check" size={16} className="text-success mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-body font-body-medium text-sm text-foreground">{benefit?.title}</div>
                      <div className="font-body font-body-normal text-sm text-muted-foreground">{benefit?.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-heading font-heading-semibold text-base text-foreground mb-3">
                Potential Side Effects
              </h4>
              <div className="space-y-3">
                {ingredient?.sideEffects?.map((effect, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <Icon name="AlertTriangle" size={16} className="text-warning mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-body font-body-medium text-sm text-foreground">{effect?.title}</div>
                      <div className="font-body font-body-normal text-sm text-muted-foreground">{effect?.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      
      case 'usage':
        return (
          <div className="space-y-6">
            <div>
              <h4 className="font-heading font-heading-semibold text-base text-foreground mb-3">
                Recommended Usage
              </h4>
              <div className="bg-muted rounded-clinical p-4">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <div className="font-body font-body-medium text-sm text-foreground mb-1">Concentration</div>
                    <div className="font-data font-data-normal text-sm text-muted-foreground">{ingredient?.concentration}</div>
                  </div>
                  <div>
                    <div className="font-body font-body-medium text-sm text-foreground mb-1">Frequency</div>
                    <div className="font-data font-data-normal text-sm text-muted-foreground">{ingredient?.frequency}</div>
                  </div>
                </div>
                <div className="font-body font-body-normal text-sm text-foreground">
                  {ingredient?.usageInstructions}
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-heading font-heading-semibold text-base text-foreground mb-3">
                Best Time to Use
              </h4>
              <div className="flex items-center space-x-4">
                <div className={`flex items-center space-x-2 px-3 py-2 rounded-clinical ${
                  ingredient?.timeOfUse?.includes('morning') ? 'bg-warning/10 text-warning' : 'bg-muted text-muted-foreground'
                }`}>
                  <Icon name="Sun" size={16} />
                  <span className="font-body font-body-medium text-sm">Morning</span>
                </div>
                <div className={`flex items-center space-x-2 px-3 py-2 rounded-clinical ${
                  ingredient?.timeOfUse?.includes('evening') ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
                }`}>
                  <Icon name="Moon" size={16} />
                  <span className="font-body font-body-medium text-sm">Evening</span>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'compatibility':
        return (
          <div className="space-y-6">
            <div>
              <h4 className="font-heading font-heading-semibold text-base text-foreground mb-3">
                Works Well With
              </h4>
              <div className="space-y-2">
                {ingredient?.compatibleWith?.map((compatible, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-success/5 border border-success/20 rounded-clinical">
                    <Icon name="Plus" size={16} className="text-success" />
                    <div>
                      <div className="font-body font-body-medium text-sm text-foreground">{compatible?.name}</div>
                      <div className="font-body font-body-normal text-sm text-muted-foreground">{compatible?.reason}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-heading font-heading-semibold text-base text-foreground mb-3">
                Avoid Mixing With
              </h4>
              <div className="space-y-2">
                {ingredient?.incompatibleWith?.map((incompatible, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-destructive/5 border border-destructive/20 rounded-clinical">
                    <Icon name="X" size={16} className="text-destructive" />
                    <div>
                      <div className="font-body font-body-medium text-sm text-foreground">{incompatible?.name}</div>
                      <div className="font-body font-body-normal text-sm text-muted-foreground">{incompatible?.reason}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      
      case 'studies':
        return (
          <div className="space-y-6">
            <div>
              <h4 className="font-heading font-heading-semibold text-base text-foreground mb-3">
                Clinical Studies
              </h4>
              <div className="space-y-4">
                {ingredient?.studies?.map((study, index) => (
                  <div key={index} className="border border-border rounded-clinical p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h5 className="font-body font-body-medium text-sm text-foreground">{study?.title}</h5>
                      <span className="font-data font-data-normal text-xs text-muted-foreground">{study?.year}</span>
                    </div>
                    <p className="font-body font-body-normal text-sm text-muted-foreground mb-3">{study?.summary}</p>
                    <div className="flex items-center justify-between">
                      <span className="font-caption font-caption-normal text-xs text-muted-foreground">{study?.journal}</span>
                      <Button variant="link" size="sm" className="h-auto p-0 text-xs">
                        Read Study
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-modal bg-background/80 backdrop-blur-sm">
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="bg-card border border-border rounded-clinical shadow-clinical-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-muted rounded-clinical overflow-hidden">
                <Image
                  src={ingredient?.image}
                  alt={ingredient?.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h2 className="font-heading font-heading-semibold text-xl text-card-foreground">
                  {ingredient?.name}
                </h2>
                <p className="font-caption font-caption-normal text-sm text-muted-foreground">
                  {ingredient?.scientificName}
                </p>
                <div className="flex items-center space-x-3 mt-2">
                  <div className={`px-2 py-1 rounded-clinical-sm text-xs font-body font-body-medium ${getSafetyColor(ingredient?.safetyRating)}`}>
                    {ingredient?.safetyRating}
                  </div>
                  <div className="flex items-center space-x-1">
                    <Icon name="Star" size={14} className="text-warning" />
                    <span className="font-data font-data-normal text-sm text-muted-foreground">
                      {ingredient?.rating}/5
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onBookmark(ingredient?.id)}
                iconName={isBookmarked ? "Bookmark" : "BookmarkPlus"}
                iconPosition="left"
                iconSize={16}
              >
                {isBookmarked ? 'Bookmarked' : 'Bookmark'}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                iconName="X"
                iconSize={20}
              >
                <span className="sr-only">Close</span>
              </Button>
            </div>
          </div>
          
          {/* Skin Concerns */}
          <div className="px-6 py-4 border-b border-border">
            <div className="flex flex-wrap gap-2">
              {ingredient?.skinConcerns?.map((concern, index) => (
                <span
                  key={index}
                  className={`px-3 py-1 rounded-clinical-sm text-sm font-caption font-caption-normal ${getConcernBadgeColor(concern)}`}
                >
                  {concern}
                </span>
              ))}
            </div>
          </div>
          
          {/* Tabs */}
          <div className="border-b border-border">
            <div className="flex overflow-x-auto">
              {tabs?.map((tab) => (
                <button
                  key={tab?.id}
                  onClick={() => setActiveTab(tab?.id)}
                  className={`flex items-center space-x-2 px-6 py-4 text-sm font-body font-body-medium whitespace-nowrap border-b-2 transition-clinical ${
                    activeTab === tab?.id
                      ? 'border-primary text-primary' :'border-transparent text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Icon name={tab?.icon} size={16} />
                  <span>{tab?.label}</span>
                </button>
              ))}
            </div>
          </div>
          
          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-96">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default IngredientDetailModal;