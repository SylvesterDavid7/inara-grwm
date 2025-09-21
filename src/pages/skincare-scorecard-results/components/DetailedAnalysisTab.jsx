import React from 'react';
import IngredientCompatibilityCard from './IngredientCompatibilityCard';
import Icon from '../../../components/AppIcon';

const DetailedAnalysisTab = ({ detailedIngredientAnalysis, ingredientCompatibility }) => {

  if (!detailedIngredientAnalysis || detailedIngredientAnalysis.length === 0) {
    return (
      <div className="bg-card border border-border rounded-clinical p-8 text-center">
        <h3 className="text-lg font-heading font-heading-semibold text-foreground">Detailed Ingredient Analysis</h3>
        <p className="text-muted-foreground mt-2">No key ingredients were identified for a detailed analysis in this routine.</p>
        <p className="text-muted-foreground text-sm mt-2">Tip: Ensure your product names are descriptive (e.g., 'CeraVe Retinol Serum').</p>
      </div>
    );
  }

  const citations = detailedIngredientAnalysis.map(item => item.evidence).filter(Boolean);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-heading font-bold text-foreground mb-4">Ingredient Deep Dive</h2>
        <p className="text-muted-foreground max-w-3xl">
          Here is a detailed breakdown of the key active ingredients identified in your routine. This analysis focuses on their purpose, strength, and how they contribute to your skin goals, backed by scientific evidence.
        </p>
      </div>

      {/* Ingredient Deep Dive Section */}
      <div className="space-y-6">
        {detailedIngredientAnalysis.map((ingredient, index) => (
          <div key={index} className="bg-card border border-border rounded-clinical overflow-hidden">
            <div className="p-6">
              <h3 className="text-xl font-heading font-heading-semibold text-foreground mb-2">{ingredient.name}</h3>
              <p className="text-muted-foreground text-sm mb-4">{ingredient.purpose}</p>
              
              <div className="flex items-center gap-4 mb-4 text-sm">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary`}>
                  Strength: {ingredient.strength}
                </span>
                 <span className="text-muted-foreground">Products: {ingredient.products.join(', ')}</span>
              </div>
              
              {/* Suggestions & Warnings */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                    <h4 className="font-semibold text-foreground mb-2 flex items-center"><Icon name="ThumbsUp" className="text-success mr-2" size={16}/> Suggestions</h4>
                    <ul className="list-disc list-inside space-y-1 text-foreground/80">
                        {ingredient.suggestions.map((s, i) => <li key={i}>{s}</li>)}
                    </ul>
                </div>
                 <div>
                    <h4 className="font-semibold text-foreground mb-2 flex items-center"><Icon name="AlertTriangle" className="text-warning mr-2" size={16}/> Warnings</h4>
                    <ul className="list-disc list-inside space-y-1 text-foreground/80">
                        {ingredient.warnings.map((w, i) => <li key={i}>{w}</li>)}
                    </ul>
                </div>
              </div>
            </div>
            <div className="bg-card-alt border-t border-border px-6 py-4">
                <h4 className="font-semibold text-foreground mb-2 text-sm flex items-center"><Icon name="BookOpen" className="text-muted-foreground mr-2" size={16}/> Supporting Evidence</h4>
                <p className="text-muted-foreground text-xs italic">{ingredient.evidence.summary} <a href={ingredient.evidence.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">[source]</a></p>
            </div>
          </div>
        ))}
      </div>

      {/* Ingredient Compatibility */}
      {ingredientCompatibility && ingredientCompatibility.length > 0 && (
        <IngredientCompatibilityCard
          compatibility={ingredientCompatibility}
        />
      )}

      {/* Citations */}
      {citations.length > 0 && (
        <div className="bg-card border border-border rounded-clinical p-6">
            <h3 className="font-heading font-heading-semibold text-lg text-foreground mb-3">Scientific References</h3>
            <div className="space-y-3 text-xs text-muted-foreground">
                {citations.map((cite, i) => (
                    <p key={i}>{i+1}. {cite.summary} <a href={cite.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">[Full Text]</a></p>
                ))}
            </div>
        </div>
      )}
    </div>
  );
};

export default DetailedAnalysisTab;
