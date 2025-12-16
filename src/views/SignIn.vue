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
            <h1 class="brand-title">NETCLONE <span class="version">yeon</span></h1>
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
                <span class="btn-content">LOGIN</span>
                <div class="btn-glitch"></div>
              </button>
            </div>
            
            <div class="form-footer input-group-animate delay-4">
              <div class="checkbox-wrapper">
                <input type="checkbox" id="rememberMe" v-model="loginForm.keepLoggedIn">
                <label for="rememberMe">KEEP SESSION</label>
              </div>
              <p class="switch-text">
                NO ACCESS? <span @click="toggleForm" class="neon-link">CREATE DATA</span>
              </p>
            </div>
          </form>
          
          <form v-else @submit.prevent="handleRegister" key="register">
            <h1 class="brand-title">NETCLONE <span class="version">yeon</span></h1>
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
        saveId: false,      
        keepLoggedIn: false 
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
  mounted() {
    // 페이지 로드 시 저장된 아이디 불러오기
    const savedId = localStorage.getItem('savedId');
    if (savedId) {
      this.loginForm.email = savedId;
      this.loginForm.saveId = true;
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
    
    // [수정된 핵심 로그인 로직]
    handleLogin() {
      // 1. 저장된 사용자 정보 확인 (없으면 테스트용 계정으로 간주하거나 실패 처리)
      const storedEmail = localStorage.getItem('userEmail');
      const storedPassword = localStorage.getItem('userPassword');

      // 등록된 정보가 없는데 로그인을 시도하는 경우 (테스트 편의를 위해 통과시킬 수도 있음)
      // 여기서는 '등록된 정보와 일치하거나' OR '정보가 없으면 그냥 통과(테스트모드)' 로직으로 짭니다.
      const isMatch = (this.loginForm.email === storedEmail && this.loginForm.password === storedPassword);
      
      // ★ 중요: 등록된 정보가 있으면 일치 여부 확인, 없으면 그냥 테스트용으로 로그인 성공 처리 (개발 편의성)
      if (isMatch || !storedEmail) {
        
        console.log("로그인 성공 처리 시작");

        // [핵심 Fix] 체크박스 여부와 상관없이 '현재 로그인 상태'는 무조건 true여야 함
        localStorage.setItem('isLoggedIn', 'true');
        
        // 닉네임 설정 (없으면 이메일 앞자리)
        const nickname = localStorage.getItem('userNickname') || this.loginForm.email.split('@')[0];
        localStorage.setItem('userNickname', nickname);

        // 아이디 저장 (선택 사항)
        if (this.loginForm.keepLoggedIn) {
           // '로그인 유지'를 체크했다면 savedId 등을 갱신
           localStorage.setItem('savedId', this.loginForm.email);
        }

        // 알림 (옵션)
        // alert('ACCESS GRANTED!'); 

        // 라우터 이동 (강제 이동)
        this.$router.push('/home').catch(() => {
            // 혹시라도 라우터 에러나면 강제로 href 이동
            window.location.href = '/home'; 
        });
        
      } else {
        alert('ACCESS DENIED: 아이디 또는 비밀번호가 일치하지 않습니다.');
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
      
      // 회원가입 정보 저장
      localStorage.setItem('userEmail', this.registerForm.email)
      localStorage.setItem('userPassword', this.registerForm.password)
      localStorage.setItem('userNickname', this.registerForm.nickname)
      
      alert('REGISTRATION COMPLETE. Welcome Agent.')
      
      // 로그인 화면으로 전환 및 이메일 자동 입력
      this.isLogin = true
      this.loginForm.email = this.registerForm.email
      this.loginForm.password = '' // 비밀번호는 비워두기
    },
    
    toggleForm() {
      this.isLogin = !this.isLogin
      // 폼 전환 시 입력값 초기화 (선택사항)
      if(this.isLogin) {
          this.loginForm.password = '';
      } else {
          this.registerForm.password = '';
          this.registerForm.confirmPassword = '';
      }
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
  background: transparent !important;
  border: none;
  border-bottom: 1px solid rgba(0, 102, 255, 0.5) !important;
  color: #fff;
  font-family: 'Orbitron', sans-serif;
  font-size: 16px;
  letter-spacing: 1px;
  outline: none;
  z-index: 2;
  position: relative;
  transition: all 0.3s;
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

/* 포커스 효과 */
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

.cyber-input input:focus,
.cyber-input input:hover,
.cyber-input input:not(:placeholder-shown) {
  border-bottom: 1px solid #0066FF !important;
  box-shadow: 0 10px 10px -5px rgba(0, 102, 255, 0.2);
}

/* 브라우저 자동완성 스타일 제거 */
.cyber-input input:-webkit-autofill,
.cyber-input input:-webkit-autofill:hover, 
.cyber-input input:-webkit-autofill:focus, 
.cyber-input input:-webkit-autofill:active {
    -webkit-box-shadow: 0 0 0 30px #000510 inset !important;
    -webkit-text-fill-color: white !important;
    transition: background-color 5000s ease-in-out 0s;
    caret-color: white;
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
  width: 16px; 
  height: 16px;
}

.checkbox-wrapper label {
  cursor: pointer;
  color: #ccc;
  user-select: none;
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