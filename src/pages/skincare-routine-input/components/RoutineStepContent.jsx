import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import ProductEntryCard from './ProductEntryCard';

const RoutineStepContent = ({ 
  step = {}, 
  products = [], 
  onProductsChange = () => {},
  stepIndex = 0 
}) => {
  const [draggedIndex, setDraggedIndex] = useState(null);

  const addNewProduct = () => {
    const newProduct = {
      id: Date.now(),
      name: '',
      brand: '',
      category: '',
      frequency: '',
      order: products?.length + 1,
      image: '',
      ingredients: '',
      notes: ''
    };
    onProductsChange([...products, newProduct]);
  };

  const updateProduct = (index, updatedProduct) => {
    const newProducts = [...products];
    newProducts[index] = updatedProduct;
    onProductsChange(newProducts);
  };

  const removeProduct = (index) => {
    const newProducts = products?.filter((_, i) => i !== index);
    onProductsChange(newProducts);
  };

  const duplicateProduct = (index) => {
    const productToDuplicate = { ...products?.[index] };
    productToDuplicate.id = Date.now();
    productToDuplicate.name = `${productToDuplicate?.name} (Copy)`;
    const newProducts = [...products];
    newProducts?.splice(index + 1, 0, productToDuplicate);
    onProductsChange(newProducts);
  };

  const checkIngredientConflicts = (product, productIndex) => {
    // Mock conflict detection logic
    const conflictingCombinations = [
      ['retinol', 'vitamin c'],
      ['aha', 'bha'],
      ['niacinamide', 'vitamin c'],
      ['retinol', 'benzoyl peroxide']
    ];

    const currentIngredients = (product?.ingredients || '')?.toLowerCase()?.split(',')?.map(i => i?.trim());
    
    for (let i = 0; i < products?.length; i++) {
      if (i === productIndex) continue;
      
      const otherIngredients = (products?.[i]?.ingredients || '')?.toLowerCase()?.split(',')?.map(ing => ing?.trim());
      
      for (const combination of conflictingCombinations) {
        const hasFirst = currentIngredients?.some(ing => combination?.[0]?.includes(ing) || ing?.includes(combination?.[0]));
        const hasSecond = otherIngredients?.some(ing => combination?.[1]?.includes(ing) || ing?.includes(combination?.[1]));
        
        if (hasFirst && hasSecond) {
          return {
            hasConflict: true,
            message: `${combination?.[0]} and ${combination?.[1]} may cause irritation when used together`
          };
        }
      }
    }
    
    return { hasConflict: false, message: '' };
  };

  const handleDragStart = (e, index) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e?.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, dropIndex) => {
    e?.preventDefault();
    
    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null);
      return;
    }

    const newProducts = [...products];
    const draggedProduct = newProducts?.[draggedIndex];
    
    // Remove dragged item
    newProducts?.splice(draggedIndex, 1);
    
    // Insert at new position
    const insertIndex = draggedIndex < dropIndex ? dropIndex - 1 : dropIndex;
    newProducts?.splice(insertIndex, 0, draggedProduct);
    
    // Update order numbers
    newProducts?.forEach((product, index) => {
      product.order = index + 1;
    });
    
    onProductsChange(newProducts);
    setDraggedIndex(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Step Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-4 mb-4">
          <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-clinical">
            <Icon name={step?.icon} size={24} className="text-primary" />
          </div>
          <div>
            <h1 className="font-heading font-heading-semibold text-2xl text-foreground">
              {step?.title}
            </h1>
            <p className="font-body font-body-normal text-base text-muted-foreground mt-1">
              {step?.description}
            </p>
          </div>
        </div>

        {/* Step Guidelines */}
        {step?.guidelines && (
          <div className="bg-accent/5 border border-accent/20 rounded-clinical p-4">
            <div className="flex items-start space-x-3">
              <Icon name="Lightbulb" size={16} className="text-accent mt-0.5 flex-shrink-0" />
              <div>
                <div className="font-body font-body-medium text-sm text-accent mb-2">
                  Pro Tips for {step?.title}
                </div>
                <ul className="space-y-1">
                  {step?.guidelines?.map((guideline, index) => (
                    <li key={index} className="font-caption font-caption-normal text-sm text-foreground flex items-start space-x-2">
                      <span className="text-accent mt-1">•</span>
                      <span>{guideline}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
      {/* Products List */}
      <div className="space-y-6">
        {products?.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-muted rounded-clinical flex items-center justify-center mx-auto mb-4">
              <Icon name="Package" size={32} className="text-muted-foreground" />
            </div>
            <h3 className="font-heading font-heading-medium text-lg text-foreground mb-2">
              No products added yet
            </h3>
            <p className="font-body font-body-normal text-base text-muted-foreground mb-6 max-w-md mx-auto">
              Start building your {step?.title?.toLowerCase()} by adding your skincare products. 
              We'll analyze them for compatibility and effectiveness.
            </p>
            <Button
              variant="default"
              onClick={addNewProduct}
              iconName="Plus"
              iconPosition="left"
              iconSize={16}
            >
              Add Your First Product
            </Button>
          </div>
        ) : (
          <>
            {/* Products Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <h2 className="font-heading font-heading-medium text-lg text-foreground">
                  Your Products
                </h2>
                <span className="inline-flex items-center px-2 py-1 rounded-clinical-sm bg-primary/10 text-primary font-data font-data-normal text-sm">
                  {products?.length}
                </span>
              </div>
              
              <Button
                variant="outline"
                onClick={addNewProduct}
                iconName="Plus"
                iconPosition="left"
                iconSize={16}
              >
                Add Product
              </Button>
            </div>

            {/* Drag and Drop Instructions */}
            <div className="bg-muted/50 border border-border/50 rounded-clinical p-3">
              <div className="flex items-center space-x-2">
                <Icon name="Move" size={14} className="text-muted-foreground" />
                <span className="font-caption font-caption-normal text-xs text-muted-foreground">
                  Drag products to reorder your routine. Order matters for optimal results!
                </span>
              </div>
            </div>

            {/* Products */}
            <div className="space-y-4">
              {products?.map((product, index) => {
                const conflictCheck = checkIngredientConflicts(product, index);
                
                return (
                  <div
                    key={product?.id || index}
                    draggable
                    onDragStart={(e) => handleDragStart(e, index)}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, index)}
                    className={`transition-clinical ${
                      draggedIndex === index ? 'opacity-50 scale-95' : ''
                    }`}
                  >
                    <ProductEntryCard
                      product={product}
                      index={index}
                      onUpdate={(updatedProduct) => updateProduct(index, updatedProduct)}
                      onRemove={() => removeProduct(index)}
                      onDuplicate={() => duplicateProduct(index)}
                      showConflictWarning={conflictCheck?.hasConflict}
                      conflictMessage={conflictCheck?.message}
                    />
                  </div>
                );
              })}
            </div>

            {/* Add More Button */}
            <div className="flex justify-center pt-4">
              <Button
                variant="outline"
                onClick={addNewProduct}
                iconName="Plus"
                iconPosition="left"
                iconSize={16}
                className="w-full md:w-auto"
              >
                Add Another Product
              </Button>
            </div>
          </>
        )}
      </div>
      {/* Step Summary */}
      {products?.length > 0 && (
        <div className="mt-8 p-6 bg-card border border-border rounded-clinical shadow-clinical">
          <div className="flex items-start space-x-4">
            <div className="flex items-center justify-center w-10 h-10 bg-success/10 rounded-clinical flex-shrink-0">
              <Icon name="CheckCircle" size={20} className="text-success" />
            </div>
            <div className="flex-1">
              <h3 className="font-heading font-heading-medium text-base text-foreground mb-2">
                {step?.title} Summary
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="font-body font-body-medium text-muted-foreground">Products:</span>
                  <span className="font-data font-data-normal text-foreground ml-2">{products?.length}</span>
                </div>
                <div>
                  <span className="font-body font-body-medium text-muted-foreground">Categories:</span>
                  <span className="font-data font-data-normal text-foreground ml-2">
                    {new Set(products.filter(p => p.category).map(p => p.category))?.size}
                  </span>
                </div>
                <div>
                  <span className="font-body font-body-medium text-muted-foreground">Conflicts:</span>
                  <span className={`font-data font-data-normal ml-2 ${
                    products?.some((p, i) => checkIngredientConflicts(p, i)?.hasConflict) 
                      ? 'text-warning' :'text-success'
                  }`}>
                    {products?.some((p, i) => checkIngredientConflicts(p, i)?.hasConflict) ? 'Found' : 'None'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoutineStepContent;