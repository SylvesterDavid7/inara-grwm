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
