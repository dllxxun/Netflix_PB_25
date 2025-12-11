<template>
  <div class="movie-list">
    <div v-if="loading">Loading...</div>
    <div v-else class="movie-grid">
      <div v-for="movie in movies" 
           :key="movie.id" 
           class="movie-card"
           @click="goToDetail(movie.id)">
        <img 
          :src="`https://image.tmdb.org/t/p/w500${movie.poster_path}`" 
          :alt="movie.title"
        >
        <div class="movie-info">
          <h3>{{ movie.title }}</h3>
          <div class="genres">
            {{ getGenres(movie.genre_ids) }}
          </div>
        </div>
      </div>
    </div>
    <div v-if="isLoading" class="loading-more">
        더 많은 영화 불러오는 중...
    </div>
    <button v-show="showTopButton" @click="scrollToTop" class="scroll-top">
      Top ↑
    </button>
  </div>
</template>

<script>
import { tmdbApi } from '@/api/tmdb'

export default {
  name: 'MovieList',
  data() {
    return {
      movies: [],
      loading: true,
      genres: [],
      currentPage: 1,
      isLoading: false,
      hasMore: true,
      showTopButton: false
    }
  },
  async created() {
    try {
      const genresResponse = await tmdbApi.getGenres()
      this.genres = genresResponse.data.genres
      
      const response = await tmdbApi.getPopular()
      // 중복 제거 적용
      this.movies = this.removeDuplicateMovies(response.data.results)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      this.loading = false
    }
  },
  methods: {
    async fetchMovies() {
      try {
        const genresResponse = await tmdbApi.getGenres()
        this.genres = genresResponse.data.genres
        
        const response = await tmdbApi.getPopular(this.currentPage)
        this.movies = response.data.results
        this.loading = false
      } catch (error) {
        console.error('Error:', error)
      }
    },
    async loadMoreMovies() {
      if (this.isLoading || !this.hasMore) return
      
      this.isLoading = true
      try {
        const response = await tmdbApi.getPopular(this.currentPage + 1)
        const newMovies = response.data.results
        
        if (newMovies.length === 0) {
          this.hasMore = false
        } else {
          this.movies = [...this.movies, ...newMovies]
          this.currentPage += 1
        }
      } catch (error) {
        console.error('Error:', error)
      } finally {
        this.isLoading = false
      }
    },
    handleScroll() {
      const bottom = Math.ceil(window.innerHeight + window.scrollY) >= document.documentElement.scrollHeight - 100
      if (bottom && !this.isLoading) {
        this.loadMoreMovies()
      }
      this.showTopButton = window.scrollY > 300
    },
    scrollToTop() {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    },
    removeDuplicateMovies(movies) {
      const uniqueMovies = [];
      const seenIds = new Set();
    
      movies.forEach(movie => {
        if (!seenIds.has(movie.id)) {
          seenIds.add(movie.id);
          uniqueMovies.push(movie);
        }
      });
    
      return uniqueMovies;
    },
    getGenres(genreIds) {
      return genreIds
        .map(id => this.genres.find(genre => genre.id === id)?.name)
        .filter(name => name)
        .join(', ')
    },
    goToDetail(movieId) {
      this.$router.push(`/movie/${movieId}`)
    }
  },
  mounted() {
    this.fetchMovies()
    window.addEventListener('scroll', this.handleScroll)
  },
  unmounted() {
    window.removeEventListener('scroll', this.handleScroll)
  }
}
</script>

<style scoped>
.movie-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
  padding: 20px;
}

.movie-card {
  transition: transform 0.3s ease;
  cursor: pointer;
  background: rgba(0, 0, 0, 0.5);
  overflow: hidden;
  cursor: pointer;
  padding: 10px;
  border-radius: 8px;
}

.movie-card:hover {
  transform: scale(1.05);
}

.movie-card:hover {
  transform: scale(1.05);
}

.movie-card img {
  width: 100%;
  display: block;
  border-radius: 8px 8px 0 0;
}

.movie-info {
  padding: 15px;
  background: rgba(0, 0, 0, 0.8);
}

.movie-info h3 {
  margin: 0;
  font-size: 1.1rem;
  color: white;
  margin-bottom: 8px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.genres {
  font-size: 0.9rem;
  color: #aaa;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.scroll-top {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background-color: #e50914;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  z-index: 1000;
}

.scroll-top:hover {
  background-color: #ff0a16;
}
</style>