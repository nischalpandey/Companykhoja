<template>
  <div v-if="dataLoading" class="flex items-center justify-center min-h-[60vh]">
    <div class="text-center">
      <div class="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
      <p class="text-surface-500 dark:text-surface-400">Loading company data…</p>
    </div>
  </div>
  <template v-else>
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="mb-8">
        <h1 class="text-3xl sm:text-4xl font-bold text-surface-900 dark:text-surface-100 mb-2">Statistics Dashboard</h1>
        <p class="text-lg text-surface-500 dark:text-surface-400">Insights and analytics on registered companies in Nepal</p>
      </div>

      <!-- Stat Cards -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard title="Total Companies" :value="stats.totalCompanies ?? 0" icon="BuildingOfficeIcon" color="bg-gradient-to-br from-blue-500 to-blue-600" />
        <StatCard title="Today" :value="stats.todayRegistrations ?? 0" icon="CalendarDaysIcon" color="bg-gradient-to-br from-emerald-500 to-emerald-600" clickable @click="navigateToSearch({ date: navigateDate })" />
        <StatCard title="This Week" :value="stats.weeklyRegistrations ?? 0" icon="CalendarDaysIcon" color="bg-gradient-to-br from-teal-500 to-teal-600" clickable @click="navigateToSearch({ since: '7', sort: 'newest' })" />
        <StatCard title="This Month" :value="stats.monthlyRegistrations ?? 0" icon="CalendarDaysIcon" color="bg-gradient-to-br from-cyan-500 to-cyan-600" clickable @click="navigateToSearch({ since: '30', sort: 'newest' })" />
      </div>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard title="Districts" :value="77" icon="MapPinIcon" color="bg-gradient-to-br from-violet-500 to-violet-600" />
        <StatCard title="Categories" :value="Object.keys(stats.byCategory ?? {}).length" icon="TagIcon" color="bg-gradient-to-br from-cyan-500 to-cyan-600" />
        <StatCard title="Company Types" :value="Object.keys(stats.byType ?? {}).length" icon="BriefcaseIcon" color="bg-gradient-to-br from-rose-500 to-rose-600" />
      </div>

     

      <!-- Timeline Chart (full width)
      <div class="bg-white dark:bg-surface-800/50 rounded-2xl border border-surface-200 dark:border-surface-700/50 p-6 mb-8">
        <h3 class="font-semibold text-surface-900 dark:text-surface-100 mb-4">Registration Timeline</h3>
        <LineChart :data="timelineChartData" />
      </div> -->

      <!-- Top Districts -->
      <div class="bg-white dark:bg-surface-800/50 rounded-2xl border border-surface-200 dark:border-surface-700/50 p-6 mb-8">
        <h3 class="font-semibold text-surface-900 dark:text-surface-100 mb-4">Top Districts</h3>
        <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div v-for="([district, count], index) in topDistricts" :key="district" class="flex items-center gap-4 p-4 bg-surface-50 dark:bg-surface-900 rounded-xl hover:bg-primary-50 dark:hover:bg-primary-950/30 transition-all hover:cursor" @click="navigateToSearch({ district })">
            <div class="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-sm">{{ index + 1 }}</div>
            <div class="flex-1 min-w-0">
              <div class="font-medium text-surface-900 dark:text-surface-100 truncate">{{ district }}</div>
              <div class="text-sm text-surface-500">{{ formatNumber(count) }} companies</div>
            </div>
            <div class="text-sm font-semibold text-primary-600 dark:text-primary-400">{{ ((count / (stats.totalCompanies ?? 1)) * 100).toFixed(1) }}%</div>
          </div>
        </div>
      </div>

      <!-- Top Categories -->
      <div class="bg-white dark:bg-surface-800/50 rounded-2xl border border-surface-200 dark:border-surface-700/50 p-6">
        <h3 class="font-semibold text-surface-900 dark:text-surface-100 mb-4">Top Categories</h3>
        <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div v-for="([category, count], index) in topCategories" :key="category" class="flex items-center gap-4 p-4 bg-surface-50 dark:bg-surface-900 rounded-xl hover:bg-primary-50 dark:hover:bg-primary-950/30 transition-all " @click="navigateToCategory(category)">
            <div class="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white font-bold text-sm">{{ index + 1 }}</div>
            <div class="flex-1 min-w-0">
              <div class="font-medium text-surface-900 dark:text-surface-100 truncate">{{ category }}</div>
              <div class="text-sm text-surface-500">{{ formatNumber(count) }} companies</div>
            </div>
            <div class="text-sm font-semibold text-primary-600 dark:text-primary-400">{{ ((count / (stats.totalCompanies ?? 1)) * 100).toFixed(1) }}%</div>
          </div>
        </div>
      </div>
    </div>
  </template>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import type { Statistics } from '~/types'

useHead({ title: 'Statistics Dashboard' })

const searchEngine = useSearchEngine()
const isReady = searchEngine.isIndexReady()
const dataLoading = ref(!isReady.value)
const stats = ref<Partial<Statistics>>({ totalCompanies: 0, todayRegistrations: 0, weeklyRegistrations: 0, monthlyRegistrations: 0, todayBS: '', latestRegistrationDate: '', lastUpdated: '', byProvince: {}, byDistrict: {}, byType: {}, byOwnership: {}, byRokka: {}, byCategory: {}, yearlyGrowth: [], timeline: [] })

watch(isReady, (ready) => { dataLoading.value = !ready })

onMounted(async () => { stats.value = await searchEngine.getStatistics() })

const navigateDate = computed(() => stats.value.todayBS || stats.value.latestRegistrationDate || '')


function navigateToSearch(params: Record<string, string>) {
  navigateTo({ path: '/search', query: params })
}

function navigateToCategory(category: string) {
  navigateToSearch({ category })
}






const topDistricts = computed(() =>
  Object.entries(stats.value.byDistrict || {}).sort((a, b) => b[1] - a[1]).slice(0, 12)
)

const topCategories = computed(() =>
  Object.entries(stats.value.byCategory || {}).sort((a, b) => b[1] - a[1]).slice(0, 12)
)
</script>