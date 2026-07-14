<template>
  <footer class="bg-white dark:bg-surface-950 border-t border-gray-200 dark:border-surface-800">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
      <div class="grid md:grid-cols-4 gap-8 lg:gap-12">
        <div class="md:col-span-1">
          <NuxtLink to="/" class="flex items-center mb-4">
              <img src="/imglogo.png" alt="CompanyKhoja Logo" class="">
          </NuxtLink>
          <p class="text-sm text-gray-500 dark:text-surface-400 leading-relaxed">Open-source search engine for registered companies in Nepal.</p>
        </div>

        <div>
          <h4 class="text-sm font-semibold text-gray-900 dark:text-surface-100 mb-4">Product</h4>
          <ul class="space-y-3">
            <li><NuxtLink to="/search" class="text-sm text-gray-500 dark:text-surface-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Search</NuxtLink></li>
            <li><NuxtLink to="/statistics" class="text-sm text-gray-500 dark:text-surface-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Statistics</NuxtLink></li>
            <li><NuxtLink to="/categories" class="text-sm text-gray-500 dark:text-surface-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Categories</NuxtLink></li>
            <li><NuxtLink to="/api-docs" class="text-sm text-gray-500 dark:text-surface-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">API Docs</NuxtLink></li>
          </ul>
        </div>

        <div>
          <h4 class="text-sm font-semibold text-gray-900 dark:text-surface-100 mb-4">Company</h4>
          <ul class="space-y-3">
            <li><NuxtLink to="/about" class="text-sm text-gray-500 dark:text-surface-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">About</NuxtLink></li>
            <li><NuxtLink to="/faq" class="text-sm text-gray-500 dark:text-surface-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">FAQ</NuxtLink></li>
            <li><a href="https://github.com/nischalpandey/companykhoja" target="_blank" rel="noopener" class="text-sm text-gray-500 dark:text-surface-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">GitHub</a></li>
          </ul>
        </div>

        <div>
          <h4 class="text-sm font-semibold text-gray-900 dark:text-surface-100 mb-4">Legal</h4>
          <ul class="space-y-3">
            <li><NuxtLink to="/privacy" class="text-sm text-gray-500 dark:text-surface-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Privacy Policy</NuxtLink></li>
            <li><NuxtLink to="/disclaimer" class="text-sm text-gray-500 dark:text-surface-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Disclaimer</NuxtLink></li>
          </ul>
        </div>
      </div>

      <div class="mt-12 pt-8 border-t border-gray-200 dark:border-surface-800 flex flex-col md:flex-row items-center justify-between gap-4">
        <p class="text-sm text-gray-500 dark:text-surface-400">CompanyKhoja. Open source under Apache  License. Built by <a href="https://github.com/nischalpandey" target="_blank" rel="noopener" class="text-blue-600 dark:text-blue-400 hover:underline">Nischal</a></p>

        <p class="text-sm text-gray-500 dark:text-surface-400">Data last updated: {{ lastUpdated }}. Data sourced from <a href="https://ocr.gov.np" target="_blank" rel="noopener" class="text-blue-600 dark:text-blue-400 hover:underline">OCR, Nepal</a>.</p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
const lastUpdated = ref('')
const searchEngine = useSearchEngine()

onMounted(async () => {
  try {
    const stats = await searchEngine.getStatistics()
    if (stats?.lastUpdated) {
      const d = new Date(stats.lastUpdated)
      lastUpdated.value = d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    }
  } catch { lastUpdated.value = 'Loading…' }
})
</script>