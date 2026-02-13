<template>
  <teleport to="body">
    <div class="share-wrapper">
      <!-- 分享按钮 - 固定右上角 -->
      <button
        v-if="!isOpen"
        @click="openShare"
        class="share-header-btn"
        title="分享祝酒词"
      >
        <span class="share-icon">🍻</span>
        <span class="share-text">分享</span>
      </button>

      <!-- 分享界面 -->
      <transition name="share-modal">
        <div v-if="isOpen" class="share-modal-overlay" @click="closeShare">
          <div class="share-modal" @click.stop>
            <button @click="closeShare" class="close-btn">✕</button>

            <!-- 祝酒词画面 -->
            <div ref="shareCard" class="share-card">
              <div class="card-bg"></div>
              <div class="card-content">
                <h1 class="site-name">YIVI</h1>
                <p class="site-tagline">精酿手记</p>

                <div class="quote-container">
                  <div class="quote-mark">"</div>
                  <p class="quote-text">{{ currentQuote.text }}</p>
                  <div class="quote-mark end">"</div>
                </div>

                <p class="quote-author">—— {{ currentQuote.author }}</p>

                <div class="card-footer">
                  <p class="invitation">邀你共饮一杯</p>
                  <p class="url">yivibeer.pages.dev</p>
                </div>
              </div>
            </div>

            <!-- 操作按钮 -->
            <div class="action-buttons">
              <button @click="changeQuote" class="btn-change">
                🎲 换一句
              </button>
              <button @click="downloadImage" class="btn-download">
                📷 保存图片
              </button>
              <button @click="copyText" class="btn-copy">
                📋 复制文案
              </button>
            </div>

            <p class="tip">长按图片保存，分享给朋友</p>
          </div>
        </div>
      </transition>
    </div>
  </teleport>
</template>

<script setup>
import { ref, computed } from 'vue'
import html2canvas from 'html2canvas'

const isOpen = ref(false)
const currentQuoteIndex = ref(0)
const shareCard = ref(null)

// 精选50条关于酒的经典诗词、名言和歌词
const quotes = [
  { text: '人生得意须尽欢，莫使金樽空对月', author: '李白《将进酒》' },
  { text: '劝君更尽一杯酒，西出阳关无故人', author: '王维《送元二使安西》' },
  { text: '葡萄美酒夜光杯，欲饮琵琶马上催', author: '王翰《凉州词》' },
  { text: '酒逢知己千杯少，话不投机半句多', author: '欧阳修' },
  { text: '今朝有酒今朝醉，明日愁来明日愁', author: '罗隐《自遣》' },
  { text: '一壶浊酒尽余欢，今宵别梦寒', author: '李叔同《送别》' },
  { text: '对酒当歌，人生几何', author: '曹操《短歌行》' },
  { text: '兰陵美酒郁金香，玉碗盛来琥珀光', author: '李白《客中行》' },
  { text: '桃李春风一杯酒，江湖夜雨十年灯', author: '黄庭坚《寄黄几复》' },
  { text: '明月几时有，把酒问青天', author: '苏轼《水调歌头》' },

  { text: '醉翁之意不在酒，在乎山水之间也', author: '欧阳修《醉翁亭记》' },
  { text: '开轩面场圃，把酒话桑麻', author: '孟浩然《过故人庄》' },
  { text: '浊酒一杯家万里，燕然未勒归无计', author: '范仲淹《渔家傲》' },
  { text: '花间一壶酒，独酌无相亲', author: '李白《月下独酌》' },
  { text: '酒入愁肠，化作相思泪', author: '范仲淹《苏幕遮》' },
  { text: '白日放歌须纵酒，青春作伴好还乡', author: '杜甫《闻官军收河南河北》' },
  { text: '三杯两盏淡酒，怎敌他晚来风急', author: '李清照《声声慢》' },
  { text: '绿蚁新醅酒，红泥小火炉', author: '白居易《问刘十九》' },
  { text: '借问酒家何处有，牧童遥指杏花村', author: '杜牧《清明》' },
  { text: '钟鼓馔玉不足贵，但愿长醉不愿醒', author: '李白《将进酒》' },

  { text: '酒债寻常行处有，人生七十古来稀', author: '杜甫《曲江二首》' },
  { text: '醉卧沙场君莫笑，古来征战几人回', author: '王翰《凉州词》' },
  { text: '浮生若梦，为欢几何', author: '李白《春夜宴桃李园序》' },
  { text: '天若不爱酒，酒星不在天', author: '李白《月下独酌》' },
  { text: '但使主人能醉客，不知何处是他乡', author: '李白《客中行》' },
  { text: '酒不醉人人自醉', author: '民间俗语' },
  { text: '举杯邀明月，对影成三人', author: '李白《月下独酌》' },
  { text: '醉里挑灯看剑，梦回吹角连营', author: '辛弃疾《破阵子》' },
  { text: '抽刀断水水更流，举杯消愁愁更愁', author: '李白《宣州谢脁楼饯别校书叔云》' },
  { text: '新丰美酒斗十千，咸阳游侠多少年', author: '王维《少年行》' },

  { text: '一醉解千愁', author: '民间俗语' },
  { text: '酒香不怕巷子深', author: '民间俗语' },
  { text: '无酒不成席', author: '民间俗语' },
  { text: '酒肉穿肠过，佛祖心中留', author: '济公' },
  { text: '酒是粮食精，越喝越年轻', author: '民间俗语' },
  { text: '感情深，一口闷；感情浅，舔一舔', author: '民间俗语' },
  { text: '酒逢知己饮，诗向会人吟', author: '古语' },
  { text: '酒能成事，酒能败事', author: '古语' },
  { text: '酒后吐真言', author: '民间俗语' },
  { text: '醉后不知天在水，满船清梦压星河', author: '唐温如《题龙阳县青草湖》' },

  { text: '来时一盏酒，去后一杯茶', author: '民间俗语' },
  { text: '酒是穿肠毒药，色是刮骨钢刀', author: '古语' },
  { text: '千古文章未尽才，至今犹待酒中来', author: '方回' },
  { text: '酒量虽小，醉后无德', author: '古语' },
  { text: '但愿老死花酒间，不愿鞠躬车马前', author: '李白' },
  { text: '一杯未竟情先醉', author: '古诗词' },
  { text: '酒逢知己千钟少', author: '古语' },
  { text: '有缘千里来相会，无缘对面不相逢', author: '施耐庵《水浒传》' },
  { text: '酒不醉人人自醉，色不迷人人自迷', author: '古语' },
  { text: '浮生长恨欢娱少，肯爱千金轻一笑', author: '宋祁' }
]

const currentQuote = computed(() => quotes[currentQuoteIndex.value])

const openShare = () => {
  isOpen.value = true
  currentQuoteIndex.value = Math.floor(Math.random() * quotes.length)
}

const closeShare = () => {
  isOpen.value = false
}

const changeQuote = () => {
  let newIndex
  do {
    newIndex = Math.floor(Math.random() * quotes.length)
  } while (newIndex === currentQuoteIndex.value)
  currentQuoteIndex.value = newIndex
}

const downloadImage = async () => {
  try {
    // 等待元素完全渲染
    await new Promise(resolve => setTimeout(resolve, 500))

    const canvas = await html2canvas(shareCard.value, {
      backgroundColor: null, // 保留透明背景，让渐变完整显示
      scale: 4, // 超高清晰度
      useCORS: true,
      allowTaint: true,
      logging: false,
      // 让 html2canvas 自动计算尺寸
      foreignObjectRendering: true,
      // 确保渐变和阴影正确渲染
      removeContainer: true
    })

    // 创建一个新的 canvas 添加白色背景
    const finalCanvas = document.createElement('canvas')
    finalCanvas.width = canvas.width
    finalCanvas.height = canvas.height
    const ctx = finalCanvas.getContext('2d')

    // 填充白色背景
    ctx.fillStyle = '#fefdfb'
    ctx.fillRect(0, 0, finalCanvas.width, finalCanvas.height)

    // 绘制海报
    ctx.drawImage(canvas, 0, 0)

    // 转换为高质量图片
    const link = document.createElement('a')
    const now = new Date()
    const dateStr = `${now.getFullYear()}${(now.getMonth()+1).toString().padStart(2,'0')}${now.getDate().toString().padStart(2,'0')}`
    link.download = `YIVI祝酒词_${dateStr}.png`
    link.href = finalCanvas.toDataURL('image/png', 1.0)
    link.click()

    alert('✅ 图片已保存到下载文件夹！')
  } catch (error) {
    console.error('保存图片失败:', error)
    alert('💡 提示：请长按图片手动保存，或截图保存')
  }
}

const copyText = () => {
  const text = `${currentQuote.value.text}\n—— ${currentQuote.value.author}\n\n来自 YIVI 精酿手记\n邀你共饮一杯 🍺`

  if (navigator.clipboard) {
    navigator.clipboard.writeText(text).then(() => {
      alert('✅ 文案已复制到剪贴板！')
    })
  } else {
    // 降级方案
    const textarea = document.createElement('textarea')
    textarea.value = text
    document.body.appendChild(textarea)
    textarea.select()
    document.execCommand('copy')
    document.body.removeChild(textarea)
    alert('✅ 文案已复制！')
  }
}
</script>

<style scoped>
.share-wrapper {
  position: fixed;
  z-index: 9997;
}

.share-header-btn {
  position: fixed;
  top: 20px;
  right: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 4px 20px rgba(102, 126, 234, 0.3);
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  letter-spacing: 0.05em;
  font-family: var(--font-display);
  z-index: 9997;
  display: flex;
  align-items: center;
  gap: 8px;
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.15);
}

.share-header-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 28px rgba(102, 126, 234, 0.45);
  background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
}

.share-header-btn:active {
  transform: translateY(0);
}

.share-icon {
  font-size: 1.25rem;
  line-height: 1;
}

.share-text {
  font-size: 1rem;
}

.share-modal-overlay {
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

.share-modal {
  background: white;
  border-radius: 24px;
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  padding: 60px 40px 40px;
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

/* 分享卡片 */
.share-card {
  position: relative;
  background: linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%);
  border-radius: 16px;
  padding: 48px 32px;
  margin-bottom: 32px;
  overflow: hidden;
  min-height: 600px;
  max-width: 500px;
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.card-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image:
    radial-gradient(circle at 20% 50%, rgba(255, 255, 255, 0.3) 0%, transparent 50%),
    radial-gradient(circle at 80% 80%, rgba(255, 255, 255, 0.2) 0%, transparent 50%);
  pointer-events: none;
}

.card-content {
  position: relative;
  z-index: 1;
  text-align: center;
  width: 100%;
}

.site-name {
  font-family: var(--font-display);
  font-size: 3rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  color: rgba(0, 0, 0, 0.9);
  margin: 0 0 8px 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.site-tagline {
  font-size: 1rem;
  color: rgba(0, 0, 0, 0.7);
  margin: 0 0 40px 0;
  letter-spacing: 0.2em;
}

.quote-container {
  position: relative;
  margin: 48px 0;
  padding: 0 32px;
}

.quote-mark {
  font-family: Georgia, serif;
  font-size: 4rem;
  color: rgba(0, 0, 0, 0.2);
  line-height: 1;
  position: absolute;
  top: -20px;
  left: 0;
}

.quote-mark.end {
  top: auto;
  bottom: -40px;
  left: auto;
  right: 0;
}

.quote-text {
  font-family: var(--font-display);
  font-size: 1.5rem;
  line-height: 1.8;
  color: rgba(0, 0, 0, 0.9);
  margin: 0;
  font-weight: 500;
}

.quote-author {
  font-size: 1.125rem;
  color: rgba(0, 0, 0, 0.7);
  margin: 24px 0 0 0;
  font-style: italic;
}

.card-footer {
  margin-top: 48px;
  padding-top: 24px;
  border-top: 2px solid rgba(0, 0, 0, 0.1);
}

.invitation {
  font-size: 1.125rem;
  color: rgba(0, 0, 0, 0.8);
  margin: 0 0 8px 0;
  font-weight: 500;
}

.url {
  font-family: var(--font-mono);
  font-size: 0.875rem;
  color: rgba(0, 0, 0, 0.6);
  margin: 0;
}

/* 操作按钮 */
.action-buttons {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
}

.action-buttons button {
  flex: 1;
  padding: 14px 20px;
  border: none;
  border-radius: 12px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-change {
  background: var(--color-cream);
  color: var(--color-charcoal);
}

.btn-change:hover {
  background: var(--color-sand);
  transform: translateY(-2px);
}

.btn-download {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-download:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.btn-copy {
  background: var(--color-amber);
  color: white;
}

.btn-copy:hover {
  background: var(--color-gold);
  transform: translateY(-2px);
}

.tip {
  text-align: center;
  color: var(--color-stone);
  font-size: 0.875rem;
  margin: 0;
  font-style: italic;
}

/* 动画 */
.share-modal-enter-active,
.share-modal-leave-active {
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.share-modal-enter-from,
.share-modal-leave-to {
  opacity: 0;
}

.share-modal-enter-from .share-modal,
.share-modal-leave-to .share-modal {
  transform: scale(0.9);
}

/* 响应式 */
@media (max-width: 768px) {
  .share-modal {
    padding: 40px 24px 24px;
  }

  .share-card {
    padding: 32px 24px;
    min-height: 450px;
  }

  .site-name {
    font-size: 2.5rem;
  }

  .quote-text {
    font-size: 1.25rem;
  }

  .action-buttons {
    flex-direction: column;
  }

  .share-header-btn {
    top: 16px;
    right: 16px;
    padding: 10px 20px;
    font-size: 0.95rem;
  }

  .share-icon {
    font-size: 1.125rem;
  }
}
</style>
