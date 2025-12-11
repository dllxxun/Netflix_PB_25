
<template>
  <div class="movie-detail" v-if="movie">
    <div class="backdrop" :style="{ backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})` }">
      <div class="content">
        <div class="poster">
          <img :src="`https://image.tmdb.org/t/p/w500${movie.poster_path}`" :alt="movie.title">
        </div>
        <div class="info">
          <h1>{{ movie.title }}</h1>
          <div class="meta">
            <span class="year">{{ getYear(movie.release_date) }}</span>
            <span class="rating">⭐ {{ formatRating(movie.vote_average) }}</span>
            <span class="heart-icon" @click="toggleFavorite">
              {{ isFavorite ? '❤️' : '🤍' }}
            </span>
            <div class="genres">{{ getGenres(movie.genres) }}</div>
          </div>
          <p class="overview">{{ movie.overview }}</p>
          <div class="trailer" v-if="trailerKey">
            <h3>예고편</h3>
            <iframe 
              :src="`https://www.youtube.com/embed/${trailerKey}`"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen
            ></iframe>
          </div>
          <!-- 비디오 플레이어 추가 -->
          <div class="video-section">
            <video ref="videoPlayer" class="video-player"></video>
            <button @click="playVideo">재생</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { tmdbApi } from '@/api/tmdb'
import { ref, onMounted } from 'vue'

export default {
  name: 'MovieDetail',
  data() {
    return {
      movie: null,
      trailerKey: null,
      isFavorite: false
    }
  },
  setup() {
    const videoPlayer = ref(null)
    
    const playVideo = () => {
      if (videoPlayer.value) {
        videoPlayer.value.play()
      }
    }

    onMounted(() => {
      console.log('비디오 플레이어 참조:', videoPlayer.value)
    })

    return {
      videoPlayer,
      playVideo
    }
  },
  async created() {
    try {
      const movieId = this.$route.params.id
      const [movieResponse, videosResponse] = await Promise.all([
        tmdbApi.getMovieDetails(movieId),
        tmdbApi.getMovieVideos(movieId)
      ])
      
      this.movie = movieResponse.data
      const trailer = videosResponse.data.results.find(
        video => video.type === 'Trailer' && video.site === 'YouTube'
      )
      if (trailer) {
        this.trailerKey = trailer.key
      }
      this.checkIfFavorite()
    } catch (error) {
      console.error('Error:', error)
    }
  },
  methods: {
    getYear(date) {
      return new Date(date).getFullYear()
    },
    formatRating(rating) {
      return Math.round(rating * 10) / 10
    },
    toggleFavorite() {
      // localStorage에서 현재 찜 목록 가져오기
      let favorites = JSON.parse(localStorage.getItem('favorites') || '[]')
      const movieId = this.movie.id

      // 이미 찜한 영화인지 확인
      const existingIndex = favorites.findIndex(item => item.id === movieId)
      
      if (existingIndex !== -1) {
        // 찜 목록에서 제거
        favorites.splice(existingIndex, 1)
        this.isFavorite = false
      } else {
        // 찜 목록에 추가 (중복 방지)
        if (!favorites.some(item => item.id === movieId)) {
          favorites.push({
            id: movieId,
            title: this.movie.title,
            poster_path: this.movie.poster_path,
            vote_average: this.movie.vote_average
          })
          this.isFavorite = true
        }
      }
      
      // 변경된 찜 목록 저장
      localStorage.setItem('favorites', JSON.stringify(favorites))
    },
    checkIfFavorite() {
      if (!this.movie) return
      
      const favorites = JSON.parse(localStorage.getItem('favorites') || '[]')
      this.isFavorite = favorites.some(item => item.id === this.movie.id)
    },
    // created 훅 수정 - checkIfFavorite 호출 추가
    mounted() {
      this.checkIfFavorite()
    },
    // 라우트 변경을 감지하는 watch 추가
    watch: {
      '$route': {
        immediate: true,
        async handler() {
          try {
            const movieId = this.$route.params.id
            const [movieResponse, videosResponse] = await Promise.all([
              tmdbApi.getMovieDetails(movieId),
              tmdbApi.getMovieVideos(movieId)
            ])
          
            this.movie = movieResponse.data
            const trailer = videosResponse.data.results.find(
              video => video.type === 'Trailer' && video.site === 'YouTube'
            )
            if (trailer) {
              this.trailerKey = trailer.key
            }
            this.checkIfFavorite()
          } catch (error) {
            console.error('Error:', error)
          }
        }
      }
    },
    getGenres(genres) {
      return genres.map(genre => genre.name).join(', ')
    }
  },
}
</script>

<style scoped>
.movie-detail {
  min-height: 100vh;
  background-color: #141414;
}

.backdrop {
  position: relative;
  background-size: cover;
  background-position: center;
  padding: 40px 20px;
}

.backdrop::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
}

.heart-icon {
  cursor: pointer;
  font-size: 1.5rem;
  transition: transform 0.2s ease;
}

.heart-icon:hover {
  transform: scale(1.2);
}

.content {
  position: relative;
  display: flex;
  gap: 40px;
  max-width: 1200px;
  margin: 0 auto;
}

.poster img {
  width: 300px;
  border-radius: 8px;
}

.info {
  flex: 1;
  color: white;
}

h1 {
  font-size: 2.5rem;
  margin-bottom: 20px;
}

.meta {
  margin-bottom: 20px;
}

.meta > * {
  margin-right: 20px;
}

.overview {
  font-size: 1.1rem;
  line-height: 1.6;
  margin-bottom: 30px;
}

.trailer {
  margin-top: 30px;
}

.trailer iframe {
  width: 100%;
  height: 400px;
  border-radius: 8px;
}

.video-section {
  margin-top: 20px;
}

.video-player {
  width: 100%;
  max-width: 800px;
  margin-bottom: 10px;
}
</style>
