import { ref, computed } from 'vue'
import { tmdbApi } from '../api/tmdb'

export function useMovieSearch() {
  const searchQuery = ref('')
  const searchResults = ref([])
  const isLoading = ref(false)
  const error = ref(null)

  const hasResults = computed(() => searchResults.value.length > 0)

  const searchMovies = async (query) => {
    if (!query.trim()) return
    
    try {
      isLoading.value = true
      error.value = null
      searchQuery.value = query
      const response = await tmdbApi.searchMovies(query)
      searchResults.value = response.results
    } catch (err) {
      error.value = err.message
    } finally {
      isLoading.value = false
    }
  }

  const clearSearch = () => {
    searchQuery.value = ''
    searchResults.value = []
    error.value = null
  }

  return {
    searchQuery,
    searchResults,
    isLoading,
    error,
    hasResults,
    searchMovies,
    clearSearch
  }
}