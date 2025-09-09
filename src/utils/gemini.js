// The Gemini API Key is loaded from an environment variable.
// Make sure you have a .env file in the root of your project with the following line:
// VITE_GEMINI_API_KEY='your_actual_api_key'
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${GEMINI_API_KEY}`;

// This function calls the Gemini API directly to get a real analysis.
export const fetchGeminiAnalysis = async (routine) => {

  const prompt = `
  Analyze the following skincare routine and return a single, valid JSON object. Do not include any text or markdown formatting before or after the JSON object.

  **User's Routine:**
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
        "effectiveness": { 
            "value": "number (0-100)", 
            "explanation": "string (Detailed explanation of why this score was given, considering product types, active ingredients, and routine structure.)"
        },
        "safety": { 
            "value": "number (0-100)",
            "explanation": "string (Detailed explanation of the safety score, focusing on potential irritants, ingredient concentrations, and compatibility issues.)"
        },
        "goalAlignment": { 
            "value": "number (0-100)",
            "explanation": "string (Detailed explanation of how well the routine aligns with common goals like anti-aging, hydration, or acne control.)"
        },
        "costEfficiency": { 
            "value": "number (0-10)",
            "explanation": "string (A subjective explanation of the routine\'s value, considering product prices, ingredient quality, and potential for similar results with more affordable options.)"
        }
    },
    "morningRoutine": {
      "score": "number (0-100)",
      "analysis": "string (A detailed paragraph analyzing the morning routine\'s strengths and weaknesses)",
      "products": [], // This will be populated by the application later
      "insights": [
        {"text": "string (A specific, actionable insight for the morning routine. Include suggestions for missing products (e.g., \'Consider adding an antioxidant serum\'), good pairings (e.g., \'Vitamin C and sunscreen work well together\'), or potential issues.)", "icon": "string (e.g., \'Sun\', \'PlusCircle\')", "type": "string (e.g., \'pro\', \'suggestion\', \'warning\')"}
      ]
    },
    "eveningRoutine": {
      "score": "number (0-100)",
      "analysis": "string (A detailed paragraph analyzing the evening routine\'s strengths and weaknesses)",
      "products": [], // This will be populated by the application later
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

    // Ensure the final object has the required keys, even if the model omits them.
    analysisResult.productRecommendations = analysisResult.productRecommendations || [];
    analysisResult.progressTracking = analysisResult.progressTracking || [];

    // Manually inject the product data back into the routine sections for UI display
    analysisResult.morningRoutine.products = routine.morningProducts;
    analysisResult.eveningRoutine.products = routine.eveningProducts;

    return analysisResult;

  } catch (error) {
    console.error("Error fetching Gemini analysis:", error);
    if (error.message.includes('API key not valid')) {
        throw new Error("Invalid Gemini API Key. Please check the VITE_GEMINI_API_KEY in your .env file.");
    }
    throw new Error("Could not get a new analysis from the AI. Please check your API key and network connection.");
  }
};
