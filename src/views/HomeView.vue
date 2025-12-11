<template>
  <div class="home-container">
    
    <div v-if="isLoading" class="loading-screen">
      <div class="cyber-spinner"></div>
      <p>SYSTEM INITIALIZING...</p>
    </div>

    <div v-else class="content-wrapper">
      <div class="hero-banner" :style="{ backgroundImage: `url(${getImageUrl(featuredMovie?.backdrop_path)})` }">
        <div class="hero-overlay"></div>
        
        <div class="hero-content">
          <h1 class="hero-title" v-if="featuredMovie">
            {{ featuredMovie.title }}
          </h1>
          <p class="hero-desc" v-if="featuredMovie">
            {{ truncateText(featuredMovie.overview, 150) }}
          </p>
          
          <div class="hero-buttons">
            <button class="cyber-btn play-btn" @click="goToDetail(featuredMovie?.id)">
              <span class="icon">▶</span> PLAY NOW
            </button>
            <button class="cyber-btn info-btn" @click="goToDetail(featuredMovie?.id)">
              <span class="icon">DATA</span> MORE INFO
            </button>
          </div>
        </div>
      </div>

      <div class="movie-rows">
        <section class="row-section">
          <h2 class="row-header">POPULAR <span class="highlight">NOW</span></h2>
          <MovieList :movies="popularMovies" />
        </section>

        <section class="row-section">
          <h2 class="row-header">TOP <span class="highlight">RATED</span></h2>
          <MovieList :movies="topRatedMovies" />
        </section>

        <section class="row-section">
          <h2 class="row-header">NEW <span class="highlight">ARRIVALS</span></h2>
          <MovieList :movies="upcomingMovies" />
        </section>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { tmdbApi } from '@/api/tmdb'; // API 파일 경로 확인
import MovieList from '@/components/MovieList.vue'; // 컴포넌트 경로 확인
import { useRouter } from 'vue-router';

export default {
  name: 'HomeView',
  components: {
    MovieList
  },
  setup() {
    const router = useRouter();
    const isLoading = ref(true);
    
    const featuredMovie = ref(null);
    const popularMovies = ref([]);
    const topRatedMovies = ref([]);
    const upcomingMovies = ref([]);

    const getImageUrl = (path) => {
      return path ? `https://image.tmdb.org/t/p/original${path}` : '';
    };

    const truncateText = (text, length) => {
      if (!text) return '';
      return text.length > length ? text.substring(0, length) + '...' : text;
    };

    const goToDetail = (id) => {
      router.push(`/movie/${id}`);
    };

    onMounted(async () => {
      try {
        isLoading.value = true;
        // 병렬로 데이터 한꺼번에 가져오기
        const [popularRes, topRatedRes, nowPlayingRes] = await Promise.all([
          tmdbApi.getPopular(),
          tmdbApi.getTopRated(),
          tmdbApi.getNowPlaying()
        ]);

        popularMovies.value = popularRes.data.results;
        topRatedMovies.value = topRatedRes.data.results;
        upcomingMovies.value = nowPlayingRes.data.results;

        // 히어로 배너: 인기 영화 상위 5개 중 랜덤 1개 선택
        const randomIndex = Math.floor(Math.random() * 5);
        featuredMovie.value = popularMovies.value[randomIndex];

      } catch (error) {
        console.error('Data Fetch Error:', error);
      } finally {
        isLoading.value = false;
      }
    });

    return {
      isLoading,
      featuredMovie,
      popularMovies,
      topRatedMovies,
      upcomingMovies,
      getImageUrl,
      truncateText,
      goToDetail
    };
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&display=swap');

/* 전체 배경 */
.home-container {
  background-color: #000510; /* 로그인 화면과 같은 딥 다크 네이비 */
  min-height: 100vh;
  color: white;
  font-family: 'Orbitron', sans-serif; /* 사이버펑크 폰트 */
  overflow-x: hidden;
}

/* 로딩 화면 */
.loading-screen {
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #0066FF;
}

.cyber-spinner {
  width: 60px;
  height: 60px;
  border: 4px solid rgba(0, 102, 255, 0.3);
  border-top: 4px solid #0066FF;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 20px;
  box-shadow: 0 0 20px rgba(0, 102, 255, 0.5);
}

@keyframes spin { to { transform: rotate(360deg); } }

/* 히어로 배너 */
.hero-banner {
  position: relative;
  height: 80vh;
  background-size: cover;
  background-position: center top;
  display: flex;
  align-items: center;
}

.hero-overlay {
  position: absolute;
  inset: 0;
  /* 아래쪽이 자연스럽게 배경색과 섞이도록 그라데이션 */
  background: linear-gradient(to top, #000510 5%, transparent 60%),
              radial-gradient(circle at 20% 50%, rgba(0,5,16,0.8) 0%, transparent 70%);
}

.hero-content {
  position: relative;
  z-index: 2;
  width: 50%;
  margin-left: 5%;
  margin-top: 50px;
}

.hero-title {
  font-size: 4rem;
  font-weight: 900;
  margin-bottom: 20px;
  line-height: 1.1;
  text-shadow: 0 0 20px rgba(0, 102, 255, 0.8); /* 파란 네온 글로우 */
  color: #fff;
}

.hero-desc {
  font-size: 1.1rem;
  line-height: 1.6;
  color: #ccc;
  margin-bottom: 30px;
  text-shadow: 0 2px 4px rgba(0,0,0,0.8);
  font-family: sans-serif; /* 본문은 가독성 위해 일반 폰트 */
}

/* 버튼 스타일 */
.hero-buttons {
  display: flex;
  gap: 15px;
}

.cyber-btn {
  padding: 14px 36px;
  font-family: 'Orbitron', sans-serif;
  font-size: 1.1rem;
  font-weight: bold;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  gap: 10px;
  border: 1px solid transparent;
}

.play-btn {
  background-color: #0066FF;
  color: white;
  box-shadow: 0 0 15px rgba(0, 102, 255, 0.5);
}

.play-btn:hover {
  background-color: #0052cc;
  box-shadow: 0 0 30px rgba(0, 102, 255, 0.8);
  transform: translateY(-2px);
}

.info-btn {
  background-color: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(5px);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.info-btn:hover {
  background-color: rgba(0, 102, 255, 0.2);
  border-color: #0066FF;
  color: #0066FF;
  box-shadow: 0 0 15px rgba(0, 102, 255, 0.3);
}

/* 영화 섹션 */
.movie-rows {
  position: relative;
  z-index: 3;
  margin-top: -50px;
  padding-bottom: 100px;
}

.row-section {
  margin-bottom: 50px;
  padding-left: 5%;
}

.row-header {
  font-size: 1.5rem;
  margin-bottom: 15px;
  color: white;
  letter-spacing: 2px;
}

.highlight {
  color: #0066FF;
  text-shadow: 0 0 10px rgba(0, 102, 255, 0.6);
}

@media (max-width: 768px) {
  .hero-title { font-size: 2.5rem; }
  .hero-content { width: 90%; }
  .hero-desc { display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
}
</style>