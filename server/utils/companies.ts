import { readFileSync, existsSync } from 'fs'
import { join } from 'path'
import MiniSearch from 'minisearch'
import Fuse from 'fuse.js'

interface Company {
  id: string
  registrationNumber: string
  nameEnglish: string
  nameNepali: string
  registrationDate: string
  companyType: string
  ownership: string
  address: string
  province: string
  district: string
  municipality: string
  rokkaStatus: string
  category: string
  keywords: string[]
  updatedAt: string
  createdAt: string
}

let cached: Company[] | null = null
let miniSearch: MiniSearch | null = null
let fuseInstance: Fuse<Company> | null = null
let filterOptions: ReturnType<typeof computeFilterOptions> | null = null
let statistics: ReturnType<typeof computeStatistics> | null = null

const SEARCH_FIELDS = ['nameEnglish', 'nameNepali', 'registrationNumber', 'address', 'keywords']

export function loadCompanies(): Company[] {
  if (cached) return cached
  const fp = join(process.cwd(), 'public', 'data', 'companies.json')
  if (!existsSync(fp)) return []
  cached = JSON.parse(readFileSync(fp, 'utf-8'))
  return cached!
}

function ensureIndex(): void {
  if (miniSearch) return
  const data = loadCompanies()
  if (!data.length) return

  miniSearch = new MiniSearch({
    fields: SEARCH_FIELDS,
    storeFields: ['id', 'nameEnglish', 'nameNepali', 'registrationNumber', 'registrationDate', 'companyType', 'ownership', 'address', 'province', 'district', 'municipality', 'rokkaStatus', 'category', 'keywords'],
    searchOptions: { boost: { nameEnglish: 3, nameNepali: 2, registrationNumber: 2.5 }, fuzzy: 0.2, prefix: true },
  })
  miniSearch.addAll(data)

  fuseInstance = new Fuse(data, {
    keys: SEARCH_FIELDS,
    threshold: 0.4,
    includeScore: true,
    includeMatches: true,
    minMatchCharLength: 2,
    ignoreLocation: true,
    useExtendedSearch: true,
  })
}

function computeFilterOptions() {
  const data = loadCompanies()
  const provinces = [...new Set(data.map(c => c.province))].sort()
  const districts = [...new Set(data.map(c => c.district))].sort()
  const types = [...new Set(data.map(c => c.companyType))].sort()
  const ownerships = [...new Set(data.map(c => c.ownership))].sort()
  const categories = [...new Set(data.map(c => c.category))].sort()
  const rokkaStatuses = [...new Set(data.map(c => c.rokkaStatus))].sort()
  const years = [...new Set(data.map(c => getBsYear(c.registrationDate)))].sort((a, b) => b - a)
  return { provinces, districts, types, ownerships, categories, rokkaStatuses, years }
}

function computeStatistics() {
  const data = loadCompanies()
  const byProvince: Record<string, number> = {}
  const byDistrict: Record<string, number> = {}
  const byType: Record<string, number> = {}
  const byOwnership: Record<string, number> = {}
  const byRokka: Record<string, number> = {}
  const byCategory: Record<string, number> = {}
  const yearlyGrowth: Record<number, number> = {}
  const timeline: Record<string, number> = {}

  let maxDate = ''
  let maxUpdatedAt = ''
  for (const company of data) {
    byProvince[company.province] = (byProvince[company.province] || 0) + 1
    byDistrict[company.district] = (byDistrict[company.district] || 0) + 1
    byType[company.companyType] = (byType[company.companyType] || 0) + 1
    byOwnership[company.ownership] = (byOwnership[company.ownership] || 0) + 1
    byRokka[company.rokkaStatus] = (byRokka[company.rokkaStatus] || 0) + 1
    const normCat = ({ AI: 'Technology', Software: 'Technology', IT: 'Technology' })[company.category] || company.category
    byCategory[normCat] = (byCategory[normCat] || 0) + 1
    const year = getBsYear(company.registrationDate)
    yearlyGrowth[year] = (yearlyGrowth[year] || 0) + 1
    const date = company.registrationDate.split('T')[0]
    timeline[date] = (timeline[date] || 0) + 1
    if (date > maxDate) maxDate = date
    if (company.updatedAt > maxUpdatedAt) maxUpdatedAt = company.updatedAt
  }

  let todayRegistrations = 0
  let weeklyRegistrations = 0
  let monthlyRegistrations = 0
  if (maxDate) {
    const maxParts = maxDate.split('-').map(Number)
    const maxYear = maxParts[0]
    const maxMonth = maxParts[1]
    const maxDay = maxParts[2]
    for (const company of data) {
      const d = company.registrationDate.split('T')[0]
      if (d === maxDate) todayRegistrations++
      const p = d.split('-').map(Number)
      const diffDays = (maxYear - p[0]) * 365 + (maxMonth - p[1]) * 30 + (maxDay - p[2])
      if (diffDays >= 0 && diffDays <= 7) weeklyRegistrations++
      if (diffDays >= 0 && diffDays <= 30) monthlyRegistrations++
    }
  }

  return {
    totalCompanies: data.length,
    latestRegistrationDate: maxDate,
    lastUpdated: maxUpdatedAt,
    todayRegistrations,
    weeklyRegistrations,
    monthlyRegistrations,
    byProvince,
    byDistrict,
    byType,
    byOwnership,
    byRokka,
    byCategory,
    yearlyGrowth: Object.entries(yearlyGrowth)
      .map(([year, count]) => ({ year: parseInt(year), count, growth: 0 }))
      .sort((a, b) => a.year - b.year),
    timeline: Object.entries(timeline)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date)),
  }
}

export function getBsYear(dateStr: string): number {
  return parseInt(dateStr.split('-')[0]) || 0
}

export function parseAdvancedQuery(query: string): { terms: string[]; filters: Record<string, string> } {
  const filters: Record<string, string> = {}
  const regex = /(\w+):([^\s]+)/g
  let match
  let cleaned = query
  while ((match = regex.exec(query)) !== null) {
    const [, key, value] = match
    const nk = key.toLowerCase()
    if (['registered', 'district', 'type', 'ownership', 'rokka', 'year', 'province', 'category'].includes(nk)) {
      filters[nk] = value
      cleaned = cleaned.replace(match[0], '')
    }
  }
  const terms = cleaned.trim().split(/\s+/).filter(Boolean)
  return { terms, filters }
}

export function searchCompanies(q: string, filters: Record<string, string> = {}, sort = 'newest', page = 1, limit = 20) {
  ensureIndex()
  const data = loadCompanies()
  if (!data.length) return { companies: [], total: 0, page, limit, totalPages: 0, executionTimeMs: 0, didYouMean: undefined }
  const startTime = performance.now()

  const parsed = parseAdvancedQuery(q)
  const mergedFilters: Record<string, string> = { ...filters }
  if (parsed.filters.registered) mergedFilters.registrationYear = parsed.filters.registered
  if (parsed.filters.district) mergedFilters.district = parsed.filters.district
  if (parsed.filters.type) mergedFilters.companyType = parsed.filters.type
  if (parsed.filters.ownership) mergedFilters.ownership = parsed.filters.ownership
  if (parsed.filters.rokka) mergedFilters.rokkaStatus = parsed.filters.rokka === 'true' ? 'Under Rokka' : 'Active'
  if (parsed.filters.year) mergedFilters.registrationYear = parsed.filters.year
  if (parsed.filters.province) mergedFilters.province = parsed.filters.province
  if (parsed.filters.category) mergedFilters.category = parsed.filters.category

  let results: Company[] = []
  const searchTerms = parsed.terms.join(' ')

  if (searchTerms) {
    const miniResults = miniSearch!.search(searchTerms)
    if (miniResults.length === 0) {
      results = fuseInstance!.search(searchTerms).map(r => r.item)
    } else {
      const idSet = new Set(miniResults.map(r => r.id))
      results = data.filter(c => idSet.has(c.id))
    }
  } else {
    results = [...data]
  }

  if (mergedFilters.province) results = results.filter(c => c.province === mergedFilters.province)
  if (mergedFilters.district) results = results.filter(c => c.district === mergedFilters.district)
  if (mergedFilters.companyType) results = results.filter(c => c.companyType === mergedFilters.companyType)
  if (mergedFilters.ownership) results = results.filter(c => c.ownership === mergedFilters.ownership)
    if (mergedFilters.category) {
      const aliases = Object.entries({ AI: 'Technology', Software: 'Technology', IT: 'Technology' })
        .filter(([, v]) => v === mergedFilters.category).map(([k]) => k)
      results = results.filter(c => c.category === mergedFilters.category || aliases.includes(c.category))
    }
  if (mergedFilters.rokkaStatus) results = results.filter(c => c.rokkaStatus === mergedFilters.rokkaStatus)
  if (mergedFilters.letter) results = results.filter(c => c.nameEnglish.toLowerCase().startsWith(mergedFilters.letter!.toLowerCase()))
  if (mergedFilters.registrationYear) results = results.filter(c => getBsYear(c.registrationDate) === parseInt(mergedFilters.registrationYear!))
  if (mergedFilters.registrationDate) results = results.filter(c => c.registrationDate.split('T')[0] === mergedFilters.registrationDate)

  if (sort === 'newest') results.sort((a, b) => b.registrationDate.localeCompare(a.registrationDate))
  else if (sort === 'oldest') results.sort((a, b) => a.registrationDate.localeCompare(b.registrationDate))
  else if (sort === 'az') results.sort((a, b) => a.nameEnglish.localeCompare(b.nameEnglish))
  else if (sort === 'za') results.sort((a, b) => b.nameEnglish.localeCompare(a.nameEnglish))
  else if (sort === 'registrationNumber') results.sort((a, b) => a.registrationNumber.localeCompare(b.registrationNumber))
  else if (sort === 'random') results.sort(() => Math.random() - 0.5)

  if (searchTerms) {
    const q = searchTerms.toLowerCase().trim()
    const exact: Company[] = []
    const rest: Company[] = []
    for (const c of results) {
      if (
        c.nameEnglish.toLowerCase() === q ||
        c.nameNepali.toLowerCase() === q ||
        c.registrationNumber.toLowerCase() === q
      ) exact.push(c)
      else rest.push(c)
    }
    results = [...exact, ...rest]
  }

  const total = results.length
  const totalPages = Math.ceil(total / limit)
  const start = (page - 1) * limit
  const paginated = results.slice(start, start + limit)
  const executionTimeMs = Math.round(performance.now() - startTime)

  let didYouMean: string | undefined
  if (total === 0 && searchTerms.length > 3) {
    const typoResults = fuseInstance!.search(searchTerms, { limit: 1 })
    if (typoResults.length > 0 && (typoResults[0].score || 1) < 0.5) {
      didYouMean = typoResults[0].item.nameEnglish
    }
  }

  return { companies: paginated, total, page, limit, totalPages, executionTimeMs, didYouMean }
}

export function autocomplete(q: string, limit = 10) {
  if (q.length < 2) return []
  ensureIndex()
  const results = miniSearch!.search(q, { prefix: true, fuzzy: 0.2 })
  const suggestions: { text: string; type: string; id: string }[] = []
  const seen = new Set<string>()
  for (const r of results.slice(0, limit * 2)) {
    const company = loadCompanies().find(c => c.id === r.id)
    if (!company || seen.has(company.nameEnglish)) continue
    seen.add(company.nameEnglish)
    suggestions.push({ text: company.nameEnglish, type: 'company', id: company.id })
    if (suggestions.length >= limit) break
  }
  return suggestions
}

export function getCompanyById(id: string): Company | undefined {
  return loadCompanies().find(c => c.id === id)
}

export function getCompaniesByCategory(category: string, limit = 5): Company[] {
  return loadCompanies().filter(c => c.category === category).slice(0, limit)
}

export function getFilterOptions() {
  if (filterOptions) return filterOptions
  filterOptions = computeFilterOptions()
  return filterOptions
}

export function getStatistics() {
  if (statistics) return statistics
  statistics = computeStatistics()
  return statistics
}

export function getAllCompanies(): Company[] {
  return loadCompanies()
}
