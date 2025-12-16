import axios from 'axios';

//  TMDB Axios 인스턴스 (API 키 + 기본 파라미터 + 헤더)
const instance = axios.create({
  baseURL: 'https://api.themoviedb.org/3',
  params: {
    api_key: import.meta.env.VITE_TMDB_API_KEY,
    language: 'ko-KR',
  },
  headers: {
    'Content-Type': 'application/json',
  },
});

//  공통 에러 핸들링 함수 (여기서 alert/UI용 메시지 처리)
function handleTmdbError(error, contextMessage = '요청 처리 중 오류가 발생했습니다.') {
  console.error(contextMessage, error);

  // 네트워크 오류 (response 자체가 없음)
  if (!error.response) {
    alert('네트워크 오류가 발생했습니다. 인터넷 연결을 확인한 뒤 다시 시도해주세요.');
    return;
  }

  const status = error.response.status;

  if (status === 401 || status === 403) {
    alert('TMDB 인증에 실패했습니다. API 키 또는 토큰 설정을 확인해주세요.');
  } else if (status === 404) {
    alert('요청한 영화 정보를 찾을 수 없습니다.');
  } else if (status >= 500) {
    alert('TMDB 서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
  } else {
    alert('알 수 없는 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
  }
}

//  요청 인터셉터 (디버깅용)
instance.interceptors.request.use(
  (config) => {
    console.log('API 요청 설정:', {
      url: config.url,
      method: config.method,
      params: config.params,
    });
    return config;
  },
  (error) => {
    console.error('API 요청 에러:', error);
    // 여기서도 공통 핸들링 가능
    handleTmdbError(error, 'API 요청 단계에서 에러 발생');
    return Promise.reject(error);
  },
);

//  응답 인터셉터 (디버깅 + 공통 에러)
instance.interceptors.response.use(
  (response) => {
    console.log('API 응답 성공:', response.status);
    return response;
  },
  (error) => {
    console.error('API 응답 에러:', error.response?.status, error.message);
    handleTmdbError(error, 'API 응답 단계에서 에러 발생');
    return Promise.reject(error);
  },
);

//  실제로 화면에서 사용할 TMDB API 래퍼
export const tmdbApi = {
  getPopular: (page = 1) => {
    console.log('인기 영화 요청 시작');
    return instance
      .get('/movie/popular', { params: { page } })
      .then((response) => {
        console.log('인기 영화 응답:', response.data.results.length + '개 항목');
        return response;
      })
      .catch((error) => {
        handleTmdbError(error, '인기 영화 목록을 불러오는 중 오류가 발생했습니다.');
        throw error;
      });
  },

  getGenres: () => {
    console.log('장르 목록 요청 시작');
    return instance
      .get('/genre/movie/list')
      .then((response) => {
        console.log('장르 목록 응답:', response.data.genres.length + '개 항목');
        return response;
      })
      .catch((error) => {
        handleTmdbError(error, '장르 목록을 불러오는 중 오류가 발생했습니다.');
        throw error;
      });
  },

  getMovieDetails: (id) => {
    console.log('영화 상세 정보 요청:', id);
    return instance
      .get(`/movie/${id}`)
      .then((response) => {
        console.log('영화 상세 정보 응답:', response.data.title);
        return response;
      })
      .catch((error) => {
        handleTmdbError(error, '영화 상세 정보를 불러오는 중 오류가 발생했습니다.');
        throw error;
      });
  },

  getMovieVideos: (id) => {
    console.log('영화 비디오 요청:', id);
    return instance
      .get(`/movie/${id}/videos`)
      .then((response) => {
        console.log('영화 비디오 응답:', response.data.results.length + '개 항목');
        return response;
      })
      .catch((error) => {
        handleTmdbError(error, '영화 예고편 정보를 불러오는 중 오류가 발생했습니다.');
        throw error;
      });
  },

  getMoviesByGenre: (genreId) => {
    console.log('장르별 영화 요청:', genreId);
    return instance
      .get('/discover/movie', { params: { with_genres: genreId } })
      .then((response) => {
        console.log('장르별 영화 응답:', response.data.results.length + '개 항목');
        return response;
      })
      .catch((error) => {
        handleTmdbError(error, '장르별 영화 목록을 불러오는 중 오류가 발생했습니다.');
        throw error;
      });
  },

  getNowPlaying: () => {
    console.log('현재 상영작 요청 시작');
    return instance
      .get('/movie/now_playing')
      .then((response) => {
        console.log('현재 상영작 응답:', response.data.results.length + '개 항목');
        return response;
      })
      .catch((error) => {
        handleTmdbError(error, '현재 상영작 목록을 불러오는 중 오류가 발생했습니다.');
        throw error;
      });
  },

  getTopRated: () => {
    console.log('높은 평점 영화 요청 시작');
    return instance
      .get('/movie/top_rated')
      .then((response) => {
        console.log('높은 평점 영화 응답:', response.data.results.length + '개 항목');
        return response;
      })
      .catch((error) => {
        handleTmdbError(error, '평점 높은 영화 목록을 불러오는 중 오류가 발생했습니다.');
        throw error;
      });
  },

  searchMovies: (query) => {
    console.log('영화 검색 요청:', query);
    return instance
      .get('/search/movie', { params: { query } })
      .then((response) => {
        console.log('검색 결과:', response.data.results.length + '개 항목');
        return response;
      })
      .catch((error) => {
        handleTmdbError(error, '영화 검색 중 오류가 발생했습니다.');
        throw error;
      });
  },
};
