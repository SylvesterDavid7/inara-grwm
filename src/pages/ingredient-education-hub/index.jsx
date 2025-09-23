import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Header from '../../components/ui/Header';
import QuickAccessToolbar from '../../components/ui/QuickAccessToolbar';
import SectionContextMenu from '../../components/ui/SectionContextMenu';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import IngredientCard from './components/IngredientCard';
import IngredientDetailModal from './components/IngredientDetailModal';
import IngredientSearchBar from './components/IngredientSearchBar';
import IngredientFilters from './components/IngredientFilters';
import CompatibilityChecker from './components/CompatibilityChecker';
import EducationalContent from './components/EducationalContent';

const IngredientEducationHub = () => {
  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState({});
  const [selectedIngredient, setSelectedIngredient] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isCompatibilityCheckerOpen, setIsCompatibilityCheckerOpen] = useState(false);
  const [bookmarkedIngredients, setBookmarkedIngredients] = useState([]);
  const [filteredIngredients, setFilteredIngredients] = useState([]);
  const [searchSuggestions, setSearchSuggestions] = useState([]);

  // Mock ingredients data
  const mockIngredients = [
    {
      id: 1,
      name: "Retinol",
      scientificName: "Vitamin A",
      description: "A powerful anti-aging ingredient that promotes cell turnover and collagen production, helping to reduce fine lines and improve skin texture.",
      detailedDescription: `Retinol is a derivative of Vitamin A and one of the most researched anti‑aging ingredients in skincare. It works by accelerating cell turnover, promoting the shedding of old skin cells and the generation of new ones. This process helps to smooth fine lines, improve skin texture, and fade dark spots.
    
    Retinol also stimulates collagen production in the deeper layers of the skin, which helps to improve skin firmness and elasticity over time. It's particularly effective for treating acne, as it helps to unclog pores and prevent the formation of new breakouts.`,
      image: "/Retinol.webp",
      safetyRating: "moderate",
      rating: 4.5,
      concentration: "0.25‑1%",
      frequency: "Evening only",
      skinConcerns: ["aging", "acne", "hyperpigmentation"],
      category: "actives",
      phLevel: "5.5‑6.0",
      molecularWeight: "286.45 Da",
      solubility: "Oil‑soluble",
      stability: "Light‑sensitive",
      timeOfUse: ["evening"],
      usageInstructions: "Start with 2‑3 times per week and gradually increase frequency. Always use sunscreen during the day as retinol increases photosensitivity.",
      benefits: [
        { title: "Anti‑aging", description: "Reduces fine lines and wrinkles by stimulating collagen production" },
        { title: "Acne treatment", description: "Unclogs pores and prevents new breakouts" },
        { title: "Skin texture", description: "Smooths rough skin and improves overall texture" },
        { title: "Hyperpigmentation", description: "Fades dark spots and evens skin tone" }
      ],
      sideEffects: [
        { title: "Initial irritation", description: "May cause redness, peeling, and dryness when first starting" },
        { title: "Photosensitivity", description: "Increases skin's sensitivity to sun exposure" },
        { title: "Pregnancy concerns", description: "Not recommended during pregnancy or breastfeeding" }
      ],
      compatibleWith: [
        { name: "Hyaluronic Acid", reason: "Provides hydration to counteract dryness" },
        { name: "Niacinamide", reason: "Reduces irritation and enhances barrier function" }
      ],
      incompatibleWith: [
        { name: "Vitamin C", reason: "May cause irritation when used together" },
        { name: "Benzoyl Peroxide", reason: "Can deactivate retinol and cause excessive dryness" }
      ],
      studies: [
        {
          title: "Efficacy of Retinol in Photoaging Treatment",
          year: "2023",
          journal: "Journal of Dermatological Science",
          summary: "12‑week study showing significant improvement in fine lines and skin texture with 0.5% retinol use."
        },
        {
          title: "Retinol vs Retinyl Palmitate: Comparative Analysis",
          year: "2022",
          journal: "Clinical Dermatology Review",
          summary: "Comparative study demonstrating superior efficacy of retinol over retinyl palmitate in anti‑aging applications."
        }
      ]
    },
    {
      id: 2,
      name: "Niacinamide",
      scientificName: "Vitamin B3",
      description: "A multi‑tasking vitamin that calms inflammation, improves skin barrier, and reduces hyperpigmentation.",
      detailedDescription: `Niacinamide, also known as Vitamin B3, is valued for its versatility in skincare. It helps strengthen the lipid barrier of the skin, reducing moisture loss and protecting against environmental stressors.
    
    It reduces redness and blotchiness by calming inflammation, and helps fade pigmentation by inhibiting the transfer of melanosomes to skin cells. Additionally, it regulates sebum production, which makes it helpful for oily and acne‑prone skin.`,
      image: "/Niacinamide.webp",
      safetyRating: "high",
      rating: 4.7,
      concentration: "2‑10%",
      frequency: "Morning or Evening",
      skinConcerns: ["sensitivity", "redness", "hyperpigmentation", "aging", "oily skin"],
      category: "vitamins / actives",
      phLevel: "5.0‑7.0",
      molecularWeight: "122.12 Da",
      solubility: "Water‑soluble",
      stability: "Stable",
      timeOfUse: ["morning", "evening"],
      usageInstructions: "Compatible with most other actives; use 5‑10% if new. Can be used daily, morning or night.",
      benefits: [
        { title: "Barrier support", description: "Strengthens skin’s natural lipid barrier" },
        { title: "Redness reduction", description: "Calms inflammatory responses" },
        { title: "Hyperpigmentation fading", description: "Helps even out skin tone" },
        { title: "Oil control", description: "Reduces excess sebum production" }
      ],
      sideEffects: [
        { title: "Mild irritation", description: "Possible mild irritation if used with strong acids or in high concentrations" }
      ],
      compatibleWith: [
        { name: "Hyaluronic Acid", reason: "Boosts hydration" },
        { name: "Retinol", reason: "Helps mitigate irritation" },
        { name: "Ceramides", reason: "Supports skin barrier repair" }
      ],
      incompatibleWith: [],
      studies: [
        {
          title: "Niacinamide 10% in the treatment of rosacea",
          year: "2021",
          journal: "Dermatology Reports",
          summary: "Showed reduced redness and discomfort in subjects after 4 weeks."
        }
      ]
    },
    {
      id: 3,
      name: "Salicylic Acid",
      scientificName: "o‑Hydroxybenzoic Acid",
      description: "A beta hydroxy acid that penetrates oil ducts to exfoliate inside pores; excellent for acne and congestion.",
      detailedDescription: `Salicylic Acid (BHA) is oil‑soluble, enabling it to penetrate into the sebum‑filled pores and exfoliate the inner walls of follicles. It loosens bonds between dead skin cells and helps with congestion, blackheads, and acne.
    
    It also has anti‑inflammatory properties, which help soothe inflamed lesions. Over time, regular use can improve skin texture and reduce breakouts without overly drying the surface skin if proper moisturization is maintained.`,
      image: "/Salicylic Acid.webp",
      safetyRating: "moderate",
      rating: 4.4,
      concentration: "0.5‑2%",
      frequency: "Evening or as needed",
      skinConcerns: ["acne", "clogged pores", "blackheads", "oily skin"],
      category: "chemical exfoliant",
      phLevel: "3.0‑4.0",
      molecularWeight: "138.12 Da",
      solubility: "Oil‑soluble",
      stability: "Stable under acid formulations",
      timeOfUse: ["evening"],
      usageInstructions: "Apply on clean skin; start with once or twice weekly if new. Follow with moisturizer. Avoid combining with other strong exfoliants too often.",
      benefits: [
        { title: "Deep exfoliation", description: "Penetrates pores to remove build‑up" },
        { title: "Acne control", description: "Helps reduce and prevent breakouts" },
        { title: "Improve texture", description: "Smooths rough or bumpy skin" }
      ],
      sideEffects: [
        { title: "Dryness or peeling", description: "May cause flaking with overuse" },
        { title: "Stinging or burning", description: "Particularly for sensitive skin types" }
      ],
      compatibleWith: [
        { name: "Niacinamide", reason: "Soothes irritation" },
        { name: "Hyaluronic Acid", reason: "Hydration support" }
      ],
      incompatibleWith: [
        { name: "Retinol (high strength)", reason: "May increase irritation when used together" },
        { name: "Other strong acids (AHA)", reason: "Risk of over‑exfoliation" }
      ],
      studies: [
        {
          title: "Salicylic Acid vs Benzoyl Peroxide for Acne Management",
          year: "2022",
          journal: "Journal of Clinical Acne Research",
          summary: "Demonstrated better tolerance and similar efficacy in mild to moderate acne with 2% salicylic acid."
        }
      ]
    },
    {
      id: 4,
      name: "Hyaluronic Acid",
      scientificName: "Sodium Hyaluronate / Hyaluronic Acid",
      description: "A humectant that draws moisture into the skin, helping to hydrate and plump the skin surface.",
      detailedDescription: `Hyaluronic Acid is a naturally occurring polysaccharide in the skin that has remarkable ability to hold up to 1000x its weight in water. In topical skincare, it hydrates the surface and deeper layers, helping to plump fine lines and reduce dryness.
    
    It also supports skin barrier function, making it particularly beneficial post‑exfoliation or for dry, sensitive skin. Because of its large size, different molecular weights are used in formulations to penetrate different depths.`,
      image: "/Hyaluronic Acid.webp",
      safetyRating: "very high",
      rating: 4.9,
      concentration: "0.1‑2%",
      frequency: "Morning and/or Evening",
      skinConcerns: ["dryness", "dehydration", "loss of plumpness", "sensitivity"],
      category: "hydrator / humectant",
      phLevel: "5.5‑7.0",
      molecularWeight: "varies (from ~20‑1000 kDa)",
      solubility: "Water‑soluble",
      stability: "Generally stable",
      timeOfUse: ["morning", "evening"],
      usageInstructions: "Can be applied on damp skin for better absorption. Follow with occlusive or moisturizer to seal in moisture.",
      benefits: [
        { title: "Hydration", description: "Draws moisture to skin and improves hydration levels" },
        { title: "Plumping", description: "Reduces appearance of fine lines by plumping skin" },
        { title: "Barrier support", description: "Helps maintain healthy skin barrier" }
      ],
      sideEffects: [],
      compatibleWith: [
        { name: "Allantoin", reason: "Soothing and barrier repair" },
        { name: "Ceramides", reason: "Restores lipids in skin barrier" },
        { name: "Niacinamide", reason: "Further boosts barrier and soothes" }
      ],
      incompatibleWith: [],
      studies: [
        {
          title: "Effects of Hyaluronic Acid on Skin Hydration",
          year: "2020",
          journal: "International Journal of Cosmetic Science",
          summary: "Use of topical hyaluronic acid improved hydration and skin elasticity over 8 weeks."
        }
      ]
    },
    {
      id: 5,
      name: "Vitamin C (Ascorbic Acid)",
      scientificName: "L‑Ascorbic Acid",
      description: "A potent antioxidant that brightens skin, fades dark spots, and protects against environmental damage.",
      detailedDescription: `Vitamin C (Ascorbic Acid) is one of the strongest antioxidants in skincare. It neutralizes free radicals generated by UV exposure, pollution, and other environmental stresses, helping to prevent collagen degradation.
    
    It also inhibits tyrosinase, the enzyme responsible for melanin production, thus fading hyperpigmentation and brightening skin tone. Because it is water‑soluble and unstable when exposed to light and air, proper packaging (dark, air‑tight bottles) is important for efficacy.`,
      image: "/Vitamin C (Ascorbic Acid).webp",
      safetyRating: "moderate",
      rating: 4.6,
      concentration: "5‑20%",
      frequency: "Morning",
      skinConcerns: ["hyperpigmentation", "dullness", "aging", "photo damage"],
      category: "antioxidant / brightening",
      phLevel: "3.0‑4.0",
      molecularWeight: "176.12 Da",
      solubility: "Water‑soluble",
      stability: "Oxidation sensitive",
      timeOfUse: ["morning"],
      usageInstructions: "Use after cleansing and toning, before sunscreen. Store in opaque container. Begin with lower concentration if new to avoid irritation.",
      benefits: [
        { title: "Antioxidant protection", description: "Neutralizes free radicals and prevents damage" },
        { title: "Brightening", description: "Fades dark spots and improves dull complexion" },
        { title: "Collagen support", description: "Helps prevent photoaging and sagging" }
      ],
      sideEffects: [
        { title: "Stinging or burning", description: "Possible at higher concentrations or sensitive skin" },
        { title: "Irritation", description: "Especially under higher pH or with other actives" }
      ],
      compatibleWith: [
        { name: "Vitamin E", reason: "Synergistic antioxidant effect" },
        { name: "Ferulic Acid", reason: "Stabilizes Vitamin C and boosts efficacy" }
      ],
      incompatibleWith: [
        { name: "Strong acids/BHAs", reason: "May increase irritation" }
      ],
      studies: [
        {
          title: "L‑Ascorbic Acid in Photoaged Skin",
          year: "2021",
          journal: "Journal of Cosmetic Dermatology",
          summary: "Showed reduction in wrinkle depth and increased brightness in 12 weeks."
        }
      ]
    },
    {
      id: 6,
      name: "Glycolic Acid",
      scientificName: "Alpha Hydroxy Acid (AHA)",
      description: "A small‑molecule exfoliant derived from sugar cane, helps remove dead surface skin cells and improve uneven texture.",
      detailedDescription: `Glycolic Acid is one of the smallest AHAs and penetrates the skin surface easily. It loosens the ‘glue’ between dead skin cells, encouraging shedding of dull surface layers and revealing smoother skin beneath.
    
    It can help fade dark spots, smooth rough patches, and increase cell turnover. Regular use improves skin texture and radiance, though it may increase sensitivity to sun and irritation risk if overused.`,
      image: "/Glycolic Acid.webp",
      safetyRating: "moderate",
      rating: 4.3,
      concentration: "5‑15%",
      frequency: "Evening / 2‑3 times per week",
      skinConcerns: ["uneven texture", "dullness", "hyperpigmentation", "aging"],
      category: "chemical exfoliant",
      phLevel: "3.5‑4.5",
      molecularWeight: "76.05 Da",
      solubility: "Water‑soluble",
      stability: "Must be stored with stable pH",
      timeOfUse: ["evening"],
      usageInstructions: "Start with low concentration and infrequent use (once every few days). Always follow with moisturizer and sunscreen.",
      benefits: [
        { title: "Surface exfoliation", description: "Removes dull, dead skin on the surface" },
        { title: "Even tone", description: "Helps fade dark spots and hyperpigmentation" },
        { title: "Texture smoothing", description: "Reduces rough patches" }
      ],
      sideEffects: [
        { title: "Burning or stinging", description: "Especially when first used or with other strong actives" },
        { title: "Increased sensitivity", description: "Can make skin more reactive to sun" }
      ],
      compatibleWith: [
        { name: "Hyaluronic Acid", reason: "Hydration support" },
        { name: "Niacinamide", reason: "Soothing, barrier help" }
      ],
      incompatibleWith: [
        { name: "Retinol (high strength)", reason: "Risk of irritation" },
        { name: "Other strong acids (BHA)", reason: "Over‑exfoliation" }
      ],
      studies: [
        {
          title: "Glycolic Acid Peels in Hyperpigmentation",
          year: "2020",
          journal: "Dermatologic Therapy",
          summary: "Improved uniformity of skin tone and reduced pigmentation after 4 weekly treatments."
        }
      ]
    },
    {
      id: 7,
      name: "Lactic Acid",
      scientificName: "Alpha Hydroxy Acid (AHA)",
      description: "A gentler AHA that exfoliates while providing mild hydration; good for sensitive or dry skin.",
      detailedDescription: `Lactic Acid is larger in molecular size than glycolic acid, so it works a bit more gently. It exfoliates the skin surface, improving texture and tone, while also acting as a humectant attracting moisture to the upper skin layers.
    
    It is often used in low concentrations for sensitive or dry skin to avoid the irritation that stronger acids can cause. Also helpful in smoothing rough patches and improving dullness with less risk of over‑exfoliation.`,
      image: "/Lactic Acid.webp",
      safetyRating: "good for sensitive types",
      rating: 4.2,
      concentration: "5‑10%",
      frequency: "Evening / 1‑2 times per week",
      skinConcerns: ["dryness", "sensitivity", "uneven tone", "rough texture"],
      category: "chemical exfoliant",
      phLevel: "3.5‑4.5",
      molecularWeight: "90.08 Da",
      solubility: "Water‑soluble",
      stability: "Stable under moderate pH",
      timeOfUse: ["evening"],
      usageInstructions: "Begin with low strength once a week; increase frequency as tolerated. Use gentle cleansers and good moisturizers.",
      benefits: [
        { title: "Gentle exfoliation", description: "Removes dull surface skin with less irritation" },
        { title: "Hydration", description: "Acts also as humectant to attract moisture" },
        { title: "Skin tone improvement", description: "Softens rough patches and brightens dullness" }
      ],
      sideEffects: [
        { title: "Mild tingling", description: "Some stinging initially for sensitive skin" }
      ],
      compatibleWith: [
        { name: "Niacinamide", reason: "Soothes and supports skin barrier" },
        { name: "Hyaluronic Acid", reason: "Moisturizing and hydrating" }
      ],
      incompatibleWith: [
        { name: "Other strong acids (BHAs or high‑strength AHAs)", reason: "Risk of irritation / overexfoliation" }
      ],
      studies: [
        {
          title: "Low‑strength lactic acid for sensitive skin improvement",
          year: "2019",
          journal: "Journal of Cosmetic Science",
          summary: "Demonstrated improved skin smoothness with minimal side effects."
        }
      ]
    },
    {
      id: 8,
      name: "Ceramides",
      scientificName: "Ceramide NP / Other ceramides",
      description: "Lipids that help restore and maintain the skin’s barrier and retain moisture.",
      detailedDescription: `Ceramides are lipid molecules naturally present in the skin’s stratum corneum. They form part of the intercellular matrix that holds skin cells together and prevent transepidermal water loss.
    
    Using ceramide‑rich products helps repair barrier damage, reduce sensitivity, and improve hydration retention. They're especially beneficial after exfoliation, retinol use, or environmental stress, helping skin heal and stay resilient.`,
      image: "/Ceramides.webp",
      safetyRating: "very high",
      rating: 4.8,
      concentration: "1‑5%",
      frequency: "Morning and Evening",
      skinConcerns: ["dryness", "barrier damage", "sensitivity"],
      category: "lipids / barrier repair",
      phLevel: "-- (neutral) approx 5.5‑7.0",
      molecularWeight: "varies",
      solubility: "Oil‑soluble / lipid‑soluble",
      stability: "Generally stable",
      timeOfUse: ["morning", "evening"],
      usageInstructions: "Apply after cleanser, before heavier creams. Especially useful if skin feels tight or looks flaky.",
      benefits: [
        { title: "Barrier repair", description: "Helps restore skin’s lipid structure" },
        { title: "Moisture retention", description: "Prevents water loss through skin" },
        { title: "Sensitivity reduction", description: "Helps reduce irritation and discomfort" }
      ],
      sideEffects: [],
      compatibleWith: [
        { name: "Hyaluronic Acid", reason: "Moisture + barrier support" },
        { name: "Niacinamide", reason: "Soothing and repair synergy" }
      ],
      incompatibleWith: [],
      studies: [
        {
          title: "Ceramide‑rich moisturizers in compromised barrier skin",
          year: "2022",
          journal: "Skin Pharmacology & Physiology",
          summary: "Observed improved transepidermal water retention and reduced irritation in users over 4 weeks."
        }
      ]
    },
    {
      id: 9,
      name: "Peptides (e.g., Palmitoyl Peptide)",
      scientificName: "Oligopeptides / Palmitoyl Peptide",
      description: "Short chains of amino acids that signal skin to produce collagen, improving firmness and reducing wrinkles.",
      detailedDescription: `Peptides are small protein fragments that act as signaling molecules in skin. When applied topically, certain peptides can prompt skin cells to produce more collagen, elastin, and other structural proteins.
    
    Some peptides also help reduce inflammation or antimicrobial defense. They are generally gentle and used for anti‑aging, firmness, and improving skin resilience without the harsh side effects of retinol or strong acids.`,
      image: "/Peptides.webp",
      safetyRating: "high",
      rating: 4.6,
      concentration: "0.5‑2%",
      frequency: "Morning or Evening",
      skinConcerns: ["aging", "loss of firmness", "fine lines", "elasticity"],
      category: "actives / anti‑aging",
      phLevel: "5.0‑7.0",
      molecularWeight: "varies (peptide chains)",
      solubility: "Water‑soluble or mixed solvent",
      stability: "Sensitive to heat / improper storage",
      timeOfUse: ["morning", "evening"],
      usageInstructions: "Use after lighter serums / before heavier creams. Avoid excessive heat exposure in storage.",
      benefits: [
        { title: "Firmness", description: "Helps boost skin elasticity and reduce sagging" },
        { title: "Anti‑wrinkle", description: "Smooths fine lines" },
        { title: "Skin repair", description: "Supports healing and resilience" }
      ],
      sideEffects: [
        { title: "Rare irritation", description: "Possible if formulation includes strong preservatives or fragrances" }
      ],
      compatibleWith: [
        { name: "Niacinamide", reason: "Supports barrier and calms skin" },
        { name: "Ceramides", reason: "Helps heal and reinforce skin structure" }
      ],
      incompatibleWith: [],
      studies: [
        {
          title: "Palmitoyl Peptide in Skin Firmness Improvement",
          year: "2020",
          journal: "Journal of Cosmetic Dermatology",
          summary: "Noted increase in skin elasticity metrics after 8 weeks of use."
        }
      ]
    },
    {
      id: 10,
      name: "Alpha Arbutin",
      scientificName: "Alpha‑Arbutin",
      description: "A skin‑brightening agent that gently inhibits melanin production, reducing dark spots and pigmentation.",
      detailedDescription: `Alpha Arbutin is a glycosylated hydroquinone derivative that inhibits tyrosinase, the enzyme involved in melanin synthesis. Because of its gentle mechanism, it's often preferred over hydroquinone for sensitive skin wanting brightening effects.
    
    It helps fade sun spots, age spots, and hyperpigmentation without as much risk of irritation. Works best with consistent use and should be paired with UV protection to prevent new pigmentation.`,
      image: "/Alpha Arbutin.webp",
      safetyRating: "good",
      rating: 4.4,
      concentration: "1‑2%",
      frequency: "Morning or Evening",
      skinConcerns: ["hyperpigmentation", "dark spots", "uneven tone", "freckles"],
      category: "brightening agent",
      phLevel: "5.0‑7.0",
      molecularWeight: "272.25 Da",
      solubility: "Water‑soluble",
      stability: "Moderately stable",
      timeOfUse: ["morning", "evening"],
      usageInstructions: "Apply to clean skin, avoid combining with strong exfoliants on same routine. Use sunscreen daily.",
      benefits: [
        { title: "Brightening", description: "Reduces appearance of dark spots" },
        { title: "Even tone", description: "Improves overall skin tone uniformity" }
      ],
      sideEffects: [
        { title: "Minimal irritation", description: "Possible in sensitive skin or high concentration" }
      ],
      compatibleWith: [
        { name: "Vitamin C", reason: "Can enhance brightening" },
        { name: "Niacinamide", reason: "Soothing and reduces risk of irritation" }
      ],
      incompatibleWith: [],
      studies: [
        {
          title: "Alpha Arbutin efficacy in melasma",
          year: "2021",
          journal: "Skin Lightening Research Journal",
          summary: "4‑week trial showing visible reduction in melasma patches with 2% alpha arbutin."
        }
      ]
    },
    {
      id: 11,
      name: "Azelaic Acid",
      scientificName: "9‑Oxocyclohexane Carboxylic Acid",
      description: "Multipurpose acid that calms inflammation, fades pigmentation, and treats acne with a gentle profile.",
      detailedDescription: `Azelaic Acid has antibacterial and anti‑inflammatory properties, making it useful for acne and rosacea. It also helps with hyperpigmentation by inhibiting tyrosinase.
    
    Because it is less irritating than many strong acids, it is often tolerated by sensitive skin. It can help lighten dark spots, reduce redness, and prevent breakouts without the peeling often seen with stronger chemical exfoliants.`,
      image: "/Azelaic Acid.webp",
      safetyRating: "good",
      rating: 4.5,
      concentration: "10‑20%",
      frequency: "Evening or as needed",
      skinConcerns: ["acne", "rosacea", "pigmentation", "redness"],
      category: "actives / acid",
      phLevel: "4.0‑5.5",
      molecularWeight: "269.29 Da",
      solubility: "Moderately water‑soluble",
      stability: "Stable in proper formulation",
      timeOfUse: ["evening"],
      usageInstructions: "Apply on clean skin, follow with moisturizer. Patch test if new to acid treatments. Can be used daily depending on tolerance.",
      benefits: [
        { title: "Acne reduction", description: "Kills acne bacteria and reduces breakouts" },
        { title: "Redness calming", description: "Reduces inflammation and rosacea symptoms" },
        { title: "Pigmentation fading", description: "Helps lighten dark spots" }
      ],
      sideEffects: [
        { title: "Dryness or mild peeling", description: "Possible when first using or at higher strengths" },
        { title: "Stinging", description: "May occur especially if used with exfoliants" }
      ],
      compatibleWith: [
        { name: "Ceramides", reason: "Helps restore barrier after acid use" },
        { name: "Niacinamide", reason: "Anti‑inflammatory and soothing" }
      ],
      incompatibleWith: [
        { name: "Strong acids (AHA/BHA)", reason: "May over‑exfoliate / irritate" }
      ],
      studies: [
        {
          title: "Azelaic Acid in Papulopustular Rosacea",
          year: "2020",
          journal: "Dermatology Treatment Journal",
          summary: "Improvement in lesion count and erythema over 12 weeks."
        }
      ]
    },
    {
      id: 12,
      name: "Squalane",
      scientificName: "Hydrogenated Squalene",
      description: "A stable, lightweight oil that mimics skin’s natural oils, deeply moisturizing without greasiness.",
      detailedDescription: `Squalane is derived from squalene (a lipid naturally present in skin) but hydrogenated to improve stability. It’s non‑comedogenic and easily absorbed, leaving skin smooth and protected without clogging pores.
    
    It helps restore lipids, reduce water loss, and soothe dryness and irritation. It is often used in oils, serums, and creams to provide silky texture and deep moisture, especially for dry or compromised skin.`,
      image: "/Squalane.webp",
      safetyRating: "very high",
      rating: 4.8,
      concentration: "up to 10‑20%",
      frequency: "Morning & Evening",
      skinConcerns: ["dryness", "dehydration", "sensitivity", "barrier damage"],
      category: "emollient / oil",
      phLevel: "neutral",
      molecularWeight: "422.73 Da",
      solubility: "Oil‑soluble",
      stability: "Very stable",
      timeOfUse: ["morning", "evening"],
      usageInstructions: "Use as the last step in skincare (before sunscreen in AM). A few drops are enough; massage into skin gently.",
      benefits: [
        { title: "Moisturization", description: "Softens skin and helps retain moisture" },
        { title: "Barrier restoration", description: "Replenishes lipids for healthy barrier" },
        { title: "Non‑comedogenic", description: "Moisture without clogging pores" }
      ],
      sideEffects: [],
      compatibleWith: [
        { name: "Ceramides", reason: "Together strengthen lipid barrier" },
        { name: "Peptides", reason: "Support repair and firmness" }
      ],
      incompatibleWith: [],
      studies: [
        {
          title: "Squalane in Skin Hydration and Barrier Repair",
          year: "2021",
          journal: "International Journal of Dermatological Science",
          summary: "Improved hydration and reduced transepidermal water loss over 4 weeks in dry skin subjects."
        }
      ]
    },
    {
      id: 13,
      name: "SPF (Zinc Oxide)",
      scientificName: "Zinc Oxide",
      description: "A broad‐spectrum physical sunscreen that protects skin from UVA and UVB rays.",
      detailedDescription: `Zinc Oxide is a mineral filter effective against both UVA and UVB radiation. It sits on top of the skin and reflects / scatters UV rays, offering broad‑spectrum protection.
    
    It is often well tolerated, especially by sensitive and acne‑prone skin. Formulations with non‑nano or properly blended zinc oxide are preferred. Regular use prevents hyperpigmentation, sunburn, premature aging, and lowers risk of skin cancer.`,
      image: "/SPF (Zinc Oxide).webp",
      safetyRating: "very high",
      rating: 5.0,
      concentration: "10‑25%",
      frequency: "Every morning",
      skinConcerns: ["photo damage", "aging", "hyperpigmentation", "sun sensitivity"],
      category: "sunscreen / physical filter",
      phLevel: "--",
      molecularWeight: "≈ 81.38 Da",
      solubility: "Insoluble in water (mostly oil suspensions)",
      stability: "Very stable",
      timeOfUse: ["morning"],
      usageInstructions: "Apply generously 15 minutes before sun exposure; reapply every 2 hours when outdoors. Use sufficient amount (about 2 mg/cm²).",
      benefits: [
        { title: "UV protection", description: "Shields skin from harmful UVA/UVB rays" },
        { title: "Prevents photoaging", description: "Reduces risk of wrinkles and sun spots" }
      ],
      sideEffects: [
        { title: "White cast", description: "May leave visible cast on darker skin tones" }
      ],
      compatibleWith: [
        { name: "Antioxidants", reason: "Boosts protection against free radicals" }
      ],
      incompatibleWith: [],
      studies: [
        {
          title: "Zinc Oxide efficacy in broad‐spectrum sunscreens",
          year: "2020",
          journal: "Photodermatology, Photoimmunology & Photomedicine",
          summary: "High SPF sunscreen with zinc oxide protected against UVA1‑3 in in‑vitro modeling."
        }
      ]
    },
    {
      id: 14,
      name: "SPF (Titanium Dioxide)",
      scientificName: "Titanium Dioxide",
      description: "Another physical sunscreen ingredient that reflects UV rays and protects skin from UV damage.",
      detailedDescription: `Titanium Dioxide is used in sunscreens because it reflects or scatters UV light and protects the skin surface. It's particularly effective at UVB and short UVA wavelengths.
    
    Like zinc oxide, it is often used in mineral or hybrid sunscreens. It is generally safe and well tolerated, though formulations with very fine particles may have special processing to avoid inhalation risk (in sprays) and minimize visible cast.`,
      image: "/SPF Titanium Dioxide.webp",
      safetyRating: "very high",
      rating: 4.9,
      concentration: "5‑25%",
      frequency: "Morning",
      skinConcerns: ["photo damage", "sensitive skin", "sun protection"],
      category: "sunscreen / physical filter",
      phLevel: "--",
      molecularWeight: "≈ 79.87 Da",
      solubility: "Insoluble in water (suspended or dispersed)",
      stability: "Highly stable",
      timeOfUse: ["morning"],
      usageInstructions: "Use generously and reapply as needed. Prefer non‑nano versions for safety. Avoid inhalation in spray forms.",
      benefits: [
        { title: "UV protection", description: "Blocks UV rays to prevent sun damage" }
      ],
      sideEffects: [
        { title: "White cast potential", description: "More likely on deeper skin tones or thick application" }
      ],
      compatibleWith: [
        { name: "Antioxidants", reason: "For added protection against free radicals" }
      ],
      incompatibleWith: [],
      studies: [
        {
          title: "Titanium Dioxide as a Physical UV Filter",
          year: "2019",
          journal: "Cosmetic Ingredient Review",
          summary: "Validated effective UV protective properties in various vehicle formulations."
        }
      ]
    },
    {
      id: 15,
      name: "Polyhydroxy Acids (PHAs)",
      scientificName: "Gluconolactone / Lactobionic Acid etc.",
      description: "Gentler exfoliants which work more slowly and less irritatingly than AHAs/BHAs; suitable for sensitive skin.",
      detailedDescription: `Polyhydroxy Acids (PHAs) like gluconolactone and lactobionic acid have larger molecular sizes, leading to slower penetration and milder exfoliation.
    
    They offer benefits of surface exfoliation, hydration, and antioxidant protection. Because of their gentle nature, they are well suited for people who find stronger acids irritating, or as a bridge toward more active exfoliation.`,
      image: "/Polyhydroxy Acids (PHAs).webp",
      safetyRating: "high",
      rating: 4.3,
      concentration: "5‑10%",
      frequency: "Evening / few times per week",
      skinConcerns: ["sensitivity", "dullness", "texture issues", "aging"],
      category: "chemical exfoliant / gentle acids",
      phLevel: "3.5‑5.0",
      molecularWeight: "varies (≈ 300‑400 Da for lactobionic acid etc.)",
      solubility: "Water‑soluble",
      stability: "Stable under moderate pH",
      timeOfUse: ["evening"],
      usageInstructions: "Use in place of stronger acids or alternate. Follow with hydration and sunscreen. Avoid combining too many exfoliants in one routine.",
      benefits: [
        { title: "Gentle exfoliation", description: "Smooths skin without strong irritation" },
        { title: "Hydration", description: "Attracts moisture and helps skin retain water" },
        { title: "Antioxidant", description: "Some PHAs also scavenge free radicals" }
      ],
      sideEffects: [
        { title: "Mild tingling", description: "Possible in sensitive skin" }
      ],
      compatibleWith: [
        { name: "Ceramides", reason: "Support barrier while exfoliating" },
        { name: "Hyaluronic Acid", reason: "Hydration" }
      ],
      incompatibleWith: [
        { name: "Strong AHAs/BHAs used same night", reason: "Potential for over‑exfoliation" }
      ],
      studies: [
        {
          title: "Lactobionic Acid in Sensitive Skin Users",
          year: "2021",
          journal: "Journal of Clinical Cosmetic Research",
          summary: "Reduced roughness and increased hydration in sensitive skin subjects over 6 weeks."
        }
      ]
    },
    {
      id: 16,
      name: "Rosehip Oil",
      scientificName: "Rosa Canina Seed Oil",
      description: "A rich source of essential fatty acids and antioxidants; helps with nourishment, healing, and brightening.",
      detailedDescription: `Rosehip Oil is cold‑pressed from rosehip fruit; it's rich in linoleic acid, linolenic acid, and vitamin A precursors. These help nourish dry or mature skin, improve elasticity, and reduce appearance of scars.
    
    Also contains antioxidants that protect against environmental damage. Light oils such as rosehip are often absorbed quite well and leave skin soft. Useful in PM routines as part of facial oils or blends.`,
      image: "/Rosehip Oil.webp",
      safetyRating: "good",
      rating: 4.4,
      concentration: "5‑15%",
      frequency: "Evening",
      skinConcerns: ["scarring", "dryness", "aging", "uneven tone"],
      category: "oil / botanical",
      phLevel: "neutral",
      molecularWeight: "varies",
      solubility: "Oil‑soluble",
      stability: "Light and heat sensitive",
      timeOfUse: ["evening"],
      usageInstructions: "Use after serums, before heavier creams or as the last step. Store in cool, dark place. Use a few drops.",
      benefits: [
        { title: "Scar fading", description: "Helps reduce appearance of scars and stretch marks" },
        { title: "Nourishment", description: "Delivers essential fatty acids to support skin" },
        { title: "Brightening", description: "Includes pro‑vitamin A and helps improve tone" }
      ],
      sideEffects: [
        { title: "Possible purging", description: "Vitamin A content may trigger mild breakout initially" },
        { title: "Oxidation", description: "Oil can go rancid if not stored properly" }
      ],
      compatibleWith: [
        { name: "Ceramides", reason: "Helps reinforce barrier" },
        { name: "Peptides", reason: "Synergistic repair" }
      ],
      incompatibleWith: [],
      studies: [
        {
          title: "Rosehip Oil in Scar Improvement",
          year: "2022",
          journal: "Journal of Natural Products in Dermatology",
          summary: "Visible lightening of post‑acne scars over 8 weeks."
        }
      ]
    },
    {
      id: 17,
      name: "Bakuchiol",
      scientificName: "Psoralea Corylifolia Extract",
      description: "A plant‑based alternative to retinol, offering similar benefits with lower irritation risk.",
      detailedDescription: `Bakuchiol is an extract from the seeds and leaves of the Psoralea Corylifolia plant. It has been shown in studies to provide retinol‑like effects on skin, promoting collagen production, reducing fine lines, and improving skin texture, without many of the side effects (peeling, irritation) associated with retinol.
    
    Because it is gentler, it's a good option for those who want anti‑aging benefits but have sensitive skin or cannot tolerate retinoids. It can also be used during pregnancy (though always advisable to consult care professionals).`,
      image: "/Bakuchiol.webp",
      safetyRating: "good",
      rating: 4.3,
      concentration: "0.5‑1%",
      frequency: "Evening",
      skinConcerns: ["aging", "sensitivity", "texture", "fine lines"],
      category: "botanical / retinol alternative",
      phLevel: "5.5‑6.5",
      molecularWeight: "varies",
      solubility: "Oil‑soluble / mixed solvents",
      stability: "Moderately stable",
      timeOfUse: ["evening"],
      usageInstructions: "Can be used like retinol but start slowly (2‑3 times a week). Use sunscreen daily. Monitor tolerance.",
      benefits: [
        { title: "Anti‑aging", description: "Reduces fine lines and improves collagen" },
        { title: "Gentler alternative", description: "Less irritation than retinoids" }
      ],
      sideEffects: [
        { title: "Mild irritation", description: "Possible early when skin is unaccustomed" }
      ],
      compatibleWith: [
        { name: "Hyaluronic Acid", reason: "To reduce dryness" },
        { name: "Ceramides", reason: "Barrier support" }
      ],
      incompatibleWith: [],
      studies: [
        {
          title: "Bakuchiol vs Retinol Comparative Study",
          year: "2020",
          journal: "British Journal of Dermatology",
          summary: "Found similar improvements in wrinkles over 12 weeks with lower irritation for bakuchiol."
        }
      ]
    },
    {
      id: 18,
      name: "Centella Asiatica (Madecassoside)",
      scientificName: "Centella Asiatica Extract / Madecassoside",
      description: "A soothing botanical that calms inflammation, supports healing, and improves barrier function.",
      detailedDescription: `Centella Asiatica is a plant used traditionally for wound healing and skin soothing. The component madecassoside has anti‑inflammatory, antioxidant, and collagen‑stimulating effects.
    
    It helps reduce redness, accelerate healing, and is often included in products targeted at sensitive, irritated, or compromised skin. Also helps with moisture retention and strengthening barrier integrity.`,
      image: "/Centella Asiatica (Madecassoside).webp",
      safetyRating: "very high",
      rating: 4.7,
      concentration: "0.5‑2%",
      frequency: "Morning & Evening",
      skinConcerns: ["sensitivity", "redness", "barrier damage", "acne"],
      category: "botanical / soothing",
      phLevel: "5.0‑6.5",
      molecularWeight: "varying",
      solubility: "Water‑soluble or mixed",
      stability: "Moderate",
      timeOfUse: ["morning", "evening"],
      usageInstructions: "Apply after actives or exfoliants or as a soothing serum. Can be layered under moisturizer.",
      benefits: [
        { title: "Soothing", description: "Calms inflammation and irritation" },
        { title: "Barrier repair", description: "Helps skin heal and strengthen" },
        { title: "Antioxidant", description: "Protects from oxidative stress" }
      ],
      sideEffects: [],
      compatibleWith: [
        { name: "Hyaluronic Acid", reason: "Enhanced hydration" },
        { name: "Ceramides", reason: "Supports barrier" }
      ],
      incompatibleWith: [],
      studies: [
        {
          title: "Madecassoside effect on skin irritation",
          year: "2021",
          journal: "Journal of Ethnopharmacology",
          summary: "Significantly reduced irritation and transepidermal water loss in compromised skin."
        }
      ]
    },
    {
      id: 19,
      name: "Green Tea Extract",
      scientificName: "Camellia Sinensis Leaf Extract",
      description: "An antioxidant and anti‑inflammatory botanical that protects skin from environmental damage and calms irritation.",
      detailedDescription: `Green Tea Extract contains polyphenols such as EGCG which act as powerful antioxidants. They neutralize free radicals, reduce oxidative stress, and help prevent collagen breakdown.
    
    It has anti‑inflammatory effects, useful for calming redness, sensitivity, or acne. Also helps with UV protection (as supplementary protection) and soothes irritated skin.`,
      image: "/Green Tea Extract.webp",
      safetyRating: "very high",
      rating: 4.6,
      concentration: "1‑5%",
      frequency: "Morning & Evening",
      skinConcerns: ["oxidative stress", "redness", "acne", "anti‑aging"],
      category: "antioxidant / botanical",
      phLevel: "5.0‑7.0",
      molecularWeight: "varies",
      solubility: "Water‑soluble",
      stability: "Moderate (can degrade with heat/light)",
      timeOfUse: ["morning", "evening"],
      usageInstructions: "Include in antioxidant serums. Store in cool, dark place. Can be used under sunscreen in AM.",
      benefits: [
        { title: "Antioxidant protection", description: "Fights free radicals" },
        { title: "Calming", description: "Reduces inflammation and redness" }
      ],
      sideEffects: [],
      compatibleWith: [
        { name: "Vitamin C", reason: "Boosts antioxidant effect" },
        { name: "Niacinamide", reason: "Soothing synergy" }
      ],
      incompatibleWith: [],
      studies: [
        {
          title: "EGCG and UV damage mitigation",
          year: "2020",
          journal: "Photochemistry & Photobiology",
          summary: "Found reduced skin cell damage in participants with topical green tea application."
        }
      ]
    },
    {
      id: 20,
      name: "Shea Butter",
      scientificName: "Butyrospermum Parkii Butter",
      description: "A rich emollient that deeply moisturizes, softens skin, and supports the lipid barrier.",
      detailedDescription: `Shea Butter is extracted from the nuts of the shea tree and is rich in fatty acids (oleic, stearic, linoleic acids) and vitamins. It forms a protective layer on the skin surface, locking in moisture and preventing dryness.
    
    Because of its richness, it is especially beneficial for dry or cracked skin. However, for oily or acne‑prone skin, lighter moisturizers are often preferred or shea butter used sparingly.`,
      image: "/Shea Butter.webp",
      safetyRating: "high",
      rating: 4.5,
      concentration: "5‑20%",
      frequency: "Morning & Evening as needed",
      skinConcerns: ["dryness", "roughness", "barrier damage"],
      category: "emollient / butter",
      phLevel: "neutral",
      molecularWeight: "large, complex",
      solubility: "Oil‑soluble",
      stability: "Stable, but may spoil if not stored well",
      timeOfUse: ["morning", "evening"],
      usageInstructions: "Use as the final moisturizing step. Warm between fingers, apply to damp skin for better absorption.",
      benefits: [
        { title: "Deep moisturization", description: "Softens and nourishes dry, flaky skin" },
        { title: "Barrier support", description: "Helps seal moisture and protect skin" }
      ],
      sideEffects: [
        { title: "Possible clogging", description: "If skin is very acne‑prone, heavy emollients may contribute to breakouts" }
      ],
      compatibleWith: [
        { name: "Ceramides", reason: "Enhances barrier repair" },
        { name: "Hyaluronic Acid", reason: "Hydrate then seal" }
      ],
      incompatibleWith: [],
      studies: [
        {
          title: "Shea Butter in Lip and Facial Skin Hydration",
          year: "2019",
          journal: "International Journal of Cosmetic Science",
          summary: "Improved skin softness and moisture retention in dry skin over 4 weeks."
        }
      ]
    },
    {
      id: 21,
      name: "Panthenol (Provitamin B5)",
      scientificName: "Pantothenic Acid / Panthenol",
      description: "A humectant and soothing agent that helps retain moisture and aid in skin repair.",
      detailedDescription: `Panthenol (or Provitamin B5) is converted in skin to pantothenic acid. It attracts and retains moisture, helps improve barrier function, and accelerates healing of minor irritations or wounds.
    
    It also has mild anti‑inflammatory effects, reducing itchiness and redness. Useful in moisturizers, toners, serums, especially for sensitive, dry, or compromised skin.`,
      image: "/Panthenol (Provitamin B5).webp",
      safetyRating: "very high",
      rating: 4.8,
      concentration: "0.5‑5%",
      frequency: "Morning & Evening",
      skinConcerns: ["irritation", "dryness", "sensitivity", "barrier damage"],
      category: "humectant / repair",
      phLevel: "5.0‑7.0",
      molecularWeight: "205.25 Da",
      solubility: "Water‑soluble",
      stability: "Stable",
      timeOfUse: ["morning", "evening"],
      usageInstructions: "Can be applied after cleansing or exfoliation. Works well under heavier creams or oils.",
      benefits: [
        { title: "Hydration", description: "Draws moisture into skin" },
        { title: "Soothing", description: "Alleviates irritation and redness" },
        { title: "Healing", description: "Supports minor damage repair" }
      ],
      sideEffects: [],
      compatibleWith: [
        { name: "Ceramides", reason: "Barrier healing synergy" },
        { name: "Squalane", reason: "Moisture + emollient combo" }
      ],
      incompatibleWith: [],
      studies: [
        {
          title: "Panthenol effects on wound healing in skin",
          year: "2020",
          journal: "Journal of Dermatological Science",
          summary: "Showed faster recovery of barrier function in treated areas."
        }
      ]
    },
    {
      id: 22,
      name: "Licorice Root Extract",
      scientificName: "Glycyrrhiza Glabra Root Extract",
      description: "A botanical brightening and soothing ingredient helpful for pigmentation and irritation.",
      detailedDescription: `Licorice Root Extract contains glabridin, which inhibits tyrosinase without acting as a skin irritant. It also has anti‑inflammatory properties helpful in calming redness and irritation.
    
    Often used in formulations targeting dark spots, uneven tone, and sensitive skin. Can help reduce visible irritation after sun exposure or harsh treatments.`,
      image: "/Licorice Root Extract.webp",
      safetyRating: "good",
      rating: 4.4,
      concentration: "0.5‑2%",
      frequency: "Morning & Evening",
      skinConcerns: ["hyperpigmentation", "redness", "sensitivity"],
      category: "botanical / brightening / soothing",
      phLevel: "5.0‑7.0",
      molecularWeight: "≈ 340 Da",
      solubility: "Water‑soluble",
      stability: "Moderate under light and heat",
      timeOfUse: ["morning", "evening"],
      usageInstructions: "Use after hydrating serums; avoid pairing with many strong actives on same night. Use sunscreen daily.",
      benefits: [
        { title: "Brightening", description: "Helps fade dark spots and even skin tone" },
        { title: "Soothing", description: "Reduces irritation and inflammation" }
      ],
      sideEffects: [],
      compatibleWith: [
        { name: "Niacinamide", reason: "Enhances brightening while calming" },
        { name: "Hyaluronic Acid", reason: "Hydration" }
      ],
      incompatibleWith: [],
      studies: [
        {
          title: "Licorice Extract in Melasma Treatment",
          year: "2022",
          journal: "Dermatology Review",
          summary: "Reduced pigmentation in melasma after 8 weeks with licorice root extract."
        }
      ]
    },
    {
      id: 23,
      name: "Coenzyme Q10 (Ubiquinone)",
      scientificName: "Ubiquinone",
      description: "A powerful antioxidant that protects skin from oxidative stress and supports energy production in skin cells.",
      detailedDescription: `Coenzyme Q10, or ubiquinone, is naturally present in skin mitochondria and plays a role in energy generation. Topically, it helps neutralize free radicals, reduce oxidative damage, and protect lipids and proteins in skin cells.
    
    It may help reduce appearance of wrinkles and sagging, as oxidative stress is a major contributor to skin aging. Also often formulated with other antioxidants to bolster protection.`,
      image: "/Coenzyme Q10 (Ubiquinone).webp",
      safetyRating: "good",
      rating: 4.3,
      concentration: "0.5‑1%",
      frequency: "Morning & Evening",
      skinConcerns: ["oxidative stress", "aging", "UV damage", "dullness"],
      category: "antioxidant",
      phLevel: "≈ 4.5‑7.0",
      molecularWeight: "863.36 Da",
      solubility: "Fat‑soluble",
      stability: "Sensitive to light and oxidation",
      timeOfUse: ["morning", "evening"],
      usageInstructions: "Include in antioxidant serums or creams; store properly. Pair with sunscreens in the morning.",
      benefits: [
        { title: "Antioxidant protection", description: "Neutralizes free radicals" },
        { title: "Anti‑aging", description: "Helps reduce lines and skin damage" }
      ],
      sideEffects: [],
      compatibleWith: [
        { name: "Vitamin E", reason: "Synergistic antioxidant effect" },
        { name: "Sunscreen", reason: "Protection from UV" }
      ],
      incompatibleWith: [],
      studies: [
        {
          title: "CoQ10 effects on UV‑induced oxidative skin damage",
          year: "2021",
          journal: "Skin Research & Technology",
          summary: "Reduced markers of oxidative stress in human skin model."
        }
      ]
    },
    {
      id: 24,
      name: "Clay (Kaolin)",
      scientificName: "Kaolin Clay",
      description: "A gentle absorbent clay that helps draw out impurities and excess oil without overly drying the skin.",
      detailedDescription: `Kaolin is a mild clay used in face masks and cleansers. It absorbs oil, dirt, and sebum from pores while being less abrasive or drying than some stronger clays.
    
    Useful for oily or combination skin types, when used occasionally to detox or clarify. Also helps in refining texture when skin feels congested.`,
      image: "/Clay (Kaolin).webp",
      safetyRating: "high",
      rating: 4.2,
      concentration: "10‑30%",
      frequency: "1‑2 times per week",
      skinConcerns: ["oiliness", "clogged pores", "dullness"],
      category: "mask / absorbent",
      phLevel: "-- (neutral) approx 6‑7",
      molecularWeight: "varies",
      solubility: "Insoluble (suspension or paste)",
      stability: "Stable",
      timeOfUse: ["evening"],
      usageInstructions: "Use as mask; apply to damp skin, leave 10‑15 minutes, then rinse. Follow with moisturizer.",
      benefits: [
        { title: "Oil control", description: "Absorbs excess sebum" },
        { title: "Pore cleansing", description: "Helps draw out impurities and unclog pores" },
        { title: "Texture refinement", description: "Smooths rough or bumpy skin" }
      ],
      sideEffects: [
        { title: "Dryness", description: "May dry out skin if overused" }
      ],
      compatibleWith: [
        { name: "Hydrator after mask", reason: "Rehydrate skin" }
      ],
      incompatibleWith: [],
      studies: [
        {
          title: "Kaolin mask use in oily skin",
          year: "2018",
          journal: "Journal of Cosmetic Science",
          summary: "Found reduction in shine and sebum production after regular use."
        }
      ]
    },
    {
      id: 25,
      name: "Tea Tree Oil",
      scientificName: "Melaleuca Alternifolia Oil",
      description: "A botanical with strong antimicrobial and anti‑inflammatory properties useful for acne‑prone skin.",
      detailedDescription: `Tea Tree Oil contains terpinen‑4‑ol among its active components, which have proven antimicrobial and anti‑inflammatory activity. It helps kill acne bacteria (Propionibacterium acnes), reduce swelling, and soothe inflamed acne lesions.
    
    Used in spot treatments or diluted in carrier oils; pure oil can cause irritation and allergic reactions if overused or applied undiluted.`,
      image: "/Tea Tree Oil.webp",
      safetyRating: "moderate",
      rating: 4.1,
      concentration: "0.5‑5% (for skin use)",
      frequency: "Spot / as needed",
      skinConcerns: ["acne", "inflammation", "oily skin"],
      category: "essential oil / botanical",
      phLevel: "--",
      molecularWeight: ")—complex mix",
      solubility: "Oil‑soluble / volatile",
      stability: "Light and heat sensitive",
      timeOfUse: ["evening or spot use"],
      usageInstructions: "Dilute properly. Apply to affected areas. Avoid sensitive or broken skin. Patch test first.",
      benefits: [
        { title: "Antibacterial", description: "Helps kill acne bacteria" },
        { title: "Inflammation reduction", description: "Reduces redness and swelling" }
      ],
      sideEffects: [
        { title: "Allergic reaction", description: "Possible for some skin types" },
        { title: "Drying", description: "Can dry out surrounding skin if overused" }
      ],
      compatibleWith: [
        { name: "Hydrators", reason: "Counteracts dryness" }
      ],
      incompatibleWith: [],
      studies: [
        {
          title: "Tea Tree Oil vs Benzoyl Peroxide in Acne",
          year: "2017",
          journal: "Phytotherapy Research",
          summary: "Showed comparable reduction in acne lesions over 3 months with fewer side effects for tea tree oil."
        }
      ]
    },
    {
      id: 26,
      name: "Niacin",
      scientificName: "Niacin / Nicotinic Acid",
      description: "Different from niacinamide; helps improve circulation and brightens skin when used appropriately.",
      detailedDescription: `Niacin (nicotinic acid) when applied topically can improve microcirculation in skin, leading to a flushed glow initially, and over time brighter, more even skin tone. It is more irritating than niacinamide, so used in lower doses.
    
    Helpful in addressing dullness, mild discoloration, and overall radiance. Often found in formulations targeting tone and radiance rather than strong actives.`,
      image: "/Niacin.webp",
      safetyRating: "low to moderate",
      rating: 3.8,
      concentration: "0.1‑1%",
      frequency: "Evening / occasional",
      skinConcerns: ["dullness", "uneven tone", "circulation", "aging"],
      category: "vitamin",
      phLevel: "5.0‑6.0",
      molecularWeight: "123.11 Da",
      solubility: "Water‑soluble",
      stability: "Moderate",
      timeOfUse: ["evening"],
      usageInstructions: "Use in small percentages and look for flushing sensitivity. Can alternate nights. Follow with soothing agents.",
      benefits: [
        { title: "Brightening", description: "Helps with dullness and general radiance" }
      ],
      sideEffects: [
        { title: "Flushing", description: "Temporary redness or warmth after application" }
      ],
      compatibleWith: [
        { name: "Soothing botanicals", reason: "Reduced irritation" }
      ],
      incompatibleWith: [],
      studies: [
        {
          title: "Topical niacin in skin radiance",
          year: "2018",
          journal: "Dermatology Science & Practice",
          summary: "Increased glow and improved skin tone after 4 weeks, though some participants had mild discomfort."
        }
      ]
    },
    {
      id: 27,
      name: "Ferulic Acid",
      scientificName: "Ferulic Acid",
      description: "A plant‑based antioxidant that stabilizes other antioxidants and enhances their effects, especially vitamin C and E.",
      detailedDescription: `Ferulic Acid is found in plant cell walls, notably in oats, rice bran, and certain fruits. It not only neutralizes free radicals itself but also stabilizes other antioxidants like vitamins C and E, boosting their efficacy.
    
    When combined (e.g., in serums) it increases photoprotection and reduces photoaging. It also helps fade dark spots and supports skin that has been exposed to UV or environmental stressors.`,
      image: "/Ferulic Acid.webp",
      safetyRating: "good",
      rating: 4.5,
      concentration: "0.5‑1%",
      frequency: "Morning",
      skinConcerns: ["oxidative stress", "photoaging", "pigmentation"],
      category: "antioxidant",
      phLevel: "≈ 3.5‑6.0",
      molecularWeight: "194.18 Da",
      solubility: "Water‑soluble",
      stability: "Sensitive, especially to light",
      timeOfUse: ["morning"],
      usageInstructions: "Often paired with vitamin C and E. Store in dark, airtight containers. Use daily in morning under sunscreen.",
      benefits: [
        { title: "Free radical protection", description: "Helps prevent environmental damage to skin" },
        { title: "Boosts other antioxidants", description: "Synergistic effect" }
      ],
      sideEffects: [],
      compatibleWith: [
        { name: "Vitamin C", reason: "Enhances its stability and effect" },
        { name: "Vitamin E", reason: "Synergy for antioxidant action" }
      ],
      incompatibleWith: [],
      studies: [
        {
          title: "Ferulic Acid enhances photoprotection with vitamins C and E",
          year: "2019",
          journal: "Journal of Photochemistry & Photobiology",
          summary: "Found increased protection against UV‑induced damage in human skin models."
        }
      ]
    },
    {
      id: 28,
      name: "Centella Asiatica (Asiatic Acid)",
      scientificName: "Asiatic Acid",
      description: "A triterpenoid from Centella that encourages collagen synthesis and improves skin elasticity.",
      detailedDescription: `Asiatic Acid is one of the active constituents of Centella Asiatica. It boosts collagen and glycosaminoglycan production, aiding in wound healing, skin repair, and elasticity improvement.
    
    It also has antioxidant effects and helps with inflammation. Useful in aging skincare, especially when the goal is firmness and regenerative support.`,
      image: "/Centella Asiatica (Asiatic Acid).webp",
      safetyRating: "high",
      rating: 4.4,
      concentration: "0.5‑1%",
      frequency: "Evening / Alternating Days",
      skinConcerns: ["loss of elasticity", "aging", "scarring", "sagging"],
      category: "botanical / regenerative",
      phLevel: "≈ 5.0‑6.5",
      molecularWeight: "≈ 488 Da",
      solubility: "Moderately soluble in mixed solvents",
      stability: "Moderate",
      timeOfUse: ["evening"],
      usageInstructions: "Use in creams or serums. Pair with moisturizers and sunscreens. Avoid using with many strong actives same night.",
      benefits: [
        { title: "Firmness", description: "Boosts collagen and elasticity" },
        { title: "Skin repair", description: "Aids healing and regeneration" }
      ],
      sideEffects: [],
      compatibleWith: [
        { name: "Peptides", reason: "Supports regenerative processes" },
        { name: "Ceramides", reason: "Helps repair barrier" }
      ],
      incompatibleWith: [],
      studies: [
        {
          title: "Asiatic Acid in skin elasticity improvement",
          year: "2021",
          journal: "Phytomedicine",
          summary: "Showed increased firmness in aging skin after 8 weeks of use."
        }
      ]
    },
    {
      id: 29,
      name: "Allantoin",
      scientificName: "Allantoin",
      description: "A soothing, skin‑repairing ingredient that helps heal and calm irritated skin.",
      detailedDescription: `Allantoin is a compound often derived from the comfrey plant or synthetically produced. It has keratolytic and soothing properties, helping to gently remove dead skin, promote healing, and reduce irritation. It supports the skin’s natural recovery mechanisms.
    
    Particularly helpful after retinol, acids, or other irritants, and in products for sensitive skin. Helps leave skin feeling smoother and less inflamed.`,
      image: "/Allantoin.webp",
      safetyRating: "very high",
      rating: 4.8,
      concentration: "0.5‑2%",
      frequency: "Morning & Evening",
      skinConcerns: ["irritation", "dryness", "sensitivity", "post‑treatment recovery"],
      category: "soothing / repair",
      phLevel: "5.0‑7.0",
      molecularWeight: "158.12 Da",
      solubility: "Water‑soluble",
      stability: "Stable",
      timeOfUse: ["morning", "evening"],
      usageInstructions: "Use after actives or exfoliation. Include in moisturizer or serums to soothe skin.",
      benefits: [
        { title: "Soothing", description: "Relieves irritation and redness" },
        { title: "Healing", description: "Promotes recovery of damage and micro‑injuries" },
        { title: "Skin smoothing", description: "Gentle exfoliation of dead skin" }
      ],
      sideEffects: [],
      compatibleWith: [
        { name: "Ceramides", reason: "Barrier support + healing" },
        { name: "Hyaluronic Acid", reason: "Hydration" }
      ],
      incompatibleWith: [],
      studies: [
        {
          title: "Allantoin in skin recovery post chemical peel",
          year: "2022",
          journal: "Journal of Cosmetic Dermatology",
          summary: "Faster healing and reduced discomfort in treated sites."
        }
      ]
    },
    {
      id: 30,
      name: "Mandelic Acid",
      scientificName: "Alpha Hydroxy Acid (Mandelic Acid)",
      description: "A mild AHA derived from almonds; exfoliates more gently than glycolic acid, good for sensitive or darker skin.",
      detailedDescription: `Mandelic Acid has a larger molecular size than glycolic acid, so it penetrates more slowly and is less likely to irritate. It gently exfoliates the surface, improving tone and texture with a lower risk of photosensitivity or inflammation.
    
    It’s particularly suitable for sensitive skin or skin prone to post‑inflammatory hyperpigmentation. Over time it can fade dark spots, improve skin smoothness, and reduce congestion.`,
      image: "/Mandelic Acid.webp",
      safetyRating: "good",
      rating: 4.3,
      concentration: "5‑10%",
      frequency: "Evening / 1‑2 times per week",
      skinConcerns: ["hyperpigmentation", "sensitivity", "uneven texture", "age spots"],
      category: "chemical exfoliant / gentle acid",
      phLevel: "3.5‑4.5",
      molecularWeight: "152.15 Da",
      solubility: "Water‑soluble",
      stability: "Moderate",
      timeOfUse: ["evening"],
      usageInstructions: "Begin with low frequency (once a week), then increase as tolerated. Always pair with moisturizer and sunscreen.",
      benefits: [
        { title: "Brightening", description: "Helps fade dark spots" },
        { title: "Texture smoothing", description: "Smooths rough or bumpy skin" }
      ],
      sideEffects: [
        { title: "Mild tingling or peeling", description: "Possible on first uses" }
      ],
      compatibleWith: [
        { name: "Niacinamide", reason: "Soothing AND improves tone" },
        { name: "Ceramides", reason: "Barrier support" }
      ],
      incompatibleWith: [
        { name: "Strong AHAs/BHAs combination same night", reason: "Over‑exfoliation risk" }
      ],
      studies: [
        {
          title: "Mandelic Acid in Post‑Inflammatory Hyperpigmentation",
          year: "2021",
          journal: "Dermatologic Therapy",
          summary: "Significant fading of PIH in darker skin types after 6 weeks."
        }
      ]
    }
  ];
  
  // Mock search suggestions
  const mockSuggestions = [
    { name: "Retinol", type: "ingredient", description: "Anti-aging vitamin A derivative", matchCount: 1 },
    { name: "Acne", type: "concern", description: "Breakouts and blemishes", matchCount: 3 },
    { name: "Anti-aging", type: "benefit", description: "Reduces signs of aging", matchCount: 4 },
    { name: "Active Ingredients", type: "category", description: "Potent treatment ingredients", matchCount: 6 },
    { name: "Niacinamide", type: "ingredient", description: "Versatile vitamin B3", matchCount: 1 },
    { name: "Hyperpigmentation", type: "concern", description: "Dark spots and uneven tone", matchCount: 4 }
  ];

  useEffect(() => {
    // Initialize with all ingredients
    setFilteredIngredients(mockIngredients);
  }, []);

  useEffect(() => {
    // Filter ingredients based on search and filters
    let filtered = mockIngredients;

    // Apply search filter
    if (searchQuery) {
      filtered = filtered?.filter(ingredient =>
        ingredient?.name?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
        ingredient?.description?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
        ingredient?.skinConcerns?.some(concern => 
          concern?.toLowerCase()?.includes(searchQuery?.toLowerCase())
        )
      );
    }

    // Apply category filter
    if (activeFilters?.category) {
      filtered = filtered?.filter(ingredient => 
        ingredient?.category === activeFilters?.category
      );
    }

    // Apply safety rating filter
    if (activeFilters?.safetyRating) {
      filtered = filtered?.filter(ingredient => 
        ingredient?.safetyRating === activeFilters?.safetyRating
      );
    }

    // Apply skin concerns filter
    if (activeFilters?.skinConcerns && activeFilters?.skinConcerns?.length > 0) {
      filtered = filtered?.filter(ingredient =>
        activeFilters?.skinConcerns?.some(concern =>
          ingredient?.skinConcerns?.includes(concern)
        )
      );
    }

    // Apply special filters
    if (activeFilters?.specialFilters) {
      const specialFilters = activeFilters?.specialFilters;
      if (specialFilters?.pregnancySafe) {
        filtered = filtered?.filter(ingredient => 
          !['retinol', 'salicylic acid']?.includes(ingredient?.name?.toLowerCase())
        );
      }
      if (specialFilters?.fraganceFree) {
        // Mock filter - in real app would check ingredient list
        filtered = filtered?.filter(ingredient => ingredient?.id !== 999);
      }
    }

    setFilteredIngredients(filtered);
  }, [searchQuery, activeFilters]);

  const handleSearch = (query) => {
    setSearchQuery(query);
    // Generate search suggestions based on query
    if (query) {
      const suggestions = mockSuggestions?.filter(suggestion =>
        suggestion?.name?.toLowerCase()?.includes(query?.toLowerCase())
      );
      setSearchSuggestions(suggestions);
    } else {
      setSearchSuggestions([]);
    }
  };

  const handleSuggestionSelect = (suggestion) => {
    setSearchQuery(suggestion?.name);
    setSearchSuggestions([]);
  };

  const handleFiltersChange = (newFilters) => {
    setActiveFilters(newFilters);
  };

  const handleClearFilters = () => {
    setActiveFilters({});
    setSearchQuery('');
  };

  const handleViewDetails = (ingredient) => {
    setSelectedIngredient(ingredient);
    setIsDetailModalOpen(true);
  };

  const handleBookmark = (ingredientId) => {
    setBookmarkedIngredients(prev => 
      prev?.includes(ingredientId)
        ? prev?.filter(id => id !== ingredientId)
        : [...prev, ingredientId]
    );
  };

  const handleCheckCompatibility = (ingredient) => {
    setSelectedIngredient(ingredient);
    setIsCompatibilityCheckerOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Ingredient Education Hub - SkinScore Analyzer</title>
        <meta name="description" content="Comprehensive skincare ingredient database with safety information, compatibility checker, and educational content." />
      </Helmet>
      <Header />
      <QuickAccessToolbar />
      <main className="pt-2">
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Page Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-heading font-heading-bold text-3xl text-foreground mb-2">
                Ingredient Education Hub
              </h1>
              <p className="font-body font-body-normal text-lg text-muted-foreground">
                Discover, learn, and understand skincare ingredients with our comprehensive database
              </p>
            </div>
            <SectionContextMenu />
          </div>

        
          {/* Main Content Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Filters Sidebar */}
            <div className="lg:col-span-1">
              <IngredientFilters
                onFiltersChange={handleFiltersChange}
                activeFilters={activeFilters}
                onClearFilters={handleClearFilters}
                className="sticky top-32"
              />
            </div>

            {/* Ingredients Grid */}
            <div className="lg:col-span-3">
              {/* View Controls */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <span className="font-body font-body-medium text-sm text-foreground">
                    {filteredIngredients?.length} ingredients found
                  </span>
                  {searchQuery && (
                    <span className="font-body font-body-normal text-sm text-muted-foreground">
                      for "{searchQuery}"
                    </span>
                  )}
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                    iconName="Grid3X3"
                    iconSize={16}
                  >
                    <span className="sr-only">Grid view</span>
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                    iconName="List"
                    iconSize={16}
                  >
                    <span className="sr-only">List view</span>
                  </Button>
                </div>
              </div>

              {/* Ingredients Display */}
              {filteredIngredients?.length > 0 ? (
                <div className={`${viewMode === 'grid' ?'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6' :'space-y-4'}`}>
                  {filteredIngredients?.map((ingredient) => (
                    <IngredientCard
                      key={ingredient?.id}
                      ingredient={ingredient}
                      onViewDetails={handleViewDetails}
                      onBookmark={handleBookmark}
                      onCheckCompatibility={handleCheckCompatibility}
                      isBookmarked={bookmarkedIngredients?.includes(ingredient?.id)}
                      viewMode={viewMode}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Icon name="Search" size={48} className="text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-heading font-heading-semibold text-lg text-foreground mb-2">
                    No ingredients found
                  </h3>
                  <p className="font-body font-body-normal text-muted-foreground mb-4">
                    Try adjusting your search terms or filters
                  </p>
                  <Button variant="outline" onClick={handleClearFilters}>
                    Clear all filters
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Educational Content Section */}
          <div className="mt-16">
            <EducationalContent />
          </div>

          {/* Quick Actions */}
          <div className="mt-12 bg-card border border-border rounded-clinical p-6">
            <h2 className="font-heading font-heading-semibold text-xl text-card-foreground mb-4">
              Quick Actions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button
                variant="outline"
                onClick={() => setIsCompatibilityCheckerOpen(true)}
                iconName="GitCompare"
                iconPosition="left"
                iconSize={16}
                className="justify-start"
              >
                Check Ingredient Compatibility
              </Button>
              <Button
                variant="outline"
                iconName="Bookmark"
                iconPosition="left"
                iconSize={16}
                className="justify-start"
              >
                View Bookmarked Ingredients ({bookmarkedIngredients?.length})
              </Button>
              <Button
                variant="outline"
                iconName="Download"
                iconPosition="left"
                iconSize={16}
                className="justify-start"
              >
                Download Ingredient Guide
              </Button>
            </div>
          </div>
        </div>
      </main>
      {/* Modals */}
      <IngredientDetailModal
        ingredient={selectedIngredient}
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        onBookmark={handleBookmark}
        isBookmarked={selectedIngredient && bookmarkedIngredients?.includes(selectedIngredient?.id)}
      />
      <CompatibilityChecker
        isOpen={isCompatibilityCheckerOpen}
        onClose={() => setIsCompatibilityCheckerOpen(false)}
        selectedIngredient={selectedIngredient}
      />
    </div>
  );
};

export default IngredientEducationHub;
