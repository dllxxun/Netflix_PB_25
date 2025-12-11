
import { ref, watch } from 'vue'

export function useFavorites() {
  const favorites = ref([])

  const loadFavorites = () => {
    const saved = localStorage.getItem('favorites')
    if (saved) {
      favorites.value = JSON.parse(saved)
    }
  }

  const addToFavorites = (movie) => {
    favorites.value.push(movie)
    localStorage.setItem('favorites', JSON.stringify(favorites.value))
  }

  const removeFromFavorites = (movieId) => {
    favorites.value = favorites.value.filter(m => m.id !== movieId)
    localStorage.setItem('favorites', JSON.stringify(favorites.value))
  }

  return {
    favorites,
    loadFavorites,
    addToFavorites,
    removeFromFavorites
  }
}
