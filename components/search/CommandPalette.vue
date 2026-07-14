<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-all duration-200"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-all duration-150"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="searchStore.commandPaletteOpen"
        class="fixed inset-0 z-[100] bg-surface-950/60 backdrop-blur-sm"
        @click="searchStore.closeCommandPalette()"
      >
        <div class="flex items-start justify-center pt-[15vh] px-4" @click.stop>
          <div class="w-full max-w-xl bg-white dark:bg-surface-900 rounded-2xl shadow-2xl border border-surface-200 dark:border-surface-700 overflow-hidden animate-scale-in">
            <div class="flex items-center px-4 py-3.5 border-b border-surface-200 dark:border-surface-700">
              <MagnifyingGlassIcon class="w-5 h-5 text-surface-400" />
              <input
                ref="inputRef"
                v-model="query"
                type="text"
                placeholder="Search companies, pages, or commands..."
                class="w-full px-3 py-1.5 bg-transparent text-surface-900 dark:text-surface-100 placeholder-surface-400 focus:outline-none"
                @keyup.enter="execute"
                @keydown.esc="searchStore.closeCommandPalette()"
              />
              <kbd class="hidden sm:inline-flex px-2 py-1 bg-surface-100 dark:bg-surface-800 rounded-lg text-xs text-surface-500 font-mono border border-surface-200 dark:border-surface-600">ESC</kbd>
            </div>

            <div class="max-h-[60vh] overflow-y-auto p-2">
              <div v-if="pageResults.length > 0" class="mb-2">
                <div class="px-3 py-1.5 text-xs font-semibold text-surface-400 uppercase tracking-wider">Pages</div>
                <button
                  v-for="page in pageResults"
                  :key="page.path"
                  @click="navigate(page.path)"
                  class="w-full text-left px-3 py-2.5 rounded-xl hover:bg-surface-50 dark:hover:bg-surface-800/50 text-surface-700 dark:text-surface-300 transition-colors flex items-center gap-3"
                >
                  <component :is="page.icon" class="w-4 h-4 text-surface-400" />
                  {{ page.name }}
                </button>
              </div>

              <div v-if="companyResults.length > 0">
                <div class="px-3 py-1.5 text-xs font-semibold text-surface-400 uppercase tracking-wider">Companies</div>
                <button
                  v-for="company in companyResults"
                  :key="company.id"
                  @click="navigate(`/company/${companySlug(company)}`)"
                  class="w-full text-left px-3 py-2.5 rounded-xl hover:bg-surface-50 dark:hover:bg-surface-800/50 text-surface-700 dark:text-surface-300 transition-colors flex items-center gap-3"
                >
                  <BuildingOfficeIcon class="w-4 h-4 text-surface-400" />
                  <div>
                    <div class="text-sm font-medium">{{ company.nameEnglish }}</div>
                    <div class="text-xs text-surface-500">{{ company.registrationNumber }}</div>
                  </div>
                </button>
              </div>

              <div v-if="query.length > 0 && pageResults.length === 0 && companyResults.length === 0" class="py-10 text-center text-surface-400">
                <p class="text-sm">No results found for "{{ query }}"</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'
import { MagnifyingGlassIcon, BuildingOfficeIcon } from '@heroicons/vue/24/outline'
import type { Company, SearchSuggestion } from '~/types'
import { companySlug } from '~/utils/formatter'

const searchStore = useSearchStore()
const router = useRouter()
const searchEngine = useSearchEngine()

const query = ref('')
const inputRef = ref<HTMLInputElement>()
const companyResults = ref<Company[]>([])

const pages = [
  { name: 'Home', path: '/', icon: 'HomeIcon' },
  { name: 'Search', path: '/search', icon: 'MagnifyingGlassIcon' },
  { name: 'Statistics', path: '/statistics', icon: 'ChartBarIcon' },
  { name: 'Categories', path: '/categories', icon: 'TagIcon' },
  { name: 'API Docs', path: '/api-docs', icon: 'DocumentTextIcon' },
  { name: 'FAQ', path: '/faq', icon: 'QuestionMarkCircleIcon' },
  { name: 'Privacy', path: '/privacy', icon: 'ShieldCheckIcon' },
  { name: 'About', path: '/about', icon: 'InformationCircleIcon' },
]

const pageResults = computed(() => {
  if (!query.value) return []
  return pages.filter((p) => p.name.toLowerCase().includes(query.value.toLowerCase()))
})

watch(() => searchStore.commandPaletteOpen, (open) => {
  if (open) {
    nextTick(() => inputRef.value?.focus())
    query.value = ''
    companyResults.value = []
  }
})

watch(query, async (val) => {
  if (val.length < 2) { companyResults.value = []; return }
  const results = await searchEngine.autocomplete(val, 5)
  const companies = await Promise.all(results.map((r: SearchSuggestion) => searchEngine.getCompanyById(r.id)))
  companyResults.value = companies.filter(Boolean) as Company[]
})

function navigate(path: string) {
  searchStore.closeCommandPalette()
  router.push(path)
}

function execute() {
  if (companyResults.value.length > 0) navigate(`/company/${companySlug(companyResults.value[0])}`)
  else if (pageResults.value.length > 0) navigate(pageResults.value[0].path)
  else navigate(`/search?q=${encodeURIComponent(query.value)}`)
}
</script>
