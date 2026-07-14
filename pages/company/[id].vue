<template>
    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Breadcrumbs -->
      <nav class="flex items-center gap-2 text-sm text-surface-500 dark:text-surface-400 mb-6">
        <NuxtLink to="/" class="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Home</NuxtLink>
        <ChevronRightIcon class="w-4 h-4" />
        <NuxtLink to="/search" class="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Search</NuxtLink>
        <ChevronRightIcon class="w-4 h-4" />
        <span class="text-surface-700 dark:text-surface-300 truncate max-w-xs font-medium">{{ company?.nameEnglish }}</span>
      </nav>

      <!-- Loading -->
      <div v-if="!company" class="space-y-6">
        <div class="h-40 bg-surface-200 dark:bg-surface-800 rounded-2xl animate-pulse" />
        <div class="grid md:grid-cols-3 gap-6">
          <div class="h-64 bg-surface-200 dark:bg-surface-800 rounded-2xl animate-pulse" />
          <div class="md:col-span-2 h-64 bg-surface-200 dark:bg-surface-800 rounded-2xl animate-pulse" />
        </div>
      </div>

      <!-- Company Detail -->
      <div v-else>
        <!-- Header Card -->
        <div class="bg-white dark:bg-surface-800/50 rounded-2xl border border-surface-200 dark:border-surface-700/50 p-6 md:p-8 mb-6">
          <div class="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
            <div class="flex-1">
              <div class="flex items-center gap-3 mb-4">
                <span
                  class="px-3 py-1 rounded-full text-xs font-semibold"
                  :class="company.rokkaStatus === 'Active'
                    ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                    : 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800'"
                >
                  {{ company.rokkaStatus }}
                </span>
                <span class="px-3 py-1 rounded-full text-xs font-semibold bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300 border border-primary-200 dark:border-primary-800">
                  {{ company.companyType }}
                </span>
                <span
                  class="px-3 py-1 rounded-full text-xs font-semibold text-white"
                  :class="getCategoryColor(company.category)"
                >
                  {{ company.category }}
                </span>
              </div>
              <h1 class="text-2xl md:text-3xl font-bold text-surface-900 dark:text-surface-100 mb-2">{{ company.nameEnglish }}</h1>
              <p v-if="company.nameNepali" class="text-lg text-surface-500 dark:text-surface-400">{{ company.nameNepali }}</p>
            </div>
            <div class="flex items-center gap-2">
              <button
                @click="shareCompany"
                class="p-2.5 rounded-xl border border-surface-200 dark:border-surface-700 text-surface-500 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800 hover:text-primary-600 dark:hover:text-primary-400 transition-all"
                :title="'Share'"
              >
                <ShareIcon class="w-5 h-5" />
              </button>
              <button
                @click="window.print()"
                class="p-2.5 rounded-xl border border-surface-200 dark:border-surface-700 text-surface-500 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800 hover:text-primary-600 dark:hover:text-primary-400 transition-all"
                :title="'Print'"
              >
                <PrinterIcon class="w-5 h-5" />
              </button>
              <button
                @click="downloadJSON"
                class="p-2.5 rounded-xl border border-surface-200 dark:border-surface-700 text-surface-500 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800 hover:text-primary-600 dark:hover:text-primary-400 transition-all"
                :title="'Download JSON'"
              >
                <ArrowDownTrayIcon class="w-5 h-5" />
              </button>
            </div>
          </div>

          <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8 pt-8 border-t border-surface-200 dark:border-surface-700">
            <InfoItem label="Registration Number" :value="company.registrationNumber" status="success" />
            <InfoItem
              label="Registration Date"
              :value="formatDate(company.registrationDate)"
            />
            <InfoItem label="Address" :value="company.address" />
            <InfoItem label="Province/District" :value="[company.district, company.province].filter(Boolean).join(', ') || 'N/A'" />
          </div>
        </div>

        <!-- Details Grid -->
        <div class="grid md:grid-cols-3 gap-6 mb-6">
          <div class="bg-white dark:bg-surface-800/50 rounded-2xl border border-surface-200 dark:border-surface-700/50 p-6">
            <h3 class="font-semibold text-surface-900 dark:text-surface-100 mb-4 flex items-center gap-2">
              <IdentificationIcon class="w-5 h-5 text-primary-500" />
              Company Details
            </h3>
            <div class="space-y-4">
              <InfoItem label="Company Type" :value="company.companyType" />
              <InfoItem label="Ownership" :value="company.ownership" />
              <InfoItem label="Rokka Status" :value="company.rokkaStatus" :status="company.rokkaStatus === 'Active' ? 'success' : 'warning'" />
              <InfoItem label="Category" :value="company.category" />
            </div>
          </div>

          <div class="bg-white dark:bg-surface-800/50 rounded-2xl border border-surface-200 dark:border-surface-700/50 p-6">
            <h3 class="font-semibold text-surface-900 dark:text-surface-100 mb-4 flex items-center gap-2">
              <MapPinIcon class="w-5 h-5 text-primary-500" />
              Location
            </h3>
            <div class="space-y-4">
              <InfoItem label="Province" :value="company.province || 'N/A'" />
              <InfoItem label="District" :value="company.district || 'N/A'" />
              <InfoItem v-if="company.municipality" label="Municipality" :value="company.municipality" />
              <InfoItem label="Full Address" :value="company.address || 'N/A'" />
            </div>
          </div>

          <div class="bg-white dark:bg-surface-800/50 rounded-2xl border border-surface-200 dark:border-surface-700/50 p-6">
            <h3 class="font-semibold text-surface-900 dark:text-surface-100 mb-4 flex items-center gap-2">
              <DocumentDuplicateIcon class="w-5 h-5 text-primary-500" />
              Quick Actions
            </h3>
            <div class="space-y-3">
              <button @click="copyRegNumber" class="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-surface-50 dark:bg-surface-900 text-surface-700 dark:text-surface-300 hover:bg-primary-50 dark:hover:bg-primary-950/50 hover:text-primary-600 dark:hover:text-primary-400 transition-all text-sm font-medium">
                <DocumentDuplicateIcon class="w-4 h-4" />
                Copy Registration Number
              </button>
              <NuxtLink :to="`/search?category=${encodeURIComponent(company.category)}`" class="flex items-center gap-3 px-4 py-3 rounded-xl bg-surface-50 dark:bg-surface-900 text-surface-700 dark:text-surface-300 hover:bg-primary-50 dark:hover:bg-primary-950/50 hover:text-primary-600 dark:hover:text-primary-400 transition-all text-sm font-medium">
                <TagIcon class="w-4 h-4" />
                Browse {{ company.category }} Companies
              </NuxtLink>
            </div>

            <!-- QR Code -->
            <div v-if="qrCodeUrl" class="mt-4 pt-4 border-t border-surface-200 dark:border-surface-700">
              <p class="text-xs text-surface-500 dark:text-surface-400 mb-2">Scan to view this company</p>
              <img :src="qrCodeUrl" alt="QR Code" class="w-24 h-24 mx-auto rounded-xl bg-white p-1" />
            </div>
          </div>
        </div>

        <!-- Similar Companies -->
        <div v-if="similarCompanies.length > 0" class="bg-white dark:bg-surface-800/50 rounded-2xl border border-surface-200 dark:border-surface-700/50 p-6 mb-6">
          <h3 class="font-semibold text-surface-900 dark:text-surface-100 mb-4">Similar Companies</h3>
          <div class="grid sm:grid-cols-2 gap-3">
            <NuxtLink
              v-for="c in similarCompanies"
              :key="c.id"
              :to="`/company/${c.id}`"
              class="flex items-center gap-3 p-3 rounded-xl bg-surface-50 dark:bg-surface-900 hover:bg-primary-50 dark:hover:bg-primary-950/50 transition-all group"
            >
              <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-xs font-bold">
                {{ getInitials(c.nameEnglish) }}
              </div>
              <div class="flex-1 min-w-0">
                <div class="text-sm font-medium text-surface-900 dark:text-surface-100 truncate group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">{{ c.nameEnglish }}</div>
                <div class="text-xs text-surface-500">{{ c.registrationNumber }}</div>
              </div>
            </NuxtLink>
          </div>
        </div>

        <!-- Web Enrichment -->
        <div v-if="loadingEnrichment" class="bg-white dark:bg-surface-800/50 rounded-2xl border border-surface-200 dark:border-surface-700/50 p-6">
          <div class="flex items-center gap-3 mb-4">
            <div class="w-5 h-5 rounded bg-surface-200 dark:bg-surface-700 animate-pulse" />
            <div class="h-5 w-24 bg-surface-200 dark:bg-surface-700 rounded animate-pulse" />
          </div>
          <div class="space-y-3">
            <div v-for="i in 3" :key="i" class="h-20 bg-surface-100 dark:bg-surface-800 rounded-xl animate-pulse" />
          </div>
        </div>
        <div v-else-if="enrichment" class="bg-white dark:bg-surface-800/50 rounded-2xl border border-surface-200 dark:border-surface-700/50 p-6">
          <h3 class="font-semibold text-surface-900 dark:text-surface-100 mb-4 flex items-center gap-2">
            <MagnifyingGlassIcon class="w-5 h-5 text-primary-500" />
            Additional Information
          </h3>

          <div v-if="enrichment.message" class="text-sm text-surface-500 dark:text-surface-400 py-4 text-center">
            {{ enrichment.message }}
          </div>

          <template v-else-if="enrichment.data">
            <!-- Image + Abstract -->
            <div v-if="enrichment.data.abstract" class="flex gap-4 mb-6">
              <img v-if="enrichment.data.imageUrl" :src="enrichment.data.imageUrl" alt="" class="w-20 h-20 rounded-xl object-contain bg-surface-100 dark:bg-surface-900 p-1 shrink-0" />
              <div>
                <p class="text-sm text-surface-600 dark:text-surface-300 leading-relaxed">{{ enrichment.data.abstract }}</p>
                <a v-if="enrichment.data.sourceUrl" :href="enrichment.data.sourceUrl" target="_blank" rel="noopener" class="text-xs text-primary-600 dark:text-primary-400 hover:underline mt-1 inline-block">Source: {{ enrichment.data.source }}</a>
              </div>
            </div>

            <!-- Infobox -->
            <div v-if="enrichment.data.infobox?.content?.length" class="mb-6">
              <div class="grid sm:grid-cols-2 gap-3">
                <div v-for="item in enrichment.data.infobox.content.filter((i: any) => i.label && i.value)" :key="item.label" class="flex items-start gap-2">
                  <span class="text-xs font-medium text-surface-500 dark:text-surface-400 min-w-24">{{ item.label }}</span>
                  <span class="text-xs text-surface-700 dark:text-surface-300">{{ item.value }}</span>
                </div>
              </div>
            </div>

            <!-- Web Results -->
            <div v-if="enrichment.data.results?.length">
              <h4 class="text-sm font-semibold text-surface-900 dark:text-surface-100 mb-3">Web Results</h4>
              <div class="space-y-3">
                <a
                  v-for="r in enrichment.data.results"
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
            </div>

            <!-- Related Topics -->
            <div v-if="enrichment.data.relatedTopics?.length" class="mt-6 pt-4 border-t border-surface-200 dark:border-surface-700">
              <h4 class="text-sm font-semibold text-surface-900 dark:text-surface-100 mb-3">Related Topics</h4>
              <div class="flex flex-wrap gap-2">
                <a
                  v-for="t in enrichment.data.relatedTopics"
                  :key="t.title"
                  :href="t.link"
                  target="_blank"
                  rel="noopener"
                  class="px-3 py-1.5 rounded-lg bg-surface-100 dark:bg-surface-800 text-xs text-surface-600 dark:text-surface-300 hover:bg-primary-100 dark:hover:bg-primary-900/30 hover:text-primary-600 dark:hover:text-primary-400 transition-all"
                >
                  {{ t.title }}
                </a>
              </div>
            </div>

            <!-- No content message -->
            <div v-if="!enrichment.data.abstract && !enrichment.data.results?.length && !enrichment.data.infobox?.content?.length" class="text-sm text-surface-500 dark:text-surface-400 py-4 text-center">
              No additional information found.
            </div>
          </template>
        </div>
      </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import {
  ChevronRightIcon, MapPinIcon, DocumentDuplicateIcon, ShareIcon,
  PrinterIcon, ArrowDownTrayIcon, IdentificationIcon, TagIcon, MagnifyingGlassIcon,
} from '@heroicons/vue/24/outline'
import type { Company } from '~/types'

const window = globalThis.window

const route = useRoute()
const searchEngine = useSearchEngine()
const searchStore = useSearchStore()

const company = ref<Company | undefined>()
const qrCodeUrl = ref('')
const enrichment = ref<any>(null)
const loadingEnrichment = ref(false)
const similarCompanies = ref<Company[]>([])

const companyId = computed(() => String((route.params as { id: string }).id))

onMounted(async () => {
  company.value = await searchEngine.getCompanyById(companyId.value)
  if (company.value) {
    searchStore.addRecentlyViewed(company.value)
    generateQRCode()
    fetchEnrichment()
    const result = await searchEngine.search('', { category: company.value.category as any }, 'newest', 1, 6)
    similarCompanies.value = result.companies.filter(c => c.id !== company.value!.id).slice(0, 5)
  }
})

async function fetchEnrichment() {
  loadingEnrichment.value = true
  try {
    const res = await fetch(`/api/enrich/${companyId.value}`)
    enrichment.value = await res.json()
  } catch {
    enrichment.value = { message: 'Failed to load web results' }
  } finally {
    loadingEnrichment.value = false
  }
}

useHead({ title: computed(() => company.value?.nameEnglish || 'Company Details') })

async function generateQRCode() {
  if (!company.value) return
  try {
    const QRCode = await import('qrcode')
    const url = `https://www.google.com/search?q=${company.value.nameEnglish}`
    qrCodeUrl.value = await QRCode.toDataURL(url, { width: 160, margin: 2 })
  } catch { qrCodeUrl.value = '' }
}

function copyRegNumber() {
  if (!company.value) return
  copyToClipboard(company.value.registrationNumber)
}

function shareCompany() {
  if (!company.value) return
  const url = `${window.location.origin}/company/${company.value.id}`
  if (navigator.share) {
    navigator.share({ title: company.value.nameEnglish, text: `Check out ${company.value.nameEnglish} on CompanyKhoja`, url })
  } else {
    copyToClipboard(url)
  }
}

function downloadJSON() {
  if (!company.value) return
  const blob = new Blob([JSON.stringify(company.value, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url; a.download = `${company.value.registrationNumber}.json`
  a.click(); URL.revokeObjectURL(url)
}
</script>
