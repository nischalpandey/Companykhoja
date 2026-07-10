<template>
    <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div class="bg-white dark:bg-surface-800/50 rounded-2xl border border-surface-200 dark:border-surface-700/50 p-8 md:p-12">
        <h1 class="text-3xl sm:text-4xl font-bold text-surface-900 dark:text-surface-100 mb-8">Frequently Asked Questions</h1>
        <div class="space-y-6">
          <div v-for="faq in faqs" :key="faq.question" class="border-b border-surface-200 dark:border-surface-700 pb-6 last:border-0">
            <h3 class="text-lg font-semibold text-surface-900 dark:text-surface-100 mb-2">{{ faq.question }}</h3>
            <p class="text-surface-600 dark:text-surface-300 leading-relaxed">{{ faq.answer }}</p>
          </div>
        </div>
      </div>
    </div>
</template>

<script setup lang="ts">
useHead({ title: 'FAQ' })
const faqs = [
  { question: 'What is CompanyKhoja?', answer: 'CompanyKhoja is an open-source search engine that makes it easy to find and search registered companies in Nepal.' },
  { question: 'Is the data accurate?', answer: 'We source data from the official Office of Company Registrar (OCR) and update it regularly. For legal verification, always check official OCR records.' },
  { question: 'Is it free to use?', answer: 'Yes, CompanyKhoja is completely free and open source with no usage limits.' },
  { question: 'How often is data updated?', answer: 'We perform daily incremental syncs and weekly full syncs to ensure data stays current.' },
  { question: 'Can I download data?', answer: 'Yes, you can export search results as CSV or JSON files directly from the search page.' },
  { question: 'What does Rokka mean?', answer: 'Rokka refers to a company whose operations have been suspended or frozen by the authorities.' },
]
</script>
