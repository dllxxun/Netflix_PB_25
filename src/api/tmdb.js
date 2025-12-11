import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://api.themoviedb.org/3',
    params: {
        api_key: import.meta.env.VITE_TMDB_API_KEY,
        language: 'ko-KR'
    },
    headers: {
        'Content-Type': 'application/json'
    }
});

// 요청 인터셉터 추가
instance.interceptors.request.use(
    config => {
        console.log('API 요청 설정:', {
            url: config.url,
            method: config.method,
            params: config.params
        });
        return config;
    },
    error => {
        console.error('API 요청 에러:', error);
        return Promise.reject(error);
    }
);

// 응답 인터셉터 추가
instance.interceptors.response.use(
    response => {
        console.log('API 응답 성공:', response.status);
        return response;
    },
    error => {
        console.error('API 응답 에러:', error.response?.status, error.message);
        return Promise.reject(error);
    }
);

export const tmdbApi = {
    getPopular: (page = 1) => {
        console.log('인기 영화 요청 시작');
        return instance.get('/movie/popular', {
            params: { page }
        })
            .then(response => {
                console.log('인기 영화 응답:', response.data.results.length + '개 항목');
                return response;
            })
            .catch(error => {
                console.error('인기 영화 에러:', error);
                throw error;
            });
    },
    // 장르 목록 가져오기 메서드 추가
    getGenres: () => {
        console.log('장르 목록 요청 시작');
        return instance.get('/genre/movie/list')
            .then(response => {
                console.log('장르 목록 응답:', response.data.genres.length + '개 항목');
                return response;
            })
            .catch(error => {
                console.error('장르 목록 에러:', error);
                throw error;
            });
    },
    // 영화 상세 정보 메서드 수정
    getMovieDetails: (id) => {
        console.log('영화 상세 정보 요청:', id);
        return instance.get(`/movie/${id}`)
            .then(response => {
                console.log('영화 상세 정보 응답:', response.data.title);
                return response;
            })
            .catch(error => {
                console.error('영화 상세 정보 에러:', error);
                throw error;
            });
    },
    // 영화 비디오(예고편) 가져오기 메서드 추가
    getMovieVideos: (id) => {
        console.log('영화 비디오 요청:', id);
        return instance.get(`/movie/${id}/videos`)
            .then(response => {
                console.log('영화 비디오 응답:', response.data.results.length + '개 항목');
                return response;
            })
            .catch(error => {
                console.error('영화 비디오 에러:', error);
                throw error;
            });
    },
    // 장르별 영화 가져오기 메서드 추가
    getMoviesByGenre: (genreId) => {
        console.log('장르별 영화 요청:', genreId);
        return instance.get('/discover/movie', {
            params: { with_genres: genreId }
        })
            .then(response => {
                console.log('장르별 영화 응답:', response.data.results.length + '개 항목');
                return response;
            })
            .catch(error => {
                console.error('장르별 영화 에러:', error);
                throw error;
            });
    },
    getNowPlaying: () => {
        console.log('현재 상영작 요청 시작');
        return instance.get('/movie/now_playing')
            .then(response => {
                console.log('현재 상영작 응답:', response.data.results.length + '개 항목');
                return response;
            })
            .catch(error => {
                console.error('현재 상영작 에러:', error);
                throw error;
            });
    },
    getTopRated: () => {
        console.log('높은 평점 영화 요청 시작');
        return instance.get('/movie/top_rated')
            .then(response => {
                console.log('높은 평점 영화 응답:', response.data.results.length + '개 항목');
                return response;
            })
            .catch(error => {
                console.error('높은 평점 영화 에러:', error);
                throw error;
            });
    },
    searchMovies: (query) => {
        console.log('영화 검색 요청:', query);
        return instance.get('/search/movie', {
            params: { query }
        })
            .then(response => {
                console.log('검색 결과:', response.data.results.length + '개 항목');
                return response;
            })
            .catch(error => {
                console.error('검색 에러:', error);
                throw error;
            });
    }
};