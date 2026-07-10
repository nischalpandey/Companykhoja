<template>
  <div class="fixed bottom-4 right-4 z-50 space-y-2">
    <TransitionGroup
      enter-active-class="transition-all duration-300"
      enter-from-class="opacity-0 translate-y-4"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition-all duration-300"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 translate-y-4"
    >
      <div
        v-for="toast in toasts"
        :key="toast.id"
        class="px-4 py-3 rounded-xl shadow-lg border flex items-center gap-3 min-w-[280px]"
        :class="toast.type === 'success' ? 'bg-emerald-50 dark:bg-emerald-900/30 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200' : 'bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200'"
      >
        <CheckCircleIcon v-if="toast.type === 'success'" class="w-5 h-5 flex-shrink-0" />
        <XCircleIcon v-else class="w-5 h-5 flex-shrink-0" />
        <span class="text-sm font-medium">{{ toast.message }}</span>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { CheckCircleIcon, XCircleIcon } from '@heroicons/vue/24/outline'

interface Toast {
  id: number
  message: string
  type: 'success' | 'error'
}

const toasts = ref<Toast[]>([])
let toastId = 0

function showToast(message: string, type: 'success' | 'error' = 'success') {
  const id = ++toastId
  toasts.value.push({ id, message, type })
  setTimeout(() => {
    toasts.value = toasts.value.filter((t) => t.id !== id)
  }, 3000)
}

defineExpose({ showToast })
</script>
