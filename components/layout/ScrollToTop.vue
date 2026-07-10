<template>
  <Transition
    enter-active-class="transition-all duration-300"
    enter-from-class="opacity-0 translate-y-4 scale-95"
    enter-to-class="opacity-100 translate-y-0 scale-100"
    leave-active-class="transition-all duration-200"
    leave-from-class="opacity-100 translate-y-0 scale-100"
    leave-to-class="opacity-0 translate-y-4 scale-95"
  >
    <button
      v-if="show"
      @click="scrollToTop"
      class="fixed bottom-8 right-8 p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg transition-all z-50"
      aria-label="Scroll to top"
    >
      <ArrowUpIcon class="w-5 h-5" />
    </button>
  </Transition>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { ArrowUpIcon } from '@heroicons/vue/24/outline'

const show = ref(false)

function handleScroll() {
  show.value = window.scrollY > 400
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

onMounted(() => window.addEventListener('scroll', handleScroll, { passive: true }))
onUnmounted(() => window.removeEventListener('scroll', handleScroll))
</script>
