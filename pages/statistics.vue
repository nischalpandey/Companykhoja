<template>
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="mb-8">
        <h1 class="text-3xl sm:text-4xl font-bold text-surface-900 dark:text-surface-100 mb-2">Statistics Dashboard</h1>
        <p class="text-lg text-surface-500 dark:text-surface-400">Insights and analytics on registered companies in Nepal</p>
      </div>

      <!-- Stat Cards -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard title="Total Companies" :value="stats.totalCompanies ?? 0" icon="BuildingOfficeIcon" color="bg-gradient-to-br from-blue-500 to-blue-600" />
        <StatCard title="Provinces" :value="Object.keys(stats.byProvince ?? {}).length" icon="MapIcon" color="bg-gradient-to-br from-indigo-500 to-indigo-600" />
        <StatCard title="Districts" :value="Object.keys(stats.byDistrict ?? {}).length" icon="MapPinIcon" color="bg-gradient-to-br from-violet-500 to-violet-600" />
        <StatCard title="Categories" :value="Object.keys(stats.byCategory ?? {}).length" icon="TagIcon" color="bg-gradient-to-br from-cyan-500 to-cyan-600" />
      </div>

      <!-- Charts -->
      <div class="grid md:grid-cols-2 gap-6 mb-8">
        <div class="bg-white dark:bg-surface-800/50 rounded-2xl border border-surface-200 dark:border-surface-700/50 p-6">
          <h3 class="font-semibold text-surface-900 dark:text-surface-100 mb-4">Companies by Province</h3>
          <BarChart :data="provinceChartData" />
        </div>
        <div class="bg-white dark:bg-surface-800/50 rounded-2xl border border-surface-200 dark:border-surface-700/50 p-6">
          <h3 class="font-semibold text-surface-900 dark:text-surface-100 mb-4">Companies by Type</h3>
          <DoughnutChart :data="typeChartData" />
        </div>
        <div class="bg-white dark:bg-surface-800/50 rounded-2xl border border-surface-200 dark:border-surface-700/50 p-6">
          <h3 class="font-semibold text-surface-900 dark:text-surface-100 mb-4">Yearly Growth</h3>
          <LineChart :data="yearlyChartData" />
        </div>
        <div class="bg-white dark:bg-surface-800/50 rounded-2xl border border-surface-200 dark:border-surface-700/50 p-6">
          <h3 class="font-semibold text-surface-900 dark:text-surface-100 mb-4">By Ownership</h3>
          <PieChart :data="ownershipChartData" />
        </div>
      </div>

      <!-- Top Districts -->
      <div class="bg-white dark:bg-surface-800/50 rounded-2xl border border-surface-200 dark:border-surface-700/50 p-6">
        <h3 class="font-semibold text-surface-900 dark:text-surface-100 mb-4">Top Districts</h3>
        <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div v-for="([district, count], index) in topDistricts" :key="district" class="flex items-center gap-4 p-4 bg-surface-50 dark:bg-surface-900 rounded-xl hover:bg-primary-50 dark:hover:bg-primary-950/30 transition-all" @click="navigateTosearch(district)">
            <div class="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-sm">{{ index + 1 }}</div>
            <div class="flex-1 min-w-0">
              <div class="font-medium text-surface-900 dark:text-surface-100 truncate">{{ district }}</div>
              <div class="text-sm text-surface-500">{{ formatNumber(count) }} companies</div>
            </div>
            <div class="text-sm font-semibold text-primary-600 dark:text-primary-400">{{ ((count / (stats.totalCompanies ?? 1)) * 100).toFixed(1) }}%</div>
          </div>
        </div>
      </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import type { Statistics } from '~/types'

useHead({ title: 'Statistics Dashboard' })

const searchEngine = useSearchEngine()
const stats = ref<Partial<Statistics>>({ totalCompanies: 0, byProvince: {}, byDistrict: {}, byType: {}, byOwnership: {}, byCategory: {}, yearlyGrowth: [] })



onMounted(async () => { stats.value = await searchEngine.getStatistics() })

const navigateTosearch = (district: string) => {
  const query = { district }
  navigateTo({ path: '/search', query })
}

const provinceChartData = computed(() => ({
  labels: Object.keys(stats.value.byProvince || {}),
  datasets: [{ label: 'Companies', data: Object.values(stats.value.byProvince || {}), backgroundColor: '#2563eb' }],
}))

const typeChartData = computed(() => ({
  labels: Object.keys(stats.value.byType || {}),
  datasets: [{ data: Object.values(stats.value.byType || {}), backgroundColor: ['#2563eb', '#0d9488', '#ea580c', '#dc2626', '#8b5cf6', '#06b6d4', '#65a30d', '#d946ef'] }],
}))

const yearlyChartData = computed(() => ({
  labels: (stats.value.yearlyGrowth || []).map((y) => String(y.year)),
  datasets: [{
    label: 'Registrations',
    data: (stats.value.yearlyGrowth || []).map((y) => y.count),
    borderColor: '#2563eb',
    backgroundColor: 'rgba(37, 99, 235, 0.1)',
    fill: true,
    tension: 0.4,
  }],
}))

const ownershipChartData = computed(() => ({
  labels: Object.keys(stats.value.byOwnership || {}),
  datasets: [{ data: Object.values(stats.value.byOwnership || {}), backgroundColor: ['#2563eb', '#0d9488', '#ea580c', '#dc2626', '#8b5cf6', '#65a30d', '#d946ef'] }],
}))

const topDistricts = computed(() =>
  Object.entries(stats.value.byDistrict || {}).sort((a, b) => b[1] - a[1]).slice(0, 12)
)
</script>
