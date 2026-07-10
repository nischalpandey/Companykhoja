/**
 * CompanyKhoja - Type Definitions
 * Core types for company data, search, and application state
 */

// ── Core Company Data ───────────────────────────────────────────────────────

export interface Company {
  id: string
  registrationNumber: string
  nameEnglish: string
  nameNepali: string
  registrationDate: string // ISO date string
  companyType: CompanyType
  ownership: OwnershipType
  address: string
  province: string
  district: string
  municipality: string
  rokkaStatus: RokkaStatus
  category: CompanyCategory
  keywords: string[]
  updatedAt: string
  createdAt: string
}

export type CompanyType =
  | 'Private Limited'
  | 'Public Limited'
  | 'Non-Profit Distributing'
  | 'Foreign Company'
  | 'Single Shareholder'
  | 'Sole Proprietorship'
  | 'Partnership'
  | 'Holding Company'
  | 'Subsidiary Company'
  | 'Others'

export type OwnershipType = 'Nepali' | 'Foreign' | 'Joint Venture' | 'Government' | 'Solo Owner' | 'Multiple Owner' | 'Others'

export type RokkaStatus = 'Active' | 'Under Rokka' | 'Dissolved' | 'Unknown'

export type CompanyCategory =
  | 'Technology'
  | 'Software'
  | 'IT'
  | 'AI'
  | 'Education'
  | 'School'
  | 'College'
  | 'Hospital'
  | 'Healthcare'
  | 'Construction'
  | 'Engineering'
  | 'Finance'
  | 'Bank'
  | 'Hydropower'
  | 'Manufacturing'
  | 'Agriculture'
  | 'Restaurant'
  | 'Hotel'
  | 'Retail'
  | 'Import Export'
  | 'NGO'
  | 'Media'
  | 'Marketing'
  | 'Real Estate'
  | 'Logistics'
  | 'Travel'
  | 'Automobile'
  | 'Startup'
  | 'Others'

// ── Search & Filter Types ──────────────────────────────────────────────────

export interface SearchFilters {
  province?: string
  district?: string
  municipality?: string
  registrationYear?: number
  registrationMonth?: number
  companyType?: CompanyType
  ownership?: OwnershipType
  rokkaStatus?: RokkaStatus
  category?: CompanyCategory
  alphabet?: string
}

export type SortOption =
  | 'newest'
  | 'oldest'
  | 'az'
  | 'za'
  | 'recentlyUpdated'
  | 'registrationNumber'
  | 'random'

export interface SearchQuery {
  query: string
  filters: SearchFilters
  sort: SortOption
  page: number
  perPage: number
}

export interface SearchResult {
  companies: Company[]
  total: number
  page: number
  perPage: number
  totalPages: number
  suggestions: SearchSuggestion[]
  didYouMean?: string
  executionTimeMs: number
}

// ─- OCR API Types ──────────────────────────────────────────────────────────

export interface OcrSearchPayload {
  companyNameEnglish?: string
  companyNameNepali?: string
  companyRegistrationNumber?: string
}

export interface OcrSearchResponse {
  success: boolean
  data?: OcrCompanyData[]
  message?: string
}

export interface OcrCompanyData {
  companyNameEnglish: string
  companyNameNepali: string
  registrationNumber: string
  registrationDate: string
  companyType: string
  address: string
  rokkaStatus: string
}

// ── Statistics Types ────────────────────────────────────────────────────────

export interface Statistics {
  totalCompanies: number
  latestRegistrationDate: string
  lastUpdated: string
  todayRegistrations: number
  weeklyRegistrations: number
  monthlyRegistrations: number
  byProvince: Record<string, number>
  byDistrict: Record<string, number>
  byType: Record<string, number>
  byOwnership: Record<string, number>
  byRokka: Record<string, number>
  byCategory: Record<string, number>
  yearlyGrowth: YearlyGrowth[]
  timeline: TimelinePoint[]
}

export interface YearlyGrowth {
  year: number
  count: number
  growth: number
}

export interface TimelinePoint {
  date: string
  count: number
}

// ── UI & App State Types ────────────────────────────────────────────────────

export interface RecentSearch {
  query: string
  timestamp: number
  resultCount: number
}

export interface BookmarkedCompany {
  id: string
  name: string
  registrationNumber: string
  timestamp: number
}

export interface RecentlyViewed {
  id: string
  name: string
  registrationNumber: string
  timestamp: number
}

export interface SearchSuggestion {
  id: string
  text: string
  type: 'company' | 'district' | 'category' | 'recent'
  highlight?: string
}

// ── Advanced Search Syntax ──────────────────────────────────────────────────

export interface ParsedQuery {
  raw: string
  terms: string[]
  filters: Record<string, string>
  isAdvanced: boolean
}

// ─- PWA Types ───────────────────────────────────────────────────────────────

export interface PwaManifest {
  name: string
  short_name: string
  description: string
  start_url: string
  display: string
  background_color: string
  theme_color: string
  icons: Array<{ src: string; sizes: string; type: string }>
}

// ─- Export Types ────────────────────────────────────────────────────────────

export type ExportFormat = 'csv' | 'json' | 'clipboard' | 'print'

export interface ExportOptions {
  format: ExportFormat
  filename?: string
  includeFields?: string[]
}
