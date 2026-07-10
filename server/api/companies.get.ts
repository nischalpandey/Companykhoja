export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const q = String(query.q || '').trim()
  const sort = String(query.sort || 'newest')
  const page = Math.max(1, parseInt(String(query.page || '1')))
  const limit = Math.min(100, Math.max(1, parseInt(String(query.limit || '20'))))

  const filters: Record<string, string> = {}
  if (query.province) filters.province = String(query.province)
  if (query.district) filters.district = String(query.district)
  if (query.type) filters.companyType = String(query.type)
  if (query.ownership) filters.ownership = String(query.ownership)
  if (query.category) filters.category = String(query.category)
  if (query.rokka) filters.rokkaStatus = String(query.rokka)
  if (query.year) filters.registrationYear = String(query.year)
  if (query.letter) filters.letter = String(query.letter)

  const result = searchCompanies(q, filters, sort, page, limit)

  return {
    success: true,
    data: result.companies,
    pagination: { page: result.page, limit: result.limit, total: result.total, totalPages: result.totalPages },
    executionTimeMs: result.executionTimeMs,
    didYouMean: result.didYouMean,
  }
})
