<template>
  <header class="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-surface-950 border-b border-gray-200 dark:border-surface-800">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <NuxtLink to="/" class="flex items-center gap-2.5">
         <img src="/logo.png" alt="CompanyKhoja Logo" class="w-6 h-6" />
          <span class="text-lg font-semibold text-gray-900 dark:text-surface-100">CompanyKhoja</span>
        </NuxtLink>

        <nav class="hidden md:flex items-center gap-1">
          <NuxtLink
            v-for="link in navLinks"
            :key="link.to"
            :to="link.to"
            class="px-3 py-2 rounded-lg text-sm font-medium transition-colors"
            :class="route.path === link.to
              ? 'text-blue-600 bg-blue-50'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'"
          >
            {{ link.label }}
          </NuxtLink>
        </nav>

        <div class="flex items-center gap-3">
          <button
            @click="searchStore.openCommandPalette()"
            class="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-surface-800 rounded-lg text-sm text-gray-500 dark:text-surface-400 hover:bg-gray-200 dark:hover:bg-surface-700 hover:text-gray-700 dark:hover:text-surface-200 transition-colors"
          >
            <MagnifyingGlassIcon class="w-4 h-4" />
            <span>Search</span>
            <kbd class="hidden lg:inline-flex px-1.5 py-0.5 bg-white dark:bg-surface-900 rounded text-xs font-mono border border-gray-200 dark:border-surface-700">⌘K</kbd>
          </button>

          <ColorModeToggle />

          <button
            @click="mobileMenuOpen = !mobileMenuOpen"
            class="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-surface-800 transition-colors"
            :aria-label="mobileMenuOpen ? 'Close menu' : 'Open menu'"
          >
            <Bars3Icon v-if="!mobileMenuOpen" class="w-5 h-5 text-gray-700 dark:text-surface-300" />
            <XMarkIcon v-else class="w-5 h-5 text-gray-700 dark:text-surface-300" />
          </button>
        </div>
      </div>
    </div>

    <Transition
      enter-active-class="transition-all duration-200"
      enter-from-class="opacity-0 -translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition-all duration-150"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-2"
    >
      <div
        v-if="mobileMenuOpen"
        class="md:hidden bg-white dark:bg-surface-950 border-t border-gray-200 dark:border-surface-800 shadow-lg"
      >
        <nav class="px-4 py-3 space-y-1">
          <NuxtLink
            v-for="link in navLinks"
            :key="link.to"
            :to="link.to"
            class="block px-3 py-2.5 rounded-lg text-sm font-medium transition-colors"
            :class="route.path === link.to
              ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50'
              : 'text-gray-600 dark:text-surface-400 hover:text-gray-900 dark:hover:text-surface-100 hover:bg-gray-100 dark:hover:bg-surface-800'"
            @click="mobileMenuOpen = false"
          >
            {{ link.label }}
          </NuxtLink>
        </nav>
      </div>
    </Transition>
  </header>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { MagnifyingGlassIcon, Bars3Icon, XMarkIcon } from '@heroicons/vue/24/outline'

const route = useRoute()
const searchStore = useSearchStore()
const mobileMenuOpen = ref(false)

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/search', label: 'Search' },
  { to: '/statistics', label: 'Statistics' },
  { to: '/categories', label: 'Categories' },
  { to: '/about', label: 'About' },
]
</script>