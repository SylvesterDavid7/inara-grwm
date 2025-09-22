import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const IngredientCard = ({ 
  ingredient, 
  onViewDetails, 
  onBookmark, 
  onCheckCompatibility,
  isBookmarked = false,
  viewMode = 'grid' 
}) => {
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

  if (viewMode === 'list') {
    return (
      <div className="bg-card border border-border rounded-clinical p-4 hover:shadow-clinical transition-clinical">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <div className="w-16 h-16 bg-muted rounded-clinical overflow-hidden">
              <Image
                src={ingredient?.image}
                alt={ingredient?.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="font-heading font-heading-semibold text-base text-card-foreground mb-1">
                  {ingredient?.name}
                </h3>
                <p className="font-caption font-caption-normal text-sm text-muted-foreground">
                  {ingredient?.scientificName}
                </p>
              </div>
              
              <div className="flex items-center space-x-2 ml-4">
                <div className={`px-2 py-1 rounded-clinical-sm text-xs font-body font-body-medium ${getSafetyColor(ingredient?.safetyRating)}`}>
                  {ingredient?.safetyRating}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onBookmark(ingredient?.id)}
                  iconName={isBookmarked ? "Bookmark" : "BookmarkPlus"}
                  iconSize={20}
                  aria-label={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
                  className="text-gray-400"
                />
              </div>
            </div>
            
            <p className="font-body font-body-normal text-sm text-card-foreground mb-3 line-clamp-2">
              {ingredient?.description}
            </p>
            
            <div className="flex flex-wrap gap-2 mb-3">
              {ingredient?.skinConcerns?.slice(0, 3)?.map((concern, index) => (
                <span
                  key={index}
                  className={`px-2 py-1 rounded-clinical-sm text-xs font-caption font-caption-normal ${getConcernBadgeColor(concern)}`}
                >
                  {concern}
                </span>
              ))}
              {ingredient?.skinConcerns?.length > 3 && (
                <span className="px-2 py-1 rounded-clinical-sm text-xs font-caption font-caption-normal bg-muted text-muted-foreground">
                  +{ingredient?.skinConcerns?.length - 3} more
                </span>
              )}
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <Icon name="Beaker" size={14} />
                  <span className="font-data font-data-normal">{ingredient?.concentration}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Icon name="Star" size={14} />
                  <span className="font-data font-data-normal">{ingredient?.rating}/5</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onCheckCompatibility(ingredient)}
                  iconName="GitCompare"
                  iconPosition="left"
                  iconSize={14}
                >
                  Check
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => onViewDetails(ingredient)}
                >
                  Learn More
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-clinical overflow-hidden hover:shadow-clinical transition-clinical group flex flex-col">
      <div className="relative">
        <div className="aspect-video bg-muted overflow-hidden">
          <Image
            src={ingredient?.image}
            alt={ingredient?.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-clinical-slow"
          />
        </div>
        
        <div className="absolute top-3 right-3 flex items-center space-x-2">
          <div className={`px-2 py-1 rounded-clinical-sm text-xs font-body font-body-medium ${getSafetyColor(ingredient?.safetyRating)}`}>
            {ingredient?.safetyRating}
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onBookmark(ingredient?.id)}
            iconName={isBookmarked ? "Bookmark" : "BookmarkPlus"}
            iconSize={20}
            aria-label={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
            className="bg-background/80 backdrop-blur-sm hover:bg-black text-gray-400"
          />
        </div>
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex-grow">
          <div className="mb-3">
            <h3 className="font-heading font-heading-semibold text-base text-card-foreground mb-1">
              {ingredient?.name}
            </h3>
            <p className="font-caption font-caption-normal text-sm text-muted-foreground">
              {ingredient?.scientificName}
            </p>
          </div>
          
          <p className="font-body font-body-normal text-sm text-card-foreground mb-3 line-clamp-3">
            {ingredient?.description}
          </p>
          
          <div className="flex flex-wrap gap-2 mb-4">
            {ingredient?.skinConcerns?.slice(0, 2)?.map((concern, index) => (
              <span
                key={index}
                className={`px-2 py-1 rounded-clinical-sm text-xs font-caption font-caption-normal ${getConcernBadgeColor(concern)}`}
              >
                {concern}
              </span>
            ))}
            {ingredient?.skinConcerns?.length > 2 && (
              <span className="px-2 py-1 rounded-clinical-sm text-xs font-caption font-caption-normal bg-muted text-muted-foreground">
                +{ingredient?.skinConcerns?.length - 2} more
              </span>
            )}
          </div>
          
          <div className="flex items-center justify-between mb-4 text-sm text-muted-foreground">
            <div className="flex items-center space-x-1">
              <Icon name="Beaker" size={14} />
              <span className="font-data font-data-normal">{ingredient?.concentration}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Icon name="Star" size={14} />
              <span className="font-data font-data-normal">{ingredient?.rating}/5</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onCheckCompatibility(ingredient)}
            iconName="GitCompare"
            iconPosition="left"
            iconSize={14}
            className="flex-1"
          >
            Check
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={() => onViewDetails(ingredient)}
            className="flex-1"
          >
            Learn More
          </Button>
        </div>
      </div>
    </div>
  );
};

export default IngredientCard;