<template>
    <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div class="bg-white dark:bg-surface-800/50 rounded-2xl border border-surface-200 dark:border-surface-700/50 p-8 md:p-12">
        <h1 class="text-3xl sm:text-4xl font-bold text-surface-900 dark:text-surface-100 mb-6">About CompanyKhoja</h1>
        <div class="space-y-6 text-surface-600 dark:text-surface-300 leading-relaxed">
          <p class="text-lg">CompanyKhoja is an open-source search engine for registered companies in Nepal. Our mission is to make company registration data accessible, searchable, and useful for everyone.</p>
          <div>
            <h2 class="text-2xl font-bold text-surface-900 dark:text-surface-100 mb-3">Our Mission</h2>
            <p>We believe that access to public company data should be free, fast, and easy. By building an open-source platform, we ensure transparency and allow the community to contribute.</p>
          </div>
          <div>
            <h2 class="text-2xl font-bold text-surface-900 dark:text-surface-100 mb-3">Data Source</h2>
            <p>All company data is sourced from the <a href="https://ocr.gov.np" target="_blank" rel="noopener" class="text-primary-600 dark:text-primary-400 hover:underline">Office of Company Registrar (OCR)</a>, Government of Nepal.</p>
          </div>
          <div>
            <h2 class="text-2xl font-bold text-surface-900 dark:text-surface-100 mb-3">Open Source</h2>
            <p>This project is fully open source under the Apache License. View the source code on <a href="https://github.com/nischalpandey/companykhoja" target="_blank" rel="noopener" class="text-primary-600 dark:text-primary-400 hover:underline">GitHub</a>.</p>
          </div>
        </div>
      </div>
    </div>
</template>

<script setup lang="ts">
useHead({ title: 'About' })
</script>
