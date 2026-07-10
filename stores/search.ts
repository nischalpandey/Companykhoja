/**
 * CompanyKhoja - Search Store (Pinia)
 * Manages search state, history, bookmarks, and recent views
 */

import { defineStore } from 'pinia'
import type {
  Company,
  SearchFilters,
  SortOption,
  SearchResult,
  RecentSearch,
  BookmarkedCompany,
  RecentlyViewed,
  SearchSuggestion,
} from '~/types'

interface SearchState {
  query: string
  filters: SearchFilters
  sort: SortOption
  results: SearchResult | null
  isLoading: boolean
  error: string | null
  recentSearches: RecentSearch[]
  bookmarks: BookmarkedCompany[]
  recentlyViewed: RecentlyViewed[]
  suggestions: SearchSuggestion[]
  selectedCompanyId: string | null
  commandPaletteOpen: boolean
}

const STORAGE_KEYS = {
  recentSearches: 'ck_recent_searches',
  bookmarks: 'ck_bookmarks',
  recentlyViewed: 'ck_recently_viewed',
  searchPreferences: 'ck_search_prefs',
}

const MAX_RECENT = 20
const MAX_BOOKMARKS = 100
const MAX_VIEWED = 50

function loadFromStorage<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue
  try {
    const data = localStorage.getItem(key)
    return data ? JSON.parse(data) : defaultValue
  } catch {
    return defaultValue
  }
}

function saveToStorage(key: string, value: unknown): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // Storage full or unavailable
  }
}

export const useSearchStore = defineStore('search', {
  state: (): SearchState => ({
    query: '',
    filters: {},
    sort: 'newest',
    results: null,
    isLoading: false,
    error: null,
    recentSearches: [],
    bookmarks: [],
    recentlyViewed: [],
    suggestions: [],
    selectedCompanyId: null,
    commandPaletteOpen: false,
  }),

  getters: {
    hasResults: (state) => state.results !== null && state.results.total > 0,
    hasFilters: (state) => Object.keys(state.filters).length > 0,
    isBookmarked: (state) => (id: string) => state.bookmarks.some((b) => b.id === id),
    bookmarkCount: (state) => state.bookmarks.length,
    recentSearchQueries: (state) => state.recentSearches.map((s) => s.query),
    activeFilterCount: (state) => Object.values(state.filters).filter(Boolean).length,
  },

  actions: {
    // ── Search Actions ──────────────────────────────────────────────────────
    setQuery(query: string) {
      this.query = query
    },

    setFilters(filters: Partial<SearchFilters>) {
      this.filters = { ...this.filters, ...filters }
    },

    clearFilters() {
      this.filters = {}
    },

    setSort(sort: SortOption) {
      this.sort = sort
    },

    setResults(results: SearchResult | null) {
      this.results = results
      this.isLoading = false
      this.error = null
    },

    setLoading(loading: boolean) {
      this.isLoading = loading
    },

    setError(error: string | null) {
      this.error = error
      this.isLoading = false
    },

    // ── Recent Searches ─────────────────────────────────────────────────────
    addRecentSearch(query: string, resultCount: number) {
      if (!query.trim()) return
      const existing = this.recentSearches.findIndex((s) => s.query === query)
      if (existing >= 0) {
        this.recentSearches.splice(existing, 1)
      }
      this.recentSearches.unshift({
        query,
        timestamp: Date.now(),
        resultCount,
      })
      if (this.recentSearches.length > MAX_RECENT) {
        this.recentSearches = this.recentSearches.slice(0, MAX_RECENT)
      }
      saveToStorage(STORAGE_KEYS.recentSearches, this.recentSearches)
    },

    removeRecentSearch(query: string) {
      this.recentSearches = this.recentSearches.filter((s) => s.query !== query)
      saveToStorage(STORAGE_KEYS.recentSearches, this.recentSearches)
    },

    clearRecentSearches() {
      this.recentSearches = []
      saveToStorage(STORAGE_KEYS.recentSearches, [])
    },

    // ── Bookmarks ───────────────────────────────────────────────────────────
    toggleBookmark(company: Company) {
      const index = this.bookmarks.findIndex((b) => b.id === company.id)
      if (index >= 0) {
        this.bookmarks.splice(index, 1)
      } else {
        if (this.bookmarks.length >= MAX_BOOKMARKS) {
          this.bookmarks.pop()
        }
        this.bookmarks.unshift({
          id: company.id,
          name: company.nameEnglish,
          registrationNumber: company.registrationNumber,
          timestamp: Date.now(),
        })
      }
      saveToStorage(STORAGE_KEYS.bookmarks, this.bookmarks)
    },

    removeBookmark(id: string) {
      this.bookmarks = this.bookmarks.filter((b) => b.id !== id)
      saveToStorage(STORAGE_KEYS.bookmarks, this.bookmarks)
    },

    clearBookmarks() {
      this.bookmarks = []
      saveToStorage(STORAGE_KEYS.bookmarks, [])
    },

    // ── Recently Viewed ─────────────────────────────────────────────────────
    addRecentlyViewed(company: Company) {
      const index = this.recentlyViewed.findIndex((v) => v.id === company.id)
      if (index >= 0) {
        this.recentlyViewed.splice(index, 1)
      }
      this.recentlyViewed.unshift({
        id: company.id,
        name: company.nameEnglish,
        registrationNumber: company.registrationNumber,
        timestamp: Date.now(),
      })
      if (this.recentlyViewed.length > MAX_VIEWED) {
        this.recentlyViewed = this.recentlyViewed.slice(0, MAX_VIEWED)
      }
      saveToStorage(STORAGE_KEYS.recentlyViewed, this.recentlyViewed)
    },

    clearRecentlyViewed() {
      this.recentlyViewed = []
      saveToStorage(STORAGE_KEYS.recentlyViewed, [])
    },

    // ── Suggestions ─────────────────────────────────────────────────────────
    setSuggestions(suggestions: SearchSuggestion[]) {
      this.suggestions = suggestions
    },

    clearSuggestions() {
      this.suggestions = []
    },

    // ── Command Palette ─────────────────────────────────────────────────────
    openCommandPalette() {
      this.commandPaletteOpen = true
    },

    closeCommandPalette() {
      this.commandPaletteOpen = false
    },

    toggleCommandPalette() {
      this.commandPaletteOpen = !this.commandPaletteOpen
    },

    // ── Hydration ───────────────────────────────────────────────────────────
    hydrateFromStorage() {
      this.recentSearches = loadFromStorage(STORAGE_KEYS.recentSearches, [])
      this.bookmarks = loadFromStorage(STORAGE_KEYS.bookmarks, [])
      this.recentlyViewed = loadFromStorage(STORAGE_KEYS.recentlyViewed, [])
      const prefs = loadFromStorage<Partial<SearchState>>(STORAGE_KEYS.searchPreferences, {})
      if (prefs.sort) this.sort = prefs.sort
    },
  },
})
