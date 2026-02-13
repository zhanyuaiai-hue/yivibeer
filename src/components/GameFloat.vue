<template>
  <teleport to="body">
    <div class="game-wrapper">
      <!-- 浮窗按钮 -->
      <button
        v-if="!isOpen"
        @click="openGame"
        class="game-float-btn"
        title="何不添欢"
      >
        何不添欢
      </button>

      <!-- 游戏主界面 -->
      <transition name="game-modal">
        <div v-if="isOpen" class="game-modal-overlay" @click="closeGame">
          <div class="game-modal" @click.stop>
            <button @click="closeGame" class="close-btn">✕</button>

            <!-- 游戏列表 -->
            <div v-if="!selectedGame" class="game-menu">
              <h1 class="game-title">何不添欢</h1>
              <p class="game-subtitle">选择一个助兴的小游戏</p>

              <div class="games-grid">
                <div
                  v-for="game in games"
                  :key="game.id"
                  @click="selectGame(game)"
                  class="game-card"
                >
                  <div class="game-icon">{{ game.icon }}</div>
                  <h3>{{ game.name }}</h3>
                  <p>{{ game.desc }}</p>
                </div>
              </div>
            </div>

            <!-- 游戏规则详情 -->
            <div v-else class="game-detail">
              <button @click="backToMenu" class="back-btn">← 返回</button>

              <div class="detail-header">
                <div class="detail-icon">{{ selectedGame.icon }}</div>
                <h2>{{ selectedGame.name }}</h2>
                <p class="detail-subtitle">{{ selectedGame.desc }}</p>
              </div>

              <div class="detail-content">
                <section class="rule-section">
                  <h3>🎯 游戏人数</h3>
                  <p>{{ selectedGame.players }}</p>
                </section>

                <section class="rule-section">
                  <h3>📜 游戏规则</h3>
                  <ol>
                    <li v-for="(rule, idx) in selectedGame.rules" :key="idx">
                      {{ rule }}
                    </li>
                  </ol>
                </section>

                <section class="rule-section" v-if="selectedGame.examples">
                  <h3>💡 示例</h3>
                  <div class="examples">
                    <div v-for="(example, idx) in selectedGame.examples" :key="idx" class="example-item">
                      {{ example }}
                    </div>
                  </div>
                </section>

                <section class="rule-section" v-if="selectedGame.tips">
                  <h3>⚠️ 注意事项</h3>
                  <ul>
                    <li v-for="(tip, idx) in selectedGame.tips" :key="idx">
                      {{ tip }}
                    </li>
                  </ul>
                </section>
              </div>

              <div class="game-footer">
                <p class="footer-text">理性饮酒，适量为宜 🍺</p>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </teleport>
</template>

<script setup>
import { ref } from 'vue'

const isOpen = ref(false)
const selectedGame = ref(null)

const games = [
  {
    id: 'three-words',
    name: '传三字',
    icon: '🎲',
    desc: '传话游戏，考验反应',
    players: '3人以上',
    rules: [
      '第一个人说一句话',
      '下一个人可以选择：原句传下去，或者改成三个字往回传',
      '改成的三个字必须是有含义的词语',
      '卡顿、说错、说乱了就喝酒',
      '可以一直往下传，也可以随时改成三字往回传'
    ],
    examples: [
      '甲："今天天气不错" → 乙："今天天气不错" → 丙："天气好"（往回传）',
      '甲："我们一起喝一杯" → 乙："喝一杯"（往回传） → 甲："我们一起喝一杯"',
      '甲："精酿啤酒真好喝" → 乙："真好喝"（往回传） → 甲："精酿啤酒真好喝"'
    ],
    tips: [
      '三个字必须是有意义的词语',
      '不能卡顿或说错',
      '往回传后又可以继续往下传'
    ]
  },
  {
    id: 'three-gardens',
    name: '逛三园',
    icon: '🏞️',
    desc: '经典酒桌游戏',
    players: '3人以上',
    rules: [
      '三个园：水果园、蔬菜园、动物园',
      '主持人指定一个园',
      '按顺序轮流报该园的物品',
      '卡顿或重复就喝酒',
      '完成一轮后可以换其他园继续'
    ],
    examples: [
      '水果园: 苹果 → 香蕉 → 西瓜 → 草莓 → 芒果...',
      '蔬菜园: 白菜 → 萝卜 → 茄子 → 西红柿 → 黄瓜...',
      '动物园: 老虎 → 狮子 → 大象 → 熊猫 → 长颈鹿...'
    ],
    tips: [
      '必须是真实存在的物品',
      '不能重复别人说过的',
      '卡顿超过3秒就算输'
    ]
  },
  {
    id: 'initials',
    name: '声母组词',
    icon: '🔤',
    desc: '声母拼词游戏',
    players: '3人以上',
    rules: [
      '随机一个人指定两个声母',
      '每人必须说一个以这两个声母拼写的两字词语',
      '按顺序轮流说，不能重复',
      '说不出来就喝酒',
      '一轮结束后换人指定新的声母'
    ],
    examples: [
      '指定 p-j: 啤酒 → 瓶颈 → 拼接 → 平静 → 偏激...',
      '指定 j-n: 精酿 → 记念 → 江南 → 积年 → 酒酿...',
      '指定 h-l: 欢乐 → 欢愣 → 哄抢 → 合理 → 胡乱...'
    ],
    tips: [
      '声母要准确（zh、ch、sh算一个声母）',
      '必须是两个字的词语',
      '词语要常用，不能胡编乱造'
    ]
  }
]

const openGame = () => {
  isOpen.value = true
}

const closeGame = () => {
  isOpen.value = false
  selectedGame.value = null
}

const selectGame = (game) => {
  selectedGame.value = game
}

const backToMenu = () => {
  selectedGame.value = null
}
</script>

<style scoped>
.game-wrapper {
  position: fixed;
  z-index: 9998;
}

.game-float-btn {
  position: fixed;
  bottom: 40px;
  right: 40px;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
  border: none;
  padding: 16px 20px;
  border-radius: 16px;
  font-size: 1.125rem;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 8px 32px rgba(245, 87, 108, 0.35);
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  letter-spacing: 0.15em;
  font-family: var(--font-display);
  z-index: 9998;
  writing-mode: vertical-rl;
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.2);
}

.game-float-btn:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(245, 87, 108, 0.5);
  background: linear-gradient(135deg, #f5576c 0%, #f093fb 100%);
}

.game-float-btn:active {
  transform: translateY(-2px);
}

.game-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 20px;
}

.game-modal {
  background: white;
  border-radius: 24px;
  max-width: 800px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.close-btn {
  position: absolute;
  top: 20px;
  right: 20px;
  background: rgba(0, 0, 0, 0.1);
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  font-size: 20px;
  cursor: pointer;
  transition: all 0.2s;
  z-index: 10;
}

.close-btn:hover {
  background: rgba(0, 0, 0, 0.2);
  transform: rotate(90deg);
}

/* 游戏菜单 */
.game-menu {
  padding: 60px 40px 40px;
}

.game-title {
  font-family: var(--font-display);
  font-size: 3rem;
  text-align: center;
  margin: 0 0 12px 0;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.game-subtitle {
  text-align: center;
  color: var(--color-stone);
  font-size: 1.125rem;
  margin: 0 0 48px 0;
}

.games-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 24px;
}

.game-card {
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 32px 24px;
  border-radius: 16px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  border: 2px solid transparent;
}

.game-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
  border-color: #f5576c;
}

.game-icon {
  font-size: 3rem;
  margin-bottom: 16px;
}

.game-card h3 {
  font-size: 1.5rem;
  margin: 0 0 8px 0;
  color: var(--color-ink);
  font-family: var(--font-display);
}

.game-card p {
  color: var(--color-stone);
  font-size: 0.9rem;
  margin: 0;
}

/* 游戏详情 */
.game-detail {
  padding: 60px 40px 40px;
}

.back-btn {
  background: transparent;
  border: none;
  color: var(--color-charcoal);
  font-size: 1rem;
  cursor: pointer;
  padding: 8px 0;
  margin-bottom: 24px;
  transition: color 0.2s;
}

.back-btn:hover {
  color: var(--color-ink);
}

.detail-header {
  text-align: center;
  margin-bottom: 40px;
  padding-bottom: 32px;
  border-bottom: 2px solid var(--color-sand);
}

.detail-icon {
  font-size: 4rem;
  margin-bottom: 16px;
}

.detail-header h2 {
  font-family: var(--font-display);
  font-size: 2.5rem;
  margin: 0 0 8px 0;
  color: var(--color-ink);
}

.detail-subtitle {
  color: var(--color-stone);
  font-size: 1.125rem;
  margin: 0;
}

.detail-content {
  margin-bottom: 32px;
}

.rule-section {
  margin-bottom: 32px;
}

.rule-section h3 {
  font-size: 1.25rem;
  color: var(--color-ink);
  margin: 0 0 16px 0;
  font-weight: 600;
}

.rule-section p {
  color: var(--color-charcoal);
  line-height: 1.8;
  font-size: 1rem;
}

.rule-section ol,
.rule-section ul {
  padding-left: 24px;
  color: var(--color-charcoal);
  line-height: 1.8;
}

.rule-section li {
  margin-bottom: 12px;
  font-size: 1rem;
}

.examples {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.example-item {
  background: var(--color-cream);
  padding: 16px;
  border-radius: 8px;
  border-left: 4px solid #f5576c;
  font-family: var(--font-mono);
  font-size: 0.95rem;
  color: var(--color-charcoal);
}

.game-footer {
  text-align: center;
  padding-top: 24px;
  border-top: 2px solid var(--color-sand);
}

.footer-text {
  color: var(--color-stone);
  font-size: 0.9rem;
  margin: 0;
  font-style: italic;
}

/* 动画 */
.game-modal-enter-active,
.game-modal-leave-active {
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.game-modal-enter-from,
.game-modal-leave-to {
  opacity: 0;
}

.game-modal-enter-from .game-modal,
.game-modal-leave-to .game-modal {
  transform: scale(0.9);
}

/* 响应式 */
@media (max-width: 768px) {
  .game-menu,
  .game-detail {
    padding: 40px 24px 24px;
  }

  .game-title {
    font-size: 2rem;
  }

  .games-grid {
    grid-template-columns: 1fr;
  }

  .game-float-btn {
    bottom: 30px;
    right: 30px;
    padding: 14px 18px;
    font-size: 1rem;
  }
}

/* 滚动条 */
.game-modal::-webkit-scrollbar {
  width: 8px;
}

.game-modal::-webkit-scrollbar-track {
  background: #f0f0f0;
}

.game-modal::-webkit-scrollbar-thumb {
  background: #ccc;
  border-radius: 4px;
}

.game-modal::-webkit-scrollbar-thumb:hover {
  background: #999;
}
</style>
