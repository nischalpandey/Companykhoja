export interface SiteMetaData {
  stats: import('~/types').Statistics
  latestCompanies: import('~/types').Company[]
  filterOptions: {
    provinces: string[]
    districts: string[]
    types: string[]
    ownerships: string[]
    categories: string[]
    rokkaStatuses: string[]
    years: number[]
  }
}

const cachedMeta = ref<SiteMetaData | null>(null)
const loading = ref(false)
const error = ref<string | null>(null)
let loadPromise: Promise<SiteMetaData> | null = null

export function useSiteMeta() {
  async function load(): Promise<SiteMetaData> {
    if (cachedMeta.value) return cachedMeta.value
    if (loadPromise) return loadPromise

    loading.value = true
    error.value = null

    loadPromise = (async () => {
      try {
        const meta = await $fetch<SiteMetaData>('/data/site-meta.json')
        cachedMeta.value = meta
        return meta
      } catch (err) {
        error.value = err instanceof Error ? err.message : 'Failed to load site metadata'
        throw err
      } finally {
        loading.value = false
        loadPromise = null
      }
    })()

    return loadPromise
  }

  return {
    load,
    loading: readonly(loading),
    error: readonly(error),
    meta: readonly(cachedMeta),
  }
}