// The Gemini API Key is loaded from an environment variable.
// Make sure you have a .env file in the root of your project with the following line:
// VITE_GEMINI_API_KEY='your_actual_api_key'
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${GEMINI_API_KEY}`;

// This function calls the Gemini API directly to get a real analysis.
export const fetchGeminiAnalysis = async (routine) => {

  const prompt = `
  Analyze the following skincare routine and return a single, valid JSON object. Do not include any text or markdown formatting before or after the JSON object.

  **User\'s Routine:**
  - **Morning:** ${JSON.stringify(routine.morningProducts.map(p => ({ id: p.id, name: p.name, category: p.category, ingredients: p.ingredients })) )}
  - **Evening:** ${JSON.stringify(routine.eveningProducts.map(p => ({ id: p.id, name: p.name, category: p.category, ingredients: p.ingredients })) )}
  - **Weekly:** ${JSON.stringify(routine.weeklyTreatments.map(p => ({ id: p.id, name: p.name, category: p.category, ingredients: p.ingredients })) )}

  **JSON Output Structure:**
  Follow this structure precisely. Populate all fields with rich, detailed, and scientifically-grounded analysis.

  {
    "overallScore": {
      "score": "number (0-100)",
      "rating": "string (e.g., 'Excellent', 'Needs Improvement')",
      "improvement": "string (A one-sentence summary of the key area for improvement)",
      "insights": [
        {"text": "string (A key insight about the overall routine, such as a missing product category or a major conflict)", "icon": "string (Icon name from lucide-react, e.g., 'ShieldCheck', 'FlaskConical')", "type": "string (e.g., 'suggestion', 'warning')"}
      ]
    },
    "metrics": {
      "Effectiveness": {
        "score": "number (0-100)",
        "rating": "string (e.g., 'Excellent', 'Good', 'Fair', 'Poor')",
        "explanation": "string (Detailed explanation of why this score was given, considering product types, active ingredients, and routine structure.)"
      },
      "Safety": {
        "score": "number (0-100)",
        "rating": "string (e.g., 'Excellent', 'Good', 'Fair', 'Poor')",
        "explanation": "string (Detailed explanation of the safety score, focusing on potential irritants, ingredient concentrations, and compatibility issues.)"
      },
      "Goal Alignment": {
        "score": "number (0-100)",
        "rating": "string (e.g., 'Excellent', 'Good', 'Fair', 'Poor')",
        "explanation": "string (Detailed explanation of how well the routine aligns with common goals like anti-aging, hydration, or acne control.)"
      },
      "Routine Consistency": {
        "score": "number (0-100)",
        "rating": "string (e.g., 'Excellent', 'Good', 'Fair', 'Poor')",
        "explanation": "string (Detailed explanation of how consistent the routine is, e.g., using key products daily.)"
      }
    },
    "morningRoutine": {
      "score": "number (0-100)",
      "analysis": "string (A detailed paragraph analyzing the morning routine\'s strengths and weaknesses)",
      "products": [
          {
            "id": "string (The original product ID)",
            "score": "number (0-10, score for the individual product)",
            "rating": "string (e.g., 'Excellent', 'Good', 'Fair', 'Poor')",
            "issues": ["string (List any specific issues or conflicts with this product in the routine)"]
          }
      ],
      "insights": [
        {"text": "string (A specific, actionable insight for the morning routine. Include suggestions for missing products (e.g., \'Consider adding an antioxidant serum\'), good pairings (e.g., \'Vitamin C and sunscreen work well together\'), or potential issues.)", "icon": "string (e.g., \'Sun\', \'PlusCircle\')", "type": "string (e.g., \'pro\', \'suggestion\', \'warning\')"}
      ]
    },
    "eveningRoutine": {
      "score": "number (0-100)",
      "analysis": "string (A detailed paragraph analyzing the evening routine\'s strengths and weaknesses)",
      "products": [
          {
            "id": "string (The original product ID)",
            "score": "number (0-10, score for the individual product)",
            "rating": "string (e.g., 'Excellent', 'Good', 'Fair', 'Poor')",
            "issues": ["string (List any specific issues or conflicts with this product in the routine)"]
          }
      ],
      "insights": [
        {"text": "string (A specific, actionable insight for the evening routine. Include suggestions like using retinoids, avoiding conflicts, or adding a specific type of moisturizer.)", "icon": "string (e.g., \'Moon\', \'Zap\')", "type": "string (e.g., \'pro\', \'suggestion\', \'warning\')"}
      ]
    },
    "detailedIngredientAnalysis": [
      {
        "name": "string (e.g., 'Retinol')",
        "purpose": "string (e.g., 'Anti-aging, cell turnover')",
        "strength": "string (e.g., 'High', 'Moderate', 'Low')",
        "products": ["string (List of product names containing this ingredient)"],
        "suggestions": ["string (Suggestions for using this ingredient, e.g., \'Start with a lower concentration\')"],
        "warnings": ["string (Potential side effects or interactions, e.g., \'Can cause dryness and irritation\')"],
        "evidence": {
          "summary": "string (A brief summary of the scientific evidence for this ingredient\'s effectiveness)",
          "url": "string (A link to a reputable source, like an NCBI study or dermatology journal)"
        }
      }
    ],
    "ingredientCompatibility": [
      {
        "ingredientA": "string (e.g., 'Vitamin C')",
        "ingredientB": "string (e.g., 'Niacinamide')",
        "compatible": "boolean",
        "reason": "string (A detailed explanation of why the ingredients are or are not compatible, and how to use them safely if they are not)"
      }
    ]
  }
`;


  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
            "response_mime_type": "application/json",
        }
      })
    });

    if (!response.ok) {
        const errorBody = await response.json();
        console.error("Gemini API Error:", errorBody);
        throw new Error(`API request failed with status ${response.status}: ${errorBody.error.message}`);
    }

    const data = await response.json();
    
    // With JSON mode, the response text is a clean JSON string.
    const jsonString = data.candidates[0].content.parts[0].text;
    const analysisResult = JSON.parse(jsonString);

    // --- DATA NORMALIZATION --- 
    // Ensure the final object has a consistent structure, even if the model omits empty keys.
    analysisResult.overallScore = analysisResult.overallScore || { score: 0, rating: 'N/A', improvement: '', insights: [] };
    analysisResult.overallScore.insights = analysisResult.overallScore.insights || [];
    
    analysisResult.metrics = analysisResult.metrics || {};

    analysisResult.morningRoutine = analysisResult.morningRoutine || { score: 0, analysis: '', products: [], insights: [] };
    analysisResult.morningRoutine.products = analysisResult.morningRoutine.products || [];
    analysisResult.morningRoutine.insights = analysisResult.morningRoutine.insights || [];

    analysisResult.eveningRoutine = analysisResult.eveningRoutine || { score: 0, analysis: '', products: [], insights: [] };
    analysisResult.eveningRoutine.products = analysisResult.eveningRoutine.products || [];
    analysisResult.eveningRoutine.insights = analysisResult.eveningRoutine.insights || [];

    analysisResult.detailedIngredientAnalysis = analysisResult.detailedIngredientAnalysis || [];
    analysisResult.ingredientCompatibility = analysisResult.ingredientCompatibility || [];
    analysisResult.productRecommendations = analysisResult.productRecommendations || []; // This was already here, keeping for completeness

    // Manually merge the analysis scores back into the original product data
    const mergeProductData = (originalProducts, analyzedProducts) => {
        if (!analyzedProducts) return originalProducts;
        return originalProducts.map(origP => {
            const analyzedP = analyzedProducts.find(p => p.id === origP.id);
            return { ...origP, ...analyzedP };
        });
    };

    analysisResult.morningRoutine.products = mergeProductData(routine.morningProducts, analysisResult.morningRoutine.products);
    analysisResult.eveningRoutine.products = mergeProductData(routine.eveningProducts, analysisResult.eveningRoutine.products);

    return analysisResult;

  } catch (error) {
    console.error("Error fetching Gemini analysis:", error);
    if (error.message.includes('API key not valid')) {
        throw new Error("Invalid Gemini API Key. Please check the VITE_GEMINI_API_KEY in your .env file.");
    }
    throw new Error("Could not get a new analysis from the AI. Please check your API key and network connection.");
  }
};


export const fetchGeminiAnalysisFromAssessment = async (answers, questions) => {

    const formattedAnswers = questions.map((q, index) => {
        const answer = answers[index];
        if (!answer) return null;
        
        let answerDisplay;
        switch (q.type) {
            case 'single-select':
            case 'image-select':
                answerDisplay = q.options.find(opt => opt.value === answer)?.label || answer;
                break;
            case 'multi-select':
                answerDisplay = answer.map(val => q.options.find(opt => opt.value === val)?.label || val).join(', ');
                break;
            case 'slider':
                answerDisplay = `${answer} out of ${q.max}`;
                break;
            default:
                answerDisplay = answer;
        }
        return {
            question: q.title,
            answer: answerDisplay
        };
    }).filter(Boolean);


  const prompt = `
  Act as an expert dermatologist and skincare consultant. Based on the user's answers to the following skin assessment, generate a complete and personalized skincare scorecard. The user has NOT provided an existing routine; you are to CREATE a recommended routine for them from scratch.

  **User's Assessment Answers:**
  ${JSON.stringify(formattedAnswers, null, 2)}

  **Your Task:**
  Generate a valid JSON object that provides a comprehensive skincare analysis and a recommended daily and weekly routine. The JSON object must strictly follow the structure below. For each product, provide detailed usage instructions.

  **JSON Output Structure:**
  {
    "overallScore": {
      "score": "number (0-100, This is a projected score if the user follows your recommended routine)",
      "rating": "string (e.g., 'Excellent Potential', 'Strong Foundation')",
      "improvement": "string (A one-sentence summary of how the new routine will help their primary concerns)",
      "insights": [
        {"text": "string (A key insight about the user's skin based on their answers)", "icon": "string (e.g., 'ShieldCheck', 'FlaskConical')", "type": "string ('suggestion')"}
      ]
    },
    "metrics": {
      "Effectiveness": { "score": 95, "rating": "Excellent", "explanation": "This routine is highly effective because it directly targets the user\'s stated concerns (e.g., acne, aging) with proven active ingredients in a consistent structure." },
      "Safety": { "score": 90, "rating": "Excellent", "explanation": "The routine is designed to be safe by starting with lower concentrations of active ingredients and avoiding common irritants, based on the user's sensitivity level." },
      "Goal Alignment": { "score": 98, "rating": "Excellent", "explanation": "Every product in this recommended routine is chosen specifically to address the user\'s primary goals, such as reducing hyperpigmentation and improving skin texture." },
      "Routine Consistency": { "score": 100, "rating": "Excellent", "explanation": "This foundational routine is designed for easy and consistent daily use, which is critical for achieving long-term results." }
    },
    "morningRoutine": {
      "score": "number (90-100, a high score reflecting a well-designed routine)",
      "analysis": "string (A detailed paragraph explaining WHY this morning routine is ideal for the user. Mention the purpose of each product type, e.g., 'The gentle cleanser removes overnight buildup without stripping the skin, the antioxidant serum protects against environmental damage...')",
      "products": [
          {
            "id": "m-rec-1",
            "name": "string (Generic but descriptive product name, e.g., 'Hydrating Cream Cleanser')",
            "category": "Cleanser",
            "ingredients": ["string (List 2-3 key beneficial ingredients, e.g., 'Ceramides', 'Glycerin')"],
            "usage": "string (e.g., 'Daily, in the morning')",
            "quantity": "string (e.g., 'A dime-sized amount')",
            "application": "string (e.g., 'Gently massage onto damp skin for 60 seconds, then rinse with lukewarm water.')",
            "tips": "string (e.g., 'Avoid using hot water, which can strip the skin\'s natural oils.')",
            "score": 10, "rating": "Excellent", "issues": []
          }
      ]
    },
    "eveningRoutine": {
      "score": "number (90-100, a high score reflecting a well-designed routine)",
      "analysis": "string (A detailed paragraph explaining the evening routine's focus on repair and treatment, e.g., 'The evening is for cleansing the day away and using targeted treatments... The double cleanse ensures all impurities are removed...')",
      "products": [
           {
            "id": "e-rec-1",
            "name": "string (e.g., 'Micellar Water or Cleansing Balm')",
            "category": "Cleanser",
            "ingredients": ["string (e.g., 'Glycerin', 'Micelles')"],
            "usage": "string (e.g., 'Daily, in the evening')",
            "quantity": "string (e.g., 'A cotton pad soaked, or a pea-sized amount')",
            "application": "string (e.g., 'Apply to dry skin to break down makeup and sunscreen before your main cleanser.')",
            "tips": "string (e.g., 'This is the first step of a double cleanse, crucial for removing oil-based impurities.')",
            "score": 10, "rating": "Excellent", "issues": []
          }
      ]
    },
    "weeklyRoutine": {
        "analysis": "string (A paragraph explaining the importance of weekly treatments for the user\'s goals, like exfoliation for texture or a hydrating mask for dryness.)",
        "products": [
            {
                "id": "w-rec-1",
                "name": "string (e.g., 'AHA/BHA Exfoliating Serum')",
                "category": "Exfoliant",
                "usage": "string (e.g., '2-3 times per week, at night')",
                "quantity": "string (e.g., 'A few drops')",
                "application": "string (e.g., 'Apply to clean, dry skin. Leave on for 10 minutes, then rinse.')",
                "tips": "string (e.g., 'Avoid using on the same night as other strong actives like retinoids.')",
                "ingredients": ["string (e.g., 'Glycolic Acid', 'Salicylic Acid')"],
                "score": 10,
                "rating": "Excellent",
                "issues": []
            }
        ]
    },
    "detailedIngredientAnalysis": [],
    "ingredientCompatibility": [],
    "productRecommendations": []
  }
`;

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
            "response_mime_type": "application/json",
        }
      })
    });

    if (!response.ok) {
        const errorBody = await response.json();
        console.error("Gemini API Error:", errorBody);
        throw new Error(`API request failed with status ${response.status}: ${errorBody.error.message}`);
    }

    const data = await response.json();
    const jsonString = data.candidates[0].content.parts[0].text;
    const analysisResult = JSON.parse(jsonString);

    // --- DATA NORMALIZATION ---
    analysisResult.overallScore = analysisResult.overallScore || { score: 0, rating: 'N/A', improvement: '', insights: [] };
    analysisResult.metrics = analysisResult.metrics || {};
    analysisResult.morningRoutine = analysisResult.morningRoutine || { score: 0, analysis: '', products: [], insights: [] };
    analysisResult.eveningRoutine = analysisResult.eveningRoutine || { score: 0, analysis: '', products: [], insights: [] };
    analysisResult.weeklyRoutine = analysisResult.weeklyRoutine || { analysis: '', products: [], insights: [] };
    analysisResult.detailedIngredientAnalysis = analysisResult.detailedIngredientAnalysis || [];
    analysisResult.ingredientCompatibility = analysisResult.ingredientCompatibility || [];
    analysisResult.productRecommendations = analysisResult.productRecommendations || [];

    // The recommended routine doesn't have original products to merge with, so we just use the generated ones.
    analysisResult.routine = {
        morningProducts: analysisResult.morningRoutine.products,
        eveningProducts: analysisResult.eveningRoutine.products,
        weeklyTreatments: analysisResult.weeklyRoutine.products,
    };

    return analysisResult;

  } catch (error) {
    console.error("Error fetching Gemini analysis from assessment:", error);
     if (error.message.includes('API key not valid')) {
        throw new Error("Invalid Gemini API Key. Please check the VITE_GEMINI_API_KEY in your .env file.");
    }
    throw new Error("Could not get a new analysis from the AI. Please check your API key and network connection.");
  }
};
