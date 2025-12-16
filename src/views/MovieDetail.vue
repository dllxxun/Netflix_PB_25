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
            
            <div class="title-area">
              <h1 class="movie-title">{{ movie.title }}</h1>
              
              <button class="heart-btn" @click="toggleLike" :class="{ 'is-active': isLiked }">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="heart-icon">
                  <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
                </svg>
              </button>
            </div>
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
import { tmdbApi } from '@/api/tmdb';

export default {
  name: 'MovieDetail',
  setup() {
    const route = useRoute();
    const movie = ref(null);
    const videoKey = ref(null);
    const loading = ref(true);
    const isLiked = ref(false); // 찜 상태 변수

    const getImageUrl = (path) => {
      return path ? `https://image.tmdb.org/t/p/original${path}` : '';
    };

    // 찜 목록 확인 함수
    const checkLikeStatus = (movieData) => {
      const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
      isLiked.value = wishlist.some(item => item.id === movieData.id);
    };

    // 찜 토글(추가/삭제) 함수
    const toggleLike = () => {
      if (!movie.value) return;

      let wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
      
      if (isLiked.value) {
        // 이미 찜한 상태면 -> 삭제
        wishlist = wishlist.filter(item => item.id !== movie.value.id);
        isLiked.value = false;
        alert('찜 목록에서 삭제되었습니다.'); 
      } else {
        // 찜 안한 상태면 -> 추가
        // 목록에 저장할 필수 정보만 객체로 저장
        const movieToSave = {
          id: movie.value.id,
          title: movie.value.title,
          poster_path: movie.value.poster_path,
          vote_average: movie.value.vote_average
        };
        wishlist.push(movieToSave);
        isLiked.value = true;
        alert('찜 목록에 추가되었습니다!'); 
      }

      localStorage.setItem('wishlist', JSON.stringify(wishlist));
    };

    onMounted(async () => {
      const movieId = route.params.id;
      try {
        loading.value = true;
        const detailRes = await tmdbApi.getMovieDetails(movieId);
        movie.value = detailRes.data;

        // 데이터 로드 후 찜 상태 확인
        checkLikeStatus(movie.value);

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

    return { 
      movie, 
      videoKey, 
      loading, 
      getImageUrl, 
      isLiked, 
      toggleLike 
    };
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

/* 내용 래퍼 */
.content-wrapper {
  min-height: 100vh;
  background-size: cover;
  background-position: center;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 80px 20px;
}

.overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(4px); /* 배경만 블러 */
  z-index: 1;
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
.text-section {
  display: flex;
  flex-direction: column;
}

/* 제목 + 하트 버튼 영역 스타일 */
.title-area {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 20px;
}

.movie-title {
  font-family: 'Orbitron', sans-serif;
  font-size: 3.5rem;
  font-weight: 900;
  text-shadow: 0 0 15px rgba(0, 102, 255, 0.6);
  line-height: 1.1;
  margin: 0; /* 제목 자체 마진 제거 */
}

/* --- 하트 버튼 스타일 (핵심) --- */
.heart-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 5px;
  transition: transform 0.2s;
}

.heart-btn:hover {
  transform: scale(1.1);
}

.heart-icon {
  width: 40px;
  height: 40px;
  /* 기본 상태: 투명하고 테두리만 흰색 (빈 하트) */
  fill: transparent; 
  stroke: white;
  stroke-width: 1.5;
  transition: all 0.3s ease;
}

/* 활성화(찜함) 상태: 빨간색으로 채우기 */
.heart-btn.is-active .heart-icon {
  fill: #e50914; /* 넷플릭스 레드 */
  stroke: #e50914;
  filter: drop-shadow(0 0 10px rgba(229, 9, 20, 0.6)); /* 붉은 글로우 효과 */
}

/* ----------------------------- */

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
  border: 1px solid #ffffff;
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
  color: #ffffff;
  margin-bottom: 40px;
}

.trailer-title {
  font-family: 'Orbitron', sans-serif;
  margin-bottom: 15px;
  color: #0066FF;
}

.video-container {
  position: relative;
  padding-bottom: 56.25%;
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
  .title-area { justify-content: center; flex-wrap: wrap; text-align: center; }
  .movie-title { font-size: 2.5rem; }
  .meta-tags { justify-content: center; }
}
</style>