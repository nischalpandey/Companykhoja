<template>
  <NuxtLink
    :to="`/company/${company.id}`"
    class="group block bg-white dark:bg-surface-800/50 rounded-2xl border border-surface-200 dark:border-surface-700/50 p-5 hover:border-primary-300 dark:hover:border-primary-700 transition-all hover:shadow-xl hover:shadow-primary-500/5 dark:hover:shadow-primary-500/10 hover:-translate-y-0.5"
    @click="searchStore.addRecentlyViewed(company)"
  >
    <div class="flex items-start justify-between gap-4">
      <div class="flex-1 min-w-0">
        <div class="flex items-center gap-2 mb-3">
          <span
            class="px-2.5 py-0.5 rounded-full text-xs font-semibold"
            :class="company.rokkaStatus === 'Active'
              ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
              : 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800'"
          >
            {{ company.rokkaStatus }}
          </span>
          <span class="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300 border border-primary-200 dark:border-primary-800">
            {{ company.companyType }}
          </span>
        </div>
        <h3 class="font-semibold text-surface-900 dark:text-surface-100 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors truncate text-base" v-html="highlightedName" />
        <p v-if="company.nameNepali" class="text-sm text-surface-500 dark:text-surface-400 mt-1">{{ company.nameNepali }}</p>
        <div class="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-3 text-sm text-surface-500 dark:text-surface-400">
          <span class="flex items-center gap-1.5">
            <IdentificationIcon class="w-4 h-4" />
            {{ company.registrationNumber }}
          </span>
          <span class="flex items-center gap-1.5">
            <CalendarIcon class="w-4 h-4" />
            {{ formatDate(company.registrationDate) }}
          </span>
          <span class="flex items-center gap-1.5">
            <MapPinIcon class="w-4 h-4" />
            {{ company.district || company.province || 'N/A' }}
          </span>
        </div>
      </div>
      <div class="flex-shrink-0">
        <span
          class="inline-block px-3 py-1 rounded-lg text-xs font-semibold text-white"
          :class="getCategoryColor(company.category)"
        >
          {{ company.category }}
        </span>
      </div>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { IdentificationIcon, CalendarIcon, MapPinIcon } from '@heroicons/vue/24/outline'
import type { Company } from '~/types'

const props = defineProps<{
  company: Company
  highlight?: string
}>()

const searchStore = useSearchStore()

const highlightedName = computed(() => {
  if (!props.highlight) return props.company.nameEnglish
  return highlightText(props.company.nameEnglish, props.highlight)
})
</script>
