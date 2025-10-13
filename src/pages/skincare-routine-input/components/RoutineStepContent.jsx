import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import ProductEntryCard from './ProductEntryCard';

const RoutineStepContent = ({
  step = {},
  products = [],
  onProductsChange = () => {},
  stepIndex = 0,
  selectedProduct,
  onProductSelect
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
    onProductSelect(newProduct);
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
    const productToDuplicate = { ...products[index] };
    productToDuplicate.id = Date.now();
    productToDuplicate.name = `${productToDuplicate.name} (Copy)`;
    const newProducts = [...products];
    newProducts.splice(index + 1, 0, productToDuplicate);
    onProductsChange(newProducts);
  };

  // Normalize ingredient names to canonical form
  const normalizeIngredient = (name) => {
    if (!name) return '';
    const n = name.toLowerCase().trim();

    // map common keywords to canonical
    if (n.includes('vitamin c') || n.includes('ascorbic acid')) return 'vitamin c';
    if (n.includes('niacinamide')) return 'niacinamide';
    if (n.includes('retinol') || n.includes('retinoid') || n.includes('retinoids')) return 'retinol';
    if (n.includes('aha') && !n.includes('bha')) return 'ahas';
    if (n.includes('bha') && !n.includes('aha')) return 'bhas';
    if (n.includes('benzoyl peroxide') || n.includes('benzoyl')) return 'benzoyl peroxide';
    // fallback: return normalized lowercase
    return n;
  };

  const conflictingCombinations = [
    ['vitamin c', 'retinol'],
    ['vitamin c', 'ahas'],
    ['vitamin c', 'bhas'],
    ['vitamin c', 'niacinamide'],
    ['retinol', 'ahas'],
    ['retinol', 'bhas'],
    ['retinol', 'benzoyl peroxide'],
    ['ahas', 'bhas'],  // depending on your logic, you might consider AHA & BHA conflict
    ['benzoyl peroxide', 'ahas'],
    ['benzoyl peroxide', 'bhas'],
  ];

  const checkIngredientConflicts = (product, productIndex) => {
    const getIngredientsAsArray = (ingredients) => {
      if (!ingredients) return [];
      if (Array.isArray(ingredients)) {
        return ingredients
          .map(ing => normalizeIngredient(ing))
          .filter(Boolean);
      }
      return String(ingredients)
        .split(',')
        .map(ing => normalizeIngredient(ing))
        .filter(Boolean);
    };

    const currentIngs = getIngredientsAsArray(product.ingredients);
    if (currentIngs.length === 0) {
      return { hasConflict: false, message: '' };
    }

    // Check against every other product
    for (let i = 0; i < products.length; i++) {
      if (i === productIndex) continue;
      const otherIngs = getIngredientsAsArray(products[i]?.ingredients);
      if (otherIngs.length === 0) continue;

      for (const [ingA, ingB] of conflictingCombinations) {
        // does current contain ingA and other contain ingB ? or vice versa
        const currentHasA = currentIngs.includes(ingA);
        const currentHasB = currentIngs.includes(ingB);
        const otherHasA = otherIngs.includes(ingA);
        const otherHasB = otherIngs.includes(ingB);

        if ((currentHasA && otherHasB) || (currentHasB && otherHasA)) {
          return {
            hasConflict: true,
            message: `${capitalize(ingA)} and ${capitalize(ingB)} may cause irritation or reduce effectiveness.`
          };
        }
      }
    }

    return { hasConflict: false, message: '' };
  };

  const capitalize = (str) => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const handleDragStart = (e, index) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, dropIndex) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null);
      return;
    }

    const newProducts = [...products];
    const dragged = newProducts[draggedIndex];
    newProducts.splice(draggedIndex, 1);

    const insertIndex = draggedIndex < dropIndex ? dropIndex - 1 : dropIndex;
    newProducts.splice(insertIndex, 0, dragged);
    newProducts.forEach((p, idx) => {
      p.order = idx + 1;
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

        {step?.guidelines && (
          <div className="bg-accent/5 border border-accent/20 rounded-clinical p-4">
            <div className="flex items-start space-x-3">
              <Icon name="Lightbulb" size={16} className="text-accent mt-0.5 flex-shrink-0" />
              <div>
                <div className="font-body font-body-medium text-sm text-accent mb-2">
                  Pro Tips for {step?.title}
                </div>
                <ul className="space-y-1">
                  {step.guidelines.map((guideline, idx) => (
                    <li key={idx} className="font-caption font-caption-normal text-sm text-foreground flex items-start space-x-2">
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
        {products.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-muted rounded-clinical flex items-center justify-center mx-auto mb-4">
              <Icon name="Package" size={32} className="text-muted-foreground" />
            </div>
            <h3 className="font-heading font-heading-medium text-lg text-foreground mb-2">
              No products added yet
            </h3>
            <p className="font-body font-body-normal text-base text-muted-foreground mb-6 max-w-md mx-auto">
              Start building your {step?.title?.toLowerCase()} routine by adding products. We'll check compatibility.
            </p>
            <Button variant="default" onClick={addNewProduct} iconName="Plus" iconPosition="left" iconSize={16}>
              Add Your First Product
            </Button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <h2 className="font-heading font-heading-medium text-lg text-foreground">Your Products</h2>
                <span className="inline-flex items-center px-2 py-1 rounded-clinical-sm bg-primary/10 text-primary font-data font-data-normal text-sm">
                  {products.length}
                </span>
              </div>
              <Button variant="outline" onClick={addNewProduct} iconName="Plus" iconPosition="left" iconSize={16}>
                Add Product
              </Button>
            </div>

            <div className="bg-muted/50 border border-border/50 rounded-clinical p-3">
              <div className="flex items-center space-x-2">
                <Icon name="Move" size={14} className="text-muted-foreground" />
                <span className="font-caption font-caption-normal text-xs text-muted-foreground">
                  Drag products to reorder your routine. Order matters!
                </span>
              </div>
            </div>

            <div className="space-y-4">
              {products.map((product, index) => {
                const conflictCheck = checkIngredientConflicts(product, index);
                return (
                  <div
                    key={product.id ?? index}
                    draggable
                    onDragStart={(e) => handleDragStart(e, index)}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, index)}
                    className={`transition-clinical ${draggedIndex === index ? 'opacity-50 scale-95' : ''}`}
                  >
                    <ProductEntryCard
                      product={product}
                      index={index}
                      onUpdate={(upd) => updateProduct(index, upd)}
                      onRemove={() => removeProduct(index)}
                      onDuplicate={() => duplicateProduct(index)}
                      onSelect={() => onProductSelect(product)}
                      isSelected={selectedProduct?.id === product.id}
                      showConflictWarning={conflictCheck.hasConflict}
                      conflictMessage={conflictCheck.message}
                    />
                  </div>
                );
              })}
            </div>

            <div className="flex justify-center pt-4">
              <Button variant="outline" onClick={addNewProduct} iconName="Plus" iconPosition="left" iconSize={16}>
                Add Another Product
              </Button>
            </div>
          </>
        )}
      </div>

      {products.length > 0 && (
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
                  <span className="font-data font-data-normal text-foreground ml-2">{products.length}</span>
                </div>
                <div>
                  <span className="font-body font-body-medium text-muted-foreground">Categories:</span>
                  <span className="font-data font-data-normal text-foreground ml-2">
                    {new Set(products.filter(p => p.category).map(p => p.category)).size}
                  </span>
                </div>
                <div>
                  <span className="font-body font-body-medium text-muted-foreground">Conflicts:</span>
                  <span className={`font-data font-data-normal ml-2 ${
                    products.some((p, i) => checkIngredientConflicts(p, i).hasConflict)
                      ? 'text-warning' : 'text-success'
                  }`}>
                    {products.some((p, i) => checkIngredientConflicts(p, i).hasConflict)
                      ? 'Potential' : 'None'}
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
