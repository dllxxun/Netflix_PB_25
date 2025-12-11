
import { ref, computed } from 'vue'
import { tmdbApi } from '@/api/tmdb'

export function useMovies() {
  const movies = ref([])
  const loading = ref(false)

  const fetchMovies = async () => {
    try {
      const response = await tmdbApi.getPopular()
      movies.value = response.data.results
    } finally {
      loading.value = false
    }
  }
  

  return {
    movies,
    loading,
    fetchMovies
  }
}
