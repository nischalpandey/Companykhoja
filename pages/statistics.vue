<template>
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="mb-8">
        <h1 class="text-3xl sm:text-4xl font-bold text-surface-900 dark:text-surface-100 mb-2">Statistics Dashboard</h1>
        <p class="text-lg text-surface-500 dark:text-surface-400">Insights and analytics on registered companies in Nepal</p>
      </div>

      <!-- Stat Cards -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard title="Total Companies" :value="stats.totalCompanies ?? 0" icon="BuildingOfficeIcon" color="bg-gradient-to-br from-blue-500 to-blue-600" />
        <StatCard title="Today" :value="stats.todayRegistrations ?? 0" icon="CalendarDaysIcon" color="bg-gradient-to-br from-emerald-500 to-emerald-600" clickable @click="navigateToDate(latestDate)" />
        <StatCard title="This Week" :value="stats.weeklyRegistrations ?? 0" icon="CalendarDaysIcon" color="bg-gradient-to-br from-teal-500 to-teal-600" clickable @click="navigateToSearch({ sort: 'newest' })" />
        <StatCard title="This Month" :value="stats.monthlyRegistrations ?? 0" icon="CalendarDaysIcon" color="bg-gradient-to-br from-cyan-500 to-cyan-600" clickable @click="navigateToSearch({ sort: 'newest' })" />
      </div>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard title="Provinces" :value="Object.keys(stats.byProvince ?? {}).length" icon="MapIcon" color="bg-gradient-to-br from-indigo-500 to-indigo-600" />
        <StatCard title="Districts" :value="Object.keys(stats.byDistrict ?? {}).length" icon="MapPinIcon" color="bg-gradient-to-br from-violet-500 to-violet-600" />
        <StatCard title="Categories" :value="Object.keys(stats.byCategory ?? {}).length" icon="TagIcon" color="bg-gradient-to-br from-cyan-500 to-cyan-600" />
        <StatCard title="Company Types" :value="Object.keys(stats.byType ?? {}).length" icon="BriefcaseIcon" color="bg-gradient-to-br from-rose-500 to-rose-600" />
      </div>

      <!-- Charts Row 1 -->
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

      <!-- Charts Row 2 -->
      <div class="grid md:grid-cols-2 gap-6 mb-8">
        <div class="bg-white dark:bg-surface-800/50 rounded-2xl border border-surface-200 dark:border-surface-700/50 p-6">
          <h3 class="font-semibold text-surface-900 dark:text-surface-100 mb-4">Company Status</h3>
          <PieChart :data="rokkaChartData" />
        </div>
        <div class="bg-white dark:bg-surface-800/50 rounded-2xl border border-surface-200 dark:border-surface-700/50 p-6">
          <h3 class="font-semibold text-surface-900 dark:text-surface-100 mb-4">By Category</h3>
          <DoughnutChart :data="categoryChartData" />
        </div>
      </div>

      <!-- Timeline Chart (full width) -->
      <div class="bg-white dark:bg-surface-800/50 rounded-2xl border border-surface-200 dark:border-surface-700/50 p-6 mb-8">
        <h3 class="font-semibold text-surface-900 dark:text-surface-100 mb-4">Registration Timeline</h3>
        <LineChart :data="timelineChartData" />
      </div>

      <!-- Top Districts -->
      <div class="bg-white dark:bg-surface-800/50 rounded-2xl border border-surface-200 dark:border-surface-700/50 p-6 mb-8">
        <h3 class="font-semibold text-surface-900 dark:text-surface-100 mb-4">Top Districts</h3>
        <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div v-for="([district, count], index) in topDistricts" :key="district" class="flex items-center gap-4 p-4 bg-surface-50 dark:bg-surface-900 rounded-xl hover:bg-primary-50 dark:hover:bg-primary-950/30 transition-all" @click="navigateToSearch({ district })">
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
          <div v-for="([category, count], index) in topCategories" :key="category" class="flex items-center gap-4 p-4 bg-surface-50 dark:bg-surface-900 rounded-xl hover:bg-primary-50 dark:hover:bg-primary-950/30 transition-all" @click="navigateToCategory(category)">
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

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import type { Statistics } from '~/types'

useHead({ title: 'Statistics Dashboard' })

const searchEngine = useSearchEngine()
const stats = ref<Partial<Statistics>>({ totalCompanies: 0, todayRegistrations: 0, weeklyRegistrations: 0, monthlyRegistrations: 0, latestRegistrationDate: '', lastUpdated: '', byProvince: {}, byDistrict: {}, byType: {}, byOwnership: {}, byRokka: {}, byCategory: {}, yearlyGrowth: [], timeline: [] })

onMounted(async () => { stats.value = await searchEngine.getStatistics() })

const latestDate = computed(() => stats.value.latestRegistrationDate || '')

const chartColors = ['#2563eb', '#0d9488', '#ea580c', '#dc2626', '#8b5cf6', '#06b6d4', '#65a30d', '#d946ef', '#f59e0b', '#14b8a6', '#f97316', '#84cc16', '#06b6d4', '#a855f7', '#ec4899', '#e11d48']

function navigateToSearch(params: Record<string, string>) {
  navigateTo({ path: '/search', query: params })
}

function navigateToDate(date: string) {
  if (date) navigateToSearch({ date })
}

function navigateToCategory(category: string) {
  navigateToSearch({ category })
}

const provinceChartData = computed(() => ({
  labels: Object.keys(stats.value.byProvince || {}),
  datasets: [{ label: 'Companies', data: Object.values(stats.value.byProvince || {}), backgroundColor: '#2563eb' }],
}))

const typeChartData = computed(() => ({
  labels: Object.keys(stats.value.byType || {}),
  datasets: [{ data: Object.values(stats.value.byType || {}), backgroundColor: chartColors }],
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
  datasets: [{ data: Object.values(stats.value.byOwnership || {}), backgroundColor: chartColors }],
}))

const rokkaChartData = computed(() => ({
  labels: Object.keys(stats.value.byRokka || {}),
  datasets: [{ data: Object.values(stats.value.byRokka || {}), backgroundColor: ['#10b981', '#f59e0b', '#ef4444', '#6b7280'] }],
}))

const categoryChartData = computed(() => ({
  labels: Object.keys(stats.value.byCategory || {}),
  datasets: [{ data: Object.values(stats.value.byCategory || {}), backgroundColor: chartColors }],
}))

const timelineChartData = computed(() => ({
  labels: (stats.value.timeline || []).map((t) => t.date),
  datasets: [{
    label: 'Registrations',
    data: (stats.value.timeline || []).map((t) => t.count),
    borderColor: '#0d9488',
    backgroundColor: 'rgba(13, 148, 136, 0.1)',
    fill: true,
    tension: 0.3,
    pointRadius: 2,
  }],
}))

const topDistricts = computed(() =>
  Object.entries(stats.value.byDistrict || {}).sort((a, b) => b[1] - a[1]).slice(0, 12)
)

const topCategories = computed(() =>
  Object.entries(stats.value.byCategory || {}).sort((a, b) => b[1] - a[1]).slice(0, 12)
)
</script>