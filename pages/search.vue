<template>
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Search Header -->
      <div class="mb-8">
        <div class="relative max-w-3xl">
          <div class="flex items-center bg-white dark:bg-surface-800 rounded-2xl shadow-lg shadow-surface-200/50 dark:shadow-surface-900/50 border border-surface-600 dark:border-surface-700">
            <MagnifyingGlassIcon class="w-5 h-5 text-surface-400 ml-5" />
            <input
              v-model="query"
              type="text"
              placeholder="Search companies..."
              class="w-full py-4 px-4 bg-transparent text-surface-900 dark:text-surface-100 placeholder-surface-400 focus:outline-none border-none focus:ring-0 text-sm rounded-2xl"
              @input="handleInput"
              @keyup.enter="executeSearch"
            />
            <button
              v-if="query"
              @click="clearSearch"
              class="p-2 text-surface-400 hover:text-surface-600 dark:hover:text-surface-300 transition-colors"
            >
              <XMarkIcon class="w-5 h-5" />
            </button>
            <button
              @click="executeSearch"
              class="mr-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
            >
              Search
            </button>
          </div>
          </div>
        <div class="mt-3 flex flex-wrap gap-2 text-sm">
          <span class="text-surface-400">Try:</span>
          <button
            v-for="example in searchExamples"
            :key="example"
            @click="query = example; executeSearch()"
            class="px-3 py-1.5 bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-xl text-surface-500 dark:text-surface-400 hover:border-primary-400 hover:text-primary-600 dark:hover:text-primary-400 transition-all text-xs"
          >
            {{ example }}
          </button>
        </div>
      </div>

      <div class="flex flex-col lg:flex-row gap-8">
        <!-- Filters Sidebar -->
        <aside class="lg:w-72 flex-shrink-0">
          <div class="bg-white dark:bg-surface-800/50 rounded-2xl border border-surface-200 dark:border-surface-700/50 p-6 sticky top-24 shadow-sm">
            <div class="flex items-center justify-between mb-6">
              <h3 class="font-semibold text-surface-900 dark:text-surface-100 flex items-center gap-2">
                <FunnelIcon class="w-5 h-5 text-primary-500" />
                Filters
              </h3>
              <button
                v-if="hasActiveFilters"
                @click="clearAllFilters"
                class="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 font-medium transition-colors"
              >
                Clear All
              </button>
            </div>

            <FilterSection title="Province">
              <select v-model="filters.province" class="w-full px-3 py-2.5 bg-surface-50 dark:bg-surface-900 border border-surface-200 dark:border-surface-700 rounded-xl text-surface-700 dark:text-surface-300 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition-all text-sm" @change="executeSearch">
                <option value="">All Provinces</option>
                <option v-for="p in filterOptions.provinces" :key="p" :value="p">{{ p }}</option>
              </select>
            </FilterSection>

            <FilterSection title="District">
              <select v-model="filters.district" class="w-full px-3 py-2.5 bg-surface-50 dark:bg-surface-900 border border-surface-200 dark:border-surface-700 rounded-xl text-surface-700 dark:text-surface-300 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition-all text-sm" @change="executeSearch">
                <option value="">All Districts</option>
                <option v-for="d in filterOptions.districts" :key="d" :value="d">{{ d }}</option>
              </select>
            </FilterSection>

            <FilterSection title="Company Type">
              <select v-model="filters.companyType" class="w-full px-3 py-2.5 bg-surface-50 dark:bg-surface-900 border border-surface-200 dark:border-surface-700 rounded-xl text-surface-700 dark:text-surface-300 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition-all text-sm" @change="executeSearch">
                <option value="">All Types</option>
                <option v-for="t in filterOptions.types" :key="t" :value="t">{{ t }}</option>
              </select>
            </FilterSection>

            <FilterSection title="Ownership">
              <select v-model="filters.ownership" class="w-full px-3 py-2.5 bg-surface-50 dark:bg-surface-900 border border-surface-200 dark:border-surface-700 rounded-xl text-surface-700 dark:text-surface-300 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition-all text-sm" @change="executeSearch">
                <option value="">All Ownerships</option>
                <option v-for="o in filterOptions.ownerships" :key="o" :value="o">{{ o }}</option>
              </select>
            </FilterSection>

            <FilterSection title="Category">
              <select v-model="filters.category" class="w-full px-3 py-2.5 bg-surface-50 dark:bg-surface-900 border border-surface-200 dark:border-surface-700 rounded-xl text-surface-700 dark:text-surface-300 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition-all text-sm" @change="executeSearch">
                <option value="">All Categories</option>
                <option v-for="c in filterOptions.categories" :key="c" :value="c">{{ c }}</option>
              </select>
            </FilterSection>

            <FilterSection title="Rokka Status">
              <select v-model="filters.rokkaStatus" class="w-full px-3 py-2.5 bg-surface-50 dark:bg-surface-900 border border-surface-200 dark:border-surface-700 rounded-xl text-surface-700 dark:text-surface-300 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition-all text-sm" @change="executeSearch">
                <option value="">All Statuses</option>
                <option v-for="r in filterOptions.rokkaStatuses" :key="r" :value="r">{{ r }}</option>
              </select>
            </FilterSection>

            <FilterSection title="Registration Year">
              <select v-model="filters.registrationYear" class="w-full px-3 py-2.5 bg-surface-50 dark:bg-surface-900 border border-surface-200 dark:border-surface-700 rounded-xl text-surface-700 dark:text-surface-300 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition-all text-sm" @change="executeSearch">
                <option value="">All Years</option>
                <option v-for="y in filterOptions.years" :key="y" :value="y">{{ y }}</option>
              </select>
            </FilterSection>

            <FilterSection title="Alphabet">
              <div class="flex flex-wrap gap-1">
                <button
                  v-for="letter in alphabet"
                  :key="letter"
                  @click="toggleAlphabet(letter)"
                  class="w-8 h-8 rounded-lg text-sm font-medium transition-all"
                  :class="filters.alphabet === letter
                    ? 'bg-primary-600 text-white shadow-sm shadow-primary-500/30'
                    : 'bg-surface-50 dark:bg-surface-900 text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-700'"
                >
                  {{ letter }}
                </button>
              </div>
            </FilterSection>
          </div>
        </aside>

        <!-- Results Area -->
        <div class="flex-1 min-w-0">
          <div class="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div class="text-sm text-surface-500 dark:text-surface-400">
              <span v-if="results" class="font-semibold text-surface-900 dark:text-surface-100">{{ formatNumber(results.total) }}</span>
              <span v-else class="font-semibold text-surface-900 dark:text-surface-100">-</span>
              results found
              <span v-if="results && results.executionTimeMs" class="text-surface-400">({{ results.executionTimeMs }}ms)</span>
            </div>

            <div class="flex items-center gap-3">
              <select v-model="sort" class="px-3 py-2.5 bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-xl text-sm text-surface-700 dark:text-surface-300 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition-all" @change="executeSearch">
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="az">A-Z</option>
                <option value="za">Z-A</option>
                <option value="recentlyUpdated">Recently Updated</option>
                <option value="registrationNumber">Reg. Number</option>
                <option value="random">Random</option>
              </select>

              <div class="relative">
                <button
                  @click="showExportMenu = !showExportMenu"
                  class="px-3 py-2.5 bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-xl text-sm text-surface-700 dark:text-surface-300 hover:border-primary-400 transition-all flex items-center gap-2"
                >
                  <ArrowDownTrayIcon class="w-4 h-4" />
                  Export
                </button>
                <Transition name="scale-in">
                  <div
                    v-if="showExportMenu"
                    class="absolute right-0 top-full mt-2 w-40 bg-white dark:bg-surface-800 rounded-xl shadow-xl border border-surface-200 dark:border-surface-700 z-50 overflow-hidden"
                  >
                    <button
                      v-for="fmt in exportFormats"
                      :key="fmt.value"
                      @click="handleExport(fmt.value)"
                      class="w-full text-left px-4 py-2.5 text-sm text-surface-700 dark:text-surface-300 hover:bg-surface-50 dark:hover:bg-surface-700 transition-colors flex items-center gap-2"
                    >
                      <component :is="fmt.icon" class="w-4 h-4" />
                      {{ fmt.label }}
                    </button>
                  </div>
                </Transition>
              </div>
            </div>
          </div>

          <div v-if="results?.didYouMean" class="mb-4 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl">
            <p class="text-amber-800 dark:text-amber-200 text-sm">
              Did you mean:
              <button @click="query = results.didYouMean!; executeSearch()" class="font-semibold underline hover:no-underline">
                {{ results.didYouMean }}
              </button>
              ?
            </p>
          </div>

          <div v-if="loading" class="space-y-4">
            <CompanyCardSkeleton v-for="i in 6" :key="i" />
          </div>

          <div v-else-if="results && results.companies.length > 0" class="space-y-4">
            <CompanyCard v-for="company in results.companies" :key="company.id" :company="company" :highlight="query" />

            <div v-if="results.totalPages > 1" class="flex items-center justify-center gap-3 pt-6">
              <button @click="page = Math.max(1, page - 1); executeSearch()" :disabled="page === 1" class="p-2.5 rounded-xl border border-surface-200 dark:border-surface-700 disabled:opacity-50 hover:bg-surface-50 dark:hover:bg-surface-800 transition-all hover:border-primary-400">
                <ChevronLeftIcon class="w-5 h-5 text-surface-600 dark:text-surface-400" />
              </button>
              <div class="flex items-center gap-2">
                <button
                  v-for="p in paginationRange"
                  :key="p"
                  @click="handlePageClick(p)"
                  :disabled="typeof p !== 'number'"
                  class="w-9 h-9 rounded-xl text-sm font-medium transition-all"
                  :class="p === page ? 'bg-primary-600 text-white shadow-sm shadow-primary-500/30' : 'text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800 border border-surface-200 dark:border-surface-700'"
                >
                  {{ p }}
                </button>
              </div>
              <button @click="page = Math.min(results.totalPages, page + 1); executeSearch()" :disabled="page === results.totalPages" class="p-2.5 rounded-xl border border-surface-200 dark:border-surface-700 disabled:opacity-50 hover:bg-surface-50 dark:hover:bg-surface-800 transition-all hover:border-primary-400">
                <ChevronRightIcon class="w-5 h-5 text-surface-600 dark:text-surface-400" />
              </button>
            <!-- Web Results -->
            <div v-if="webResults && results?.companies?.length" class="mt-8 pt-8 border-t border-surface-200 dark:border-surface-700">
              <button @click="showWebResults = !showWebResults" class="flex items-center gap-2 text-surface-900 dark:text-surface-100 font-semibold mb-4 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                <MagnifyingGlassIcon class="w-5 h-5" />
                Web Results for "{{ query }}"
                <ChevronRightIcon class="w-4 h-4 transition-transform" :class="showWebResults ? 'rotate-90' : ''" />
              </button>
              <div v-if="showWebResults">
                <div v-if="webResults.data?.abstract" class="flex gap-4 mb-6 p-4 rounded-xl bg-surface-50 dark:bg-surface-900">
                  <img v-if="webResults.data.imageUrl" :src="webResults.data.imageUrl" alt="" class="w-16 h-16 rounded-lg object-contain bg-white dark:bg-surface-800 p-1 shrink-0" />
                  <div>
                    <p class="text-sm text-surface-600 dark:text-surface-300 leading-relaxed">{{ webResults.data.abstract }}</p>
                    <a v-if="webResults.data.sourceUrl" :href="webResults.data.sourceUrl" target="_blank" rel="noopener" class="text-xs text-primary-600 dark:text-primary-400 hover:underline mt-1 inline-block">Source: {{ webResults.data.source }}</a>
                  </div>
                </div>
                <div v-if="webResults.data?.results?.length" class="space-y-3">
                  <a
                    v-for="r in webResults.data.results"
                    :key="r.link"
                    :href="r.link"
                    target="_blank"
                    rel="noopener"
                    class="block p-3 rounded-xl bg-surface-50 dark:bg-surface-900 hover:bg-primary-50 dark:hover:bg-primary-950/30 transition-all group"
                  >
                    <p class="text-xs text-surface-400 mb-0.5">{{ r.displayLink }}</p>
                    <h5 class="text-sm font-semibold text-primary-600 dark:text-primary-400 group-hover:underline mb-0.5">{{ r.title }}</h5>
                    <p class="text-xs text-surface-600 dark:text-surface-300 leading-relaxed">{{ r.snippet }}</p>
                  </a>
                </div>
                <div v-if="!webResults.data?.abstract && !webResults.data?.results?.length" class="text-sm text-surface-500 dark:text-surface-400 py-4 text-center">No web results found.</div>
              </div>
            </div>
          </div>

          <div v-else-if="results" class="text-center py-20">
            <div class="w-20 h-20 mx-auto mb-6 rounded-2xl bg-surface-100 dark:bg-surface-800 flex items-center justify-center">
              <MagnifyingGlassIcon class="w-10 h-10 text-surface-400" />
            </div>
            <h3 class="text-xl font-semibold text-surface-900 dark:text-surface-100 mb-2">No results found</h3>
            <p class="text-surface-500 dark:text-surface-400 max-w-md mx-auto">Try adjusting your search terms or filters.</p>
          </div>

          <div v-else class="text-center py-20">
            <div class="w-20 h-20 mx-auto mb-6 rounded-2xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
              <MagnifyingGlassIcon class="w-10 h-10 text-primary-500" />
            </div>
            <h3 class="text-xl font-semibold text-surface-900 dark:text-surface-100 mb-2">Start Searching</h3>
            <p class="text-surface-500 dark:text-surface-400">Enter a company name, registration number, or use filters to find companies.</p>
          </div>
        </div>
      </div>
    </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import {
  MagnifyingGlassIcon, XMarkIcon, FunnelIcon, ArrowDownTrayIcon,
  ChevronLeftIcon, ChevronRightIcon
} from '@heroicons/vue/24/outline'
import type { SearchFilters, SortOption, SearchResult } from '~/types'

useHead({ title: 'Search Companies' })

const route = useRoute()
const router = useRouter()
const searchEngine = useSearchEngine()
const { exportCompanies } = useExport()

const query = ref('')
const filters = ref<SearchFilters>({})
const sort = ref<SortOption>('newest')
const page = ref(1)
const perPage = 20
const results = ref<SearchResult | null>(null)
const loading = ref(false)
const showExportMenu = ref(false)
const showWebResults = ref(false)
const webResults = ref<any>(null)
const filterOptions = ref({ provinces: [], districts: [], types: [], ownerships: [], categories: [], rokkaStatuses: [], years: [] })

const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

const searchExamples = [
  'registered:2083', 'district:kathmandu', 'type:private',
  'ownership:nepali', 'rokka:false', 'year:2082', 'tech',
]

const exportFormats = [
  { value: 'csv', label: 'CSV', icon: 'DocumentTextIcon' },
  { value: 'json', label: 'JSON', icon: 'CodeBracketIcon' },
  { value: 'print', label: 'Print', icon: 'PrinterIcon' },
]

const hasActiveFilters = computed(() => Object.values(filters.value).some(Boolean))

const paginationRange = computed(() => {
  if (!results.value) return []
  const tp = results.value.totalPages
  const cp = page.value
  if (tp <= 7) return Array.from({ length: tp }, (_, i) => i + 1)
  if (cp <= 3) return [1, 2, 3, 4, '...', tp]
  if (cp >= tp - 2) return [1, '...', tp - 3, tp - 2, tp - 1, tp]
  return [1, '...', cp - 1, cp, cp + 1, '...', tp]
})

onMounted(async () => {
  filterOptions.value = await searchEngine.getFilterOptions()
  // remove empty filters which is =''



  const { q, province, district, type, ownership, category, rokka, year, sort: sortParam, page: pageParam } = route.query
  if (q) query.value = String(q)
  if (province) filters.value.province = String(province)
  if (district) filters.value.district = String(district)
  if (type) filters.value.companyType = String(type) as any
  if (ownership) filters.value.ownership = String(ownership) as any
  if (category) filters.value.category = String(category) as any
  if (rokka) filters.value.rokkaStatus = String(rokka) as any
  if (year) filters.value.registrationYear = parseInt(String(year))
  if (sortParam) sort.value = String(sortParam) as SortOption
  if (pageParam) page.value = parseInt(String(pageParam))
  if (query.value || hasActiveFilters.value) executeSearch()
})

let searchTimer: ReturnType<typeof setTimeout>
function handleInput() {
  clearTimeout(searchTimer)
  if (query.value.length < 2) { results.value = null; return }
  searchTimer = setTimeout(() => {
    page.value = 1
    executeSearch()
  }, 400)
}

async function executeSearch() {
  if (!query.value && !hasActiveFilters.value) { results.value = null; return }
  clearTimeout(searchTimer)
  loading.value = true
  try {
    const searchResults = await searchEngine.search(query.value, filters.value, sort.value, page.value, perPage)
    results.value = searchResults
    if (query.value) fetchWebResults()
    const qp: Record<string, string> = {}
    if (query.value) qp.q = query.value
    if (filters.value.province) qp.province = filters.value.province
    if (filters.value.district) qp.district = filters.value.district
    if (filters.value.companyType) qp.type = filters.value.companyType
    if (filters.value.ownership) qp.ownership = filters.value.ownership
    if (filters.value.category) qp.category = filters.value.category
    if (filters.value.rokkaStatus) qp.rokka = filters.value.rokkaStatus
    if (filters.value.registrationYear) qp.year = String(filters.value.registrationYear)
    if (sort.value !== 'newest') qp.sort = sort.value
    if (page.value > 1) qp.page = String(page.value)
    router.replace({ query: qp })
  } finally { loading.value = false }
}

async function fetchWebResults() {
  try {
    const res = await fetch(`/api/search-web?q=${encodeURIComponent(query.value)}`)
    webResults.value = await res.json()
    showWebResults.value = false
  } catch { webResults.value = null }
}
function handlePageClick(p: number | string) { if (typeof p === 'number') { page.value = p; executeSearch() } }
function clearSearch() { query.value = ''; results.value = null; router.replace({ query: {} }) }
function clearAllFilters() { filters.value = {}; page.value = 1; executeSearch() }
function toggleAlphabet(letter: string) { filters.value.alphabet = filters.value.alphabet === letter ? undefined : letter; page.value = 1; executeSearch() }
function handleExport(format: string) { showExportMenu.value = false; if (!results.value?.companies.length) return; exportCompanies(results.value.companies, { format: format as any }) }
</script>
