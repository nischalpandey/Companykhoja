export function useCompanyData() {
  const loading = ref(false)
  const progress = ref(100)
  const error = ref<string | null>(null)

  async function loadData() {
    return []
  }

  return { loadData, loading, error, progress, isReady: true }
}
