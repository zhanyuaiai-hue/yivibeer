<template>
  <div class="hall-container">
    <h1>{{ copy.title }}</h1>
    <p class="subtitle">{{ copy.subtitle }}</p>

    <div v-if="favorites.length === 0" class="empty-state">
      <div class="empty-icon">🏆</div>
      <p>{{ copy.emptyText }}</p>
      <button v-if="!isGuest" @click="showAddForm = true" class="add-btn">{{ copy.addFirstButton }}</button>
      <p v-else class="guest-hint">{{ copy.guestHint }}</p>
    </div>

    <button v-if="favorites.length > 0 && !isGuest" @click="showAddForm = !showAddForm" class="add-btn-float">
      <span v-if="!showAddForm">+</span>
      <span v-else>×</span>
    </button>

    <div v-if="showAddForm && !isGuest" class="add-form">
      <h2>{{ copy.formTitle }}</h2>
      <input v-model="newFavorite.name" :placeholder="copy.formNamePlaceholder" class="input-field" />
      <input v-model="newFavorite.brewery" :placeholder="copy.formBreweryPlaceholder" class="input-field" />
      <input v-model="newFavorite.style" :placeholder="copy.formStylePlaceholder" class="input-field" />
      <textarea v-model="newFavorite.reason" :placeholder="copy.formReasonPlaceholder" class="textarea-field"></textarea>
      <div class="form-actions">
        <button @click="addFavorite" class="submit-btn">{{ copy.submitButton }}</button>
        <button @click="cancelAdd" class="cancel-btn">{{ copy.cancelButton }}</button>
      </div>
    </div>

    <div class="favorites-grid">
      <div v-for="beer in favorites" :key="beer.id" class="favorite-card">
        <div class="card-image" :style="{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }">
          <div class="trophy-badge">🏆</div>
        </div>
        <div class="card-content">
          <h3>{{ beer.name }}</h3>
          <div class="card-meta">
            <span class="brewery">{{ beer.brewery }}</span>
            <span class="style-tag">{{ beer.style }}</span>
          </div>
          <p class="reason">{{ beer.reason }}</p>
          <div class="card-footer">
            <span class="added-date">{{ formatDate(beer.addedDate) }}</span>
            <button v-if="!isGuest" @click="removeFavorite(beer.id)" class="remove-btn">{{ copy.removeButton }}</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { copyConfig } from '../config/copy'

const showAddForm = ref(false)
const favorites = ref([])
const newFavorite = ref({ name: '', brewery: '', style: '', reason: '' })

// 检查用户权限
const userMode = computed(() => localStorage.getItem('yivi_user_mode'))
const isGuest = computed(() => userMode.value === 'guest')
const currentUser = computed(() => localStorage.getItem('yivi_current_user'))

// 文案配置
const copy = computed(() => copyConfig.hall)

onMounted(() => {
  const storageKey = isGuest.value ? 'beerHallOfFame' : `beerHallOfFame_${currentUser.value}`
  const saved = localStorage.getItem(storageKey)
  if (saved) favorites.value = JSON.parse(saved)
})

const addFavorite = () => {
  if (isGuest.value) {
    alert(copy.value.errorGuest)
    return
  }

  if (!newFavorite.value.name || !newFavorite.value.reason) {
    alert(copy.value.errorRequired)
    return
  }
  const favorite = { id: Date.now(), ...newFavorite.value, addedDate: new Date().toISOString() }
  favorites.value.unshift(favorite)
  const storageKey = `beerHallOfFame_${currentUser.value}`
  localStorage.setItem(storageKey, JSON.stringify(favorites.value))
  newFavorite.value = { name: '', brewery: '', style: '', reason: '' }
  showAddForm.value = false
}

const cancelAdd = () => {
  newFavorite.value = { name: '', brewery: '', style: '', reason: '' }
  showAddForm.value = false
}

const removeFavorite = (id) => {
  if (isGuest.value) {
    alert(copy.value.removeGuestError)
    return
  }

  if (confirm(copy.value.removeConfirm)) {
    favorites.value = favorites.value.filter(b => b.id !== id)
    const storageKey = `beerHallOfFame_${currentUser.value}`
    localStorage.setItem(storageKey, JSON.stringify(favorites.value))
  }
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })
}
</script>

<style scoped>
.hall-container { max-width: 1200px; margin: 0 auto; position: relative; }
h1 { font-size: 2.5rem; font-weight: 700; text-align: center; margin-bottom: 0.5rem; }
.subtitle { text-align: center; color: #8E8E93; font-size: 1.125rem; margin-bottom: 3rem; }
.empty-state { text-align: center; padding: 4rem 2rem; background: white; border-radius: 16px; box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
.empty-icon { font-size: 5rem; margin-bottom: 1rem; }
.empty-state p { color: #8E8E93; font-size: 1.125rem; margin-bottom: 2rem; }
.guest-hint { color: #FF3B30; font-size: 0.95rem; font-style: italic; margin-top: 1rem; }
.add-btn { background: #007AFF; color: white; border: none; padding: 0.875rem 2rem; border-radius: 12px; font-size: 1rem; font-weight: 500; cursor: pointer; transition: all 0.2s; }
.add-btn:hover { background: #0051D5; transform: translateY(-2px); }
.add-btn-float { position: fixed; bottom: 2rem; right: 2rem; width: 60px; height: 60px; background: #007AFF; color: white; border: none; border-radius: 50%; font-size: 2rem; cursor: pointer; box-shadow: 0 4px 12px rgba(0,122,255,0.4); transition: all 0.2s; z-index: 100; display: flex; align-items: center; justify-content: center; }
.add-btn-float:hover { background: #0051D5; transform: scale(1.1); }
.add-form { background: white; padding: 2rem; border-radius: 16px; margin-bottom: 3rem; box-shadow: 0 4px 16px rgba(0,0,0,0.12); }
.add-form h2 { font-size: 1.5rem; font-weight: 600; margin-bottom: 1.5rem; }
.input-field, .textarea-field { width: 100%; padding: 0.875rem; border: 1px solid #E5E5EA; border-radius: 10px; font-size: 1rem; margin-bottom: 1rem; transition: border-color 0.2s; }
.input-field:focus, .textarea-field:focus { outline: none; border-color: #007AFF; }
.textarea-field { min-height: 100px; resize: vertical; font-family: inherit; }
.form-actions { display: flex; gap: 1rem; }
.submit-btn { flex: 1; background: #34C759; color: white; border: none; padding: 0.875rem; border-radius: 12px; font-size: 1rem; font-weight: 500; cursor: pointer; transition: all 0.2s; }
.submit-btn:hover { background: #28A745; }
.cancel-btn { background: #F2F2F7; color: #3A3A3C; border: none; padding: 0.875rem 2rem; border-radius: 12px; font-size: 1rem; font-weight: 500; cursor: pointer; transition: all 0.2s; }
.cancel-btn:hover { background: #E5E5EA; }
.favorites-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 2rem; }
.favorite-card { background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.08); transition: transform 0.3s, box-shadow 0.3s; }
.favorite-card:hover { transform: translateY(-8px); box-shadow: 0 8px 24px rgba(0,0,0,0.15); }
.card-image { height: 200px; background-size: cover; background-position: center; position: relative; display: flex; align-items: center; justify-content: center; }
.trophy-badge { font-size: 4rem; text-shadow: 0 2px 8px rgba(0,0,0,0.3); }
.card-content { padding: 1.5rem; }
.card-content h3 { font-size: 1.375rem; font-weight: 600; margin-bottom: 0.75rem; }
.card-meta { display: flex; gap: 0.5rem; margin-bottom: 1rem; flex-wrap: wrap; }
.brewery { color: #007AFF; font-weight: 500; font-size: 0.875rem; }
.style-tag { background: #F2F2F7; color: #3A3A3C; padding: 0.25rem 0.75rem; border-radius: 6px; font-size: 0.875rem; }
.reason { color: #3A3A3C; line-height: 1.6; margin-bottom: 1rem; font-style: italic; }
.card-footer { display: flex; justify-content: space-between; align-items: center; padding-top: 1rem; border-top: 1px solid #F2F2F7; }
.added-date { color: #8E8E93; font-size: 0.875rem; }
.remove-btn { background: none; color: #FF3B30; border: none; padding: 0.5rem; cursor: pointer; font-size: 0.875rem; transition: opacity 0.2s; }
.remove-btn:hover { opacity: 0.7; }
</style>
