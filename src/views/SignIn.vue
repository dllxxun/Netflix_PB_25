<template>
  <div class="auth-container">
    <div class="auth-box" :class="{ 'slide-up': !isLogin }">
      <transition name="fade" mode="out-in">
        <form v-if="isLogin" @submit.prevent="handleLogin" key="login">
          <h1>로그인</h1>
          <div class="input-group">
            <input 
              type="email" 
              v-model="loginForm.email" 
              placeholder="이메일"
              @blur="validateEmail(loginForm.email)"
              required
            >
          </div>
          <div class="input-group">
            <input 
              type="password" 
              v-model="loginForm.password" 
              placeholder="비밀번호"
              required
            >
          </div>
          <div class="checkbox-group">
            <label>
              <input type="checkbox" v-model="loginForm.rememberMe">
              <span>Remember me</span>
            </label>
          </div>
          <button type="submit">로그인</button>
          
          <p class="switch-form">
            계정이 없으신가요? 
            <span @click="toggleForm">회원가입</span>
          </p>
        </form>

        <form v-else @submit.prevent="handleRegister" key="register">
          <h1>회원가입</h1>
          <div class="input-group">
            <input 
              type="text" 
              v-model="registerForm.nickname" 
              placeholder="닉네임"
              required
            >
          </div>
          <div class="input-group">
            <input 
              type="email" 
              v-model="registerForm.email" 
              placeholder="이메일"
              @blur="validateEmail(registerForm.email)"
              required
            >
          </div>
          <div class="input-group">
            <input 
              type="password" 
              v-model="registerForm.password" 
              placeholder="비밀번호"
              required
            >
          </div>
          <div class="input-group">
            <input 
              type="password" 
              v-model="registerForm.confirmPassword" 
              placeholder="비밀번호 확인"
              required
            >
          </div>
          <div class="checkbox-group">
            <label>
              <input type="checkbox" v-model="registerForm.termsAgreed">
              <span>약관에 동의합니다</span>
            </label>
          </div>
          <button type="submit">회원가입</button>
          <p class="switch-form">
            이미 계정이 있으신가요? 
            <span @click="toggleForm">로그인</span>
          </p>
        </form>
      </transition>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SignInPage',
  // components: {} 블록 전체 제거 (카카오 외에 다른 컴포넌트가 없으므로)
  data() {
    return {
      isLogin: true,
      loginForm: {
        email: '',
        password: '',
        rememberMe: false
      },
      registerForm: {
        nickname: '',
        email: '',
        password: '',
        confirmPassword: '',
        termsAgreed: false
      }
    }
  },
  methods: {
    validateEmail(email) {
      const regex = /^[\w-]+@([\w-]+\.)+[\w-]{2,4}$/
      if (!regex.test(email)) {
        alert('잘못된 이메일 형식입니다.')
        return false
      }
      return true
    },
    handleLogin() {
      const storedEmail = localStorage.getItem('userEmail')
      const storedPassword = localStorage.getItem('userPassword')

      if (this.loginForm.email === storedEmail && this.loginForm.password === storedPassword) {
        localStorage.setItem('isLoggedIn', 'true')
        if (this.loginForm.rememberMe) {
          localStorage.setItem('rememberMe', 'true')
        }
        alert('로그인 성공!')
        this.$router.push('/home') // 홈 화면으로 이동
      } else {
        alert('이메일 또는 비밀번호가 일치하지 않습니다.')
      }
    },
    handleRegister() {
      if (!this.validateEmail(this.registerForm.email)) return
      
      if (this.registerForm.password !== this.registerForm.confirmPassword) {
        alert('비밀번호가 일치하지 않습니다.')
        return
      }

      if (!this.registerForm.termsAgreed) {
        alert('약관에 동의해주세요.')
        return
      }
      // 사용자 정보 저장
      localStorage.setItem('userEmail', this.registerForm.email)
      localStorage.setItem('userPassword', this.registerForm.password)
      localStorage.setItem('userNickname', this.registerForm.nickname)
      
      alert('회원가입 완료되었습니다.')

      // 로그인 폼으로 전환하고 이메일 자동입력
      this.isLogin = true
      this.loginForm.email = this.registerForm.email
    },
    toggleForm() {
      this.isLogin = !this.isLogin
    }
  }
}
</script>

<style scoped>
.auth-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #141414;
}

.auth-box {
  background-color: rgba(0, 0, 0, 0.75);
  padding: 60px 68px 40px;
  border-radius: 4px;
  width: 100%;
  max-width: 450px;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
  border: 1px solid #dbdbdb;
}

h1 {
  color: #0066FF;
  margin-bottom: 28px;
  font-size: 32px;
}

.input-group {
  margin-bottom: 12px;
}

input[type="email"],
input[type="password"],
input[type="text"] {
  width: 100%;
  height: 50px;
  padding: 16px 8px;
  border: none;
  border-radius: 4px;
  background-color: #333;
  color: white;
  font-size: 16px;
}

.checkbox-group {
  margin: 16px 0;
  color: #b3b3b3;
}

.checkbox-group label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

button {
  width: 104%;
  height: 60px;
  background-color: #0066FF;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  font-weight: bold;
  margin-top: 24px;
  cursor: pointer;
}

button:hover {
  background-color: #0066FF;
}

.switch-form {
  margin-top: 20px;
  color: #ffffff;
}
</style>