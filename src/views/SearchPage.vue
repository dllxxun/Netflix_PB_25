<template>
  <div class="search-page">
    <!-- 필터링 섹션 -->
    <div class="filters">
      <div class="search-input-container">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="영화 제목 검색"
          @input="handleSearch"
        
          @focus="showRecentSearches = true"
          @blur="handleBlur"
        />
        <div v-if="showRecentSearches && recentSearches.length > 0" class="recent-searches-dropdown">
          <div v-for="(search, index) in recentSearches" 
              :key="index" 
              class="recent-search-item">
            <span @click="applyRecentSearch(search)">{{ search }}</span>
            <button @click.stop="removeRecentSearch(index)" class="remove-btn">×</button>
          </div>
        </div>
      </div>
    
      <select v-model="selectedGenre" @change="applyFilters">
        <option value="">장르 선택</option>
        <option value="28">액션</option>
        <option value="12">모험</option>
        <option value="16">애니메이션</option>
        <option value="35">코미디</option>
        <option value="27">공포</option>
        <option value="9648">미스터리</option>
        <option value="18">드라마</option>
        <option value="53">스릴러</option>
        <option value="14">판타지</option>
      </select>

      <select v-model="minRating" @change="applyFilters">
        <option value="">평점 선택</option>
        <option value="8">8점 이상</option>
        <option value="7">7점 이상</option>
        <option value="6">6점 이상</option>
      </select>

      <select v-model="sortBy" @change="applyFilters">
        <option value="">정렬 기준</option>
        <option value="popularity">인기순</option>
        <option value="release_date">개봉년도순</option>
        <option value="vote_average">평점순</option>
      </select>

      <button @click="resetFilters" class="reset-button">필터 초기화</button>
    </div>
    <!-- 카테고리별 섹션 추가 -->
    <div class="category-section">
      <div class="scroll-container">
        <div
          v-for="movie in popularMovies"
          :key="movie.id"
          class="movie-card"
          @click="goToDetail(movie.id)"
        >
          <img
            :src="`https://image.tmdb.org/t/p/w500${movie.poster_path}`"
            :alt="movie.title"
          />
          <div class="movie-info">
            <h3>{{ movie.title }}</h3>
            <div class="rating">⭐ {{ movie.vote_average.toFixed(1) }}</div>
          </div>
        </div>
      </div>
    </div>

    <div class="category-section">
      <h2>다시보기 추천 콘텐츠</h2>
      <div class="scroll-container">
        <div
          v-for="movie in recommendedMovies"
          :key="movie.id"
          class="movie-card"
          @click="goToDetail(movie.id)"
        >
          <img
            :src="`https://image.tmdb.org/t/p/w500${movie.poster_path}`"
            :alt="movie.title"
          />
          <div class="movie-info">
            <h3>{{ movie.title }}</h3>
            <div class="rating">⭐ {{ movie.vote_average.toFixed(1) }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 결과 섹션 -->
    <div class="movies-grid" v-if="!loading">
      <div
        v-for="movie in filteredMovies"
        :key="movie.id"
        class="movie-card"
        @click="goToDetail(movie.id)"
      >
        <img
          :src="`https://image.tmdb.org/t/p/w500${movie.poster_path}`"
          :alt="movie.title"
        />
        <div class="movie-info">
          <h3>{{ movie.title }}</h3>
          <div class="rating">⭐ {{ movie.vote_average.toFixed(1) }}</div>
        </div>
      </div>
    </div>
    <div v-else class="loading">Loading...</div>
  </div>
</template>

<script>
import { tmdbApi } from '@/api/tmdb';
import { useMovieSearch } from '../composables/useMovieSearch'
import MovieList from '../components/MovieList.vue'

export default {
  name: 'SearchPage',
  data() {
    return {
      movies: [],
      filteredMovies: [],
      recentSearches: [],
      showRecentSearches: false,
      maxRecentSearches: 5,
      loading: true,
      searchQuery: '',
      selectedGenre: '',
      minRating: '',
      sortBy: '',
    };
  },
  methods: {
    components: {
    MovieList
    },
    setup() {
      const {
        searchQuery,
        searchResults,
        isLoading,
        error,
        hasResults,
        searchMovies,
        clearSearch
      } = useMovieSearch()
      return {
        searchQuery,
        searchResults,
        isLoading,
        error,
        hasResults,
        searchMovies,
        clearSearch
      }
    },
    async fetchMovies() {
      try {
        const response = await tmdbApi.getPopular();
        this.movies = response.data.results;
        this.filteredMovies = [...this.movies];
        this.loading = false;
      } catch (error) {
        console.error('Error:', error);
      }
    },
    handleSearch() {
      if (this.searchQuery.trim()) {
      // 검색어가 있을 때만 최근 검색어에 저장
        this.saveRecentSearch(this.searchQuery.trim());
    
      // 기존 검색 로직
        this.filteredMovies = this.movies.filter((movie) => movie.title.toLowerCase().includes(this.searchQuery.toLowerCase()));
      } else {
        this.filteredMovies = [...this.movies];
      }
      this.applyFilters();
    },
    // 최근 검색어 저장 메소드 추가
    saveRecentSearch(query) {
      if (!query) return;
      
      let searches = [...this.recentSearches];
      // 중복 검색어 제거
      const index = searches.indexOf(query);
      if (index > -1) {
        searches.splice(index, 1);
      }
      // 새 검색어 추가
      searches.unshift(query);
      // 최대 5개로 제한
      searches = searches.slice(0, this.maxRecentSearches);
      
      this.recentSearches = searches;
      localStorage.setItem('recentSearches', JSON.stringify(searches));
    },
    applyRecentSearch(search) {
      this.searchQuery = search;
      this.handleSearch();
      this.showRecentSearches = false;
    },
    removeRecentSearch(index) {
      this.recentSearches.splice(index, 1);
      localStorage.setItem('recentSearches', JSON.stringify(this.recentSearches));
    },
    handleBlur() {
    // 드롭다운이 바로 사라지지 않도록 지연 설정
      setTimeout(() => {
        this.showRecentSearches = false;
      }, 200);
    },

    applyFilters() {
      let result = [...this.movies];

      // 검색어 필터링
      if (this.searchQuery) {
        result = result.filter((movie) =>
          movie.title.toLowerCase().includes(this.searchQuery.toLowerCase())
        );
      }

      // 장르 필터링
      if (this.selectedGenre) {
        result = result.filter((movie) =>
          movie.genre_ids.includes(Number(this.selectedGenre))
        );
      }

      // 평점 필터링
      if (this.minRating) {
        result = result.filter(
          (movie) => movie.vote_average >= Number(this.minRating)
        );
      }

      // 정렬
      if (this.sortBy) {
        result.sort((a, b) => {
          switch (this.sortBy) {
            case 'popularity':
              return b.popularity - a.popularity;
            case 'release_date':
              return new Date(b.release_date) - new Date(a.release_date);
            case 'vote_average':
              return b.vote_average - a.vote_average;
            default:
              return 0;
          }
        });
      }

      this.filteredMovies = result;
    },
    resetFilters() {
      this.searchQuery = '';
      this.selectedGenre = '';
      this.minRating = '';
      this.sortBy = '';
      this.filteredMovies = [...this.movies];
    },
    goToDetail(movieId) {
      this.$router.push(`/movie/${movieId}`);
    },
  },
  created() {
    this.fetchMovies();
    // 저장된 최근 검색어 불러오기
    const savedSearches = localStorage.getItem('recentSearches');
    if (savedSearches) {
      this.recentSearches = JSON.parse(savedSearches);
    }
  },
  mounted() {
    // 드롭다운 외부 클릭 시 닫기
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.search-input-container')) {
        this.showRecentSearches = false;
      }
    });
  }
};
</script>

<style scoped>
.search-page {
  padding: 20px;
}

.filters {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.filters input,
.filters select,
.filters button {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.reset-button {
  background-color: #e74c3c;
  color: white;
  border: none;
  cursor: pointer;
}

.reset-button:hover {
  background-color: #c0392b;
}

.movies-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 20px;
}

.movie-card {
  cursor: pointer;
  transition: transform 0.3s ease;
  background: rgba(0, 0, 0, 0.8);
  border-radius: 10px;
}

.movie-card img {
  width: 100%;
  border-radius: 10px 10px 0 0;
}

.movie-card:hover {
  transform: scale(1.05);
}

.movie-info {
  padding: 10px;
  color: white;
  background: rgba(0, 0, 0, 0.8);
}

.movie-meta {
  display: flex;
  justify-content: space-between;
  font-size: 0.85rem;
  color: #aaa;
  margin-top: 5px;
}

.movie-info h3 {
  font-size: 0.9rem;
  margin: 0 0 5px 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.rating {
  color: #ffffff;
  font-size: 0.85rem;
}

.loading {
  text-align: center;
  padding: 20px;
  font-size: 1.2rem;
}

.recent-searches {
  position: absolute;
  top: 100%;
  left: 0;
  background: #141414;
  border: 1px solid #333;
  border-radius: 4px;
  padding: 10px;
  width: 200px;
  z-index: 1000;
}

.recent-searches h4 {
  margin: 0 0 10px 0;
  color: #aaa;
  font-size: 0.9rem;
}

.recent-search-items {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.recent-search-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px;
  cursor: pointer;
  color: #fff;
}

.recent-search-item:hover {
  background: rgba(255, 255, 255, 0.1);
}

.remove-search {
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  padding: 0 5px;
}

.remove-search:hover {
  color: #ff0000;
}

/* filters 클래스에 position: relative 추가 */
.filters {
  position: relative;
}

.search-input-container {
  position: relative;
  width: 200px;
}

.recent-searches-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  background: #141414;
  border: 1px solid #333;
  border-radius: 4px;
  margin-top: 4px;
  z-index: 1000;
}

.recent-search-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  cursor: pointer;
  color: #fff;
}

.recent-search-item:hover {
  background: rgba(255, 255, 255, 0.1);
}

.remove-btn {
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  padding: 0 5px;
}

.remove-btn:hover {
  color: #ff0000;
}
</style>