import React from 'react';
import ProductPill from './ProductPill';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const RoutinePreviewPanel = ({ 
  morningProducts, 
  eveningProducts, 
  weeklyTreatments, 
  isCollapsed, 
  onToggleCollapse,
  onSave,
  onAnalyze,
  isAnalyzing
}) => {
  const totalProducts = morningProducts.length + eveningProducts.length + weeklyTreatments.length;

  return (
    <div className={`bg-card border border-border rounded-clinical shadow-clinical-sm overflow-hidden transition-all duration-300 ${isCollapsed ? 'h-16' : 'h-auto'}`}>
      <div className="flex items-center justify-between p-4 cursor-pointer lg:cursor-default" onClick={onToggleCollapse}>
        <div className="flex items-center space-x-3">
          <Icon name="ClipboardList" size={20} className="text-primary" />
          <h3 className="font-heading font-heading-semibold text-foreground">Routine Preview</h3>
        </div>
        <div className="flex items-center space-x-2">
          <span className="bg-primary/10 text-primary font-mono text-xs rounded-full px-2 py-1">{totalProducts}</span>
          <button className="lg:hidden text-muted-foreground">
            <Icon name={isCollapsed ? 'ChevronDown' : 'ChevronUp'} size={18} />
          </button>
        </div>
      </div>

      {!isCollapsed && (
        <div className="p-4 border-t border-border">
          <div className="space-y-4 max-h-[40vh] overflow-y-auto pr-2">
            <RoutineSection title="Morning" icon="Sun" products={morningProducts} />
            <RoutineSection title="Evening" icon="Moon" products={eveningProducts} />
            <RoutineSection title="Weekly" icon="Sparkles" products={weeklyTreatments} />
          </div>
          
          <div className="mt-6 space-y-3">
             <Button 
                variant="default"
                onClick={onAnalyze}
                disabled={totalProducts === 0}
                className="w-full"
                loading={isAnalyzing}
                iconName="Zap"
                iconPosition="left"
             >
                {isAnalyzing ? 'Analyzing...' : 'Get AI Analysis'}
            </Button>
            <Button 
                variant="outline"
                onClick={onSave}
                className="w-full"
                iconName="Save"
                iconPosition="left"
            >
                Save Routine to Cloud
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

const RoutineSection = ({ title, icon, products }) => {
  if (products.length === 0) return null;

  return (
    <div>
      <div className="flex items-center space-x-2 mb-2">
        <Icon name={icon} size={14} className="text-muted-foreground" />
        <h4 className="font-body font-body-semibold text-sm text-muted-foreground">{title}</h4>
      </div>
      <div className="flex flex-wrap gap-2">
        {products.map(product => (
          <ProductPill key={product.id} productName={product.name} />
        ))}
      </div>
    </div>
  );
};

export default RoutinePreviewPanel;
