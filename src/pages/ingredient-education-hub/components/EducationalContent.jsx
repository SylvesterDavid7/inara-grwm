import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const EducationalContent = ({ className = "" }) => {
  const [activeCategory, setActiveCategory] = useState('beginner');

  const educationalCategories = [
    { id: 'beginner', label: 'Beginner Guide', icon: 'BookOpen' },
    { id: 'advanced', label: 'Advanced Science', icon: 'Microscope' },
    { id: 'myths', label: 'Myth Busting', icon: 'AlertCircle' },
    { id: 'trends', label: 'Latest Trends', icon: 'TrendingUp' }
  ];

  const educationalContent = {
    beginner: [
      {
        id: 1,
        title: "Understanding Your Skin Type",
        description: "Learn how to identify your skin type and choose the right ingredients for your unique needs.",
        image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=250&fit=crop",
        readTime: "5 min read",
        category: "Basics",
        content: `Understanding your skin type is the foundation of any effective skincare routine. There are five main skin types:\n\n**Normal Skin:** Balanced oil production, few imperfections, and good elasticity.\n\n**Dry Skin:** Lacks moisture, may feel tight, and shows signs of flaking.\n\n**Oily Skin:** Overproduces sebum, appears shiny, and is prone to acne.\n\n**Combination Skin:** Mix of oily and dry areas, typically oily T-zone.\n\n**Sensitive Skin:** Reacts easily to products, may experience redness or irritation.`
      },
      {
        id: 2,
        title: "The Science of pH in Skincare",
        description: "Discover why pH balance matters and how it affects ingredient effectiveness and skin health.",
        image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=250&fit=crop",
        readTime: "7 min read",
        category: "Science",
        content: `The pH scale measures how acidic or alkaline a substance is, ranging from 0 (most acidic) to 14 (most alkaline).\n\nHealthy skin has a slightly acidic pH of around 4.5-5.5, known as the acid mantle. This protective barrier:\n\n• Prevents harmful bacteria growth\n• Maintains skin hydration\n• Supports the skin's natural repair process\n\nWhen choosing skincare products, consider their pH levels to maintain your skin's natural balance.`
      },
      {
        id: 3,
        title: "Building Your First Routine",
        description: "Step-by-step guide to creating a simple yet effective skincare routine for beginners.",
        image: "https://images.unsplash.com/photo-1570194065650-d99fb4bedf0a?w=400&h=250&fit=crop",
        readTime: "8 min read",
        category: "Routine",
        content: `A basic skincare routine should include these essential steps:\n\n**Morning:**\n1. Gentle cleanser\n2. Moisturizer\n3. Sunscreen (SPF 30+)\n\n**Evening:**\n1. Cleanser (double cleanse if wearing makeup)\n2. Treatment (if needed)\n3. Moisturizer\n\nStart simple and gradually introduce new products one at a time to monitor how your skin reacts.`
      }
    ],
    advanced: [
      {
        id: 4,
        title: "Molecular Structure and Penetration",
        description: "Deep dive into how molecular size affects ingredient absorption and efficacy.",
        image: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=400&h=250&fit=crop",
        readTime: "12 min read",
        category: "Science",
        content: `Molecular weight plays a crucial role in how well ingredients penetrate the skin barrier.\n\n**Small Molecules (< 500 Da):**\n• Penetrate easily through skin\n• Examples: Glycolic acid, Salicylic acid\n• Quick absorption and immediate effects\n\n**Medium Molecules (500-1000 Da):**\n• Moderate penetration\n• May require delivery systems\n• Examples: Retinol, Niacinamide\n\n**Large Molecules (> 1000 Da):**\n• Limited penetration\n• Work primarily on skin surface\n• Examples: Hyaluronic acid, Peptides`
      },
      {
        id: 5,
        title: "Formulation Chemistry Basics",
        description: "Understanding how ingredients work together in skincare formulations.",
        image: "https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=400&h=250&fit=crop",
        readTime: "15 min read",
        category: "Chemistry",
        content: `Skincare formulation is a complex science that involves balancing multiple factors:\n\n**Solubility:** Water-soluble vs oil-soluble ingredients require different delivery systems.\n\n**Stability:** Some ingredients degrade when exposed to light, air, or certain pH levels.\n\n**Compatibility:** Not all ingredients work well together - some may neutralize each other's effects.\n\n**Concentration:** The percentage of active ingredients determines efficacy and potential irritation.`
      }
    ],
    myths: [
      {
        id: 6,
        title: "Debunking the 'Natural is Always Better' Myth",
        description: "Why natural doesn't always mean safer or more effective in skincare.",image: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&h=250&fit=crop",readTime: "6 min read",category: "Myths",
        content: `The 'natural is better' belief is one of the most persistent skincare myths.\n\n**Reality Check:**\n• Poison ivy is natural, but not safe for skin\n• Synthetic ingredients often have better safety profiles\n• Lab-created ingredients can be more stable and effective\n• Natural doesn't mean non-allergenic\n\n**The Truth:** Both natural and synthetic ingredients can be beneficial. What matters is the ingredient's safety profile, efficacy, and how it works with your skin type.`
      },
      {
        id: 7,
        title: "The Expensive = Better Fallacy",description: "Why price doesn't always correlate with skincare product effectiveness.",
        image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=250&fit=crop",
        readTime: "5 min read",
        category: "Myths",
        content: `Many people believe that expensive skincare products are automatically more effective.\n\n**Factors that inflate price but don't improve efficacy:**\n• Luxury packaging\n• Celebrity endorsements\n• Exotic ingredient marketing\n• Brand prestige\n\n**What actually matters:**\n• Active ingredient concentration\n• Formulation quality\n• Clinical testing\n• Ingredient compatibility with your skin type`
      }
    ],
    trends: [
      {
        id: 8,
        title: "The Rise of Microbiome-Friendly Skincare",
        description: "How the skin microbiome is revolutionizing skincare ingredient selection.",
        image: "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=400&h=250&fit=crop",
        readTime: "10 min read",
        category: "Trends",
        content: `The skin microbiome consists of trillions of beneficial bacteria that protect and maintain skin health.\n\n**Microbiome-Friendly Ingredients:**\n• Prebiotics: Feed beneficial bacteria\n• Probiotics: Add beneficial bacteria\n• Postbiotics: Beneficial bacterial byproducts\n\n**Benefits:**\n• Improved skin barrier function\n• Reduced inflammation\n• Better protection against pathogens\n• Enhanced skin resilience\n\nThis trend is shifting focus from harsh, antibacterial ingredients to gentle, supportive formulations.`
      },
      {
        id: 9,
        title: "Sustainable Beauty: Green Chemistry in Skincare",
        description: "How environmental consciousness is driving innovation in skincare ingredients.",
        image: "https://images.unsplash.com/photo-1556228578-dd6f8cfc2c2d?w=400&h=250&fit=crop",
        readTime: "8 min read",
        category: "Sustainability",
        content: `Sustainable skincare focuses on environmental impact throughout the product lifecycle.\n\n**Key Principles:**\n• Biodegradable ingredients\n• Renewable raw materials\n• Minimal water usage in production\n• Recyclable packaging\n• Cruelty-free testing methods\n\n**Innovative Approaches:**\n• Lab-grown ingredients\n• Upcycled botanical extracts\n• Waterless formulations\n• Refillable packaging systems\n\nThis trend proves that effective skincare and environmental responsibility can coexist.`
      }
    ]
  };

  const [expandedArticle, setExpandedArticle] = useState(null);

  const toggleArticle = (articleId) => {
    setExpandedArticle(expandedArticle === articleId ? null : articleId);
  };

  return (
    <div className={`bg-card border border-border rounded-clinical ${className}`}>
      <div className="p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Icon name="GraduationCap" size={20} className="text-primary" />
          <h2 className="font-heading font-heading-semibold text-xl text-card-foreground">
            Educational Hub
          </h2>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {educationalCategories?.map((category) => (
            <button
              key={category?.id}
              onClick={() => setActiveCategory(category?.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-clinical text-sm font-body font-body-medium transition-clinical ${
                activeCategory === category?.id
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-secondary hover:text-foreground'
              }`}
            >
              <Icon name={category?.icon} size={16} />
              <span>{category?.label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="space-y-4">
          {educationalContent?.[activeCategory]?.map((article) => (
            <div key={article?.id} className="border border-border rounded-clinical overflow-hidden">
              <div className="flex items-start space-x-4 p-4">
                <div className="flex-shrink-0">
                  <div className="w-20 h-20 bg-muted rounded-clinical overflow-hidden">
                    <Image
                      src={article?.image}
                      alt={article?.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-heading font-heading-semibold text-base text-card-foreground mb-1">
                        {article?.title}
                      </h3>
                      <p className="font-body font-body-normal text-sm text-muted-foreground">
                        {article?.description}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <Icon name="Clock" size={14} />
                        <span className="font-data font-data-normal">{article?.readTime}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Icon name="Tag" size={14} />
                        <span className="font-caption font-caption-normal">{article?.category}</span>
                      </div>
                    </div>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleArticle(article?.id)}
                      iconName={expandedArticle === article?.id ? "ChevronUp" : "ChevronDown"}
                      iconPosition="right"
                      iconSize={14}
                    >
                      {expandedArticle === article?.id ? 'Collapse' : 'Read More'}
                    </Button>
                  </div>
                </div>
              </div>
              
              {expandedArticle === article?.id && (
                <div className="px-4 pb-4 border-t border-border">
                  <div className="pt-4">
                    <div className="prose prose-sm max-w-none">
                      {article?.content?.split('\n\n')?.map((paragraph, index) => (
                        <p key={index} className="font-body font-body-normal text-sm text-card-foreground mb-3 last:mb-0">
                          {paragraph?.split('\n')?.map((line, lineIndex) => (
                            <React.Fragment key={lineIndex}>
                              {line?.startsWith('• ')
                                ? <span className="block ml-4">{line}</span>
                                : line?.split(/(\*\*.*?\*\*)/g).filter(Boolean).map((part, i) => {
                                    if (part.startsWith('**') && part.endsWith('**')) {
                                      return <strong key={i} className="font-body-medium">{part.slice(2, -2)}</strong>;
                                    }
                                    return <React.Fragment key={i}>{part}</React.Fragment>;
                                  })
                              }
                              {lineIndex < paragraph?.split('\n')?.length - 1 && <br />}
                            </React.Fragment>
                          ))}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EducationalContent;