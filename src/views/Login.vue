<template>
  <div class="login-container">
    <div class="login-content">
      <div class="logo-section">
        <h1 class="brand">{{ siteCopy.name }}</h1>
        <p class="tagline">{{ siteCopy.tagline }}</p>
      </div>

      <div class="login-card">
        <h2>{{ copy.welcome }}</h2>
        <p class="subtitle">{{ copy.subtitle }}</p>

        <div class="form-section">
          <input
            v-model="username"
            type="text"
            :placeholder="copy.usernamePlaceholder"
            class="input-field"
            @keyup.enter="handleLogin"
          />
          <input
            v-model="password"
            type="password"
            :placeholder="copy.passwordPlaceholder"
            class="input-field"
            @keyup.enter="handleLogin"
          />

          <button @click="handleLogin" class="btn-login">{{ copy.loginButton }}</button>
          <button @click="handleGuestLogin" class="btn-guest">{{ copy.guestButton }}</button>
        </div>

        <div v-if="error" class="error-message">{{ error }}</div>

        <div class="hint-section">
          <p class="hint">{{ copy.hint }}</p>
          <p class="hint-detail">{{ copy.hintDetail }}</p>
        </div>
      </div>

      <footer class="login-footer">
        <p>{{ siteCopy.copyright }} {{ siteCopy.description }}</p>
      </footer>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { copyConfig } from '../config/copy'

const router = useRouter()
const username = ref('')
const password = ref('')
const error = ref('')

// 使用配置文案
const copy = computed(() => copyConfig.login)
const siteCopy = computed(() => copyConfig.site)

const handleLogin = () => {
  if (!username.value || !password.value) {
    error.value = copy.value.errorRequired
    setTimeout(() => error.value = '', 3000)
    return
  }

  // 简单的本地认证系统
  const users = JSON.parse(localStorage.getItem('yivi_users') || '{}')

  if (users[username.value]) {
    // 用户存在，验证密码
    if (users[username.value] === password.value) {
      localStorage.setItem('yivi_current_user', username.value)
      localStorage.setItem('yivi_user_mode', 'user')
      router.push('/diary')
    } else {
      error.value = copy.value.errorPassword
      setTimeout(() => error.value = '', 3000)
    }
  } else {
    // 新用户，创建账号
    users[username.value] = password.value
    localStorage.setItem('yivi_users', JSON.stringify(users))
    localStorage.setItem('yivi_current_user', username.value)
    localStorage.setItem('yivi_user_mode', 'user')
    router.push('/diary')
  }
}

const handleGuestLogin = () => {
  localStorage.setItem('yivi_user_mode', 'guest')
  localStorage.removeItem('yivi_current_user')
  router.push('/diary')
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-md);
}

.login-content {
  width: 100%;
  max-width: 480px;
  animation: fadeIn 0.6s ease;
}

.logo-section {
  text-align: center;
  margin-bottom: var(--space-lg);
}

.brand {
  font-family: var(--font-display);
  font-size: 3.5rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  color: var(--color-ink);
  margin: 0 0 0.5rem 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.tagline {
  font-family: var(--font-body);
  font-size: 1.125rem;
  color: var(--color-stone);
  font-weight: 300;
  letter-spacing: 0.15em;
  margin: 0;
}

.login-card {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(20px);
  border-radius: 18px;
  padding: var(--space-lg);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.18);
}

.login-card h2 {
  font-family: var(--font-display);
  font-size: 2rem;
  font-weight: 600;
  color: var(--color-ink);
  margin: 0 0 0.5rem 0;
  text-align: center;
}

.subtitle {
  text-align: center;
  color: var(--color-stone);
  font-size: 0.95rem;
  margin: 0 0 var(--space-lg) 0;
}

.form-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.input-field {
  width: 100%;
  background: rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(0, 0, 0, 0.1);
  padding: 1rem 1.25rem;
  font-family: var(--font-body);
  font-size: 1rem;
  color: var(--color-ink);
  border-radius: 12px;
  transition: all 0.3s ease;
  outline: none;
}

.input-field:focus {
  background: white;
  border-color: var(--color-amber);
  box-shadow: 0 0 0 4px rgba(212, 165, 116, 0.1);
}

.input-field::placeholder {
  color: var(--color-stone);
}

.btn-login {
  background: var(--color-ink);
  color: white;
  border: none;
  padding: 1rem;
  font-family: var(--font-body);
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  border-radius: 12px;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  letter-spacing: 0.02em;
}

.btn-login:hover {
  background: var(--color-charcoal);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
}

.btn-login:active {
  transform: translateY(0);
}

.btn-guest {
  background: transparent;
  color: var(--color-amber);
  border: 2px solid var(--color-amber);
  padding: 0.875rem;
  font-family: var(--font-body);
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  border-radius: 12px;
  transition: all 0.3s ease;
}

.btn-guest:hover {
  background: var(--color-amber);
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(212, 165, 116, 0.3);
}

.error-message {
  text-align: center;
  color: #ff3b30;
  font-size: 0.875rem;
  padding: 0.75rem;
  background: rgba(255, 59, 48, 0.1);
  border-radius: 8px;
  margin-top: 1rem;
  animation: shake 0.4s ease;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-10px); }
  75% { transform: translateX(10px); }
}

.hint-section {
  margin-top: var(--space-lg);
  padding-top: var(--space-md);
  border-top: 1px solid rgba(0, 0, 0, 0.08);
  text-align: center;
}

.hint {
  font-size: 0.875rem;
  color: var(--color-charcoal);
  margin: 0 0 0.5rem 0;
  font-weight: 500;
}

.hint-detail {
  font-size: 0.8rem;
  color: var(--color-stone);
  margin: 0;
  font-style: italic;
}

.login-footer {
  margin-top: var(--space-lg);
  text-align: center;
}

.login-footer p {
  font-size: 0.8rem;
  color: rgba(0, 0, 0, 0.5);
  font-family: var(--font-mono);
}

@media (max-width: 640px) {
  .brand {
    font-size: 2.5rem;
  }

  .login-card {
    padding: var(--space-md);
  }

  .login-card h2 {
    font-size: 1.5rem;
  }
}
</style>
