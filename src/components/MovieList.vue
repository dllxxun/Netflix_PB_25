<template>
  <div class="movie-list">
    <!-- 전체 데이터 로딩 -->
    <div v-if="loading">Loading...</div>

    <!-- 영화 그리드 -->
    <div v-else class="movie-grid">
      <div
        v-for="movie in movies"
        :key="movie.id"
        class="movie-card"
        @click="goToDetail(movie.id)"
      >
        <div class="poster-wrapper">
          <!-- 이미지 로딩 스켈레톤 -->
          <div
            v-if="imageLoading[movie.id]"
            class="poster-skeleton"
          ></div>

          <!-- 이미지 로딩 실패 시 플레이스홀더 -->
          <div
            v-else-if="imageError[movie.id]"
            class="poster-fallback"
          >
            포스터 없음
          </div>

          <!-- 실제 이미지 -->
          <img
            v-else
            :src="getPosterUrl(movie.poster_path)"
            :alt="movie.title"
            class="poster-image"
            loading="lazy"
            @load="onImageLoad(movie.id)"
            @error="onImageError(movie.id)"
          />
        </div>

        <div class="movie-info">
          <h3>{{ movie.title }}</h3>
          <div class="genres">
            {{ getGenres(movie.genre_ids) }}
          </div>
        </div>
      </div>
    </div>

    <!-- 추가 로딩 -->
    <div v-if="isLoading" class="loading-more">
      더 많은 영화 불러오는 중...
    </div>

    <!-- 맨 위로 버튼 -->
    <button
      v-show="showTopButton"
      @click="scrollToTop"
      class="scroll-top"
    >
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
      showTopButton: false,
      // ✅ 이미지 로딩 상태 관리
      imageLoading: {}, // { [movieId]: true/false }
      imageError: {}    // { [movieId]: true/false }
    }
  },
  async created() {
    try {
      const genresResponse = await tmdbApi.getGenres()
      this.genres = genresResponse.data.genres

      const response = await tmdbApi.getPopular()
      const unique = this.removeDuplicateMovies(response.data.results)
      this.movies = unique
      // 최초 로딩된 영화들에 대해 이미지 로딩 상태 초기화
      this.initImageStates(unique)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      this.loading = false
    }
  },
  methods: {
    // ✅ TMDB 이미지 URL + 사이즈 최적화
    getPosterUrl(posterPath) {
      if (!posterPath) return ''
      // 용도에 따라 사이즈 변경 가능: w185, w342, w500 등
      return `https://image.tmdb.org/t/p/w342${posterPath}`
    },

    // 최초/추가 로딩 시 이미지 상태 초기화
    initImageStates(movieList) {
      movieList.forEach(movie => {
        if (this.imageLoading[movie.id] === undefined) {
          this.$set(this.imageLoading, movie.id, true)
          this.$set(this.imageError, movie.id, false)
        }
      })
    },

    onImageLoad(movieId) {
      this.$set(this.imageLoading, movieId, false)
      this.$set(this.imageError, movieId, false)
    },

    onImageError(movieId) {
      this.$set(this.imageLoading, movieId, false)
      this.$set(this.imageError, movieId, true)
    },

    async fetchMovies() {
      try {
        const genresResponse = await tmdbApi.getGenres()
        this.genres = genresResponse.data.genres

        const response = await tmdbApi.getPopular(this.currentPage)
        const list = response.data.results
        this.movies = list
        this.initImageStates(list)
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
          this.initImageStates(newMovies)
        }
      } catch (error) {
        console.error('Error:', error)
      } finally {
        this.isLoading = false
      }
    },

    handleScroll() {
      const bottom =
        Math.ceil(window.innerHeight + window.scrollY) >=
        document.documentElement.scrollHeight - 100

      if (bottom && !this.isLoading) {
        this.loadMoreMovies()
      }
      this.showTopButton = window.scrollY > 300
    },

    scrollToTop() {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    },

    removeDuplicateMovies(movies) {
      const uniqueMovies = []
      const seenIds = new Set()

      movies.forEach(movie => {
        if (!seenIds.has(movie.id)) {
          seenIds.add(movie.id)
          uniqueMovies.push(movie)
        }
      })

      return uniqueMovies
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
  padding: 10px;
  border-radius: 8px;
}

.movie-card:hover {
  transform: scale(1.05);
}

.poster-wrapper {
  position: relative;
  width: 100%;
  aspect-ratio: 2 / 3;
  overflow: hidden;
  border-radius: 8px;
}

/* 이미지 로딩 스켈레톤 */
.poster-skeleton {
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, #2b2b2b 25%, #3a3a3a 50%, #2b2b2b 75%);
  background-size: 200% 100%;
  animation: skeleton-loading 1.2s ease-in-out infinite;
}

/* 이미지 로딩 실패 시 플레이스홀더 */
.poster-fallback {
  width: 100%;
  height: 100%;
  background-color: #222;
  color: #aaa;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 실제 이미지 */
.poster-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
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
  background-color: #0066FF;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  z-index: 1000;
}

.scroll-top:hover {
  background-color: #0066FF;
}

@keyframes skeleton-loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}
</style>
