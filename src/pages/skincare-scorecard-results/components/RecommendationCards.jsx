import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const RecommendationCards = ({ recommendations }) => {
  const [addedProducts, setAddedProducts] = useState(new Set());

  const handleAddToRoutine = (productId) => {
    setAddedProducts(prev => new Set([...prev, productId]));
    // Simulate adding to routine
    setTimeout(() => {
      setAddedProducts(prev => {
        const newSet = new Set(prev);
        newSet?.delete(productId);
        return newSet;
      });
    }, 2000);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-destructive text-destructive-foreground';
      case 'medium': return 'bg-warning text-warning-foreground';
      case 'low': return 'bg-primary text-primary-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'high': return 'AlertTriangle';
      case 'medium': return 'Clock';
      case 'low': return 'Info';
      default: return 'Circle';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-heading font-heading-semibold text-foreground">
            Product Recommendations
          </h3>
          <p className="text-sm font-caption font-caption-normal text-muted-foreground">
            {recommendations?.length} products suggested to improve your routine
          </p>
        </div>
        <button className="flex items-center space-x-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-clinical hover:bg-secondary/80 transition-clinical">
          <Icon name="Filter" size={16} />
          <span className="font-body font-body-medium text-sm">Filter</span>
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recommendations?.map((product) => (
          <div key={product?.id} className="bg-card border border-border rounded-clinical overflow-hidden hover:shadow-clinical transition-clinical">
            {/* Product Image */}
            <div className="relative h-48 bg-muted overflow-hidden">
              <Image
                src={product?.image}
                alt={product?.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 left-3">
                <div className={`flex items-center space-x-1 px-2 py-1 rounded-clinical-sm text-xs font-data font-data-normal ${getPriorityColor(product?.priority)}`}>
                  <Icon name={getPriorityIcon(product?.priority)} size={12} />
                  <span>{product?.priority?.toUpperCase()}</span>
                </div>
              </div>
              {product?.discount && (
                <div className="absolute top-3 right-3 bg-success text-success-foreground px-2 py-1 rounded-clinical-sm text-xs font-data font-data-normal">
                  -{product?.discount}%
                </div>
              )}
            </div>

            {/* Product Details */}
            <div className="p-4 space-y-3">
              <div>
                <h4 className="font-body font-body-medium text-sm text-foreground mb-1 line-clamp-2">
                  {product?.name}
                </h4>
                <p className="text-xs font-caption font-caption-normal text-muted-foreground">
                  {product?.brand} • {product?.category}
                </p>
              </div>

              {/* Why Recommended */}
              <div className="bg-secondary/50 rounded-clinical p-3">
                <h5 className="font-body font-body-medium text-xs text-foreground mb-1">
                  Why recommended:
                </h5>
                <p className="text-xs font-caption font-caption-normal text-muted-foreground">
                  {product?.reason}
                </p>
              </div>

              {/* Key Benefits */}
              <div className="flex flex-wrap gap-1">
                {product?.benefits?.slice(0, 3)?.map((benefit, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-accent/10 text-accent text-xs font-caption font-caption-normal rounded-clinical-sm"
                  >
                    {benefit}
                  </span>
                ))}
                {product?.benefits?.length > 3 && (
                  <span className="px-2 py-1 bg-muted text-muted-foreground text-xs font-caption font-caption-normal rounded-clinical-sm">
                    +{product?.benefits?.length - 3} more
                  </span>
                )}
              </div>

              {/* Rating and Price */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1">
                  <div className="flex items-center">
                    {[...Array(5)]?.map((_, i) => (
                      <Icon
                        key={i}
                        name="Star"
                        size={12}
                        className={i < Math.floor(product?.rating) ? 'text-warning fill-current' : 'text-muted'}
                      />
                    ))}
                  </div>
                  <span className="text-xs font-data font-data-normal text-muted-foreground">
                    ({product?.reviews})
                  </span>
                </div>
                <div className="text-right">
                  {product?.originalPrice && product?.originalPrice !== product?.price && (
                    <div className="text-xs font-data font-data-normal text-muted-foreground line-through">
                      ${product?.originalPrice}
                    </div>
                  )}
                  <div className="text-sm font-heading font-heading-semibold text-foreground">
                    ${product?.price}
                  </div>
                </div>
              </div>

              {/* Availability */}
              <div className="flex items-center space-x-2">
                <Icon 
                  name={product?.inStock ? "CheckCircle" : "XCircle"} 
                  size={14} 
                  className={product?.inStock ? "text-success" : "text-destructive"} 
                />
                <span className={`text-xs font-caption font-caption-normal ${product?.inStock ? "text-success" : "text-destructive"}`}>
                  {product?.inStock ? "In Stock" : "Out of Stock"}
                </span>
                {product?.fastShipping && (
                  <>
                    <span className="text-xs text-muted-foreground">•</span>
                    <span className="text-xs font-caption font-caption-normal text-primary">
                      Fast Shipping
                    </span>
                  </>
                )}
              </div>

              {/* Actions */}
              <div className="flex space-x-2 pt-2">
                <button
                  onClick={() => handleAddToRoutine(product?.id)}
                  disabled={!product?.inStock || addedProducts?.has(product?.id)}
                  className={`flex-1 flex items-center justify-center space-x-2 px-3 py-2 rounded-clinical text-sm font-body font-body-medium transition-clinical ${
                    addedProducts?.has(product?.id)
                      ? 'bg-success text-success-foreground'
                      : product?.inStock
                      ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                      : 'bg-muted text-muted-foreground cursor-not-allowed'
                  }`}
                >
                  <Icon 
                    name={addedProducts?.has(product?.id) ? "Check" : "Plus"} 
                    size={14} 
                  />
                  <span>
                    {addedProducts?.has(product?.id) ? 'Added!' : 'Add to Routine'}
                  </span>
                </button>
                <button className="px-3 py-2 bg-secondary text-secondary-foreground rounded-clinical hover:bg-secondary/80 transition-clinical">
                  <Icon name="ExternalLink" size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Load More */}
      <div className="text-center">
        <button className="flex items-center space-x-2 px-6 py-3 bg-secondary text-secondary-foreground rounded-clinical hover:bg-secondary/80 transition-clinical mx-auto">
          <Icon name="MoreHorizontal" size={16} />
          <span className="font-body font-body-medium text-sm">View More Recommendations</span>
        </button>
      </div>
    </div>
  );
};

export default RecommendationCards;