<template>
  <div
    class="group bg-white dark:bg-surface-800/50 rounded-2xl border border-surface-200 dark:border-surface-700/50 p-6 transition-all hover:shadow-xl hover:shadow-primary-500/5 dark:hover:shadow-primary-500/10 hover:-translate-y-0.5"
    :class="clickable ? 'cursor-pointer hover:border-primary-300 dark:hover:border-primary-700' : ''"
    @click="clickable && $emit('click')"
  >
    <div class="flex items-center gap-4">
      <div
        class="w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110"
        :class="color"
      >
        <component :is="iconComponent" class="w-6 h-6 text-white" />
      </div>
      <div>
        <div class="text-2xl font-bold text-surface-900 dark:text-surface-100">{{ formatNumber(value) }}</div>
        <div class="text-sm text-surface-500 dark:text-surface-400">{{ title }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  title: string
  value: number
  icon: string
  color: string
  clickable?: boolean
}>()
defineEmits<{ click: [] }>()
const iconComponent = computed(() => resolveIcon(props.icon))
</script>
