export function formatDate(dateStr: string): string {
  if (!dateStr) return 'N/A'
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    const [y, m, d] = dateStr.split('-')
    const months = ['Baisakh', 'Jestha', 'Ashad', 'Shrawan', 'Bhadra', 'Ashwin', 'Kartik', 'Mangsir', 'Poush', 'Magh', 'Falgun', 'Chaitra']
    const monthIndex = (parseInt(m) - 2 + 12) % 12
    return `${months[monthIndex]} ${parseInt(d)}, ${y} BS`
  }
  try {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  } catch {
    return dateStr
  }
}

export function formatNumber(num: number): string {
  return num.toLocaleString('en-US')
}

export function formatRelativeTime(timestamp: number): string {
  const now = Date.now()
  const diff = now - timestamp
  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  const weeks = Math.floor(days / 7)
  const months = Math.floor(days / 30)
  const years = Math.floor(days / 365)

  if (years > 0) return `${years} year${years > 1 ? 's' : ''} ago`
  if (months > 0) return `${months} month${months > 1 ? 's' : ''} ago`
  if (weeks > 0) return `${weeks} week${weeks > 1 ? 's' : ''} ago`
  if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`
  return 'Just now'
}

export function highlightText(text: string, query: string): string {
  if (!query) return text
  const regex = new RegExp(`(${escapeRegex(query)})`, 'gi')
  return text.replace(regex, '<mark class="bg-blue-100 text-blue-800 px-0.5 rounded">$1</mark>')
}

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}

export function generateCompanyUrl(siteUrl: string, companyId: string): string {
  return `${siteUrl}/company/${companyId}`
}

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    const textarea = document.createElement('textarea')
    textarea.value = text
    textarea.style.position = 'fixed'
    textarea.style.opacity = '0'
    document.body.appendChild(textarea)
    textarea.select()
    const success = document.execCommand('copy')
    document.body.removeChild(textarea)
    return success
  }
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((word) => word[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

export function getCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    Technology: 'bg-blue-500',
    Education: 'bg-emerald-500',
    School: 'bg-green-500',
    College: 'bg-teal-500',
    Hospital: 'bg-red-500',
    Healthcare: 'bg-rose-500',
    Construction: 'bg-orange-500',
    Engineering: 'bg-amber-500',
    Finance: 'bg-yellow-600',
    Bank: 'bg-lime-600',
    Hydropower: 'bg-indigo-500',
    Manufacturing: 'bg-slate-500',
    Agriculture: 'bg-green-600',
    Restaurant: 'bg-orange-600',
    Hotel: 'bg-pink-500',
    Retail: 'bg-purple-500',
    'Import Export': 'bg-fuchsia-500',
    NGO: 'bg-stone-500',
    Media: 'bg-red-600',
    Marketing: 'bg-pink-600',
    'Real Estate': 'bg-amber-600',
    Logistics: 'bg-gray-500',
    Travel: 'bg-cyan-600',
    Automobile: 'bg-blue-600',
    Startup: 'bg-violet-600',
    Others: 'bg-zinc-500',
  }
  return colors[category] || 'bg-gray-500'
}

export function companySlug(company: { nameEnglish: string; id: string }): string {
  return company.nameEnglish.toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 80)
    .replace(/-$/, '') + '-' + company.id
}

export function parseSlug(slug: string): string {
  const parts = slug.split('-')
  return parts[parts.length - 1]
}
