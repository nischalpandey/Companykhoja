import type { Company, SearchFilters, SortOption, SearchResult, SearchSuggestion } from '~/types'

function buildQueryString(params: Record<string, string | number | undefined>): string {
  const sp = new URLSearchParams()
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== '') sp.set(k, String(v))
  }
  return sp.toString()
}

let cachedFilterOptions: any = null
let cachedStats: any = null

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`API error: ${res.status}`)
  return res.json()
}

export function useSearchEngine() {

  async function buildIndex(_data: Company[]) {
    // no-op — server handles indexing
  }

  async function search(
    query: string,
    filters: SearchFilters = {},
    sort: SortOption = 'newest',
    page = 1,
    perPage = 20
  ): Promise<SearchResult> {
    const startTime = performance.now()
    const params: Record<string, string | number | undefined> = { q: query || undefined, sort, page, limit: perPage }
    if (filters.province) params.province = filters.province
    if (filters.district) params.district = filters.district
    if (filters.companyType) params.type = filters.companyType
    if (filters.ownership) params.ownership = filters.ownership
    if (filters.category) params.category = filters.category
    if (filters.rokkaStatus) params.rokka = filters.rokkaStatus
    if (filters.registrationYear) params.year = filters.registrationYear
    if (filters.alphabet) params.letter = filters.alphabet

    const json = await fetchJson<{ success: boolean; data: Company[]; pagination: { page: number; limit: number; total: number; totalPages: number }; executionTimeMs?: number; didYouMean?: string }>(`/api/companies?${buildQueryString(params)}`)

    const executionTimeMs = Math.round(performance.now() - startTime)
    return {
      companies: json.data,
      total: json.pagination.total,
      page: json.pagination.page,
      perPage: json.pagination.limit,
      totalPages: json.pagination.totalPages,
      suggestions: [],
      didYouMean: json.didYouMean,
      executionTimeMs,
    }
  }

  async function autocomplete(query: string, limit = 10): Promise<SearchSuggestion[]> {
    if (query.length < 2) return []
    const json = await fetchJson<{ success: boolean; data: { text: string; type: string; id: string }[] }>(`/api/autocomplete?q=${encodeURIComponent(query)}&limit=${limit}`)
    return json.data.map(d => ({ text: d.text, id: d.id, type: d.type as SearchSuggestion['type'], highlight: query }))
  }

  async function getCompanyById(id: string): Promise<Company | undefined> {
    try {
      const json = await fetchJson<{ success: boolean; data: Company }>(`/api/companies/${encodeURIComponent(id)}`)
      return json.data
    } catch {
      return undefined
    }
  }

  function getAllCompanies(): Company[] {
    return []
  }

  async function getFilterOptions() {
    if (cachedFilterOptions) return cachedFilterOptions
    const stats = await getStatistics()
    const provinces = Object.keys(stats.byProvince).sort()
    // reomve empty 
  
    const districts = Object.keys(stats.byDistrict).sort()
    const types = Object.keys(stats.byType).sort()
    const ownerships = Object.keys(stats.byOwnership).sort()
    const categories = Object.keys(stats.byCategory).sort()
    const rokkaStatuses = Object.keys(stats.byRokka).sort()

    const years = stats.yearlyGrowth.map((y: { year: number }) => y.year).sort((a: number, b: number) => b - a)
    cachedFilterOptions = { provinces, districts, types, ownerships, categories, rokkaStatuses, years }
    return cachedFilterOptions
  }

  async function getStatistics() {
    if (cachedStats) return cachedStats
    const json = await fetchJson<{ success: boolean; data: any }>('/api/stats')
    cachedStats = json.data
    return cachedStats
  }

  function isIndexReady() {
    return true
  }

  return {
    buildIndex,
    search,
    autocomplete,
    getCompanyById,
    getAllCompanies,
    getFilterOptions,
    getStatistics,
    isIndexReady,
  }
}
