<template>
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="mb-10">
        <h1 class="text-3xl sm:text-4xl font-bold text-surface-900 dark:text-surface-100 mb-2">Browse by Category</h1>
        <p class="text-lg text-surface-500 dark:text-surface-400">Explore companies across different industries in Nepal</p>
      </div>
      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        <CategoryCard
          v-for="(cat, i) in categories"
          :key="cat.name"
          :name="cat.name"
          :count="cat.count"
          :icon="cat.icon"
          :color="cat.color"
          :delay="0.05 * i"
        />
      </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { CompanyCategory } from '~/types'

useHead({ title: 'Browse Categories' })

const searchEngine = useSearchEngine()

interface CategoryItem { name: string; count: number; icon: string; color: string }

const categories = ref<CategoryItem[]>([])

const iconMap: Record<string, string> = {
  Technology: 'CpuChipIcon', Software: 'CodeBracketIcon', IT: 'ServerIcon', AI: 'SparklesIcon',
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
  Technology: 'from-blue-500 to-blue-600', Software: 'from-cyan-500 to-cyan-600',
  IT: 'from-sky-500 to-sky-600', AI: 'from-violet-500 to-violet-600',
  Education: 'from-emerald-500 to-emerald-600', School: 'from-green-500 to-green-600',
  College: 'from-teal-500 to-teal-600', Hospital: 'from-red-500 to-red-600',
  Healthcare: 'from-rose-500 to-rose-600', Construction: 'from-orange-500 to-orange-600',
  Engineering: 'from-amber-500 to-amber-600', Finance: 'from-yellow-600 to-yellow-700',
  Bank: 'from-lime-600 to-lime-700', Hydropower: 'from-indigo-500 to-indigo-600',
  Manufacturing: 'from-slate-500 to-slate-600', Agriculture: 'from-green-600 to-green-700',
  Restaurant: 'from-orange-600 to-orange-700', Hotel: 'from-pink-500 to-pink-600',
  Retail: 'from-purple-500 to-purple-600', 'Import Export': 'from-fuchsia-500 to-fuchsia-600',
  NGO: 'from-stone-500 to-stone-600', Media: 'from-red-600 to-red-700',
  Marketing: 'from-pink-600 to-pink-700', 'Real Estate': 'from-amber-600 to-amber-700',
  Logistics: 'from-gray-500 to-gray-600', Travel: 'from-cyan-600 to-cyan-700',
  Automobile: 'from-blue-600 to-blue-700', Startup: 'from-violet-600 to-violet-700',
  Others: 'from-zinc-500 to-zinc-600',
}

onMounted(async () => {
  const stats = await searchEngine.getStatistics()
  const categoryNames = Object.keys(stats.byCategory) as CompanyCategory[]
  categories.value = categoryNames
    .map((name: CompanyCategory) => ({
      name,
      count: stats.byCategory[name] || 0,
      icon: iconMap[name] || 'Squares2X2Icon',
      color: `bg-gradient-to-br ${colorMap[name] || 'from-zinc-500 to-zinc-600'}`,
    }))
    .sort((a: CategoryItem, b: CategoryItem) => b.count - a.count)
})
</script>
