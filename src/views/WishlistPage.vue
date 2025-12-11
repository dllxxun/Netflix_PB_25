<template>
  <div class="wishlist-page">
    <h2 class="section-title">내가 찜한 콘텐츠</h2>
    
    <div v-if="favorites.length === 0" class="empty-state">
      <p>아직 찜한 콘텐츠가 없습니다.</p>
    </div>

    <div v-else class="content-section">
      <!-- 넷플릭스 스타일의 가로 스크롤 섹션 -->
      <div class="scroll-container">
        <div v-for="movie in favorites" 
             :key="movie.id" 
             class="movie-card"
             @click="goToDetail(movie.id)">
          <div class="poster-wrapper">
            <img :src="`https://image.tmdb.org/t/p/w500${movie.poster_path}`" 
                 :alt="movie.title">
            <button class="remove-button" @click.stop="removeFromFavorites(movie.id)">
              ✕
            </button>
          </div>
          <div class="movie-info">
            <h3>{{ movie.title }}</h3>
            <div class="rating">⭐ {{ movie.vote_average.toFixed(1) }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'WishlistPage',
  data() {
    return {
      favorites: []
    }
  },
  created() {
    // Local Storage에서 찜한 목록 불러오기
    const savedFavorites = localStorage.getItem('favorites')
    if (savedFavorites) {
      this.favorites = JSON.parse(savedFavorites)
    }
  },
  methods: {
    loadFavorites() {
      const savedFavorites = localStorage.getItem('favorites')
      if (savedFavorites) {
        // 중복 제거하여 로드
        const favorites = JSON.parse(savedFavorites)
        const uniqueFavorites = Array.from(new Set(favorites.map(f => f.id)))
          .map(id => favorites.find(f => f.id === id))
        this.favorites = uniqueFavorites
      }
    },
    goToDetail(movieId) {
      // router.push 메서드를 사용하여 영화 상세 페이지로 이동
      this.$router.push(`/movie/${movieId}`)
    },
    removeFromFavorites(movieId) {
      this.favorites = this.favorites.filter(movie => movie.id !== movieId)
      localStorage.setItem('favorites', JSON.stringify(this.favorites))
    }
  }
}
</script>

<style scoped>
.wishlist-page {
  padding: 20px;
  background-color: #141414;
  min-height: 100vh;
}

.section-title {
  color: white;
  font-size: 1.8rem;
  margin-bottom: 20px;
}

.empty-state {
  color: #aaa;
  text-align: center;
  padding: 40px;
}

.scroll-container {
  display: flex;
  gap: 20px;
  overflow-x: auto;
  padding: 20px 0;
  scroll-behavior: smooth;
}

.movie-card {
  flex: 0 0 200px;
  position: relative;
  transition: transform 0.3s ease;
  cursor: pointer;
}

.movie-card:hover {
  transform: scale(1.05);
}

.poster-wrapper {
  position: relative;
}

.poster-wrapper img {
  width: 100%;
  border-radius: 4px;
}

.remove-button {
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  border: none;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  cursor: pointer;
  display: none;
}

.movie-card:hover .remove-button {
  display: block;
}

.movie-info {
  padding: 10px 0;
}

.movie-info h3 {
  color: white;
  margin: 0;
  font-size: 0.9rem;
  margin-bottom: 5px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.rating {
  color: #ffd700;
  font-size: 0.8rem;
}

/* 스크롤바 스타일링 */
.scroll-container::-webkit-scrollbar {
  height: 8px;
}

.scroll-container::-webkit-scrollbar-track {
  background: #141414;
}

.scroll-container::-webkit-scrollbar-thumb {
  background: #333;
  border-radius: 4px;
}
</style>