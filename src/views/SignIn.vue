<template>
  <div class="auth-container">
    <div class="cyber-grid-bg"></div>
    <div class="background-overlay"></div>

    <div class="auth-wrapper">
      <div class="hologram-box" :class="{ 'slide-up': !isLogin }">
        
        <div class="tech-line top-line"></div>
        <div class="tech-line bottom-line"></div>

        <transition name="glitch-fade" mode="out-in">
          
          <form v-if="isLogin" @submit.prevent="handleLogin" key="login">
            <h1 class="brand-title">NETFLIX <span class="version">2077</span></h1>
            <h2 class="form-title">SYSTEM ACCESS</h2>
            
            <div class="input-group-animate delay-1">
              <div class="cyber-input">
                <input 
                  id="login-email"
                  type="email" 
                  v-model="loginForm.email" 
                  required
                  placeholder=" "
                  autocomplete="off"
                >
                <label for="login-email">USER ID / EMAIL</label>
                <span class="focus-border"></span>
              </div>
            </div>

            <div class="input-group-animate delay-2">
              <div class="cyber-input">
                <input 
                  id="login-password"
                  type="password" 
                  v-model="loginForm.password" 
                  required
                  placeholder=" "
                >
                <label for="login-password">PASSWORD</label>
                <span class="focus-border"></span>
              </div>
            </div>

            <div class="input-group-animate delay-3">
              <button type="submit" class="cyber-btn">
                <span class="btn-content">INITIALIZE LOGIN</span>
                <div class="btn-glitch"></div>
              </button>
            </div>
            
            <div class="form-footer input-group-animate delay-4">
              <div class="checkbox-wrapper">
                <input type="checkbox" id="rememberMe" v-model="loginForm.rememberMe">
                <label for="rememberMe">KEEP SESSION</label>
              </div>
              <p class="switch-text">
                NO ACCESS? <span @click="toggleForm" class="neon-link">CREATE DATA</span>
              </p>
            </div>
          </form>

          <form v-else @submit.prevent="handleRegister" key="register">
            <h1 class="brand-title">NETFLIX <span class="version">2077</span></h1>
            <h2 class="form-title">NEW USER REGISTRY</h2>

            <div class="input-group-animate delay-1">
              <div class="cyber-input">
                <input 
                  id="reg-nickname"
                  type="text" 
                  v-model="registerForm.nickname" 
                  required
                  placeholder=" "
                  autocomplete="off"
                >
                <label for="reg-nickname">CODENAME (NICKNAME)</label>
                <span class="focus-border"></span>
              </div>
            </div>

            <div class="input-group-animate delay-2">
              <div class="cyber-input">
                <input 
                  id="reg-email"
                  type="email" 
                  v-model="registerForm.email" 
                  required
                  placeholder=" "
                  @blur="validateEmail(registerForm.email)"
                >
                <label for="reg-email">EMAIL ADDRESS</label>
                <span class="focus-border"></span>
              </div>
            </div>

            <div class="input-group-animate delay-3">
              <div class="cyber-input">
                <input 
                  id="reg-password"
                  type="password" 
                  v-model="registerForm.password" 
                  required
                  placeholder=" "
                >
                <label for="reg-password">SET PASSWORD</label>
                <span class="focus-border"></span>
              </div>
            </div>

            <div class="input-group-animate delay-4">
              <div class="cyber-input">
                <input 
                  id="reg-confirm"
                  type="password" 
                  v-model="registerForm.confirmPassword" 
                  required
                  placeholder=" "
                >
                <label for="reg-confirm">CONFIRM PASSWORD</label>
                <span class="focus-border"></span>
              </div>
            </div>

            <div class="input-group-animate delay-5">
              <button type="submit" class="cyber-btn">
                <span class="btn-content">REGISTER DATA</span>
                <div class="btn-glitch"></div>
              </button>
            </div>

            <div class="form-footer input-group-animate delay-6">
              <div class="checkbox-wrapper">
                <input type="checkbox" id="terms" v-model="registerForm.termsAgreed">
                <label for="terms">ACCEPT PROTOCOLS</label>
              </div>
              <p class="switch-text">
                ALREADY REGISTERED? <span @click="toggleForm" class="neon-link">ACCESS SYSTEM</span>
              </p>
            </div>
          </form>
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SignInPage',
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
        alert('이메일 형식이 올바르지 않습니다.')
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
        this.$router.push('/home')
      } else {
        alert('ACCESS DENIED: 정보가 일치하지 않습니다.')
      }
    },
    handleRegister() {
      if (!this.validateEmail(this.registerForm.email)) return
      if (this.registerForm.password !== this.registerForm.confirmPassword) {
        alert('PASSWORD MISMATCH: 비밀번호가 일치하지 않습니다.')
        return
      }
      if (!this.registerForm.termsAgreed) {
        alert('PROTOCOL REQUIRED: 약관에 동의해주세요.')
        return
      }
      localStorage.setItem('userEmail', this.registerForm.email)
      localStorage.setItem('userPassword', this.registerForm.password)
      localStorage.setItem('userNickname', this.registerForm.nickname)
      alert('REGISTRATION COMPLETE. Welcome Agent.')
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
/* 구글 폰트 (Orbitron - SF 느낌) */
@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&display=swap');

/* --- 1. 배경 설정 --- */
.auth-container {
  min-height: 100vh;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #000510;
  font-family: 'Orbitron', sans-serif; /* 폰트 변경 */
  overflow: hidden;
}

/* 사이버펑크 그리드 배경 */
.cyber-grid-bg {
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background-image: 
    linear-gradient(rgba(0, 102, 255, 0.1) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 102, 255, 0.1) 1px, transparent 1px);
  background-size: 50px 50px;
  transform: perspective(500px) rotateX(60deg);
  animation: gridMove 20s linear infinite;
  opacity: 0.3;
  z-index: 0;
}

@keyframes gridMove {
  0% { transform: perspective(500px) rotateX(60deg) translateY(0); }
  100% { transform: perspective(500px) rotateX(60deg) translateY(50px); }
}

.background-overlay {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at center, transparent 0%, #000510 90%);
  z-index: 1;
}

/* --- 2. 홀로그램 박스 --- */
.auth-wrapper {
  position: relative;
  z-index: 10;
  width: 100%;
  max-width: 460px;
  padding: 20px;
}

.hologram-box {
  background: rgba(0, 10, 20, 0.6); /* 아주 어두운 투명 배경 */
  backdrop-filter: blur(15px);
  padding: 50px 40px;
  border: 1px solid rgba(0, 102, 255, 0.3);
  box-shadow: 0 0 30px rgba(0, 102, 255, 0.15), inset 0 0 20px rgba(0, 102, 255, 0.05);
  position: relative;
  overflow: hidden;
  clip-path: polygon(
    0 0, 
    100% 0, 
    100% 95%, 
    95% 100%, 
    0 100%
  ); /* 우하단 깎인 디자인 */
}

/* 상하단 장식 라인 */
.tech-line {
  position: absolute;
  left: 0;
  width: 100%;
  height: 2px;
  background: #0066FF;
  box-shadow: 0 0 10px #0066FF;
}
.top-line { top: 0; animation: scanLine 3s infinite linear; }
.bottom-line { bottom: 0; width: 50%; right: 0; left: auto; }

@keyframes scanLine {
  0% { transform: translateX(-100%); opacity: 0; }
  50% { opacity: 1; }
  100% { transform: translateX(100%); opacity: 0; }
}

/* --- 3. 타이포그래피 --- */
.brand-title {
  color: #fff;
  font-size: 42px;
  text-align: center;
  margin-bottom: 10px;
  letter-spacing: 4px;
  text-shadow: 0 0 10px rgba(0, 102, 255, 0.8);
}

.version {
  font-size: 14px;
  color: #0066FF;
  vertical-align: top;
  margin-left: 5px;
}

.form-title {
  color: #0066FF;
  font-size: 18px;
  text-align: center;
  margin-bottom: 40px;
  letter-spacing: 2px;
  position: relative;
  display: inline-block;
  width: 100%;
}

.form-title::after {
  content: '';
  display: block;
  width: 40px;
  height: 2px;
  background: #0066FF;
  margin: 10px auto 0;
  box-shadow: 0 0 8px #0066FF;
}

/* --- 4. 인풋 스타일 (Tech Input) --- */
.cyber-input {
  position: relative;
  margin-bottom: 30px;
}

.cyber-input input {
  width: 100%;
  padding: 15px 10px;
  background: transparent;
  border: none;
  border-bottom: 1px solid #333;
  color: #fff;
  font-family: 'Orbitron', sans-serif;
  font-size: 16px;
  letter-spacing: 1px;
  outline: none;
  z-index: 2;
  position: relative;
}

.cyber-input label {
  position: absolute;
  left: 10px;
  top: 15px;
  color: #666;
  font-size: 14px;
  transition: 0.3s ease;
  z-index: 1;
  pointer-events: none;
}

/* 포커스 효과 (가운데서 퍼지는 파란 선) */
.focus-border {
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 0;
  height: 2px;
  background-color: #0066FF;
  transition: 0.4s;
  transform: translateX(-50%);
  box-shadow: 0 0 10px #0066FF;
}

.cyber-input input:focus ~ .focus-border,
.cyber-input input:not(:placeholder-shown) ~ .focus-border {
  width: 100%;
}

.cyber-input input:focus ~ label,
.cyber-input input:not(:placeholder-shown) ~ label {
  top: -20px;
  left: 0;
  color: #0066FF;
  font-size: 12px;
  font-weight: bold;
  text-shadow: 0 0 5px rgba(0, 102, 255, 0.5);
}

/* --- 5. 버튼 스타일 (Hologram Button) --- */
.cyber-btn {
  position: relative;
  width: 100%;
  padding: 18px;
  background: transparent;
  border: 1px solid #0066FF;
  color: #0066FF;
  font-family: 'Orbitron', sans-serif;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  overflow: hidden;
  transition: all 0.3s;
  box-shadow: 0 0 10px rgba(0, 102, 255, 0.2);
  margin-top: 10px;
}

.cyber-btn:hover {
  background: rgba(0, 102, 255, 0.1);
  box-shadow: 0 0 25px rgba(0, 102, 255, 0.6);
  text-shadow: 0 0 8px #0066FF;
  letter-spacing: 2px;
}

.btn-glitch {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(0, 102, 255, 0.4), transparent);
  transform: skewX(-20deg);
  transition: 0.5s;
}

.cyber-btn:hover .btn-glitch {
  left: 100%;
  transition: 0.5s;
}

/* --- 6. 하단 및 기타 --- */
.form-footer {
  margin-top: 30px;
  display: flex;
  flex-direction: column;
  gap: 15px;
  font-size: 12px;
  color: #666;
}

.checkbox-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
}

.checkbox-wrapper input {
  accent-color: #0066FF;
  cursor: pointer;
}

.switch-text {
  text-align: right;
  letter-spacing: 1px;
}

.neon-link {
  color: #fff;
  margin-left: 5px;
  cursor: pointer;
  border-bottom: 1px solid #0066FF;
  transition: 0.3s;
}

.neon-link:hover {
  color: #0066FF;
  text-shadow: 0 0 8px #0066FF;
}

/* --- 7. 애니메이션 (Stagger) --- */
.input-group-animate {
  opacity: 0;
  transform: translateY(20px);
  animation: slideInUp 0.6s forwards;
}
.delay-1 { animation-delay: 0.1s; }
.delay-2 { animation-delay: 0.2s; }
.delay-3 { animation-delay: 0.3s; }
.delay-4 { animation-delay: 0.4s; }
.delay-5 { animation-delay: 0.5s; }
.delay-6 { animation-delay: 0.6s; }

@keyframes slideInUp {
  to { opacity: 1; transform: translateY(0); }
}

/* 전환 애니메이션 (Glitch 느낌) */
.glitch-fade-enter-active,
.glitch-fade-leave-active {
  transition: all 0.3s ease;
}
.glitch-fade-enter-from,
.glitch-fade-leave-to {
  opacity: 0;
  transform: scale(0.98);
  filter: blur(5px);
}
</style>