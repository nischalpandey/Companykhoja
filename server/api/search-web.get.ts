export default defineEventHandler(async (event) => {
  const q = String(getQuery(event).q || '').trim()
  if (!q || q.length < 2) {
    return { success: true, data: null }
  }

  const query = encodeURIComponent(`${q} Nepal company`)
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

    const abstract = json.AbstractText || ''
    const source = json.AbstractSource || ''
    const sourceUrl = json.AbstractURL || ''
    const imageUrl = json.Image || ''

    return {
      success: true,
      data: { abstract, source, sourceUrl, imageUrl, results },
    }
  } catch {
    return { success: true, data: null }
  }
})
