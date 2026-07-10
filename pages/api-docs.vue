<template>
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-surface-900 dark:text-surface-100 mb-2">API Documentation</h1>
      <p class="text-surface-500 dark:text-surface-400">Programmatic access to registered company data in Nepal.</p>
    </div>

    <div class="space-y-6">
      <div class="bg-white dark:bg-surface-800/50 rounded-xl border border-surface-200 dark:border-surface-700/50 p-6">
        <h2 class="text-lg font-semibold text-surface-900 dark:text-surface-100 mb-3">Base URL</h2>
        <div class="bg-surface-900 rounded-lg p-3 overflow-x-auto"><code class="text-sm text-emerald-400">http://localhost:3000/api</code></div>
        <p class="text-sm text-surface-500 mt-2">All endpoints return JSON with <code class="text-blue-600">success</code> boolean and <code class="text-blue-600">data</code> payload.</p>
      </div>

      <!-- GET /api/companies -->
      <div class="bg-white dark:bg-surface-800/50 rounded-xl border border-surface-200 dark:border-surface-700/50 overflow-hidden">
        <div class="flex items-center gap-3 px-6 py-4 bg-green-50 dark:bg-green-950/30 border-b border-surface-200 dark:border-surface-700">
          <span class="px-2 py-0.5 rounded text-xs font-bold bg-green-600 text-white">GET</span>
          <code class="text-sm font-mono text-surface-900 dark:text-surface-100">/api/companies</code>
        </div>
        <div class="p-6 space-y-4">
          <p class="text-sm text-surface-600 dark:text-surface-300">Search and list registered companies with filters and pagination.</p>

          <div>
            <h4 class="text-sm font-semibold text-surface-900 dark:text-surface-100 mb-2">Query Parameters</h4>
            <div class="overflow-x-auto">
              <table class="w-full text-sm">
                <thead><tr class="border-b border-surface-200 dark:border-surface-700"><th class="text-left py-2 pr-4 font-medium text-surface-900 dark:text-surface-100">Param</th><th class="text-left py-2 pr-4 font-medium text-surface-900 dark:text-surface-100">Type</th><th class="text-left py-2 font-medium text-surface-900 dark:text-surface-100">Description</th></tr></thead>
                <tbody class="text-surface-600 dark:text-surface-300">
                  <tr class="border-b border-surface-100 dark:border-surface-800"><td class="py-2 pr-4 font-mono">q</td><td class="py-2 pr-4">string</td><td class="py-2">Search term (name, registration number, address)</td></tr>
                  <tr class="border-b border-surface-100 dark:border-surface-800"><td class="py-2 pr-4 font-mono">province</td><td class="py-2 pr-4">string</td><td class="py-2">Filter by province name</td></tr>
                  <tr class="border-b border-surface-100 dark:border-surface-800"><td class="py-2 pr-4 font-mono">district</td><td class="py-2 pr-4">string</td><td class="py-2">Filter by district name</td></tr>
                  <tr class="border-b border-surface-100 dark:border-surface-800"><td class="py-2 pr-4 font-mono">type</td><td class="py-2 pr-4">string</td><td class="py-2">Filter by company type (e.g. Private Limited)</td></tr>
                  <tr class="border-b border-surface-100 dark:border-surface-800"><td class="py-2 pr-4 font-mono">ownership</td><td class="py-2 pr-4">string</td><td class="py-2">Filter by ownership (Nepali, Foreign, Solo Owner, etc.)</td></tr>
                  <tr class="border-b border-surface-100 dark:border-surface-800"><td class="py-2 pr-4 font-mono">category</td><td class="py-2 pr-4">string</td><td class="py-2">Filter by industry category</td></tr>
                  <tr class="border-b border-surface-100 dark:border-surface-800"><td class="py-2 pr-4 font-mono">rokka</td><td class="py-2 pr-4">string</td><td class="py-2">Filter by status (Active, Under Rokka)</td></tr>
                  <tr class="border-b border-surface-100 dark:border-surface-800"><td class="py-2 pr-4 font-mono">year</td><td class="py-2 pr-4">number</td><td class="py-2">Filter by registration year (BS)</td></tr>
                  <tr class="border-b border-surface-100 dark:border-surface-800"><td class="py-2 pr-4 font-mono">letter</td><td class="py-2 pr-4">string</td><td class="py-2">Filter by starting letter of company name</td></tr>
                  <tr class="border-b border-surface-100 dark:border-surface-800"><td class="py-2 pr-4 font-mono">sort</td><td class="py-2 pr-4">string</td><td class="py-2">Sort order: newest, oldest, az, za</td></tr>
                  <tr class="border-b border-surface-100 dark:border-surface-800"><td class="py-2 pr-4 font-mono">page</td><td class="py-2 pr-4">number</td><td class="py-2">Page number (default: 1)</td></tr>
                  <tr><td class="py-2 pr-4 font-mono">limit</td><td class="py-2 pr-4">number</td><td class="py-2">Results per page (max: 100, default: 20)</td></tr>
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h4 class="text-sm font-semibold text-surface-900 dark:text-surface-100 mb-2">Example Request</h4>
            <div class="bg-surface-900 rounded-lg p-3 overflow-x-auto"><pre class="text-sm text-blue-300">GET /api/companies?q=kathmandu&type=Private%20Limited&page=1&limit=10</pre></div>
          </div>

          <div>
            <h4 class="text-sm font-semibold text-surface-900 dark:text-surface-100 mb-2">Response</h4>
            <div class="bg-surface-900 rounded-lg p-3 overflow-x-auto"><pre class="text-sm text-blue-300">{
  "success": true,
  "data": [{ ...company }],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 342,
    "totalPages": 35
  }
}</pre></div>
          </div>
        </div>
      </div>

      <!-- GET /api/companies/:id -->
      <div class="bg-white dark:bg-surface-800/50 rounded-xl border border-surface-200 dark:border-surface-700/50 overflow-hidden">
        <div class="flex items-center gap-3 px-6 py-4 bg-green-50 dark:bg-green-950/30 border-b border-surface-200 dark:border-surface-700">
          <span class="px-2 py-0.5 rounded text-xs font-bold bg-green-600 text-white">GET</span>
          <code class="text-sm font-mono text-surface-900 dark:text-surface-100">/api/companies/:id</code>
        </div>
        <div class="p-6 space-y-4">
          <p class="text-sm text-surface-600 dark:text-surface-300">Get a single company by its ID or registration number.</p>

          <div>
            <h4 class="text-sm font-semibold text-surface-900 dark:text-surface-100 mb-2">Example Request</h4>
            <div class="bg-surface-900 rounded-lg p-3 overflow-x-auto"><pre class="text-sm text-blue-300">GET /api/companies/351676</pre></div>
          </div>

          <div>
            <h4 class="text-sm font-semibold text-surface-900 dark:text-surface-100 mb-2">Response</h4>
            <div class="bg-surface-900 rounded-lg p-3 overflow-x-auto"><pre class="text-sm text-blue-300">{
  "success": true,
  "data": {
    "id": "351676",
    "registrationNumber": "351676",
    "nameEnglish": "Share Vidhya Nepal",
    "nameNepali": "शेयर विद्या नेपाल",
    "registrationDate": "2081-05-18",
    "companyType": "Private Limited",
    "ownership": "Nepali",
    "address": "Kathmandu Metropolitan City-29,Kathmandu",
    "province": "",
    "district": "Kathmandu",
    "municipality": "Kathmandu Metropolitan City",
    "rokkaStatus": "Active",
    "category": "Technology",
    "keywords": ["share", "vidhya", "nepal"],
    "updatedAt": "2025-01-01T00:00:00.000Z",
    "createdAt": "2081-05-18"
  }
}</pre></div>
          </div>

          <div>
            <h4 class="text-sm font-semibold text-surface-900 dark:text-surface-100 mb-2">Error Response</h4>
            <div class="bg-surface-900 rounded-lg p-3 overflow-x-auto"><pre class="text-sm text-red-400">{
  "statusCode": 404,
  "statusMessage": "Company not found"
}</pre></div>
          </div>
        </div>
      </div>

      <!-- GET /api/stats -->
      <div class="bg-white dark:bg-surface-800/50 rounded-xl border border-surface-200 dark:border-surface-700/50 overflow-hidden">
        <div class="flex items-center gap-3 px-6 py-4 bg-green-50 dark:bg-green-950/30 border-b border-surface-200 dark:border-surface-700">
          <span class="px-2 py-0.5 rounded text-xs font-bold bg-green-600 text-white">GET</span>
          <code class="text-sm font-mono text-surface-900 dark:text-surface-100">/api/stats</code>
        </div>
        <div class="p-6 space-y-4">
          <p class="text-sm text-surface-600 dark:text-surface-300">Get aggregate statistics across all companies.</p>

          <div>
            <h4 class="text-sm font-semibold text-surface-900 dark:text-surface-100 mb-2">Response</h4>
            <div class="bg-surface-900 rounded-lg p-3 overflow-x-auto"><pre class="text-sm text-blue-300">{
  "success": true,
  "data": {
    "totalCompanies": 34,
    "byProvince": { "Bagmati": 20, ... },
    "byDistrict": { "Kathmandu": 15, ... },
    "byType": { "Private Limited": 30, ... },
    "byOwnership": { "Nepali": 32, ... },
    "byRokka": { "Active": 33, "Under Rokka": 1 },
    "byCategory": { "Technology": 5, ... },
    "yearlyGrowth": [
      { "year": 2075, "count": 2 },
      { "year": 2081, "count": 5 }
    ]
  }
}</pre></div>
          </div>
        </div>
      </div>

      <!-- Data Fields -->
      <div class="bg-white dark:bg-surface-800/50 rounded-xl border border-surface-200 dark:border-surface-700/50 p-6">
        <h2 class="text-lg font-semibold text-surface-900 dark:text-surface-100 mb-3">Company Fields</h2>
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead><tr class="border-b border-surface-200 dark:border-surface-700"><th class="text-left py-2 pr-4 font-medium text-surface-900 dark:text-surface-100">Field</th><th class="text-left py-2 pr-4 font-medium text-surface-900 dark:text-surface-100">Type</th><th class="text-left py-2 font-medium text-surface-900 dark:text-surface-100">Description</th></tr></thead>
            <tbody class="text-surface-600 dark:text-surface-300">
              <tr class="border-b border-surface-100 dark:border-surface-800"><td class="py-2 pr-4 font-mono">id</td><td class="py-2 pr-4">string</td><td class="py-2">Unique identifier</td></tr>
              <tr class="border-b border-surface-100 dark:border-surface-800"><td class="py-2 pr-4 font-mono">registrationNumber</td><td class="py-2 pr-4">string</td><td class="py-2">Official OCR registration number</td></tr>
              <tr class="border-b border-surface-100 dark:border-surface-800"><td class="py-2 pr-4 font-mono">nameEnglish</td><td class="py-2 pr-4">string</td><td class="py-2">Company name in English</td></tr>
              <tr class="border-b border-surface-100 dark:border-surface-800"><td class="py-2 pr-4 font-mono">nameNepali</td><td class="py-2 pr-4">string</td><td class="py-2">Company name in Nepali (Unicode)</td></tr>
              <tr class="border-b border-surface-100 dark:border-surface-800"><td class="py-2 pr-4 font-mono">registrationDate</td><td class="py-2 pr-4">string</td><td class="py-2">Registration date in BS (YYYY-MM-DD)</td></tr>
              <tr class="border-b border-surface-100 dark:border-surface-800"><td class="py-2 pr-4 font-mono">companyType</td><td class="py-2 pr-4">string</td><td class="py-2">Private Limited, Public Limited, Sole Proprietorship, etc.</td></tr>
              <tr class="border-b border-surface-100 dark:border-surface-800"><td class="py-2 pr-4 font-mono">ownership</td><td class="py-2 pr-4">string</td><td class="py-2">Nepali, Foreign, Joint Venture, Solo Owner, Multiple Owner, etc.</td></tr>
              <tr class="border-b border-surface-100 dark:border-surface-800"><td class="py-2 pr-4 font-mono">address</td><td class="py-2 pr-4">string</td><td class="py-2">Full registered address</td></tr>
              <tr class="border-b border-surface-100 dark:border-surface-800"><td class="py-2 pr-4 font-mono">province</td><td class="py-2 pr-4">string</td><td class="py-2">Province name</td></tr>
              <tr class="border-b border-surface-100 dark:border-surface-800"><td class="py-2 pr-4 font-mono">district</td><td class="py-2 pr-4">string</td><td class="py-2">District name</td></tr>
              <tr class="border-b border-surface-100 dark:border-surface-800"><td class="py-2 pr-4 font-mono">rokkaStatus</td><td class="py-2 pr-4">string</td><td class="py-2">Active, Under Rokka, Dissolved</td></tr>
              <tr class="border-b border-surface-100 dark:border-surface-800"><td class="py-2 pr-4 font-mono">category</td><td class="py-2 pr-4">string</td><td class="py-2">Auto-categorized industry (Technology, Finance, etc.)</td></tr>
              <tr><td class="py-2 pr-4 font-mono">keywords</td><td class="py-2 pr-4">string[]</td><td class="py-2">Search keywords extracted from company name</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Rate Limits & Auth -->
      <div class="bg-white dark:bg-surface-800/50 rounded-xl border border-surface-200 dark:border-surface-700/50 p-6">
        <h2 class="text-lg font-semibold text-surface-900 dark:text-surface-100 mb-3">Authentication & Limits</h2>
        <p class="text-sm text-surface-600 dark:text-surface-300 mb-3">This API is free and open. No authentication required. Rate limit: 60 requests per minute per IP.</p>
        <p class="text-sm text-surface-600 dark:text-surface-300">Data is updated daily from the <a href="https://ocr.gov.np" target="_blank" rel="noopener" class="text-blue-600 dark:text-blue-400 hover:underline">Office of Company Registrar, Nepal</a>.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
useHead({ title: 'API Documentation' })
</script>
