/**
 * CompanyKhoja - Auto Categorization Engine
 * Intelligently classifies companies based on name keywords
 */

import type { CompanyCategory } from '~/types'

interface CategoryRule {
  category: CompanyCategory
  keywords: string[]
  weight: number
}

const CATEGORY_RULES: CategoryRule[] = [
  // Technology (includes Software, IT, AI)
  { category: 'Technology', keywords: ['tech', 'technology', 'digital', 'innovation', 'smart', 'cyber', 'data', 'cloud', 'internet', 'web', 'online', 'ecommerce', 'e-commerce', 'software', 'app', 'application', 'saas', 'platform', 'system', 'solution', 'code', 'dev', 'development', 'programming', 'it ', 'information technology', 'infotech', 'computing', 'network', 'server', 'hosting', 'domain', 'ai', 'artificial intelligence', 'machine learning', 'ml', 'deep learning', 'neural', 'automation', 'robotic', 'bot'], weight: 3 },

  // Education
  { category: 'Education', keywords: ['education', 'educational', 'academy', 'institute', 'learning', 'training', 'coaching', 'tutorial'], weight: 3 },
  { category: 'School', keywords: ['school', 'secondary', 'higher secondary', 'boarding', 'academy'], weight: 4 },
  { category: 'College', keywords: ['college', 'university', 'campus', 'higher education', 'degree'], weight: 4 },

  // Healthcare
  { category: 'Hospital', keywords: ['hospital', 'medical center', 'health center', 'clinic', 'polyclinic', 'nursing home'], weight: 4 },
  { category: 'Healthcare', keywords: ['health', 'healthcare', 'medical', 'pharma', 'pharmaceutical', 'diagnostic', 'laboratory', 'lab', 'wellness', 'care'], weight: 3 },

  // Construction & Engineering
  { category: 'Construction', keywords: ['construction', 'builder', 'building', 'infrastructure', 'contractor', 'civil', 'road', 'bridge', 'housing', 'real estate development'], weight: 3 },
  { category: 'Engineering', keywords: ['engineering', 'engineer', 'consulting engineer', 'structural', 'mechanical', 'electrical', 'design'], weight: 3 },

  // Finance
  { category: 'Finance', keywords: ['finance', 'financial', 'investment', 'capital', 'fund', 'securities', 'broker', 'insurance', 'microfinance', 'cooperative'], weight: 3 },
  { category: 'Bank', keywords: ['bank', 'banking', 'credit', 'depository', 'bancassurance'], weight: 4 },

  // Energy
  { category: 'Hydropower', keywords: ['hydro', 'hydropower', 'power', 'energy', 'electricity', 'solar', 'renewable', 'wind', 'generation', 'transmission', 'grid'], weight: 4 },

  // Manufacturing & Industry
  { category: 'Manufacturing', keywords: ['manufacturing', 'factory', 'industry', 'industrial', 'production', 'processing', 'mill', 'plant'], weight: 3 },
  { category: 'Agriculture', keywords: ['agriculture', 'agro', 'farm', 'farming', 'dairy', 'poultry', 'fishery', 'horticulture', 'livestock', 'crop'], weight: 3 },

  // Services
  { category: 'Restaurant', keywords: ['restaurant', 'food', 'cafe', 'catering', 'bakery', 'kitchen', 'dining', 'hotel and restaurant'], weight: 3 },
  { category: 'Hotel', keywords: ['hotel', 'resort', 'lodge', 'guest house', 'hospitality', 'inn', 'motel'], weight: 4 },
  { category: 'Retail', keywords: ['retail', 'store', 'shop', 'mart', 'supermarket', 'mall', 'bazaar', 'traders', 'trading', 'sales'], weight: 2 },
  { category: 'Import Export', keywords: ['import', 'export', 'trading', 'trade', 'international', 'exim', 'overseas', 'foreign trade'], weight: 3 },

  // Organizations
  { category: 'NGO', keywords: ['ngo', 'non profit', 'non-profit', 'foundation', 'trust', 'charity', 'welfare', 'social', 'voluntary', 'community'], weight: 3 },
  { category: 'Media', keywords: ['media', 'news', 'press', 'publishing', 'broadcast', 'tv', 'television', 'radio', 'film', 'production house', 'studio'], weight: 3 },
  { category: 'Marketing', keywords: ['marketing', 'advertising', 'advertisement', 'promotion', 'brand', 'digital marketing', 'seo', 'social media'], weight: 3 },

  // Real Estate & Property
  { category: 'Real Estate', keywords: ['real estate', 'property', 'properties', 'housing', 'apartment', 'estate', 'land', 'plot', 'realtor'], weight: 3 },

  // Transportation & Logistics
  { category: 'Logistics', keywords: ['logistics', 'transport', 'transportation', 'cargo', 'freight', 'shipping', 'courier', 'delivery', 'supply chain', 'warehouse', 'storage'], weight: 3 },
  { category: 'Travel', keywords: ['travel', 'tour', 'tourism', 'trek', 'trekking', 'adventure', 'expedition', 'airlines', 'aviation'], weight: 3 },
  { category: 'Automobile', keywords: ['automobile', 'auto', 'vehicle', 'car', 'motor', 'motors', 'garage', 'workshop', 'showroom', 'dealership'], weight: 3 },

  // Startup
  { category: 'Startup', keywords: ['startup', 'start-up', 'venture', 'incubator', 'accelerator', 'innovation lab', 'tech startup'], weight: 3 },
]

/**
 * Categorize a company based on its name
 */
export function categorizeCompany(name: string): CompanyCategory {
  const lowerName = name.toLowerCase()
  const scores: Record<string, number> = {}

  for (const rule of CATEGORY_RULES) {
    for (const keyword of rule.keywords) {
      if (lowerName.includes(keyword.toLowerCase())) {
        scores[rule.category] = (scores[rule.category] || 0) + rule.weight
      }
    }
  }

  // Find highest scoring category
  let bestCategory: CompanyCategory = 'Others'
  let maxScore = 0

  for (const [category, score] of Object.entries(scores)) {
    if (score > maxScore) {
      maxScore = score
      bestCategory = category as CompanyCategory
    }
  }

  return bestCategory
}

/**
 * Extract keywords from company name
 */
export function extractKeywords(name: string): string[] {
  const stopWords = new Set([
    'pvt', 'private', 'ltd', 'limited', 'company', 'co', 'corporation', 'inc',
    'nepal', 'nepali', 'and', '&', 'the', 'of', 'in', 'for', 'with', 'group'
  ])

  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((word) => word.length > 2 && !stopWords.has(word))
}

/**
 * Get all available categories with counts
 */
export function getCategoryList(): CompanyCategory[] {
  return [
    'Technology', 'Education', 'School', 'College',
    'Hospital', 'Healthcare', 'Construction', 'Engineering', 'Finance', 'Bank',
    'Hydropower', 'Manufacturing', 'Agriculture', 'Restaurant', 'Hotel', 'Retail',
    'Import Export', 'NGO', 'Media', 'Marketing', 'Real Estate', 'Logistics',
    'Travel', 'Automobile', 'Startup', 'Others'
  ]
}

const CATEGORY_ALIASES: Record<string, CompanyCategory> = {
  'AI': 'Technology',
  'Software': 'Technology',
  'IT': 'Technology',
}

export function normalizeCategory(cat: string): CompanyCategory {
  return CATEGORY_ALIASES[cat] || (cat as CompanyCategory)
}
