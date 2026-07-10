<template>
  <div class="group bg-white dark:bg-surface-800/50 rounded-2xl border border-surface-200 dark:border-surface-700/50 p-6 hover:border-primary-300 dark:hover:border-primary-700 transition-all hover:shadow-xl hover:shadow-primary-500/5 dark:hover:shadow-primary-500/10 hover:-translate-y-0.5" :style="{ animationDelay: `${delay}s` }">
    <div class="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110 group-hover:rotate-3" :class="color">
      <component :is="iconComponent" class="w-6 h-6 text-white" />
    </div>
    <h3 class="text-lg font-semibold text-surface-900 dark:text-surface-100 mb-2">{{ title }}</h3>
    <p class="text-sm text-surface-500 dark:text-surface-400 leading-relaxed">{{ description }}</p>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  icon: string
  title: string
  description: string
  color: string
  delay?: number
}>()
const iconComponent = computed(() => resolveIcon(props.icon))
</script>
