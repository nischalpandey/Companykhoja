export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const q = String(query.q || '').trim()
  const limit = Math.min(20, Math.max(1, parseInt(String(query.limit || '10'))))
  if (q.length < 2) return { success: true, data: [] }
  const results = autocomplete(q, limit)
  return { success: true, data: results }
})
