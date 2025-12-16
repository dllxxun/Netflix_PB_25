<template>
  <div id="app">
    <div class="overlay" v-if="isMenuOpen" @click="toggleMenu"></div>
    <div class="app-overlay"></div>

    <nav class="navigation">
      <div class="nav-left">
        <button class="hamburger-btn" @click="toggleMenu">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        </button>

        <span class="brand-logo" @click="goToHome">
          NETCLONE <span class="version">yeon</span>
        </span>
        
        <div class="nav-links">
          <span class="nav-item" @click="goToPopular">대세 콘텐츠</span>
          <span class="nav-item" @click="goToWishlist">내가 찜한 콘텐츠</span>
        </div>
      </div>
      
      <div class="nav-right">
        <div v-if="isLoggedIn" class="user-menu">
          <span class="icon-btn search-btn" @click="goToSearch">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
              <path fill-rule="evenodd" d="M10.5 3.75a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5ZM2.25 10.5a8.25 8.25 0 1 1 14.59 5.28l4.69 4.69a.75.75 0 1 1-1.06 1.06l-4.69-4.69A8.25 8.25 0 0 1 2.25 10.5Z" clip-rule="evenodd" />
            </svg>
          </span>

          <div class="profile-area" @click="toggleDropdown">
            <span class="nickname">{{ userNickname }}님</span>
            <span class="dropdown-arrow">▼</span>
            
            <transition name="fade">
              <div v-if="showDropdown" class="dropdown">
                <div class="dropdown-item" @click.stop="handleLogout">
                  LOGOUT 
                </div>
              </div>
            </transition>
          </div>
        </div>
        
        <div v-else class="auth-links">
          <span class="nav-item" @click="$router.push('/signin')">LOGIN</span>
        </div>
      </div>
      <div class="mouse-follower" ref="mouseFollower"></div>
    </nav>

    <div class="mobile-sidebar" :class="{ 'open': isMenuOpen }">
      <div class="sidebar-header">
        <span class="sidebar-logo">MENU</span>
        <button class="close-btn" @click="toggleMenu">✕</button>
      </div>
      <div class="sidebar-links">
        <span @click="goToHome">홈</span>
        <span @click="goToPopular">대세 콘텐츠</span>
        <span @click="goToWishlist">내가 찜한 콘텐츠</span>
        <span v-if="!isLoggedIn" @click="$router.push('/signin')">로그인</span>
      </div>
    </div>

    <div class="main-content">
      <router-view v-slot="{ Component }">
        <transition name="page-slide" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </div>

  </div>
</template>

<script>
export default {
  data() {
    return {
      isLoggedIn: false,
      userNickname: '',
      userId: '', 
      showDropdown: false,
      isMenuOpen: false, // [추가] 메뉴 열림/닫힘 상태
      mouseX: 0,
      mouseY: 0,
      followerX: 0,
      followerY: 0,
      scrollProgress: 0, isScrolled: false, // 동적 속성
      mouseX: 0, mouseY: 0, // 마우스 팔로우
      isVisible: {} // IntersectionObserver
    }
  },
  created() {
    this.checkLoginStatus()
    const code = new URL(window.location.href).searchParams.get('code');
    if (code) {
      this.handleKakaoLogin(code);
    }
  },
  methods: {
    // [추가] 메뉴 토글 함수
    toggleMenu() {
      this.isMenuOpen = !this.isMenuOpen;
    },
    checkLoginStatus() {
      const isLoggedInStatus = localStorage.getItem('isLoggedIn') === 'true';
      this.isLoggedIn = isLoggedInStatus;
      
      if (isLoggedInStatus) {
        this.userId = localStorage.getItem('userId') || '';
        this.userNickname = localStorage.getItem('userNickname') || 
                            (this.userId ? this.userId.split('@')[0] : 'User');
      } else {
        // 로그아웃 상태 초기화
        this.userId = '';
        this.userNickname = '';
      }
    },
    toggleDropdown() {
      this.showDropdown = !this.showDropdown
    },
    async handleLogout() {
      // 모든 로그인 관련 LocalStorage 항목 제거
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('userId');
      localStorage.removeItem('userNickname');
      localStorage.removeItem('savedId');  // 아이디 저장도 함께 초기화
      
      // 상태 초기화
      this.isLoggedIn = false;
      this.userNickname = '';
      this.userId = '';
      this.showDropdown = false;
      this.isMenuOpen = false;
      
      alert('LOGGED OUT SUCCESSFULLY');
      this.$router.push('/signin');
    },

    goToHome() {
      if (this.$route.path !== '/home') this.$router.push('/home')
      this.isMenuOpen = false; // 이동 시 메뉴 닫기
    },
    goToWishlist() {
      this.$router.push('/wishlist')
      this.isMenuOpen = false; // 이동 시 메뉴 닫기
    },
    goToSearch() {
      this.$router.push('/search')
      this.isMenuOpen = false;
    },
    goToPopular() {
      this.$router.push('/popular')
      this.isMenuOpen = false; // 이동 시 메뉴 닫기
    },
    initScrollAnimations() {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          const target = entry.target;
          if (entry.isIntersecting) {
            // 보이면 애니메이션 재생
            target.style.animationPlayState = 'running';
            target.classList.add('animate-in');
          } else {
            // 안 보이면 일시정지
            target.style.animationPlayState = 'paused';
          }
        });
      }, { threshold: 0.1 });
      document.querySelectorAll('.movie-card, .nav-item, .cyber-btn').forEach(el => {
        observer.observe(el);
      });
    },
    handleScroll() { /* 동적 속성 변경 */ },
    handleMouseMove(e) { /* 마우스 팔로우 */ },
    initScrollAnimations() { /* 일시정지/재생 */ },
    lerp(start, end, t) { return start * (1 - t) + end * t; },

    //  마우스 팔로우 이벤트 핸들링 (핵심!)
    handleMouseMove(e) {
      this.mouseX = e.clientX;
      this.mouseY = e.clientY;
      
      // 부드러운 lerp로 따라가기
      this.followerX += (this.mouseX - this.followerX) * 0.12;
      this.followerY += (this.mouseY - this.followerY) * 0.12;
      
      // DOM 업데이트
      if (this.$refs.mouseFollower) {
        const navRect = this.$refs.navRef.getBoundingClientRect();
        this.$refs.mouseFollower.style.transform = `
          translate3d(${this.followerX - navRect.left - 10}px, 
                     ${this.followerY - navRect.top - 10}px, 0)
        `;
      }
    },
    // ✅ lerp 헬퍼 함수 (이미 있으면 생략)
    lerp(start, end, amt) {
      return start * (1 - amt) + end * amt;
    }
  },
  watch: {
    $route() {
      this.checkLoginStatus()
      this.showDropdown = false 
      this.isMenuOpen = false // [추가] 페이지 이동 시 사이드바 닫기
    }
  }
}
</script>

<style>
/* 폰트 가져오기 (Orbitron & Noto Sans) */
@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Noto+Sans+KR:wght@300;400;700&display=swap');

/* 전역 초기화 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  background-color: #000510;
  color: white;
  font-family: 'Noto Sans KR', sans-serif;
  overflow-x: hidden;
}

#app {
  min-height: 100vh;
  position: relative;
}

/* --- 네비게이션 바 (Glassmorphism) --- */
.navigation {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 70px;
  padding: 0 4%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 1000;
  background: rgba(0, 5, 16, 0.7);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(0, 102, 255, 0.3);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.5);
  transition: all 0.3s ease;
}

/* 로고 스타일 */
.brand-logo {
  font-family: 'Orbitron', sans-serif;
  font-size: 1.8rem;
  font-weight: 900;
  color: #0066FF;
  cursor: pointer;
  letter-spacing: 2px;
  text-shadow: 0 0 10px rgba(0, 102, 255, 0.6);
  margin-right: 40px;
  display: flex;
  align-items: flex-end;
}

.brand-logo .version {
  font-size: 0.8rem;
  color: white;
  margin-left: 5px;
  margin-bottom: 3px;
  opacity: 0.8;
}

/* 왼쪽 메뉴 영역 */
.nav-left {
  display: flex;
  align-items: center;
}

.nav-links {
  display: flex;
  gap: 25px;
  flex-wrap: wrap;
}

.nav-item {
  color: #ccc;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
  position: relative;
}

.nav-item:hover {
  color: #0066FF;
  text-shadow: 0 0 8px rgba(0, 102, 255, 0.4);
}

/* 오른쪽 메뉴 영역 */
.nav-right {
  display: flex;
  align-items: center;
  gap: 15px;
}

.icon-btn {
  /* [수정] 버튼 크기 축소 */
  width: 26px;
  height: 26px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #ccc;
  transition: all 0.3s;
}

.icon-btn:hover {
  color: #0066FF;
  transform: scale(1.1);
  filter: drop-shadow(0 0 5px #0066FF);
}

/* 프로필 & 드롭다운 */
.profile-area {
  display: flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;
  position: relative;
  padding: 5px 10px;
  border-radius: 4px;
  transition: background 0.3s;
}

.profile-area:hover {
  background: rgba(255, 255, 255, 0.1);
}

.nickname {
  font-weight: bold;
  color: white;
  font-size: 0.9rem;
}

.dropdown-arrow {
  font-size: 0.7rem;
  color: #0066FF;
}

/* 드롭다운 메뉴 스타일 */
.dropdown {
  position: absolute;
  top: 120%;
  right: 0;
  background-color: rgba(0, 5, 16, 0.95);
  border: 1px solid #0066FF;
  border-radius: 4px;
  padding: 10px 0;
  min-width: 160px;
  box-shadow: 0 0 15px rgba(0, 102, 255, 0.2);
}

.dropdown-item {
  padding: 10px 20px;
  color: #ccc;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s;
  font-family: 'Orbitron', sans-serif;
}

.dropdown-item:hover {
  background: rgba(0, 102, 255, 0.2);
  color: white;
  padding-left: 25px;
}

.main-content {
  padding-top: 70px;
  min-height: 100vh;
}

/* 애니메이션 */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}


/* [추가] 모바일 반응형 및 사이드바 스타일 */
/* 1. 햄버거 버튼 (PC에선 숨김) */
.hamburger-btn {
  display: none; /* 기본 숨김 */
  background: none;
  border: none;
  color: white;
  width: 30px;
  height: 30px;
  cursor: pointer;
  margin-right: 15px;
}

.hamburger-btn svg {
  width: 100%;
  height: 100%;
}

/* 2. 모바일 사이드바 */
.mobile-sidebar {
  position: fixed;
  top: 0;
  left: -260px; /* 화면 밖으로 숨김 */
  width: 260px;
  height: 100vh;
  background: rgba(0, 5, 16, 0.98); /* 배경색 */
  border-right: 1px solid #0066FF; /* 네온 테두리 */
  z-index: 2000;
  transition: left 0.3s ease; /* 부드럽게 슬라이드 */
  padding: 20px;
  display: flex;
  flex-direction: column;
}

.mobile-sidebar.open {
  left: 0; /* 열리면 화면 안으로 */
}

.sidebar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding-bottom: 15px;
}

.sidebar-logo {
  font-family: 'Orbitron', sans-serif;
  color: #0066FF;
  font-size: 1.2rem;
  font-weight: bold;
}

.close-btn {
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
}

.sidebar-links {
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.sidebar-links span {
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.2s;
  color: #ccc;
}

.sidebar-links span:hover {
  color: #0066FF;
  padding-left: 10px;
}

/* 3. 배경 어둡게 (Overlay) */
.overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  z-index: 1500;
}

/* 4. 미디어 쿼리  */
@media (max-width: 768px) {
  .nav-left { 
    flex: 1; 
    justify-content: space-between;
  }

  .nav-links { 
    display: none; /* 기존 상단 메뉴 숨김 */
  }
  
  .hamburger-btn {
    display: block; /* 햄버거 버튼 보이기 */
  }

  .brand-logo {
    font-size: 1.4rem;
    margin-right: 0;
  }
}

/* 활성 메뉴 */
.nav-item.active {
  color: #0066FF !important;
  background: rgba(0, 102, 255, 0.2);
  box-shadow: 0 0 15px rgba(0, 102, 255, 0.3);
}
.nav-item.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 0;
  height: 2px;
  background: #0066FF;
  animation: underlineExpand 0.4s ease forwards;
  transform: translateX(-50%);
}
@keyframes underlineExpand {
  to { width: 80%; }
}

/* 사이드바 메뉴 호버 */
.sidebar-links span {
  padding: 12px 20px;
  border-radius: 8px;
  position: relative;
}
.sidebar-links span:hover {
  color: #0066FF;
  background: rgba(0, 102, 255, 0.2);
  transform: translateX(10px);
  box-shadow: 0 5px 15px rgba(0, 102, 255, 0.2);
}

/* 라우터 전환 애니메이션 */
.page-slide-enter-active,
.page-slide-leave-active {
  transition: all 0.3s ease;
}
.page-slide-enter-from,
.page-slide-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

/*  마우스 팔로우 네온 라인 (nav 맨 아래에 추가) */
.mouse-follower {
  position: absolute;
  width: 6px;
  height: 6px;
  background: radial-gradient(circle, #00d4ff 0%, #0066FF 70%);
  border-radius: 50%;
  box-shadow: 
    0 0 15px #00d4ff,
    0 0 30px #0066FF,
    0 0 50px rgba(0, 102, 255, 0.5),
    inset 0 0 5px rgba(255, 255, 255, 0.3);
  pointer-events: none;
  z-index: 1001;
  transition: transform 0.08s ease-out;
  will-change: transform;
  opacity: 0;
  animation: neonPulse 2s ease-in-out infinite alternate;
}

.navigation:hover .mouse-follower,
.mouse-follower.moved {
  opacity: 1;
}

/* 네온 펄스 애니메이션 */
@keyframes neonPulse {
  0% {
    box-shadow: 
      0 0 15px #00d4ff,
      0 0 30px #0066FF,
      0 0 50px rgba(0, 102, 255, 0.5);
    transform: scale(1);
  }
  100% {
    box-shadow: 
      0 0 20px #00d4ff,
      0 0 40px #0066FF,
      0 0 70px rgba(0, 102, 255, 0.7),
      inset 0 0 10px rgba(255, 255, 255, 0.5);
    transform: scale(1.2);
  }
}

/* 마우스 움직임 감지 */
.mouse-follower.moved {
  animation-duration: 1.5s;
}

</style>