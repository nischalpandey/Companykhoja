<template>
  <div class="space-y-1.5">
    <div class="text-xs text-surface-500 dark:text-surface-400 uppercase tracking-wider font-medium">{{ label }}</div>
    <div class="flex items-center gap-2">
      <span class="text-surface-900 dark:text-surface-100 font-medium">{{ value || 'N/A' }}</span>
      <span
        v-if="status"
        class="w-2 h-2 rounded-full inline-block"
        :class="status === 'success' ? 'bg-emerald-500' : status === 'warning' ? 'bg-amber-500' : 'bg-red-500'"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  label: string
  value?: string
  status?: 'success' | 'warning' | 'error'
}>()
</script>
