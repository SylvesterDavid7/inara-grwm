
import React from 'react';
import Icon from '../../../components/AppIcon';

const RoutineDisplay = ({ timeOfDay, icon, routine }) => {
  if (!routine || !routine.products || routine.products.length === 0) {
    return null;
  }

  return (
    <div className="glass-card-container rounded-lg p-px bg-gradient-to-b from-white/10 to-transparent">
      <div className="glass-card rounded-lg overflow-hidden bg-white/5 backdrop-blur-lg">
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center">
            <Icon name={icon} size={24} className="text-white mr-4" />
            <h3 className="text-xl font-heading font-heading-semibold text-white">{timeOfDay} Routine</h3>
          </div>
          <p className="text-white/70 mt-2 font-body font-body-normal">{routine.analysis}</p>
        </div>
        
        <div className="divide-y divide-white/10">
          {routine.products.map((product, index) => (
            <div key={product.id} className="p-6 flex items-start">
              <div className="mr-4 flex-shrink-0">
                  <div className="w-10 h-10 bg-white/10 text-white rounded-full flex items-center justify-center font-bold text-lg">
                      {index + 1}
                  </div>
              </div>
              <div className="flex-grow">
                <h4 className="font-body font-body-medium text-lg text-white">{product.name}</h4>
                <p className="text-white/70 text-sm mb-2">{product.category}</p>
                <div className="space-y-2 text-sm text-white/80 font-body font-body-normal">
                    <div className="flex items-start space-x-2">
                        <Icon name="Clock" size={16} className="flex-shrink-0 mt-0.5 text-white/70"/>
                        <span><strong>Usage:</strong> {product.usage}</span>
                    </div>
                    <div className="flex items-start space-x-2">
                        <Icon name="Droplet" size={16} className="flex-shrink-0 mt-0.5 text-white/70"/>
                        <span><strong>Quantity:</strong> {product.quantity}</span>
                    </div>
                    <div className="flex items-start space-x-2">
                        <Icon name="Hand" size={16} className="flex-shrink-0 mt-0.5 text-white/70"/>
                        <span><strong>Application:</strong> {product.application}</span>
                    </div>
                    <div className="flex items-start space-x-2">
                        <Icon name="Info" size={16} className="flex-shrink-0 mt-0.5 text-white/70"/>
                        <span><strong>Tips:</strong> {product.tips}</span>
                    </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {routine.insights && routine.insights.length > 0 && (
          <div className="p-6 border-t border-white/10 bg-white/5">
              {routine.insights.map((insight, index) => (
                   <div key={index} className="flex items-start space-x-3">
                      <Icon name={insight.icon} size={20} className="text-white flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                      <p className="font-body font-body-normal text-sm text-white/80">
                          {insight.text}
                      </p>
                      </div>
                  </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RoutineDisplay;
