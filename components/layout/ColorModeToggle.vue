<template>
  <button
    @click="toggleColorMode"
    class="p-2 rounded-lg hover:bg-gray-100 transition-colors"
    :aria-label="`Switch to ${colorMode.value === 'dark' ? 'light' : 'dark'} mode`"
  >
    <SunIcon v-if="colorMode.value === 'dark'" class="w-5 h-5 text-amber-400" />
    <MoonIcon v-else class="w-5 h-5 text-surface-500" />
  </button>
</template>

<script setup lang="ts">
import { SunIcon, MoonIcon } from '@heroicons/vue/24/outline'

const colorMode = useColorMode()

function toggleColorMode() {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}
</script>
