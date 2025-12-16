// TMDB 이미지 기본 설정
const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/';

// 사용처에 따라 사이즈 프리셋 정의
const IMAGE_SIZES = {
  posterSmall: 'w185',
  posterMedium: 'w342',
  posterLarge: 'w500',
  backdropSmall: 'w300',
  backdropMedium: 'w780',
  backdropLarge: 'w1280',
  original: 'original',
};

/**
 * TMDB 이미지 URL 생성 유틸리티
 * @param {string} path - TMDB에서 내려주는 poster_path / backdrop_path
 * @param {keyof typeof IMAGE_SIZES} sizeKey - IMAGE_SIZES 키값
 * @returns {string|null}
 */
export function getTmdbImageUrl(path, sizeKey = 'posterMedium') {
  if (!path) return null;
  const size = IMAGE_SIZES[sizeKey] || IMAGE_SIZES.posterMedium;
  return `${TMDB_IMAGE_BASE}${size}${path}`;
}
