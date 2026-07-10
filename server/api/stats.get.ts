export default defineEventHandler(async () => {
  const stats = getStatistics()
  return { success: true, data: stats }
})
