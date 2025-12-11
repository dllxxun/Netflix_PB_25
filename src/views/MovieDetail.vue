<template>
  <div class="detail-container">
    <div v-if="loading" class="loading-screen">
      <div class="cyber-spinner"></div>
    </div>

    <div v-else-if="movie" class="content-wrapper" :style="{ backgroundImage: `url(${getImageUrl(movie.backdrop_path)})` }">
      <div class="overlay"></div>

      <div class="movie-info">
        <button class="back-btn" @click="$router.go(-1)">← BACK</button>

        <div class="info-grid">
          <div class="poster-section">
            <img :src="getImageUrl(movie.poster_path)" class="poster-img" />
          </div>

          <div class="text-section">
            <h1 class="movie-title">{{ movie.title }}</h1>
            <div class="meta-tags">
              <span class="tag">{{ movie.release_date?.split('-')[0] }}</span>
              <span class="tag rating">★ {{ movie.vote_average?.toFixed(1) }}</span>
              <span class="tag runtime" v-if="movie.runtime">{{ movie.runtime }} MIN</span>
            </div>

            <p class="tagline" v-if="movie.tagline">"{{ movie.tagline }}"</p>
            
            <div class="genres">
              <span v-for="genre in movie.genres" :key="genre.id" class="genre-chip">
                {{ genre.name }}
              </span>
            </div>

            <p class="overview">{{ movie.overview }}</p>

            <div v-if="videoKey" class="trailer-area">
              <h3 class="trailer-title">OFFICIAL TRAILER</h3>
              <div class="video-container">
                <iframe 
                  :src="`https://www.youtube.com/embed/${videoKey}`" 
                  frameborder="0" 
                  allowfullscreen
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { tmdbApi } from '@/api/tmdb'; // API 경로 확인

export default {
  name: 'MovieDetail',
  setup() {
    const route = useRoute();
    const movie = ref(null);
    const videoKey = ref(null);
    const loading = ref(true);

    const getImageUrl = (path) => {
      return path ? `https://image.tmdb.org/t/p/original${path}` : '';
    };

    onMounted(async () => {
      const movieId = route.params.id;
      try {
        loading.value = true;
        // 영화 상세 정보 요청
        const detailRes = await tmdbApi.getMovieDetails(movieId);
        movie.value = detailRes.data;

        // 예고편 영상 요청
        try {
          const videoRes = await tmdbApi.getMovieVideos(movieId);
          const trailer = videoRes.data.results.find(v => v.type === 'Trailer') || videoRes.data.results[0];
          if (trailer) videoKey.value = trailer.key;
        } catch (e) {
          console.log('No video found');
        }

      } catch (error) {
        console.error('Error fetching detail:', error);
      } finally {
        loading.value = false;
      }
    });

    return { movie, videoKey, loading, getImageUrl };
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&family=Noto+Sans+KR:wght@300;400;700&display=swap');

.detail-container {
  min-height: 100vh;
  background-color: #000510;
  color: white;
  font-family: 'Noto Sans KR', sans-serif;
}

/* 로딩 */
.loading-screen {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}
.cyber-spinner {
  width: 50px; height: 50px;
  border: 3px solid transparent; border-top: 3px solid #0066FF;
  border-radius: 50%; animation: spin 1s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* 내용 래퍼 (배경 이미지) */
.content-wrapper {
  min-height: 100vh;
  background-size: cover;
  background-position: center;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 50px 20px;
}

.overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 5, 16, 0.85); /* 배경 어둡게 */
  backdrop-filter: blur(8px); /* 블러 효과 */
}

.movie-info {
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: 1200px;
}

.back-btn {
  background: transparent;
  border: 1px solid #0066FF;
  color: #0066FF;
  padding: 8px 20px;
  font-family: 'Orbitron', sans-serif;
  cursor: pointer;
  margin-bottom: 30px;
  transition: all 0.3s;
}
.back-btn:hover {
  background: #0066FF; color: white;
  box-shadow: 0 0 15px rgba(0, 102, 255, 0.5);
}

.info-grid {
  display: grid;
  grid-template-columns: 350px 1fr;
  gap: 50px;
}

/* 포스터 */
.poster-img {
  width: 100%;
  border-radius: 12px;
  box-shadow: 0 0 30px rgba(0, 102, 255, 0.3);
  border: 1px solid rgba(0, 102, 255, 0.2);
}

/* 텍스트 영역 */
.movie-title {
  font-family: 'Orbitron', sans-serif;
  font-size: 3.5rem;
  font-weight: 900;
  margin-bottom: 20px;
  text-shadow: 0 0 15px rgba(0, 102, 255, 0.6);
  line-height: 1.1;
}

.meta-tags {
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
  font-size: 1.1rem;
}

.tag {
  background: rgba(255,255,255,0.1);
  padding: 5px 12px;
  border-radius: 4px;
  border: 1px solid rgba(255,255,255,0.2);
}
.rating { color: #FFD700; border-color: #FFD700; }
.runtime { color: #0066FF; border-color: #0066FF; }

.tagline {
  font-style: italic;
  color: #aaa;
  font-size: 1.2rem;
  margin-bottom: 20px;
  border-left: 3px solid #0066FF;
  padding-left: 15px;
}

.genre-chip {
  display: inline-block;
  font-size: 0.9rem;
  color: #0066FF;
  border: 1px solid #0066FF;
  padding: 4px 12px;
  border-radius: 20px;
  margin-right: 10px;
  margin-bottom: 20px;
}

.overview {
  font-size: 1.1rem;
  line-height: 1.8;
  color: #e0e0e0;
  margin-bottom: 40px;
}

/* 예고편 */
.trailer-title {
  font-family: 'Orbitron', sans-serif;
  margin-bottom: 15px;
  color: #0066FF;
}

.video-container {
  position: relative;
  padding-bottom: 56.25%; /* 16:9 비율 */
  height: 0;
  overflow: hidden;
  border-radius: 8px;
  border: 1px solid rgba(0, 102, 255, 0.3);
}

.video-container iframe {
  position: absolute;
  top: 0; left: 0; width: 100%; height: 100%;
}

@media (max-width: 900px) {
  .info-grid { grid-template-columns: 1fr; }
  .poster-img { max-width: 300px; margin: 0 auto; display: block; }
  .movie-title { font-size: 2.5rem; text-align: center; }
  .meta-tags { justify-content: center; }
}
</style>