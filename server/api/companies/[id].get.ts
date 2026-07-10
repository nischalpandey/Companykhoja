export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id') || ''
  const company = getCompanyById(id) || loadCompanies().find(c => c.registrationNumber === id)

  if (!company) {
    throw createError({ statusCode: 404, statusMessage: 'Company not found' })
  }

  return { success: true, data: company }
})
