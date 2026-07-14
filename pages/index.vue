<template>
    <div v-if="dataLoading" class="flex items-center justify-center min-h-[60vh]">
      <div class="text-center">
  <div class="relative w-12 h-12 mx-auto mb-4">
    <!-- Spinner -->
    <div class="absolute inset-0 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>

    <!-- Logo -->
    <img
      src="/logo.png"
      alt="CompanyKhoja Logo"
      class="absolute inset-0 m-auto w-6 h-6 object-contain"
    />
  </div>

  <p class="text-surface-500 dark:text-surface-400">
    Loading company data…
  </p>
</div>
    </div>
    <template v-else>
    <!-- Hero -->
    <section class="relative overflow-hidden pt-24 pb-16 sm:pt-32 sm:pb-24">
      <div class="absolute inset-0" />
      <div class="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full blur-3xl dark:from-blue-900 dark:to-blue-800" />
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div class="text-center max-w-3xl mx-auto">
          <div class="inline-flex items-center gap-2 px-4 py-1.5 bg-primary-100 dark:bg-primary-900/30 rounded-full text-sm font-medium text-primary-700 dark:text-primary-300 mb-6 border border-primary-200 dark:border-primary-800 ">
            Open-source company search for Nepal
          </div>
          <h1 class="text-4xl sm:text-5xl lg:text-6xl font-bold text-surface-900 dark:text-surface-100 leading-tight mb-6 animate-fade-up" style="animation-delay: 0.1s">
            Search Registered<br/>
            <span class="text-blue-600">Companies in Nepal</span>
          </h1>
          <p class="text-lg sm:text-xl text-surface-500 dark:text-surface-400 mb-8 max-w-2xl mx-auto animate-fade-up" style="animation-delay: 0.2s">
            Find any company registered in Nepal instantly. Search by name, registration number, address, and more.
          </p>
          <div class="flex items-center justify-center gap-3 animate-fade-up" style="animation-delay: 0.3s">
            <div class="relative flex-1 max-w-lg">
              <MagnifyingGlassIcon class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400" />
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Search company name, registration number..."
                class="w-full pl-12 pr-4 py-3.5 bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-2xl text-surface-900 dark:text-surface-100 placeholder-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition-all text-base shadow-lg shadow-surface-200/50 dark:shadow-surface-900/50"
                @keyup.enter="handleSearch"
                @input="onSearchInput"
              />
        
            <Transition name="slide-up ">
              <div
                v-if="showSuggestions"
                class="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-surface-800 rounded-2xl shadow-xl border border-surface-200 dark:border-surface-700 z-50 overflow-hidden"
              >
                <div class="p-2">
                  <div class="px-3 py-2 text-xs font-semibold text-surface-400 uppercase tracking-wider">Suggestions</div>
                  <button
                    v-for="s in suggestions"
                    :key="s.text"
                    class="w-full text-left px-3 py-2.5 rounded-xl hover:bg-surface-50 dark:hover:bg-surface-700/50 text-surface-700 dark:text-surface-300 transition-colors flex items-center gap-3"
                    @click="selectSuggestion(s)"
                  >
                    <MagnifyingGlassIcon class="w-4 h-4 text-surface-400" />
                    <span v-html="highlightSuggestion(s.text, searchQuery)" />
                  </button>
                </div>

              </div>
            </Transition>
            </div>
            <button
              @click="handleSearch"
              class="px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
            >
              Search
            </button>
          </div>
        </div>

        <!-- Quick Stats -->
        <div class="grid grid-cols-2 md:grid-cols-3 gap-4 mt-16 animate-fade-up" style="animation-delay: 0.4s">
          <div class="bg-white dark:bg-surface-800/50 rounded-2xl border border-surface-200 dark:border-surface-700/50 p-5 text-center hover:border-primary-300 dark:hover:border-primary-700 transition-all">
            <div class="text-2xl font-bold text-surface-900 dark:text-surface-100">{{ formatNumber(stats.totalCompanies || 0) }}</div>
            <div class="text-sm text-surface-500 dark:text-surface-400 mt-1">Total Companies</div>
          </div>
          <!-- <div class="bg-white dark:bg-surface-800/50 rounded-2xl border border-surface-200 dark:border-surface-700/50 p-5 text-center hover:border-primary-300 dark:hover:border-primary-700 transition-all">
            <div class="text-2xl font-bold text-surface-900 dark:text-surface-100">{{ formatNumber(Object.keys(stats.byProvince).length) }}</div>
            <div class="text-sm text-surface-500 dark:text-surface-400 mt-1">Provinces</div>
          </div> -->
          <div class="bg-white dark:bg-surface-800/50 rounded-2xl border border-surface-200 dark:border-surface-700/50 p-5 text-center hover:border-primary-300 dark:hover:border-primary-700 transition-all">
            <div class="text-2xl font-bold text-surface-900 dark:text-surface-100">{{ 
              Object.keys(stats.byDistrict).length > 77?77:
              formatNumber(Object.keys(stats.byDistrict).length) }}</div>
            <div class="text-sm text-surface-500 dark:text-surface-400 mt-1">Districts</div>
          </div>
          <div class="bg-white dark:bg-surface-800/50 rounded-2xl border border-surface-200 dark:border-surface-700/50 p-5 text-center hover:border-primary-300 dark:hover:border-primary-700 transition-all">
            <div class="text-2xl font-bold text-surface-900 dark:text-surface-100">{{ formatNumber(Object.keys(stats.byCategory).length) }}</div>
            <div class="text-sm text-surface-500 dark:text-surface-400 mt-1">Categories</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features -->
    <section class="py-16 sm:py-24">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <h2 class="text-3xl sm:text-4xl font-bold text-surface-900 dark:text-surface-100 mb-4">Why CompanyKhoja?</h2>
          <p class="text-lg text-surface-500 dark:text-surface-400 max-w-2xl mx-auto">Built for speed, transparency, and ease of use.</p>
        </div>
        <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <FeatureCard v-for="feature in features" :key="feature.title" v-bind="feature" />
        </div>
      </div>
    </section>

    <!-- Popular Categories -->
    <section class="py-16 sm:py-24 bg-white dark:bg-surface-900/30">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between mb-10">
          <div>
            <h2 class="text-3xl sm:text-4xl font-bold text-surface-900 dark:text-surface-100 mb-2">Browse by Category</h2>
            <p class="text-lg text-surface-500 dark:text-surface-400">Explore companies across different industries</p>
          </div>
          <NuxtLink to="/categories" class="hidden sm:inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors">
            View All
            <ArrowRightIcon class="w-4 h-4" />
          </NuxtLink>
        </div>
        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          <CategoryCard
            v-for="(cat, i) in popularCategories"
            :key="cat.name"
            :name="cat.name"
            :count="cat.count"
            :icon="cat.icon"
            :color="cat.color"
            :delay="0.1 * i"
          />
        </div>
        <div class="text-center mt-8 sm:hidden">
          <NuxtLink to="/categories" class="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors">
            View All Categories
            <ArrowRightIcon class="w-4 h-4" />
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Latest Companies -->
    <section class="py-16 sm:py-24">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between mb-10">
          <div>
            <h2 class="text-3xl sm:text-4xl font-bold text-surface-900 dark:text-surface-100 mb-2">Latest Registered</h2>
            <p class="text-lg text-surface-500 dark:text-surface-400">Recently registered companies</p>
          </div>
          <NuxtLink to="/search" class="hidden sm:inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors">
            View All
            <ArrowRightIcon class="w-4 h-4" />
          </NuxtLink>
        </div>
        <div class="grid md:grid-cols-2 gap-4">
          <CompanyCard v-for="company in latestCompanies" :key="company.id" :company="company" />
        </div>
      </div>
    </section>
    </template>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { MagnifyingGlassIcon, ArrowRightIcon } from '@heroicons/vue/24/outline'
import type { Company, SearchSuggestion } from '~/types'
import { companySlug } from '~/utils/formatter'

useHead({ title: 'Search Registered Companies in Nepal', meta: [
  { name: 'description', content: 'Free open-source search engine for registered companies in Nepal. Search by name, registration number, address, and more.' },
]})

const searchQuery = ref('')
const suggestions = ref<SearchSuggestion[]>([])
const showSuggestions = ref(false)
const router = useRouter()
const searchEngine = useSearchEngine()
const isReady = searchEngine.isIndexReady()
const dataLoading = ref(!isReady.value)
const stats = ref<import('~/types').Statistics>({ totalCompanies: 0, latestRegistrationDate: '', todayBS: '', lastUpdated: '', todayRegistrations: 0, weeklyRegistrations: 0, monthlyRegistrations: 0, byProvince: {}, byDistrict: {}, byType: {}, byOwnership: {}, byRokka: {}, byCategory: {}, yearlyGrowth: [], timeline: [] })
const latestCompanies = ref<Company[]>([])

watch(isReady, (ready) => { dataLoading.value = !ready })

onMounted(async () => {
  stats.value = await searchEngine.getStatistics()
  const result = await searchEngine.search('', {}, 'newest', 1, 6)
  latestCompanies.value = result.companies
})

let debounceTimer: ReturnType<typeof setTimeout>
function onSearchInput() {
  clearTimeout(debounceTimer)
  if (searchQuery.value.length < 2) { showSuggestions.value = false; return }
  debounceTimer = setTimeout(async () => {
    suggestions.value = await searchEngine.autocomplete(searchQuery.value)
    showSuggestions.value = suggestions.value.length > 0
  }, 150)
}

function highlightSuggestion(text: string, query: string) {
  if (!query) return text
  const idx = text.toLowerCase().indexOf(query.toLowerCase())
  if (idx === -1) return text
  return text.slice(0, idx) + '<strong class="text-primary-600 dark:text-primary-400 font-semibold">' + text.slice(idx, idx + query.length) + '</strong>' + text.slice(idx + query.length)
}

function selectSuggestion(s: SearchSuggestion) {
  showSuggestions.value = false
  router.push(`/company/${companySlug({ nameEnglish: s.text, id: s.id })}`)
}

function handleSearch() {
  if (searchQuery.value.trim()) {
    router.push(`/search?q=${encodeURIComponent(searchQuery.value.trim())}`)
  }
}

const features = [
  { icon: 'MagnifyingGlassIcon', title: 'Instant Search', description: 'Find companies in under 100ms with our optimized search index.', color: 'bg-gradient-to-br from-primary-500 to-primary-600' },
  { icon: 'FunnelIcon', title: 'Advanced Filters', description: 'Filter by province, district, company type, ownership, and more.', color: 'bg-gradient-to-br from-blue-500 to-blue-600' },
  { icon: 'ChartBarIcon', title: 'Statistics Dashboard', description: 'Visualize registration trends, growth patterns, and regional data.', color: 'bg-gradient-to-br from-indigo-500 to-indigo-600' },
  { icon: 'TagIcon', title: 'Auto Categorization', description: 'Companies are automatically classified into 30+ industry categories.', color: 'bg-gradient-to-br from-violet-500 to-violet-600' },
  { icon: 'ArrowDownTrayIcon', title: 'Export Data', description: 'Download search results as CSV or JSON with one click.', color: 'bg-gradient-to-br from-rose-500 to-rose-600' },
  { icon: 'DevicePhoneMobileIcon', title: 'PWA Support', description: 'Install as an app on your phone. Works offline with cached data.', color: 'bg-gradient-to-br from-cyan-500 to-cyan-600' },
]

const popularCategories = computed(() => {
  const s = stats.value
  const cats = Object.entries(s.byCategory).sort((a, b) => b[1] - a[1]).slice(0, 12)
  const iconMap: Record<string, string> = {
    Technology: 'CpuChipIcon',
    Education: 'AcademicCapIcon', School: 'BuildingLibraryIcon', College: 'GraduationCapIcon',
    Hospital: 'HeartIcon', Healthcare: 'HeartIcon', Construction: 'BuildingOfficeIcon',
    Engineering: 'WrenchIcon', Finance: 'BanknotesIcon', Bank: 'BuildingLibraryIcon',
    Hydropower: 'BoltIcon', Manufacturing: 'CogIcon', Agriculture: 'SunIcon',
    Restaurant: 'FireIcon', Hotel: 'HomeIcon', Retail: 'ShoppingBagIcon',
    'Import Export': 'TruckIcon', NGO: 'UsersIcon', Media: 'VideoCameraIcon',
    Marketing: 'MegaphoneIcon', 'Real Estate': 'HomeIcon', Logistics: 'TruckIcon',
    Travel: 'MapIcon', Automobile: 'CarIcon', Startup: 'RocketLaunchIcon',
    Others: 'Squares2X2Icon',
  }
  const colorMap: Record<string, string> = {
    Technology: 'from-blue-500 to-blue-600',
    Education: 'from-emerald-500 to-emerald-600', School: 'from-green-500 to-green-600',
    College: 'from-teal-500 to-teal-600', Hospital: 'from-red-500 to-red-600',
    Healthcare: 'from-rose-500 to-rose-600', Construction: 'from-orange-500 to-orange-600',
    Engineering: 'from-amber-500 to-amber-600', Finance: 'from-yellow-500 to-yellow-600',
    Bank: 'from-lime-500 to-lime-600', Hydropower: 'from-indigo-500 to-indigo-600',
    Manufacturing: 'from-slate-500 to-slate-600', Agriculture: 'from-green-600 to-green-700',
    Restaurant: 'from-orange-600 to-orange-700', Hotel: 'from-pink-500 to-pink-600',
    Retail: 'from-purple-500 to-purple-600', 'Import Export': 'from-fuchsia-500 to-fuchsia-600',
    NGO: 'from-stone-500 to-stone-600', Media: 'from-red-600 to-red-700',
    Marketing: 'from-pink-600 to-pink-700', 'Real Estate': 'from-amber-600 to-amber-700',
    Logistics: 'from-gray-500 to-gray-600', Travel: 'from-cyan-600 to-cyan-700',
    Automobile: 'from-blue-600 to-blue-700', Startup: 'from-violet-600 to-violet-700',
    Others: 'from-zinc-500 to-zinc-600',
  }
  return cats.map(([name, count]: [string, number]) => ({
    name,
    count,
    icon: iconMap[name] || 'Squares2X2Icon',
    color: `bg-gradient-to-br ${colorMap[name] || 'from-zinc-500 to-zinc-600'}`,
  }))
})

</script>
