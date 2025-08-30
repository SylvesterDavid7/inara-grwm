import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const ProductDetailModal = ({ product, isOpen, onClose, onAddToRoutine, onSaveToWishlist }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedImage, setSelectedImage] = useState(0);

  if (!isOpen || !product) return null;

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'Info' },
    { id: 'ingredients', label: 'Ingredients', icon: 'Beaker' },
    { id: 'compatibility', label: 'Compatibility', icon: 'CheckCircle' },
    { id: 'reviews', label: 'Reviews', icon: 'MessageSquare' }
  ];

  const productImages = [
    product?.image,
    `https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=400&fit=crop&crop=center`,
    `https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=400&h=400&fit=crop&crop=center`
  ];

  const compatibilityDetails = [
    {
      category: 'Current Routine',
      score: product?.compatibilityScore,
      details: `This product works well with ${Math.floor(product?.compatibilityScore / 10)} out of 10 products in your current routine.`,
      conflicts: product?.compatibilityScore < 80 ? ['May cause irritation when combined with retinol', 'Use on alternate days with AHA products'] : []
    }
  ];

  const reviews = [
    {
      id: 1,
      author: "Sarah M.",
      rating: 5,
      date: "2025-08-15",
      title: "Amazing results!",
      content: `This product has completely transformed my skin. I've been using it for 3 months and the improvement in texture and hydration is remarkable. Highly recommend for anyone with dry skin concerns.`,
      helpful: 24,
      verified: true
    },
    {
      id: 2,
      author: "Jessica L.",
      rating: 4,
      date: "2025-08-10",
      title: "Good but takes time",
      content: `Solid product that delivers on its promises. It took about 6 weeks to see noticeable results, but the wait was worth it. The texture is lightweight and absorbs quickly.`,
      helpful: 18,
      verified: true
    },
    {
      id: 3,
      author: "Maria R.",
      rating: 5,
      date: "2025-08-05",
      title: "Perfect for sensitive skin",
      content: `I have very sensitive skin and this product didn't cause any irritation. It's gentle yet effective. The packaging is also great for maintaining product stability.`,
      helpful: 31,
      verified: false
    }
  ];

  return (
    <div className="fixed inset-0 z-modal bg-background/80 backdrop-blur-sm">
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="bg-card border border-border rounded-clinical shadow-clinical-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <h2 className="font-heading font-heading-semibold text-xl text-card-foreground">
              Product Details
            </h2>
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

          <div className="flex flex-col lg:flex-row max-h-[calc(90vh-80px)]">
            {/* Product Images */}
            <div className="lg:w-1/2 p-6 border-b lg:border-b-0 lg:border-r border-border">
              <div className="space-y-4">
                <div className="aspect-square overflow-hidden rounded-clinical bg-muted">
                  <Image
                    src={productImages?.[selectedImage]}
                    alt={product?.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="flex space-x-2 overflow-x-auto">
                  {productImages?.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`flex-shrink-0 w-16 h-16 rounded-clinical overflow-hidden border-2 transition-clinical ${
                        selectedImage === index
                          ? 'border-primary' :'border-border hover:border-muted-foreground'
                      }`}
                    >
                      <Image
                        src={image}
                        alt={`${product?.name} view ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Product Info */}
            <div className="lg:w-1/2 flex flex-col">
              {/* Basic Info */}
              <div className="p-6 border-b border-border">
                <div className="space-y-4">
                  <div>
                    <div className="font-caption font-caption-normal text-sm text-muted-foreground uppercase tracking-wide">
                      {product?.brand}
                    </div>
                    <h3 className="font-heading font-heading-semibold text-xl text-card-foreground mt-1">
                      {product?.name}
                    </h3>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="font-heading font-heading-semibold text-2xl text-card-foreground">
                        ${product?.price}
                      </span>
                      {product?.originalPrice && product?.originalPrice > product?.price && (
                        <span className="font-body font-body-normal text-lg text-muted-foreground line-through">
                          ${product?.originalPrice}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-1">
                      <Icon name="Star" size={16} className="text-warning fill-current" />
                      <span className="font-data font-data-normal text-sm text-card-foreground">
                        {product?.rating}
                      </span>
                      <span className="font-caption font-caption-normal text-sm text-muted-foreground">
                        ({product?.reviewCount} reviews)
                      </span>
                    </div>
                  </div>

                  <div className="flex space-x-3">
                    <Button
                      variant="default"
                      onClick={() => onAddToRoutine(product)}
                      iconName="Plus"
                      iconPosition="left"
                      iconSize={16}
                      className="flex-1"
                    >
                      Add to Routine
                    </Button>
                    
                    <Button
                      variant="outline"
                      onClick={() => onSaveToWishlist(product?.id, true)}
                      iconName="Heart"
                      iconSize={16}
                      className="px-4"
                    >
                      <span className="sr-only">Save to wishlist</span>
                    </Button>
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <div className="border-b border-border">
                <div className="flex overflow-x-auto">
                  {tabs?.map((tab) => (
                    <button
                      key={tab?.id}
                      onClick={() => setActiveTab(tab?.id)}
                      className={`flex items-center space-x-2 px-4 py-3 border-b-2 transition-clinical whitespace-nowrap ${
                        activeTab === tab?.id
                          ? 'border-primary text-primary' :'border-transparent text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      <Icon name={tab?.icon} size={16} />
                      <span className="font-body font-body-medium text-sm">
                        {tab?.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Tab Content */}
              <div className="flex-1 overflow-y-auto p-6">
                {activeTab === 'overview' && (
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-heading font-heading-medium text-sm text-card-foreground mb-2">
                        Description
                      </h4>
                      <p className="font-body font-body-normal text-sm text-muted-foreground leading-relaxed">
                        {product?.description || `This ${product?.category?.toLowerCase()} is formulated with advanced ingredients to address specific skin concerns. Suitable for daily use and compatible with most skincare routines.`}
                      </p>
                    </div>

                    <div>
                      <h4 className="font-heading font-heading-medium text-sm text-card-foreground mb-2">
                        Key Benefits
                      </h4>
                      <ul className="space-y-1">
                        <li className="flex items-start space-x-2">
                          <Icon name="Check" size={14} className="text-success mt-0.5 flex-shrink-0" />
                          <span className="font-body font-body-normal text-sm text-muted-foreground">
                            Improves skin texture and hydration
                          </span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <Icon name="Check" size={14} className="text-success mt-0.5 flex-shrink-0" />
                          <span className="font-body font-body-normal text-sm text-muted-foreground">
                            Suitable for sensitive skin
                          </span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <Icon name="Check" size={14} className="text-success mt-0.5 flex-shrink-0" />
                          <span className="font-body font-body-normal text-sm text-muted-foreground">
                            Non-comedogenic formula
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>
                )}

                {activeTab === 'ingredients' && (
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-heading font-heading-medium text-sm text-card-foreground mb-3">
                        Key Ingredients
                      </h4>
                      <div className="space-y-3">
                        {product?.keyIngredients?.map((ingredient, index) => (
                          <div key={index} className="flex items-start space-x-3 p-3 bg-muted rounded-clinical">
                            <Icon name="Beaker" size={16} className="text-accent mt-0.5 flex-shrink-0" />
                            <div>
                              <div className="font-body font-body-medium text-sm text-card-foreground">
                                {ingredient}
                              </div>
                              <div className="font-caption font-caption-normal text-xs text-muted-foreground mt-1">
                                Known for its beneficial properties in skincare
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'compatibility' && (
                  <div className="space-y-4">
                    {compatibilityDetails?.map((detail, index) => (
                      <div key={index} className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="font-heading font-heading-medium text-sm text-card-foreground">
                            {detail?.category}
                          </h4>
                          <div className={`px-3 py-1 rounded-clinical text-xs font-data font-data-normal ${
                            detail?.score >= 90 ? 'bg-success/10 text-success' :
                            detail?.score >= 70 ? 'bg-warning/10 text-warning': 'bg-error/10 text-error'
                          }`}>
                            {detail?.score}% Compatible
                          </div>
                        </div>
                        
                        <p className="font-body font-body-normal text-sm text-muted-foreground">
                          {detail?.details}
                        </p>

                        {detail?.conflicts?.length > 0 && (
                          <div className="space-y-2">
                            <h5 className="font-body font-body-medium text-xs text-warning">
                              Usage Notes:
                            </h5>
                            {detail?.conflicts?.map((conflict, conflictIndex) => (
                              <div key={conflictIndex} className="flex items-start space-x-2">
                                <Icon name="AlertTriangle" size={12} className="text-warning mt-1 flex-shrink-0" />
                                <span className="font-caption font-caption-normal text-xs text-muted-foreground">
                                  {conflict}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'reviews' && (
                  <div className="space-y-4">
                    {reviews?.map((review) => (
                      <div key={review?.id} className="border-b border-border pb-4 last:border-b-0">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <span className="font-body font-body-medium text-sm text-card-foreground">
                              {review?.author}
                            </span>
                            {review?.verified && (
                              <span className="px-2 py-0.5 bg-success/10 text-success text-xs font-caption font-caption-normal rounded-clinical-sm">
                                Verified
                              </span>
                            )}
                          </div>
                          <div className="flex items-center space-x-1">
                            {[...Array(5)]?.map((_, i) => (
                              <Icon
                                key={i}
                                name="Star"
                                size={12}
                                className={i < review?.rating ? "text-warning fill-current" : "text-muted-foreground"}
                              />
                            ))}
                          </div>
                        </div>
                        
                        <h5 className="font-body font-body-medium text-sm text-card-foreground mb-1">
                          {review?.title}
                        </h5>
                        
                        <p className="font-body font-body-normal text-sm text-muted-foreground mb-2 leading-relaxed">
                          {review?.content}
                        </p>
                        
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>{new Date(review.date)?.toLocaleDateString()}</span>
                          <span>{review?.helpful} found helpful</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailModal;