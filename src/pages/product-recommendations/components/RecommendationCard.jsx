import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const RecommendationCard = ({ product, onAddToRoutine, onSaveToWishlist, onViewDetails }) => {
  const [isWishlisted, setIsWishlisted] = useState(product?.isWishlisted || false);

  const handleWishlistToggle = () => {
    setIsWishlisted(!isWishlisted);
    onSaveToWishlist(product?.id, !isWishlisted);
  };

  const getCompatibilityColor = (score) => {
    if (score >= 90) return 'text-success bg-success/10';
    if (score >= 70) return 'text-warning bg-warning/10';
    return 'text-error bg-error/10';
  };

  const getCompatibilityLabel = (score) => {
    if (score >= 90) return 'Excellent Match';
    if (score >= 70) return 'Good Match';
    return 'Fair Match';
  };

  return (
    <div className="bg-card border border-border rounded-clinical shadow-clinical hover:shadow-clinical-lg transition-clinical-slow group">
      {/* Product Image */}
      <div className="relative overflow-hidden rounded-t-clinical">
        <Image
          src={product?.image}
          alt={product?.name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-clinical-slow"
        />
        
        {/* Wishlist Button */}
        <button
          onClick={handleWishlistToggle}
          className="absolute top-3 right-3 p-2 bg-background/80 backdrop-blur-sm rounded-full hover:bg-background transition-clinical"
        >
          <Icon
            name={isWishlisted ? "Heart" : "Heart"}
            size={16}
            className={isWishlisted ? "text-error fill-current" : "text-muted-foreground"}
          />
        </button>

        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <span className="px-2 py-1 bg-primary text-primary-foreground text-xs font-body font-body-medium rounded-clinical-sm">
            {product?.category}
          </span>
        </div>

        {/* Compatibility Score */}
        <div className="absolute bottom-3 left-3">
          <div className={`px-2 py-1 rounded-clinical-sm text-xs font-data font-data-normal ${getCompatibilityColor(product?.compatibilityScore)}`}>
            {product?.compatibilityScore}% Match
          </div>
        </div>
      </div>
      {/* Product Details */}
      <div className="p-4">
        {/* Brand and Name */}
        <div className="mb-3">
          <div className="font-caption font-caption-normal text-xs text-muted-foreground uppercase tracking-wide mb-1">
            {product?.brand}
          </div>
          <h3 className="font-heading font-heading-semibold text-base text-card-foreground line-clamp-2">
            {product?.name}
          </h3>
        </div>

        {/* Key Ingredients */}
        <div className="mb-3">
          <div className="flex flex-wrap gap-1">
            {product?.keyIngredients?.slice(0, 3)?.map((ingredient, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-accent/10 text-accent text-xs font-caption font-caption-normal rounded-clinical-sm"
              >
                {ingredient}
              </span>
            ))}
            {product?.keyIngredients?.length > 3 && (
              <span className="px-2 py-1 bg-muted text-muted-foreground text-xs font-caption font-caption-normal rounded-clinical-sm">
                +{product?.keyIngredients?.length - 3} more
              </span>
            )}
          </div>
        </div>

        {/* Compatibility Info */}
        <div className="mb-3 p-2 bg-muted rounded-clinical-sm">
          <div className="flex items-center justify-between text-xs">
            <span className="font-caption font-caption-normal text-muted-foreground">
              Routine Compatibility
            </span>
            <span className={`font-body font-body-medium ${getCompatibilityColor(product?.compatibilityScore)?.split(' ')?.[0]}`}>
              {getCompatibilityLabel(product?.compatibilityScore)}
            </span>
          </div>
        </div>

        {/* Price and Rating */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex flex-col">
            <div className="flex items-center space-x-2">
              <span className="font-heading font-heading-semibold text-lg text-card-foreground">
                ${product?.price}
              </span>
              {product?.originalPrice && product?.originalPrice > product?.price && (
                <span className="font-body font-body-normal text-sm text-muted-foreground line-through">
                  ${product?.originalPrice}
                </span>
              )}
            </div>
            {product?.pricePerOz && (
              <span className="font-caption font-caption-normal text-xs text-muted-foreground">
                ${product?.pricePerOz}/oz
              </span>
            )}
          </div>
          
          <div className="flex items-center space-x-1">
            <Icon name="Star" size={14} className="text-warning fill-current" />
            <span className="font-data font-data-normal text-sm text-card-foreground">
              {product?.rating}
            </span>
            <span className="font-caption font-caption-normal text-xs text-muted-foreground">
              ({product?.reviewCount})
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col space-y-2">
          <Button
            variant="default"
            size="sm"
            onClick={() => onAddToRoutine(product)}
            iconName="Plus"
            iconPosition="left"
            iconSize={14}
            fullWidth
          >
            Add to Routine
          </Button>
          
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onViewDetails(product)}
              iconName="Eye"
              iconPosition="left"
              iconSize={14}
              className="flex-1"
            >
              Details
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => console.log('Compare product:', product?.id)}
              iconName="GitCompare"
              iconSize={14}
              className="px-3"
            >
              <span className="sr-only">Compare</span>
            </Button>
          </div>
        </div>

        {/* Additional Info */}
        {product?.sampleAvailable && (
          <div className="mt-3 p-2 bg-success/10 rounded-clinical-sm">
            <div className="flex items-center space-x-2">
              <Icon name="Gift" size={14} className="text-success" />
              <span className="font-caption font-caption-normal text-xs text-success">
                Free sample available
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecommendationCard;