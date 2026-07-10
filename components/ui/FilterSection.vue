<template>
  <div class="mb-5">
    <label class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2.5">{{ title }}</label>
    <slot />
  </div>
</template>

<script setup lang="ts">
defineProps<{ title: string }>()
</script>
