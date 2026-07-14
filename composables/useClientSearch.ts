import MiniSearch from 'minisearch'
import Fuse from 'fuse.js'
import type { Company, SearchFilters, SortOption, SearchResult, SearchSuggestion, Statistics } from '~/types'

const SEARCH_FIELDS = ['nameEnglish', 'nameNepali', 'registrationNumber', 'address', 'keywords']

let data: Company[] = []
let miniSearch: MiniSearch | null = null
let fuseInstance: Fuse<Company> | null = null
let filterOptionsCache: any = null
let statisticsCache: Statistics | null = null

let loadPromise: Promise<void> | null = null

async function ensureLoaded() {
  if (loadPromise) return loadPromise
  loadPromise = (async () => {
    if (data.length) return
    const config = useRuntimeConfig()
    const baseURL = config.public.baseURL
    const res = await fetch(`${baseURL}data/companies.json`)
    data = await res.json()
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
  })()
  return loadPromise
}

function getBsYear(dateStr: string): number {
  return parseInt(dateStr.split('-')[0]) || 0
}

function parseAdvancedQuery(query: string): { terms: string[]; filters: Record<string, string> } {
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

export function useClientSearch() {

  async function search(
    q: string,
    filters: SearchFilters = {},
    sort: SortOption = 'newest',
    page = 1,
    limit = 20
  ): Promise<SearchResult> {
    const startTime = performance.now()
    await ensureLoaded()

    const parsed = parseAdvancedQuery(q)
    const mergedFilters: Record<string, string> = { ...filters } as any
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
    if (mergedFilters.category) results = results.filter(c => c.category === mergedFilters.category)
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
      const query = searchTerms.toLowerCase().trim()
      const exact: Company[] = []
      const rest: Company[] = []
      for (const c of results) {
        if (
          c.nameEnglish.toLowerCase() === query ||
          c.nameNepali.toLowerCase() === query ||
          c.registrationNumber.toLowerCase() === query
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

    return { companies: paginated, total, page, perPage: limit, totalPages, executionTimeMs, didYouMean, suggestions: [] }
  }

  async function autocomplete(q: string, limit = 10): Promise<SearchSuggestion[]> {
    if (q.length < 2) return []
    await ensureLoaded()
    const results = miniSearch!.search(q, { prefix: true, fuzzy: 0.2 })
    const suggestions: SearchSuggestion[] = []
    const seen = new Set<string>()
    for (const r of results.slice(0, limit * 2)) {
      const company = data.find(c => c.id === r.id)
      if (!company || seen.has(company.nameEnglish)) continue
      seen.add(company.nameEnglish)
      suggestions.push({ text: company.nameEnglish, type: 'company', id: company.id })
      if (suggestions.length >= limit) break
    }
    return suggestions
  }

  async function getCompanyById(id: string): Promise<Company | undefined> {
    await ensureLoaded()
    return data.find(c => c.id === id)
  }

  async function getFilterOptions(): Promise<any> {
    if (filterOptionsCache) return filterOptionsCache
    const stats = await getStatistics()
    const provinces = Object.keys(stats.byProvince).sort()
    const districts = Object.keys(stats.byDistrict).sort()
    const types = Object.keys(stats.byType).sort()
    const ownerships = Object.keys(stats.byOwnership).sort()
    const categories = Object.keys(stats.byCategory).sort()
    const rokkaStatuses = Object.keys(stats.byRokka).sort()
    const years = stats.yearlyGrowth.map(y => y.year).sort((a, b) => b - a)
    filterOptionsCache = { provinces, districts, types, ownerships, categories, rokkaStatuses, years }
    return filterOptionsCache
  }

  async function getStatistics(): Promise<Statistics> {
    if (statisticsCache) return statisticsCache
    await ensureLoaded()
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
      byCategory[company.category] = (byCategory[company.category] || 0) + 1
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

    statisticsCache = {
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
    return statisticsCache
  }

  function isIndexReady() {
    return data.length > 0 && miniSearch !== null
  }

  return { search, autocomplete, getCompanyById, getFilterOptions, getStatistics, isIndexReady }
}
