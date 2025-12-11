<template>
  <div class="popular-page">
    <h1 class="title">Homeflix의 대세 콘텐츠</h1>
    
    <div class="movie-slider">
      <div class="movie-container" :style="{ transform: `translateX(-${currentSlide * 100}%)` }">
        <div v-for="(movie, index) in movies" :key="movie.id" class="movie-item">
          <div class="rank-number">{{ index + 1 }}</div>
          <div class="movie-poster" @click="goToMovieDetail(movie.id)">
            <img :src="getImageUrl(movie.poster_path)" :alt="movie.title">
            <div class="movie-info">
              <div class="badge new" v-if="movie.release_date">새로운 시리즈</div>
              
            </div>
          </div>
        </div>
      </div>
      <button class="next-arrow" @click="nextSlide">
        <span class="arrow">→</span>
      </button>
    </div>
  </div>
</template>

<script>
import { tmdbApi } from '@/api/tmdb'

export default {
  data() {
    return {
      movies: [],
      currentSlide: 0,
      itemsPerSlide: 5,
      loading: false
    }
  },
  computed: {
    maxSlides() {
      return Math.ceil(this.movies.length / this.itemsPerSlide) - 1
    }
  },
  methods: {
    getImageUrl(path) {
      return `https://image.tmdb.org/t/p/w500${path}`
    },
    goToMovieDetail(movieId) {
      this.$router.push(`/movie/${movieId}`)
    },
    async fetchPopularMovies() {
      this.loading = true
      try {
        const response = await tmdbApi.getPopular(1)
        this.movies = response.data.results.slice(0, 20)
      } catch (error) {
        console.error('Error:', error)
      } finally {
        this.loading = false
      }
    },
    nextSlide() {
      if (this.currentSlide < this.maxSlides) {
        this.currentSlide++
      } else {
        this.currentSlide = 0
      }
    },
    prevSlide() {
      if (this.currentSlide > 0) {
        this.currentSlide--
      } else {
        this.currentSlide = this.maxSlides
      }
    }
  },
  mounted() {
    this.fetchPopularMovies()
  }
}
</script>



<style scoped>
.popular-page {
  padding: 20px;
  background-color: #141414;
  color: white;
}

.title {
  font-size: 24px;
  margin-bottom: 20px;
}

.movie-slider {
  position: relative;
  overflow: hidden;
}

.movie-container {
  display: flex;
  transition: transform 0.5s ease;
}

.movie-item {
  flex: 0 0 280px;
  position: relative;
  margin-right: 20px;
}

.rank-number {
  position: absolute;
  left: -4.0px;
  bottom: 5px;
  font-size: 70px;
  font-weight: 700;
  color: #ffffff;
  /*-webkit-text-stroke: 2px #404040;*/
  letter-spacing: -15px;
  z-index: 1;
  line-height:0.8;
}

.next-arrow {
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(0, 0, 0, 0.5);
  border: none;
  color: white;
  padding: 20px 10px;
  cursor: pointer;
  z-index: 10;
}

.arrow {
  font-size: 24px;
}

.movie-poster {
  position: relative;
  z-index: 2;
  margin-left: 50px;
}

.movie-poster img {
  width: 100%;
  border-radius: 4px;
  transition: transform 0.3s ease;
}

.movie-poster:hover img {
  transform: scale(1.05);
}

.slider-controls {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 20px;
}

.slider-controls button {
  padding: 10px 20px;
  background-color: #e50914;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.slider-controls button:disabled {
  background-color: #404040;
  cursor: not-allowed;
}

.badge {
  position: absolute;
  bottom: 10px;
  left: 10px;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: bold;
}

.badge.new {
  background-color: #e50914;
}

.badge.hot {
  background-color: #ffa500;
}
</style>