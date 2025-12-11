<template>
  <div id="app">
    <div class="app-overlay"></div>

    <nav class="navigation">
      <div class="nav-left">
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
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6">
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
    </nav>

    <div class="main-content">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isLoggedIn: false,
      userNickname: '',
      showDropdown: false
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
    async handleKakaoLogin(code) {
      try {
        console.log('인증 코드:', code);
        this.$router.push('/home');
      } catch (error) {
        console.error('카카오 로그인 실패:', error);
        alert('로그인에 실패했습니다.');
      }
    },
    checkLoginStatus() {
      this.isLoggedIn = localStorage.getItem('isLoggedIn') === 'true'
      if (this.isLoggedIn) {
        this.userNickname = localStorage.getItem('userNickname')
      }
    },
    toggleDropdown() {
      this.showDropdown = !this.showDropdown
    },
    async handleLogout() {
      localStorage.removeItem('isLoggedIn')
      localStorage.removeItem('rememberMe')
      this.isLoggedIn = false
      this.showDropdown = false
      this.$router.push('/signin')
    },
    goToHome() {
      if (this.$route.path !== '/home') this.$router.push('/home')
    },
    goToWishlist() {
      this.$router.push('/wishlist')
    },
    goToSearch() {
      this.$router.push('/search')
    },
    goToPopular() {
      this.$router.push('/popular')
    }
  },
  watch: {
    $route() {
      this.checkLoginStatus()
      this.showDropdown = false // 페이지 이동 시 드롭다운 닫기
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
  background-color: #000510; /* 딥 다크 네이비 배경 */
  color: white;
  font-family: 'Noto Sans KR', sans-serif;
  overflow-x: hidden; /* 가로 스크롤 방지 */
}

#app {
  min-height: 100vh;
  position: relative;
}

/* --- 네비게이션 바 (Glassmorphism) --- */
.navigation {
  position: fixed; /* 상단 고정 */
  top: 0;
  left: 0;
  width: 100%;
  height: 70px;
  padding: 0 4%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 1000;
  
  /* 반투명 유리 효과 */
  background: rgba(0, 5, 16, 0.7);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(0, 102, 255, 0.3); /* 파란색 하단 라인 */
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
  gap: 20px;
}

.icon-btn {
  width: 24px;
  height: 24px;
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
  padding-left: 25px; /* 살짝 밀리는 효과 */
}

/* 메인 컨텐츠 여백 (네비게이션 높이만큼) */
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

/* 반응형 */
@media (max-width: 768px) {
  .nav-links { display: none; } /* 모바일에서 메뉴 숨기기 (추후 햄버거 메뉴 필요) */
  .brand-logo { font-size: 1.4rem; }
}
</style>