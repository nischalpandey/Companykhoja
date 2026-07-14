import type { Company, SearchFilters, SortOption, SearchResult, SearchSuggestion } from '~/types'

export function useSearchEngine() {
  const client = useClientSearch()

  async function buildIndex(_data: Company[]) {
    // no-op — index is built on first client search
  }

  async function search(
    query: string,
    filters: SearchFilters = {},
    sort: SortOption = 'newest',
    page = 1,
    perPage = 20
  ): Promise<SearchResult> {
    return client.search(query, filters, sort, page, perPage)
  }

  async function autocomplete(query: string, limit = 10): Promise<SearchSuggestion[]> {
    return client.autocomplete(query, limit)
  }

  async function getCompanyById(id: string): Promise<Company | undefined> {
    return client.getCompanyById(id)
  }

  async function getCompanyBySlug(slug: string): Promise<Company | undefined> {
    return client.getCompanyBySlug(slug)
  }

  function getAllCompanies(): Company[] {
    return []
  }

  async function getFilterOptions() {
    return client.getFilterOptions()
  }

  async function getStatistics() {
    return client.getStatistics()
  }

  function isIndexReady() {
    return client.isIndexReady() as import('vue').Ref<boolean>
  }

  return {
    buildIndex,
    search,
    autocomplete,
    getCompanyById,
    getCompanyBySlug,
    getAllCompanies,
    getFilterOptions,
    getStatistics,
    isIndexReady,
  }
}
