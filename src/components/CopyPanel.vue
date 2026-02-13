<template>
  <teleport to="body">
    <div v-if="isDevMode" class="copy-panel-wrapper">
      <!-- 浮动按钮 -->
      <button
        @click="togglePanel"
        class="copy-panel-toggle"
        :class="{ active: isPanelOpen }"
        title="文案配置面板"
      >
        <span v-if="!isPanelOpen">✍️</span>
        <span v-else>✕</span>
      </button>

      <!-- 配置面板 -->
      <transition name="panel-slide">
        <div v-if="isPanelOpen" class="copy-panel">
          <div class="panel-header">
            <h2>📝 文案配置中心</h2>
            <p class="panel-subtitle">直接编辑，实时预览</p>
          </div>

          <div class="panel-toolbar">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="搜索文案..."
              class="search-input"
            />
            <button @click="exportConfig" class="btn-icon" title="导出配置">
              💾
            </button>
            <button @click="resetConfig" class="btn-icon" title="重置为默认">
              🔄
            </button>
          </div>

          <div class="panel-content">
            <div v-for="(section, sectionKey) in filteredConfig" :key="sectionKey" class="config-section">
              <div class="section-header" @click="toggleSection(sectionKey)">
                <span class="section-icon">{{ sectionKey === activeSection ? '▼' : '▶' }}</span>
                <h3>{{ getSectionTitle(sectionKey) }}</h3>
                <span class="section-count">{{ getItemCount(section) }} 项</span>
              </div>

              <transition name="section-expand">
                <div v-if="activeSection === sectionKey" class="section-content">
                  <div
                    v-for="(value, key) in flattenSection(section)"
                    :key="key"
                    class="config-item"
                  >
                    <label class="item-label">
                      <span class="item-key">{{ formatKey(key) }}</span>
                      <span class="item-path">{{ sectionKey }}.{{ key }}</span>
                    </label>

                    <!-- 字符串输入 -->
                    <input
                      v-if="typeof value === 'string' && value.length < 100"
                      v-model="editingValues[`${sectionKey}.${key}`]"
                      @input="handleEdit(`${sectionKey}.${key}`, $event.target.value)"
                      type="text"
                      class="item-input"
                    />

                    <!-- 长文本输入 -->
                    <textarea
                      v-else-if="typeof value === 'string'"
                      v-model="editingValues[`${sectionKey}.${key}`]"
                      @input="handleEdit(`${sectionKey}.${key}`, $event.target.value)"
                      class="item-textarea"
                      rows="3"
                    ></textarea>

                    <!-- 数组展示 -->
                    <div v-else-if="Array.isArray(value)" class="item-array">
                      <div v-for="(item, idx) in value" :key="idx" class="array-item">
                        <input
                          v-model="editingValues[`${sectionKey}.${key}.${idx}`]"
                          @input="handleArrayEdit(`${sectionKey}.${key}`, idx, $event.target.value)"
                          type="text"
                          class="item-input"
                        />
                      </div>
                    </div>

                    <!-- 对象展示 -->
                    <div v-else-if="typeof value === 'object'" class="item-object">
                      <pre>{{ JSON.stringify(value, null, 2) }}</pre>
                    </div>
                  </div>
                </div>
              </transition>
            </div>
          </div>

          <div class="panel-footer">
            <button @click="saveAllChanges" class="btn-save">
              ✅ 保存所有修改
            </button>
            <button @click="closePanel" class="btn-cancel">
              取消
            </button>
          </div>
        </div>
      </transition>

      <!-- 遮罩层 -->
      <transition name="overlay-fade">
        <div v-if="isPanelOpen" @click="closePanel" class="copy-panel-overlay"></div>
      </transition>
    </div>
  </teleport>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { copyConfig, setCopy, resetCopyConfig, exportCopyConfig, initCopyConfig } from '../config/copy'

const isDevMode = import.meta.env.DEV
const isPanelOpen = ref(false)
const searchQuery = ref('')
const activeSection = ref('site')
const editingValues = reactive({})

// 初始化
onMounted(() => {
  try {
    initCopyConfig()
    loadEditingValues()
  } catch (error) {
    console.error('Failed to initialize copy config:', error)
  }
})

const loadEditingValues = () => {
  try {
    Object.keys(copyConfig).forEach(sectionKey => {
      const section = copyConfig[sectionKey]
      if (!section) return

      Object.entries(flattenSection(section)).forEach(([key, value]) => {
        const path = `${sectionKey}.${key}`
        if (typeof value === 'string') {
          editingValues[path] = value
        } else if (Array.isArray(value)) {
          value.forEach((item, idx) => {
            editingValues[`${path}.${idx}`] = item
          })
        }
      })
    })
  } catch (error) {
    console.error('Failed to load editing values:', error)
  }
}

const togglePanel = () => {
  isPanelOpen.value = !isPanelOpen.value
  if (isPanelOpen.value) {
    loadEditingValues()
  }
}

const closePanel = () => {
  isPanelOpen.value = false
}

const toggleSection = (sectionKey) => {
  activeSection.value = activeSection.value === sectionKey ? null : sectionKey
}

// 获取区域标题
const getSectionTitle = (key) => {
  const titles = {
    site: '🌐 网站基础',
    login: '🔐 登录页面',
    nav: '🧭 导航栏',
    diary: '📖 品鉴日记',
    guide: '📚 酒神教义',
    hall: '🏆 酣战榜'
  }
  return titles[key] || key
}

// 展平嵌套对象
const flattenSection = (obj, prefix = '') => {
  const result = {}
  for (const [key, value] of Object.entries(obj)) {
    const newKey = prefix ? `${prefix}.${key}` : key
    if (typeof value === 'object' && !Array.isArray(value) && value !== null) {
      Object.assign(result, flattenSection(value, newKey))
    } else {
      result[newKey] = value
    }
  }
  return result
}

// 获取项目数量
const getItemCount = (section) => {
  return Object.keys(flattenSection(section)).length
}

// 格式化键名
const formatKey = (key) => {
  return key
    .split('.')
    .map(k => k.replace(/([A-Z])/g, ' $1').trim())
    .join(' → ')
}

// 处理编辑
const handleEdit = (path, value) => {
  editingValues[path] = value
}

// 处理数组编辑
const handleArrayEdit = (basePath, index, value) => {
  const keys = basePath.split('.')
  const lastKey = keys.pop()
  let obj = copyConfig

  for (const key of keys) {
    obj = obj[key]
  }

  if (Array.isArray(obj[lastKey])) {
    obj[lastKey][index] = value
  }
}

// 保存所有修改
const saveAllChanges = () => {
  Object.entries(editingValues).forEach(([path, value]) => {
    if (!path.match(/\.\d+$/)) { // 跳过数组索引
      setCopy(path, value)
    }
  })

  alert('✅ 文案已保存！刷新页面查看效果。')
  location.reload()
}

// 重置配置
const resetConfig = () => {
  if (confirm('确定要重置为默认文案吗？所有自定义修改将丢失。')) {
    resetCopyConfig()
  }
}

// 导出配置
const exportConfig = () => {
  exportCopyConfig()
  alert('✅ 配置已导出到 yivi-copy-config.json')
}

// 搜索过滤
const filteredConfig = computed(() => {
  if (!searchQuery.value) return copyConfig

  const query = searchQuery.value.toLowerCase()
  const filtered = {}

  Object.entries(copyConfig).forEach(([sectionKey, section]) => {
    const flatSection = flattenSection(section)
    const matchedItems = {}

    Object.entries(flatSection).forEach(([key, value]) => {
      const searchText = `${key} ${value}`.toLowerCase()
      if (searchText.includes(query)) {
        matchedItems[key] = value
      }
    })

    if (Object.keys(matchedItems).length > 0) {
      filtered[sectionKey] = section
    }
  })

  return filtered
})
</script>

<style scoped>
.copy-panel-wrapper {
  position: fixed;
  z-index: 9999;
}

.copy-panel-toggle {
  position: fixed;
  top: 50%;
  right: 20px;
  transform: translateY(-50%);
  width: 56px;
  height: 56px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 50%;
  color: white;
  font-size: 24px;
  cursor: pointer;
  box-shadow: 0 4px 20px rgba(102, 126, 234, 0.4);
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  z-index: 10001;
  display: flex;
  align-items: center;
  justify-content: center;
}

.copy-panel-toggle:hover {
  transform: translateY(-50%) scale(1.1);
  box-shadow: 0 6px 30px rgba(102, 126, 234, 0.6);
}

.copy-panel-toggle.active {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.copy-panel {
  position: fixed;
  top: 0;
  right: 0;
  width: 480px;
  height: 100vh;
  background: white;
  box-shadow: -4px 0 40px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  z-index: 10000;
}

.panel-header {
  padding: 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.panel-header h2 {
  margin: 0 0 8px 0;
  font-size: 1.5rem;
  font-weight: 600;
}

.panel-subtitle {
  margin: 0;
  font-size: 0.875rem;
  opacity: 0.9;
}

.panel-toolbar {
  padding: 16px;
  display: flex;
  gap: 8px;
  border-bottom: 1px solid #e0e0e0;
  background: #f8f9fa;
}

.search-input {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 0.9rem;
  outline: none;
}

.search-input:focus {
  border-color: #667eea;
}

.btn-icon {
  width: 36px;
  height: 36px;
  border: 1px solid #ddd;
  background: white;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-icon:hover {
  background: #f0f0f0;
  transform: scale(1.05);
}

.panel-content {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
}

.config-section {
  margin-bottom: 16px;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  overflow: hidden;
  background: white;
}

.section-header {
  padding: 16px;
  background: #f8f9fa;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 12px;
  transition: background 0.2s;
}

.section-header:hover {
  background: #f0f0f0;
}

.section-icon {
  font-size: 12px;
  color: #666;
}

.section-header h3 {
  flex: 1;
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: #333;
}

.section-count {
  font-size: 0.75rem;
  color: #999;
  background: white;
  padding: 4px 8px;
  border-radius: 12px;
}

.section-content {
  padding: 16px;
}

.config-item {
  margin-bottom: 20px;
}

.item-label {
  display: block;
  margin-bottom: 8px;
}

.item-key {
  font-size: 0.875rem;
  font-weight: 500;
  color: #333;
}

.item-path {
  display: block;
  font-size: 0.75rem;
  color: #999;
  font-family: monospace;
  margin-top: 4px;
}

.item-input,
.item-textarea {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 0.9rem;
  font-family: inherit;
  transition: border-color 0.2s;
}

.item-input:focus,
.item-textarea:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.item-textarea {
  resize: vertical;
  line-height: 1.5;
}

.item-array {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.array-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.item-object pre {
  background: #f5f5f5;
  padding: 12px;
  border-radius: 8px;
  font-size: 0.8rem;
  overflow-x: auto;
}

.panel-footer {
  padding: 16px;
  border-top: 1px solid #e0e0e0;
  display: flex;
  gap: 8px;
  background: #f8f9fa;
}

.btn-save {
  flex: 1;
  padding: 12px 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-save:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(102, 126, 234, 0.4);
}

.btn-cancel {
  padding: 12px 24px;
  background: white;
  color: #666;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-cancel:hover {
  background: #f0f0f0;
}

.copy-panel-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 9999;
}

/* 动画 */
.panel-slide-enter-active,
.panel-slide-leave-active {
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.panel-slide-enter-from,
.panel-slide-leave-to {
  transform: translateX(100%);
}

.overlay-fade-enter-active,
.overlay-fade-leave-active {
  transition: opacity 0.3s ease;
}

.overlay-fade-enter-from,
.overlay-fade-leave-to {
  opacity: 0;
}

.section-expand-enter-active,
.section-expand-leave-active {
  transition: all 0.3s ease;
}

.section-expand-enter-from,
.section-expand-leave-to {
  max-height: 0;
  opacity: 0;
}

/* 滚动条样式 */
.panel-content::-webkit-scrollbar {
  width: 8px;
}

.panel-content::-webkit-scrollbar-track {
  background: #f0f0f0;
}

.panel-content::-webkit-scrollbar-thumb {
  background: #ccc;
  border-radius: 4px;
}

.panel-content::-webkit-scrollbar-thumb:hover {
  background: #999;
}
</style>
