<template>
  <div id="app">
    <nav class="navigation">
      <div class="nav-left">
        <span class="home-link" @click="goToHome">Home</span>
        <span class="wishlist-link" @click="goToWishlist">내가 찜한 콘텐츠</span>
        <span class="popular-link" @click="goToPopular">대세 콘텐츠</span>
      </div>
      
      <div class="nav-right">
        <div v-if="isLoggedIn" class="user-menu">
          <span class="search-icon" @click="goToSearch">🔍</span>
          <span class="nickname" @click="toggleDropdown">{{ userNickname }}님</span>
          <div v-if="showDropdown" class="dropdown">
            <button @click="handleLogout">로그아웃</button>
          </div>
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
      // 카카오 로그인 처리
      this.handleKakaoLogin(code);
    }
  },

  methods: {

    async handleKakaoLogin(code) {
      try {
        console.log('인증 코드:', code);
        // 카카오 로그인 처리 후 홈으로 리다이렉트
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
      this.$router.push('/home')
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
    }
  }
}
</script>

<style>
/* 전역 스타일 */
body {
  margin: 0;
  padding: 0;
  background-color: #141414;
  color: white;
}

#app {
  min-height: 100vh;
  background-color: #141414;
}

.navigation {
  padding: 20px;
  background-color: #141414;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.nav-left a {
  display: flex;
  align-items: center;
  gap: 10px;
}

.home-link {
  color: #bb1616;
  font-weight: 800;
  font-size: xx-large;
  cursor: pointer;
}

.wishlist-link {
  color: #e5e5e5;
  padding: 25px;
  cursor: pointer;
}

.wishlist-link:hover {
  color: #ff0000;
}

.popular-link {
  color: #e5e5e5;
  padding: 25px;
  cursor: pointer;
}

.popular-link:hover {
  color: #ff0000;
}

.nav-right {
  display: flex;
  align-items: center;
  gap: 10px;
}

.search-icon {
  cursor: pointer;
  padding: 8px;
}

.user-menu {
  position: relative;
  cursor: pointer;
}

.nickname {
  color: #e5e5e5;
  cursor: pointer;
  padding: 8px;
}

.dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  background-color: #141414;
  border: 1px solid #333;
  border-radius: 4px;
  padding: 8px;
}

.dropdown button {
  background: none;
  border: none;
  color: #e5e5e5;
  cursor: pointer;
  padding: 8px 16px;
  width: 100%;
  text-align: left;
}

.dropdown button:hover {
  background-color: #333;
}

.signin-link, .logout-link {
  color: #e5e5e5;
  text-decoration: none;
  cursor: pointer;
  font-weight: 500;
  transition: color 0.2s ease;
}

.signin-link:hover, .logout-link:hover {
  color: #ffffff;
}

.search-icon {
  cursor: pointer;
  padding: 8px;
  font-size: 1.2rem;
  transition: transform 0.2s ease;
}

.search-icon:hover {
  transform: scale(1.1);
}

.main-content {
  padding: 20px;
}

/* 링크 스타일 */
/* 링크 스타일 */
a {
  color: #e5e5e5;
}

a:hover {
  color: #ffffff;
}

/* 활성 링크 스타일 */
.router-link-active {
  color: #e50914;
}


</style>