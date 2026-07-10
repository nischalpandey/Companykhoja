export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const companies = loadCompanies()
  const company = companies.find(c => c.id === id || c.registrationNumber === id)

  if (!company) {
    throw createError({ statusCode: 404, statusMessage: 'Company not found' })
  }

  const queries = [
    `${company.nameEnglish} ${company.district} Nepal`,
    `${company.nameEnglish} company Nepal ${company.registrationNumber}`,
  ]

  for (const q of queries) {
    const query = encodeURIComponent(q)
    const url = `https://api.duckduckgo.com/?q=${query}&format=json&no_html=1&skip_disambig=1`

    try {
      const res = await fetch(url, {
        headers: { 'User-Agent': 'CompanyKhoja/1.0' },
      })
      const json = await res.json()

      const results = (json.Results || []).map((item: any) => ({
        title: item.Text || item.FirstURL || '',
        link: item.FirstURL || '',
        snippet: (item.Result || '').replace(/<[^>]*>/g, ''),
        displayLink: item.FirstURL ? new URL(item.FirstURL).hostname : '',
      }))

      const relatedTopics = (json.RelatedTopics || [])
        .filter((t: any) => t.Text)
        .slice(0, 5)
        .map((t: any) => ({
          title: t.Text,
          link: t.FirstURL || '',
        }))

      const imageUrl = json.Image || ''
      const abstract = json.AbstractText || ''
      const infobox = json.Infobox || null
      const answer = json.Answer || ''
      const source = json.AbstractSource || ''
      const sourceUrl = json.AbstractURL || ''

      return {
        success: true,
        data: {
          abstract,
          source,
          sourceUrl,
          imageUrl,
          imageWidth: json.ImageWidth,
          imageHeight: json.ImageHeight,
          answer,
          infobox,
          results,
          relatedTopics,
        },
      }
    } catch {
      continue
    }
  }

  return { success: true, data: null, message: 'No results found' }
})
