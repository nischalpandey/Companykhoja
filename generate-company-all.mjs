import {
  readFileSync,
  writeFileSync,
  existsSync,
  mkdirSync
} from 'fs'

import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')

const DATA_FILE = join(
  ROOT,
  'public',
  'data',
  'companies.json'
)

const OUTPUT_DIR = join(
  ROOT,
  '.output',
  'public',
  'company'
)

const SITE_URL =
  process.env.NUXT_PUBLIC_SITE_URL ||
  'https://companykhoja.ngp.com.np'

const SITE_NAME = 'Company Khoja'

// --------------------------------------------------
// Helpers
// --------------------------------------------------

function clean(value) {
  return String(value ?? '')
    .replace(/\s+/g, ' ')
    .trim()
}

function htmlEscape(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function slugify(name, id) {
  const slug = clean(name)
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
    .replace(/-+$/, '')

  return `${slug}-${id}`
}

function truncate(text, max = 155) {
  text = clean(text)

  if (text.length <= max) {
    return text
  }

  return (
    text
      .slice(0, max - 3)
      .replace(/\s+\S*$/, '') +
    '...'
  )
}

// --------------------------------------------------
// SEO description
// --------------------------------------------------

function createDescription(company) {
  const name = clean(company.nameEnglish)
  const type = clean(company.companyType)
  const category = clean(company.category)
  const municipality = clean(company.municipality)
  const district = clean(company.district)
  const status = clean(company.rokkaStatus)
  const registration = clean(company.registrationNumber)

  let text = `${name}`

  if (type) {
    text += ` is a ${type} company`
  } else {
    text += ` is a registered company`
  }

  if (category) {
    text += ` in the ${category} category`
  }

  if (municipality) {
    text += ` located in ${municipality}`
  } else if (district) {
    text += ` located in ${district}`
  }

  if (status) {
    text += `. Current status: ${status}`
  }

  if (registration) {
    text += `. Registration number: ${registration}`
  }

  text += '.'

  return truncate(text)
}

// --------------------------------------------------
// JSON-LD
// --------------------------------------------------

function createJsonLd(company, url) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: clean(company.nameEnglish),
    url
  }

  if (clean(company.nameNepali)) {
    data.alternateName = clean(company.nameNepali)
  }

  if (clean(company.registrationNumber)) {
    data.identifier = {
      '@type': 'PropertyValue',
      name: 'Company Registration Number',
      value: clean(company.registrationNumber)
    }
  }

  if (clean(company.address)) {
    data.address = {
      '@type': 'PostalAddress',
      streetAddress: clean(company.address),
      addressLocality:
        clean(company.municipality) ||
        clean(company.district),
      addressRegion: clean(company.province),
      addressCountry: 'NP'
    }
  }

  if (clean(company.category)) {
    data.category = clean(company.category)
  }

  return data
}

// --------------------------------------------------
// Generate HTML
// --------------------------------------------------

function generateHtml(company) {
  const name =
    clean(company.nameEnglish) ||
    clean(company.nameNepali) ||
    'Company'

  const nepaliName =
    clean(company.nameNepali)

  const id =
    clean(company.id)

  const registrationNumber =
    clean(company.registrationNumber)

  const registrationDate =
    clean(company.registrationDate)

  const companyType =
    clean(company.companyType)

  const ownership =
    clean(company.ownership)

  const address =
    clean(company.address)

  const district =
    clean(company.district)

  const municipality =
    clean(company.municipality)

  const province =
    clean(company.province)

  const status =
    clean(company.rokkaStatus)

  const category =
    clean(company.category)

  const companySlug =
    slugify(name, id)

  const url =
    `${SITE_URL}/company/${companySlug}/`

  const description =
    createDescription(company)

  const title =
    `${name} - Company Information | ${SITE_NAME}`

  const jsonLd =
    createJsonLd(company, url)

  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${htmlEscape(title)}</title><meta name="description" content="${htmlEscape(description)}"><meta name="robots" content="index,follow"><link rel="canonical" href="${htmlEscape(url)}"><meta property="og:title" content="${htmlEscape(title)}"><meta property="og:description" content="${htmlEscape(description)}"><meta property="og:url" content="${htmlEscape(url)}"><meta property="og:type" content="website"><script type="application/ld+json">${JSON.stringify(jsonLd)}</script></head><body><main><h1>${htmlEscape(name)}</h1>${nepaliName ? `<p>${htmlEscape(nepaliName)}</p>` : ''}<h2>Company Information</h2><dl>${registrationNumber ? `<dt>Registration Number</dt><dd>${htmlEscape(registrationNumber)}</dd>` : ''}${registrationDate ? `<dt>Registration Date</dt><dd>${htmlEscape(registrationDate)}</dd>` : ''}${companyType ? `<dt>Company Type</dt><dd>${htmlEscape(companyType)}</dd>` : ''}${ownership ? `<dt>Ownership</dt><dd>${htmlEscape(ownership)}</dd>` : ''}${status ? `<dt>Status</dt><dd>${htmlEscape(status)}</dd>` : ''}${category ? `<dt>Category</dt><dd>${htmlEscape(category)}</dd>` : ''}${address ? `<dt>Address</dt><dd>${htmlEscape(address)}</dd>` : ''}${municipality ? `<dt>Municipality</dt><dd>${htmlEscape(municipality)}</dd>` : ''}${district ? `<dt>District</dt><dd>${htmlEscape(district)}</dd>` : ''}${province ? `<dt>Province</dt><dd>${htmlEscape(province)}</dd>` : ''}</dl><p>${htmlEscape(description)}</p><p><a href="${htmlEscape(SITE_URL)}/">Company Khoja</a></p></main></body></html>`
}

// --------------------------------------------------
// Validate
// --------------------------------------------------

if (!existsSync(DATA_FILE)) {
  console.error('❌ companies.json not found:')
  console.error(DATA_FILE)
  process.exit(1)
}

console.log('📖 Loading companies.json...')

const companies = JSON.parse(
  readFileSync(DATA_FILE, 'utf8')
)

if (!Array.isArray(companies)) {
  console.error('❌ companies.json must contain an array')
  process.exit(1)
}

console.log(
  `📊 ${companies.length.toLocaleString()} companies loaded`
)

// --------------------------------------------------
// Prepare output directory
// --------------------------------------------------

mkdirSync(OUTPUT_DIR, {
  recursive: true
})

// --------------------------------------------------
// Generate company pages
// --------------------------------------------------

let generated = 0
let skipped = 0
let invalid = 0

const start = Date.now()

for (const company of companies) {
  const id = clean(company.id)
  const name = clean(company.nameEnglish)

  if (!id || !name) {
    invalid++
    continue
  }

  const companySlug =
    slugify(name, id)

  const companyDir =
    join(
      OUTPUT_DIR,
      companySlug
    )

  const htmlFile =
    join(
      companyDir,
      'index.html'
    )

  // ----------------------------------------------
  // SKIP IF ALREADY EXISTS
  // ----------------------------------------------

  if (existsSync(htmlFile)) {
    skipped++
    continue
  }

  // ----------------------------------------------
  // Create directory
  // ----------------------------------------------

  mkdirSync(companyDir, {
    recursive: true
  })

  // ----------------------------------------------
  // Create HTML
  // ----------------------------------------------

  writeFileSync(
    htmlFile,
    generateHtml(company),
    'utf8'
  )

  generated++

  if (generated % 10000 === 0) {
    const seconds =
      (Date.now() - start) / 1000

    console.log(
      `✅ Created: ${generated.toLocaleString()} | Skipped: ${skipped.toLocaleString()} | ${seconds.toFixed(1)}s`
    )
  }
}

// --------------------------------------------------
// Result
// --------------------------------------------------

const seconds =
  (Date.now() - start) / 1000

console.log('')
console.log('====================================')
console.log('🎉 SEO GENERATION COMPLETE')
console.log('====================================')

console.log(
  `🆕 Created: ${generated.toLocaleString()}`
)

console.log(
  `⏭️ Already existed: ${skipped.toLocaleString()}`
)

console.log(
  `⚠️ Invalid: ${invalid.toLocaleString()}`
)

console.log(
  `⏱️ Time: ${seconds.toFixed(2)} seconds`
)

console.log('')
console.log(
  `🌐 ${SITE_URL}/company/<slug>/`
)