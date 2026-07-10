<template>
  <div class="flex items-center gap-3 p-4 bg-surface-50 dark:bg-surface-900/50 rounded-xl border border-surface-200/50 dark:border-surface-700/30 opacity-70">
    <ClockIcon class="w-4 h-4 text-surface-400" />
    <span class="text-sm text-surface-500 dark:text-surface-400">{{ label }}</span>
    <span class="ml-auto text-xs px-2.5 py-0.5 bg-surface-200 dark:bg-surface-700 rounded-full text-surface-500 font-medium">Coming Soon</span>
  </div>
</template>

<script setup lang="ts">
import { ClockIcon } from '@heroicons/vue/24/outline'
defineProps<{ label: string; status: string }>()
</script>
