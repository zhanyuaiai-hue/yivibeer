<template>
  <div id="app">
    <!-- 文案配置面板（仅开发环境） -->
    <CopyPanel />

    <!-- 游戏和分享浮窗 -->
    <GameFloat v-if="showHeader" />
    <ShareFloat v-if="showHeader" />

    <header v-if="showHeader" class="masthead">
      <div class="masthead-content">
        <div class="publication-info">
          <h1 class="wordmark">{{ siteCopy.name }}</h1>
          <p class="tagline">{{ siteCopy.tagline }}</p>
        </div>
        <nav class="primary-nav">
          <router-link to="/diary" class="nav-item">{{ navCopy.diary }}</router-link>
          <span class="nav-divider">/</span>
          <router-link to="/guide" class="nav-item">{{ navCopy.guide }}</router-link>
          <span class="nav-divider">/</span>
          <router-link to="/hall" class="nav-item">{{ navCopy.hall }}</router-link>
        </nav>
        <div class="issue-info">
          <span v-if="userMode === 'guest'" class="user-badge guest">{{ navCopy.guestBadge }}</span>
          <span v-else class="user-badge user">{{ currentUser }}</span>
          <button @click="handleLogout" class="btn-logout">{{ navCopy.logout }}</button>
          <span class="mono">{{ currentDate }}</span>
        </div>
      </div>
      <div class="masthead-border"></div>
    </header>
    <main class="editorial-content">
      <router-view v-slot="{ Component }">
        <transition name="page" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
    <footer v-if="showHeader" class="editorial-footer">
      <div class="footer-content">
        <p class="mono">{{ siteCopy.description }}</p>
        <p class="copyright">{{ siteCopy.copyright }}</p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import CopyPanel from './components/CopyPanel.vue'
import GameFloat from './components/GameFloat.vue'
import ShareFloat from './components/ShareFloat.vue'
import { getCopy, copyConfig } from './config/copy'

const router = useRouter()
const route = useRoute()

const currentDate = computed(() => {
  const now = new Date()
  return now.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).replace(/\//g, '.')
})

const userMode = ref(localStorage.getItem('yivi_user_mode'))
const currentUser = ref(localStorage.getItem('yivi_current_user') || '')

// 文案配置
const siteCopy = computed(() => copyConfig.site)
const navCopy = computed(() => copyConfig.nav)

// 监听路由变化，更新用户状态
watch(() => route.path, () => {
  userMode.value = localStorage.getItem('yivi_user_mode')
  currentUser.value = localStorage.getItem('yivi_current_user') || ''
})

const showHeader = computed(() => route.path !== '/login')

const handleLogout = () => {
  if (confirm(navCopy.value.logoutConfirm)) {
    localStorage.removeItem('yivi_user_mode')
    localStorage.removeItem('yivi_current_user')
    router.push('/login')
  }
}
</script>

<style>
#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
.masthead {
  padding: var(--space-md) var(--space-lg);
  background: var(--color-paper);
  position: sticky;
  top: 0;
  z-index: 1000;
  backdrop-filter: blur(10px);
  background: rgba(254, 253, 251, 0.9);
}
.masthead-content {
  max-width: var(--max-width);
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: var(--space-md);
}
.publication-info {
  display: flex;
  align-items: baseline;
  gap: var(--space-sm);
}
.wordmark {
  font-family: var(--font-display);
  font-size: 2rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  color: var(--color-ink);
  margin: 0;
}
.tagline {
  font-family: var(--font-body);
  font-size: 0.875rem;
  color: var(--color-stone);
  font-weight: 300;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}
.primary-nav {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  justify-content: center;
}
.nav-item {
  font-family: var(--font-body);
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--color-charcoal);
  text-decoration: none;
  letter-spacing: 0.05em;
  transition: color 0.3s ease;
  position: relative;
}
.nav-item::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 0;
  width: 0;
  height: 2px;
  background: var(--color-amber);
  transition: width 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
.nav-item:hover,
.nav-item.router-link-active {
  color: var(--color-ink);
}
.nav-item.router-link-active::after {
  width: 100%;
}
.nav-divider {
  color: var(--color-sand);
  font-weight: 300;
}
.issue-info {
  text-align: right;
  display: flex;
  align-items: center;
  gap: var(--space-sm);
}
.user-badge {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  padding: 0.375rem 0.75rem;
  border-radius: 12px;
  font-weight: 500;
}
.user-badge.guest {
  background: var(--color-sand);
  color: var(--color-charcoal);
}
.user-badge.user {
  background: var(--color-amber);
  color: var(--color-paper);
}
.btn-logout {
  background: transparent;
  border: 1px solid var(--color-sand);
  color: var(--color-charcoal);
  padding: 0.375rem 0.75rem;
  font-family: var(--font-mono);
  font-size: 0.7rem;
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.2s;
}
.btn-logout:hover {
  background: var(--color-sand);
  border-color: var(--color-amber);
}
.mono {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: var(--color-stone);
  letter-spacing: 0.05em;
}
.masthead-border {
  max-width: var(--max-width);
  margin: var(--space-sm) auto 0;
  height: 1px;
  background: linear-gradient(90deg,
    transparent 0%,
    var(--color-sand) 20%,
    var(--color-sand) 80%,
    transparent 100%
  );
}
.editorial-content {
  flex: 1;
  padding: var(--space-xl) var(--space-lg);
  max-width: var(--max-width);
  width: 100%;
  margin: 0 auto;
}
.editorial-footer {
  padding: var(--space-lg);
  border-top: 1px solid var(--color-sand);
  margin-top: var(--space-2xl);
}
.footer-content {
  max-width: var(--max-width);
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.875rem;
  color: var(--color-stone);
}
.copyright {
  font-family: var(--font-mono);
  font-size: 0.75rem;
}
.page-enter-active,
.page-leave-active {
  transition: opacity 0.4s ease, transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
.page-enter-from {
  opacity: 0;
  transform: translateY(20px);
}
.page-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
@media (max-width: 1024px) {
  .masthead {
    padding: var(--space-md) var(--space-md);
  }
  .masthead-content {
    grid-template-columns: 1fr;
    gap: var(--space-sm);
    text-align: center;
  }
  .publication-info {
    justify-content: center;
  }
  .issue-info {
    text-align: center;
  }
  .editorial-content {
    padding: var(--space-lg) var(--space-md);
  }
}
@media (max-width: 640px) {
  .wordmark {
    font-size: 1.5rem;
  }
  .primary-nav {
    flex-wrap: wrap;
    gap: var(--space-xs);
  }
  .nav-item {
    font-size: 0.85rem;
  }
  .footer-content {
    flex-direction: column;
    gap: var(--space-xs);
    text-align: center;
  }
}
</style>

