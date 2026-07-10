/**
 * CompanyKhoja - Keyboard Navigation Composable
 * Handles keyboard shortcuts and accessibility
 */

import { onKeyStroke, useMagicKeys } from '@vueuse/core'

export function useKeyboardNavigation() {
  const searchStore = useSearchStore()

  // Command Palette: Ctrl+K or Cmd+K
  useMagicKeys({
    passive: false,
    onEventFired(e) {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        searchStore.toggleCommandPalette()
      }
    },
  })

  // Escape to close modals/palettes
  onKeyStroke('Escape', () => {
    if (searchStore.commandPaletteOpen) {
      searchStore.closeCommandPalette()
    }
  })

  // Slash to focus search
  onKeyStroke('/', (e) => {
    const target = e.target as HTMLElement
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return
    e.preventDefault()
    const searchInput = document.getElementById('global-search-input')
    searchInput?.focus()
  })

  // Navigation shortcuts
  onKeyStroke('g', (e) => {
    const target = e.target as HTMLElement
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return
    // 'g' + 'h' = go home, 'g' + 's' = go search, etc.
  })

  return {
    // Expose if needed for component-level handling
  }
}
