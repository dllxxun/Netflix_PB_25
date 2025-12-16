# netclone | yeon_PB_25

![Project Banner](./public/image.png)

> **# WSD-Assignment-02 | NETCLONE (yeon_PB_25)**

Vue.js + TMDB API 기반 Netflix 스타일 SPA 영화 사이트

## 🔗 배포 링크
👉 [https://netclone-25.netlify.app/movielist.github.io/home](https://netclone-25.netlify.app/movielist.github.io/home)

## 📋 프로젝트 기본 정보
- **과제명**: GPT와 함께 Front-End Demo Site 개발 (Netflix 클론)
- **Framework**: Vue 3 + Vite + Vue Router
- **API**: TMDB API (Axios, 최소 4개 엔드포인트)
- **상태관리**: LocalStorage (로그인, 위시리스트, 사용자 설정)
- **배포**: Netlify Continuous Deployment

## 📁 프로젝트 구조
```
## 📁 프로젝트 전체 폴더 구조

Netflix_Clone_25/
├── .vscode/                 # VSCode 설정
├── node_modules/            # 의존성 모듈 (제출 시 제외)
├── public/                  # 정적 리소스
│   ├── favicon.ico
│   ├── image.png
│   └── og-image.png
├── src/
│   ├── api/                 # TMDB API 관련 함수
│   │   └── tmdb.js
│   ├── components/          # 재사용 컴포넌트
│   │   ├── InfiniteScrollView.vue  # 스크롤 끝에서 자동으로 다음 페이지를 불러오는 영화 리스트 뷰
│   │   ├── MovieList.vue  # 영화 카드들을 그리드/슬라이드 형태로 나열해서 보여주는 리스트 컴포넌트
│   │   └── TableView.vue  # 테이블 형태로 영화 목록과 페이지네이션을 보여주는 컴포넌트
│   ├── composables/         # Composition API (로직 분리)
│   │   ├── useFavorites.js   # LocalStorage와 연동된 위시리스트(찜) 추가·삭제/조회 로직
│   │   ├── useMovies.js   # TMDB API 호출, 영화 목록/상태/로딩 처리 등 공통 영화 데이터 로직

│   │   └── useMovieSearch.js # 검색어·필터를 받아 TMDB 검색 API 호출하고 결과/에러/로딩을 관리하는 로직
│   ├── router/              # 라우터 설정
│   │   └── index.js
│   ├── views/               # 페이지 단위 화면
│   │   ├── HomeView.vue            # 메인 홈 화면
│   │   ├── MovieDetailView.vue     # 영화 상세 화면
│   │   ├── PopularPage.vue         # 대세 콘텐츠 화면
│   │   ├── SearchPage.vue          # 검색/필터 화면
│   │   ├── SignInPage.vue          # 로그인/회원가입 화면
│   │   └── WishlistPage.vue        # 찜한 콘텐츠 화면
│   ├── App.vue               # 루트 컴포넌트
│   └── main.js               # 진입 스크립트
├── .env                      # TMDB API 키 환경 변수
├── .gitignore
├── index.html
├── package.json
├── package-lock.json 또는 pnpm-lock.yaml
├── vite.config.js
└── README.md

```


## 🛠 기술 스택
- **Framework:** Vue 3
- **Build Tool:** Vite
- **Routing:** Vue Router
- **API:** TMDB API (Axios)
- **Deployment:** Netlify

## 📝 주요 기능
✅ Single Page Application (SPA) 구현 (Vue Router)  
✅ TMDB API 4개 엔드포인트 연동 (인기/상영중/검색/필터링)  
✅ LocalStorage 3개 이상 Key-Value 관리 (로그인/위시리스트/API키)  
✅ 로그인/회원가입 + Remember Me (폼 전환 애니메이션)  
✅ 위시리스트 토글 (포스터 클릭 → 하트 + LocalStorage 동기화)  
✅ 대세 콘텐츠: Infinite Scroll + Table View 전환  
✅ 검색/필터링: 키워드 + 장르/평점 UI  
✅ 반응형 웹: 모바일 햄버거 → 사이드바 (768px 이하)  
✅ CSS Transition: 페이지 전환/호버 확대/사이드바 슬라이드


## 🚀 설치 및 실행 가이드
``` bash
npm install
```
``` bash
npm run dev # 개발 서버: http://localhost:5173
```
``` bash
npm run build # 정적 파일 생성: dist/
```
``` bash
npm run preview # 빌드 확인: http://localhost:4173
```

## 🌿 Gitflow 브랜치 전략
- 'main' : 제품 출시 (배포) 브랜치
- 'develop' : 개발 통합 브랜치
- 'feature/*' : 기능 개발
   ├── navigation-mobile (모바일)
   ├── search-filtering (검색/필터링)
   ├── wishlist-localstorage (찜하기)
   └── popular-infinite-scroll (대세 콘텐츠)