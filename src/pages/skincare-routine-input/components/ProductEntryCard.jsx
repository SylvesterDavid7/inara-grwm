import React, { useState, useRef } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { analyzeProductImage } from '../../../utils/gemini';
import { cn } from '../../../utils/cn';

const ProductEntryCard = ({ 
  product = {}, 
  onUpdate = () => {}, 
  onRemove = () => {}, 
  onDuplicate = () => {},
  showConflictWarning = false,
  conflictMessage = "",
  index = 0 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [imagePreview, setImagePreview] = useState(product?.image || '');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const fileInputRef = useRef(null);

  const CLOUDINARY_CLOUD_NAME = 'dg8nuyybc';
  const CLOUDINARY_UPLOAD_PRESET = 'user_profile_pictures';

  const productSuggestions = [
    "CeraVe Hydrating Cleanser",
    "The Ordinary Niacinamide 10% + Zinc 1%",
    "Neutrogena Ultra Sheer Dry-Touch Sunscreen SPF 100+",
    "Paula's Choice Skin Perfecting 2% BHA Liquid Exfoliant",
    "Olay Regenerist Micro-Sculpting Cream",
    "La Roche-Posay Toleriane Double Repair Face Moisturizer",
    "Cetaphil Daily Facial Cleanser",
    "The Inkey List Hyaluronic Acid Serum"
  ];

  const frequencyOptions = [
    { value: 'daily', label: 'Daily' },
    { value: 'every-other-day', label: 'Every Other Day' },
    { value: '2-3-times-week', label: '2-3 Times a Week' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'as-needed', label: 'As Needed' }
  ];

  const categoryOptions = [
    { value: 'cleanser', label: 'Cleanser' },
    { value: 'toner', label: 'Toner' },
    { value: 'serum', label: 'Serum' },
    { value: 'moisturizer', label: 'Moisturizer' },
    { value: 'sunscreen', label: 'Sunscreen' },
    { value: 'treatment', label: 'Treatment' },
    { value: 'exfoliant', label: 'Exfoliant' },
    { value: 'mask', label: 'Mask' },
    { value: 'oil', label: 'Face Oil' },
    { value: 'eye-cream', label: 'Eye Cream' }
  ];

  const getCategoryFromAnalysis = (details) => {
    const text = `${details.name} ${details.category} ${details.brand}`.toLowerCase();
    
    if (text.includes('spf') || text.includes('sunscreen') || text.includes('sun block')) {
      return 'sunscreen';
    }

    const categoryMap = {
      cleanser: 'cleanser',
      toner: 'toner',
      serum: 'serum',
      moisturizer: 'moisturizer',
      lotion: 'moisturizer',
      cream: 'moisturizer',
      treatment: 'treatment',
      exfoliant: 'exfoliant',
      peel: 'exfoliant',
      scrub: 'exfoliant',
      mask: 'mask',
      oil: 'oil',
      'face oil': 'oil',
      'eye cream': 'eye-cream',
    };

    const receivedCategory = details.category?.toLowerCase().trim() || '';
    const matchedKey = Object.keys(categoryMap).find(key => receivedCategory.includes(key));
    
    return matchedKey ? categoryMap[matchedKey] : '';
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsAnalyzing(true);
    const imagePreviewUrl = URL.createObjectURL(file);
    setImagePreview(imagePreviewUrl);

    try {
      // Step 1: Upload image to Cloudinary
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
      formData.append('folder', 'product-images');

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error('Cloudinary image upload failed');
      }

      const cloudinaryData = await response.json();
      const imageUrl = cloudinaryData.secure_url;

      // Step 2: Analyze the product image
      const productDetails = await analyzeProductImage(file);
      const categoryValue = getCategoryFromAnalysis(productDetails);

      // Step 3: Update the state with the Cloudinary URL
      onUpdate({
        ...product,
        ...productDetails,
        category: categoryValue,
        image: imageUrl, // Use Cloudinary URL
        ingredients: Array.isArray(productDetails.ingredients) 
          ? productDetails.ingredients.join(', ') 
          : productDetails.ingredients
      });

      setIsAnalyzing(false);
    } catch (error) {
      console.error("Error during image upload and analysis:", error);
      URL.revokeObjectURL(imagePreviewUrl);
      setImagePreview('');
      setIsAnalyzing(false);
    }
  };

  const handleProductNameChange = (value) => {
    onUpdate({ ...product, name: value });
    setShowSuggestions(value?.length > 2);
  };

  const handleSuggestionClick = (suggestion) => {
    onUpdate({ ...product, name: suggestion });
    setShowSuggestions(false);
  };

  const handleBarcodeScanner = () => {
    fileInputRef?.current?.click();
  };

  const filteredSuggestions = productSuggestions?.filter(suggestion =>
    suggestion?.toLowerCase()?.includes((product?.name || '')?.toLowerCase())
  );

  return (
    <div className={`bg-card border rounded-clinical shadow-clinical transition-clinical ${
      showConflictWarning ? 'border-warning' : 'border-border hover:shadow-clinical-lg'
    }`}>
      {showConflictWarning && (
        <div className="bg-warning/10 border-b border-warning/20 px-4 py-3">
          <div className="flex items-start space-x-3">
            <Icon name="AlertTriangle" size={16} className="text-warning mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <div className="font-body font-body-medium text-sm text-warning">
                Ingredient Conflict Detected
              </div>
              <div className="font-caption font-caption-normal text-xs text-warning/80 mt-1">
                {conflictMessage}
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-8 h-8 bg-primary/10 rounded-clinical text-primary font-data font-data-normal text-sm">
              {index + 1}
            </div>
            <div>
              <div className="font-body font-body-medium text-sm text-foreground">
                {product?.name || 'New Product'}
              </div>
              {product?.brand && (
                <div className="font-caption font-caption-normal text-xs text-muted-foreground">
                  {product?.brand}
                </div>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              iconName={isExpanded ? "ChevronUp" : "ChevronDown"}
              iconSize={16}
              className="hover:bg-black hover:text-white"
            >
              {isExpanded ? 'Collapse' : 'Expand'}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onRemove}
              iconName="Trash2"
              iconSize={16}
              className="text-destructive hover:text-destructive"
            />
          </div>
        </div>
      </div>
      <div className={`transition-clinical ${isExpanded ? 'block' : 'hidden'}`}>
        <div className="p-4 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-3">
              <label className="font-body font-body-medium text-sm text-foreground">
                Product Image
              </label>
              <div className="relative">
                <div 
                  className={cn(
                    "w-full h-32 bg-muted border-2 border-dashed border-border rounded-clinical flex items-center justify-center cursor-pointer hover:bg-secondary/50 transition-clinical",
                    { "opacity-50 pointer-events-none": isAnalyzing }
                  )}
                  onClick={() => !isAnalyzing && fileInputRef?.current?.click()}
                >
                  {isAnalyzing ? (
                    <div className="text-center">
                        <Icon name="Loader" size={24} className="text-muted-foreground animate-spin mx-auto mb-2" />
                        <div className="font-caption font-caption-normal text-xs text-muted-foreground">
                            Analyzing Image...
                        </div>
                    </div>
                  ) : imagePreview ? (
                    <Image
                      src={imagePreview}
                      alt="Product preview"
                      className="w-full h-full object-cover rounded-clinical"
                    />
                  ) : (
                    <div className="text-center">
                      <Icon name="Camera" size={24} className="text-muted-foreground mx-auto mb-2" />
                      <div className="font-caption font-caption-normal text-xs text-muted-foreground">
                        Click to upload
                      </div>
                    </div>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  disabled={isAnalyzing}
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleBarcodeScanner}
                  iconName="Scan"
                  iconSize={14}
                  className="absolute top-2 right-2"
                  disabled={isAnalyzing}
                >
                  Scan
                </Button>
              </div>
            </div>

            <div className="md:col-span-2 space-y-4">
              <div className="relative">
                <Input
                  label="Product Name"
                  type="text"
                  placeholder="Enter product name..."
                  value={product?.name || ''}
                  onChange={(e) => handleProductNameChange(e?.target?.value)}
                  required
                />
                
                {showSuggestions && filteredSuggestions?.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-popover border border-border rounded-clinical shadow-clinical-lg z-50 max-h-48 overflow-y-auto">
                    {filteredSuggestions?.slice(0, 5)?.map((suggestion, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="w-full text-left px-4 py-2 hover:bg-secondary/50 transition-clinical font-body font-body-normal text-sm text-popover-foreground"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Brand"
                  type="text"
                  placeholder="Enter brand name..."
                  value={product?.brand || ''}
                  onChange={(e) => onUpdate({ ...product, brand: e?.target?.value })}
                />

                <Select
                  label="Category"
                  options={categoryOptions}
                  value={product?.category || ''}
                  onChange={(value) => onUpdate({ ...product, category: value })}
                  placeholder="Select category"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Usage Frequency"
              options={frequencyOptions}
              value={product?.frequency || ''}
              onChange={(value) => onUpdate({ ...product, frequency: value })}
              placeholder="How often do you use this?"
            />

            <Input
              label="Application Order"
              type="number"
              placeholder="1, 2, 3..."
              value={product?.order || ''}
              onChange={(e) => onUpdate({ ...product, order: e?.target?.value })}
              description="Order in your routine (1 = first)"
              min="1"
            />
          </div>

          <div className="space-y-4">
            <Input
              label="Key Ingredients (Optional)"
              type="text"
              placeholder="e.g., Niacinamide, Hyaluronic Acid, Retinol..."
              value={product.ingredients || ''}
              onChange={(e) => onUpdate({ ...product, ingredients: e.target.value })}
              description="Separate multiple ingredients with commas"
            />

            <Input
              label="Notes (Optional)"
              type="text"
              placeholder="Any special usage instructions or observations..."
              value={product?.notes || ''}
              onChange={(e) => onUpdate({ ...product, notes: e?.target?.value })}
            />
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-border">
            <Button
              variant="outline"
              size="sm"
              onClick={onDuplicate}
              iconName="Copy"
              iconPosition="left"
              iconSize={14}
            >
              Duplicate
            </Button>

            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(false)}
              >
                Collapse
              </Button>
            </div>
          </div>
        </div>
      </div>
      {!isExpanded && (
        <div className="p-4">
          <div className="flex items-start space-x-4">
            {imagePreview && (
              <div className="w-12 h-12 rounded-clinical overflow-hidden flex-shrink-0">
                <Image
                  src={imagePreview}
                  alt="Product thumbnail"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 flex-wrap">
                {product?.category && (
                  <span className="inline-flex items-center px-2 py-1 mb-1 rounded-clinical-sm bg-secondary text-secondary-foreground font-caption font-caption-normal text-xs">
                    {categoryOptions?.find(opt => opt?.value === product?.category)?.label}
                  </span>
                )}
                {product?.frequency && (
                  <span className="inline-flex items-center px-2 py-1 mb-1 rounded-clinical-sm bg-accent/10 text-accent font-caption font-caption-normal text-xs">
                    {frequencyOptions?.find(opt => opt?.value === product?.frequency)?.label}
                  </span>
                )}
              </div>
              {(product?.ingredients || product?.notes) && (
                <div className="font-caption font-caption-normal text-xs text-muted-foreground mt-2 space-y-1">
                    {product?.ingredients && (
                        <p className="whitespace-normal"><strong>Ingredients:</strong> {Array.isArray(product.ingredients) ? product.ingredients.join(', ') : product.ingredients}</p>
                    )}
                    {product?.notes && (
                        <p className="whitespace-normal"><strong>Instructions:</strong> {product.notes}</p>
                    )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductEntryCard;
