<template>
  <NuxtLink
    :to="to"
    class="block px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200"
    :class="isActive
      ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-950/50'
      : 'text-surface-600 dark:text-surface-400 hover:text-surface-900 dark:hover:text-surface-100 hover:bg-surface-100 dark:hover:bg-surface-800'"
  >
    {{ label }}
  </NuxtLink>
</template>

<script setup lang="ts">
const props = defineProps<{ to: string; label: string }>()
defineEmits(['click'])
const route = useRoute()
const isActive = computed(() => route.path === props.to)
</script>
