<template>
  <NuxtLink
    :to="`/search?category=${encodeURIComponent(name)}`"
    class="group bg-white dark:bg-surface-800/50 rounded-2xl border border-surface-200 dark:border-surface-700/50 p-5 hover:border-primary-300 dark:hover:border-primary-700 transition-all hover:shadow-xl hover:shadow-primary-500/5 dark:hover:shadow-primary-500/10 hover:-translate-y-0.5 text-center"
    :style="{ animationDelay: `${delay}s` }"
  >
    <div class="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3 transition-transform group-hover:scale-110 group-hover:rotate-3" :class="color">
      <component :is="iconComponent" class="w-6 h-6 text-white" />
    </div>
    <h3 class="font-semibold text-surface-900 dark:text-surface-100 text-sm group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">{{ name }}</h3>
    <p class="text-xs text-surface-500 dark:text-surface-400 mt-1.5">{{ formatNumber(count) }} companies</p>
  </NuxtLink>
</template>

<script setup lang="ts">
const props = defineProps<{
  name: string
  count: number
  icon: string
  color: string
  delay?: number
}>()
const iconComponent = computed(() => resolveIcon(props.icon))
</script>
