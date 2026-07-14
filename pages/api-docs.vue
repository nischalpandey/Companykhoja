<template>
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-surface-900 dark:text-surface-100 mb-2">Data &amp; API</h1>
      <p class="text-surface-500 dark:text-surface-400">CompanyKhoja is fully static. Search, filters, and statistics run client-side from a single JSON file.</p>
    </div>

    <div class="space-y-6">

      <!-- Static Data File -->
      <div class="bg-white dark:bg-surface-800/50 rounded-xl border border-surface-200 dark:border-surface-700/50 overflow-hidden">
        <div class="flex items-center gap-3 px-6 py-4 bg-blue-50 dark:bg-blue-950/30 border-b border-surface-200 dark:border-surface-700">
          <span class="px-2 py-0.5 rounded text-xs font-bold bg-blue-600 text-white">STATIC</span>
          <code class="text-sm font-mono text-surface-900 dark:text-surface-100">/data/companies.json</code>
        </div>
        <div class="p-6 space-y-4">
          <p class="text-sm text-surface-600 dark:text-surface-300">The entire dataset (~160K companies) is served as a static JSON array. All search, filtering, and statistics are computed in the browser using MiniSearch + Fuse.js.</p>

          <div>
            <h4 class="text-sm font-semibold text-surface-900 dark:text-surface-100 mb-2">Typical usage</h4>
            <div class="bg-surface-900 rounded-lg p-3 overflow-x-auto"><pre class="text-sm text-blue-300">const res = await fetch('/companykhoja/data/companies.json')
const companies = await res.json()
// companies is an array of Company objects</pre></div>
          </div>
        </div>
      </div>

      <!-- Dev REST API -->
      <div class="bg-amber-50 dark:bg-amber-950/20 rounded-xl border border-amber-200 dark:border-amber-800/50 p-6">
        <div class="flex items-center gap-2 mb-3">
          <span class="px-2 py-0.5 rounded text-xs font-bold bg-amber-600 text-white">DEV ONLY</span>
          <code class="text-sm font-mono text-surface-500">http://localhost:3000/api</code>
        </div>
        <p class="text-sm text-surface-600 dark:text-surface-300">When running <code class="text-blue-600">npm run dev</code>, REST endpoints are available for local development. These <strong>do not exist</strong> in the static build on GitHub Pages.</p>
      </div>

      <!-- GET /api/companies -->
      <div class="bg-white dark:bg-surface-800/50 rounded-xl border border-surface-200 dark:border-surface-700/50 overflow-hidden">
        <div class="flex items-center gap-3 px-6 py-4 bg-green-50 dark:bg-green-950/30 border-b border-surface-200 dark:border-surface-700">
          <span class="px-2 py-0.5 rounded text-xs font-bold bg-green-600 text-white">GET</span>
          <code class="text-sm font-mono text-surface-900 dark:text-surface-100">/api/companies</code>
        </div>
        <div class="p-6 space-y-4">
          <p class="text-sm text-surface-600 dark:text-surface-300">Search and list companies with filters and pagination.</p>

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
                  <tr class="border-b border-surface-100 dark:border-surface-800"><td class="py-2 pr-4 font-mono">ownership</td><td class="py-2 pr-4">string</td><td class="py-2">Filter by ownership (Nepali, Foreign, etc.)</td></tr>
                  <tr class="border-b border-surface-100 dark:border-surface-800"><td class="py-2 pr-4 font-mono">category</td><td class="py-2 pr-4">string</td><td class="py-2">Filter by industry category (Technology, Finance, etc.)</td></tr>
                  <tr class="border-b border-surface-100 dark:border-surface-800"><td class="py-2 pr-4 font-mono">rokka</td><td class="py-2 pr-4">string</td><td class="py-2">Filter by status (Active, Under Rokka)</td></tr>
                  <tr class="border-b border-surface-100 dark:border-surface-800"><td class="py-2 pr-4 font-mono">year</td><td class="py-2 pr-4">number</td><td class="py-2">Filter by registration year (BS)</td></tr>
                  <tr class="border-b border-surface-100 dark:border-surface-800"><td class="py-2 pr-4 font-mono">date</td><td class="py-2 pr-4">string</td><td class="py-2">Filter by exact registration date (BS YYYY-MM-DD)</td></tr>
                  <tr class="border-b border-surface-100 dark:border-surface-800"><td class="py-2 pr-4 font-mono">since</td><td class="py-2 pr-4">number</td><td class="py-2">Show companies registered in the last N days from today (BS)</td></tr>
                  <tr class="border-b border-surface-100 dark:border-surface-800"><td class="py-2 pr-4 font-mono">letter</td><td class="py-2 pr-4">string</td><td class="py-2">Filter by starting letter of company name</td></tr>
                  <tr class="border-b border-surface-100 dark:border-surface-800"><td class="py-2 pr-4 font-mono">sort</td><td class="py-2 pr-4">string</td><td class="py-2">Sort: newest, oldest, az, za, registrationNumber, random</td></tr>
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
  "companies": [{ ...company }],
  "total": 342,
  "page": 1,
  "perPage": 10,
  "totalPages": 35,
  "executionTimeMs": 2
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
          <p class="text-sm text-surface-600 dark:text-surface-300">Get a single company by its ID.</p>

          <div>
            <h4 class="text-sm font-semibold text-surface-900 dark:text-surface-100 mb-2">Example Request</h4>
            <div class="bg-surface-900 rounded-lg p-3 overflow-x-auto"><pre class="text-sm text-blue-300">GET /api/companies/351676</pre></div>
          </div>

          <div>
            <h4 class="text-sm font-semibold text-surface-900 dark:text-surface-100 mb-2">Response</h4>
            <div class="bg-surface-900 rounded-lg p-3 overflow-x-auto"><pre class="text-sm text-blue-300">{
  "id": "351676",
  "registrationNumber": "351676",
  "nameEnglish": "Some Company",
  "nameNepali": "कम्पनी नाम",
  "registrationDate": "2081-05-18",
  "companyType": "Private Limited",
  "ownership": "Nepali",
  "address": "Kathmandu-29,Kathmandu",
  "province": "Bagmati",
  "district": "Kathmandu",
  "municipality": "Kathmandu Metropolitan City",
  "rokkaStatus": "Active",
  "category": "Technology",
  "keywords": ["keyword1", "keyword2"],
  "updatedAt": "2025-01-01T00:00:00.000Z",
  "createdAt": "2081-05-18"
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
          <p class="text-sm text-surface-600 dark:text-surface-300">Aggregate statistics across all companies.</p>

          <div>
            <h4 class="text-sm font-semibold text-surface-900 dark:text-surface-100 mb-2">Response</h4>
            <div class="bg-surface-900 rounded-lg p-3 overflow-x-auto"><pre class="text-sm text-blue-300">{
  "totalCompanies": 162874,
  "latestRegistrationDate": "2081-05-18",
  "todayBS": "2083-02-30",
  "lastUpdated": "2025-01-01T00:00:00.000Z",
  "todayRegistrations": 12,
  "weeklyRegistrations": 45,
  "monthlyRegistrations": 203,
  "byProvince": { "Bagmati": 50000, ... },
  "byDistrict": { "Kathmandu": 30000, ... },
  "byType": { "Private Limited": 120000, ... },
  "byOwnership": { "Nepali": 140000, ... },
  "byRokka": { "Active": 150000, "Under Rokka": 5000 },
  "byCategory": { "Technology": 15000, ... },
  "yearlyGrowth": [
    { "year": 2075, "count": 2000 },
    { "year": 2081, "count": 8000 }
  ],
  "timeline": [
    { "date": "2081-01-01", "count": 10 }
  ]
}</pre></div>
          </div>
        </div>
      </div>

      <!-- Company Fields -->
      <div class="bg-white dark:bg-surface-800/50 rounded-xl border border-surface-200 dark:border-surface-700/50 p-6">
        <h2 class="text-lg font-semibold text-surface-900 dark:text-surface-100 mb-3">Company Fields</h2>
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead><tr class="border-b border-surface-200 dark:border-surface-700"><th class="text-left py-2 pr-4 font-medium text-surface-900 dark:text-surface-100">Field</th><th class="text-left py-2 pr-4 font-medium text-surface-900 dark:text-surface-100">Type</th><th class="text-left py-2 font-medium text-surface-900 dark:text-surface-100">Description</th></tr></thead>
            <tbody class="text-surface-600 dark:text-surface-300">
              <tr class="border-b border-surface-100 dark:border-surface-800"><td class="py-2 pr-4 font-mono">id</td><td class="py-2 pr-4">string</td><td class="py-2">Unique identifier</td></tr>
              <tr class="border-b border-surface-100 dark:border-surface-800"><td class="py-2 pr-4 font-mono">registrationNumber</td><td class="py-2 pr-4">string</td><td class="py-2">OCR registration number</td></tr>
              <tr class="border-b border-surface-100 dark:border-surface-800"><td class="py-2 pr-4 font-mono">nameEnglish</td><td class="py-2 pr-4">string</td><td class="py-2">Company name in English</td></tr>
              <tr class="border-b border-surface-100 dark:border-surface-800"><td class="py-2 pr-4 font-mono">nameNepali</td><td class="py-2 pr-4">string</td><td class="py-2">Company name in Nepali</td></tr>
              <tr class="border-b border-surface-100 dark:border-surface-800"><td class="py-2 pr-4 font-mono">registrationDate</td><td class="py-2 pr-4">string</td><td class="py-2">Registration date in BS (YYYY-MM-DD)</td></tr>
              <tr class="border-b border-surface-100 dark:border-surface-800"><td class="py-2 pr-4 font-mono">companyType</td><td class="py-2 pr-4">string</td><td class="py-2">Private Limited, Public Limited, etc.</td></tr>
              <tr class="border-b border-surface-100 dark:border-surface-800"><td class="py-2 pr-4 font-mono">ownership</td><td class="py-2 pr-4">string</td><td class="py-2">Nepali, Foreign, Joint Venture, Solo Owner, etc.</td></tr>
              <tr class="border-b border-surface-100 dark:border-surface-800"><td class="py-2 pr-4 font-mono">address</td><td class="py-2 pr-4">string</td><td class="py-2">Full registered address</td></tr>
              <tr class="border-b border-surface-100 dark:border-surface-800"><td class="py-2 pr-4 font-mono">province</td><td class="py-2 pr-4">string</td><td class="py-2">Province name</td></tr>
              <tr class="border-b border-surface-100 dark:border-surface-800"><td class="py-2 pr-4 font-mono">district</td><td class="py-2 pr-4">string</td><td class="py-2">District name</td></tr>
              <tr class="border-b border-surface-100 dark:border-surface-800"><td class="py-2 pr-4 font-mono">municipality</td><td class="py-2 pr-4">string</td><td class="py-2">Municipality name</td></tr>
              <tr class="border-b border-surface-100 dark:border-surface-800"><td class="py-2 pr-4 font-mono">rokkaStatus</td><td class="py-2 pr-4">string</td><td class="py-2">Active, Under Rokka, Dissolved</td></tr>
              <tr class="border-b border-surface-100 dark:border-surface-800"><td class="py-2 pr-4 font-mono">category</td><td class="py-2 pr-4">string</td><td class="py-2">Industry category (Technology, Education, Finance, etc.)</td></tr>
              <tr><td class="py-2 pr-4 font-mono">keywords</td><td class="py-2 pr-4">string[]</td><td class="py-2">Search keywords extracted from company name</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Data Source -->
      <div class="bg-white dark:bg-surface-800/50 rounded-xl border border-surface-200 dark:border-surface-700/50 p-6">
        <h2 class="text-lg font-semibold text-surface-900 dark:text-surface-100 mb-3">Data Source</h2>
        <p class="text-sm text-surface-600 dark:text-surface-300">Data is sourced from the <a href="https://ocr.gov.np" target="_blank" rel="noopener" class="text-blue-600 dark:text-blue-400 hover:underline">Office of Company Registrar, Nepal</a> via their public search API. The full dataset is available on <a href="https://github.com/nischalpandey/companykhoja" target="_blank" rel="noopener" class="text-blue-600 dark:text-blue-400 hover:underline">GitHub</a>.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
useHead({ title: 'Data & API - CompanyKhoja' })
</script>
