import { fetchProductEnrichment } from '../../utils/gemini';

/**
 * This function enriches a product object with AI-generated content
 * and ensures essential fields like 'image' are present.
 */
const enhanceProductData = async (product) => {
  let enrichedData = { ...product };

  // Check if the product needs enrichment (missing usage, application, or tips)
  const needsEnrichment = !(product.usage && product.application && product.tips && 
                          product.usage.trim() !== '' && 
                          product.application.trim() !== '' && 
                          product.tips.trim() !== '');

  if (needsEnrichment) {
    try {
      const aiGeneratedContent = await fetchProductEnrichment(product);
      enrichedData = {
        ...enrichedData,
        usage: (product.usage || '').trim() === '' ? aiGeneratedContent.usage : product.usage,
        application: (product.application || '').trim() === '' ? aiGeneratedContent.application : product.application,
        tips: (product.tips || '').trim() === '' ? aiGeneratedContent.tips : product.tips,
      };
    } catch (error) {
      console.error("Failed to enhance product data with AI:", error);
      // Don't break the flow; proceed with the original data if AI fails.
    }
  }

  // Ensure the product has an image URL.
  // If not, create a placeholder image using an external service.
  if (!enrichedData.image) {
    const placeholderText = encodeURIComponent(enrichedData.name || 'Product');
    enrichedData.image = `https://placehold.co/100x100/f1f5f9/334155?text=${placeholderText}`;
  }

  return enrichedData;
};

export default enhanceProductData;
