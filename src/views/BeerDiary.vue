<template>
  <div class="diary-page">
    <!-- Hero Section -->
    <section class="page-hero">
      <div class="hero-grid">
        <div class="hero-text">
          <h1 class="display-title">{{ copy.title }}</h1>
          <p class="lead">{{ copy.subtitle }}</p>
        </div>
        <div v-if="!isGuest" class="hero-action">
          <button @click="showAddForm = !showAddForm" class="btn-primary">
            {{ showAddForm ? copy.cancelButton : copy.addButton }}
          </button>
          <span class="record-count mono">{{ beers.length }} {{ copy.recordCount }}</span>
        </div>
        <div v-else class="hero-action">
          <div class="guest-notice">
            <span class="guest-icon">👀</span>
            <p>{{ copy.guestNotice }}</p>
          </div>
          <span class="record-count mono">{{ beers.length }} {{ copy.recordCount }}</span>
        </div>
      </div>
    </section>

    <!-- Add Form -->
    <transition name="form-slide">
      <section v-if="showAddForm" class="add-form-section">
        <div class="form-container">
          <h2>{{ copy.formTitle }}</h2>

          <div class="form-grid">
            <div class="form-group span-2">
              <label>{{ copy.formBeerName }} *</label>
              <input v-model="newBeer.name" type="text" :placeholder="copy.formBeerNamePlaceholder" />
            </div>

            <div class="form-group autocomplete-wrapper">
              <label>{{ copy.formBrewery }}</label>
              <input
                v-model="newBeer.brewery"
                @input="handleBreweryInput"
                @focus="showBrewerySuggestions = true"
                @blur="hideBrewerySuggestions"
                type="text"
                :placeholder="copy.formBreweryPlaceholder"
              />
              <div v-if="showBrewerySuggestions && filteredBreweries.length > 0" class="autocomplete-dropdown">
                <div
                  v-for="brewery in filteredBreweries"
                  :key="brewery"
                  @mousedown.prevent="selectBrewery(brewery)"
                  class="autocomplete-item"
                >
                  {{ brewery }}
                </div>
              </div>
            </div>

            <div class="form-group">
              <label>{{ copy.formStyle }}</label>
              <select v-model="newBeer.style" class="style-select">
                <option value="">{{ copy.formStylePlaceholder }}</option>
                <option value="IPA">{{ copy.styles.ipa }}</option>
                <option value="Stout">{{ copy.styles.stout }}</option>
                <option value="Wheat">{{ copy.styles.wheat }}</option>
                <option value="Lager">{{ copy.styles.lager }}</option>
                <option value="Sour">{{ copy.styles.sour }}</option>
                <option value="Porter">{{ copy.styles.porter }}</option>
                <option value="Pale Ale">{{ copy.styles.paleAle }}</option>
                <option value="Belgian">{{ copy.styles.belgian }}</option>
                <option value="Amber">{{ copy.styles.amber }}</option>
                <option value="Pilsner">{{ copy.styles.pilsner }}</option>
              </select>
            </div>

            <div class="form-group">
              <label>{{ copy.formAbv }}</label>
              <input v-model="newBeer.abv" type="number" step="0.1" :placeholder="copy.formAbvPlaceholder" />
            </div>

            <div class="form-group">
              <label>{{ copy.formRating }}</label>
              <div class="star-rating">
                <button
                  v-for="star in 5"
                  :key="star"
                  @click="newBeer.rating = star"
                  class="star-btn"
                  :class="{ active: star <= newBeer.rating }"
                  type="button"
                >★</button>
              </div>
            </div>

            <div class="form-group span-2">
              <label>{{ copy.formNotes }}</label>
              <textarea
                v-model="newBeer.notes"
                :placeholder="copy.formNotesPlaceholder"
                rows="4"
              ></textarea>
            </div>
          </div>

          <button @click="addBeer" class="btn-submit">{{ copy.submitButton }}</button>
        </div>
      </section>
    </transition>

    <!-- Records Grid -->
    <section class="records-section">
      <div v-if="beers.length === 0" class="empty-state">
        <p class="empty-text">{{ copy.emptyText }}</p>
        <p class="empty-hint">{{ copy.emptyHint }}</p>
      </div>

      <div v-else class="records-grid">
        <article
          v-for="(beer, index) in beers"
          :key="beer.id"
          class="beer-entry"
          :style="{ animationDelay: `${index * 0.1}s` }"
        >
          <div class="entry-label">
            <BeerLabel
              :beerName="beer.name"
              :style="beer.style || ''"
              :width="400"
              :height="200"
            />
          </div>

          <div class="entry-header">
            <div class="entry-meta">
              <span class="entry-number mono">No.{{ beers.length - index }}</span>
              <span class="entry-date mono">{{ formatDate(beer.date) }}</span>
            </div>
            <button v-if="!isGuest" @click="deleteBeer(beer.id)" class="btn-delete">{{ copy.deleteButton }}</button>
          </div>

          <h3 class="entry-title">{{ beer.name }}</h3>

          <div class="entry-tags">
            <span v-if="beer.brewery" class="tag">{{ beer.brewery }}</span>
            <span v-if="beer.style" class="tag style-tag">{{ beer.style }}</span>
            <span v-if="beer.abv" class="tag">{{ beer.abv }}%</span>
          </div>

          <div v-if="beer.rating" class="entry-rating">
            <span v-for="star in 5" :key="star" class="star" :class="{ filled: star <= beer.rating }">
              {{ star <= beer.rating ? '★' : '☆' }}
            </span>
          </div>

          <p v-if="beer.notes" class="entry-notes">{{ beer.notes }}</p>
        </article>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import BeerLabel from '../components/BeerLabel.vue'
import { copyConfig } from '../config/copy'

const showAddForm = ref(false)
const beers = ref([])
const showBrewerySuggestions = ref(false)
const newBeer = ref({ name: '', brewery: '', style: '', abv: '', notes: '', rating: 0 })

// 检查用户权限
const userMode = computed(() => localStorage.getItem('yivi_user_mode'))
const isGuest = computed(() => userMode.value === 'guest')
const currentUser = computed(() => localStorage.getItem('yivi_current_user'))

// 文案配置
const copy = computed(() => copyConfig.diary)

// 常见精酿酒厂预设
const commonBreweries = [
  '高大师', '熊猫精酿', '拳击猫', 'Jing-A', '牛啤堂',
  '丰收', '18号酒馆', '悠航', 'Slow Boat', '京A',
  'BrewDog', 'Stone', 'Lagunitas', 'Sierra Nevada', 'Goose Island'
]

const allBreweries = computed(() => {
  const breweries = beers.value.map(b => b.brewery).filter(b => b && b.trim())
  const unique = [...new Set([...commonBreweries, ...breweries])]
  return unique
})

const filteredBreweries = computed(() => {
  const input = newBeer.value.brewery.trim().toLowerCase()
  if (!input) return allBreweries.value.slice(0, 8)
  return allBreweries.value.filter(brewery => brewery.toLowerCase().includes(input)).slice(0, 8)
})

const handleBreweryInput = () => { showBrewerySuggestions.value = true }
const selectBrewery = (brewery) => { newBeer.value.brewery = brewery; showBrewerySuggestions.value = false }
const hideBrewerySuggestions = () => { setTimeout(() => { showBrewerySuggestions.value = false }, 200) }

onMounted(() => {
  // 根据用户加载对应的数据
  const storageKey = isGuest.value ? 'beerDiary' : `beerDiary_${currentUser.value}`
  const saved = localStorage.getItem(storageKey)
  if (saved) beers.value = JSON.parse(saved)
})

const addBeer = () => {
  if (isGuest.value) {
    alert(copy.value.errorGuest)
    return
  }

  if (!newBeer.value.name) {
    alert(copy.value.errorRequired)
    return
  }

  const beer = {
    id: Date.now(),
    ...newBeer.value,
    date: new Date().toISOString()
  }

  beers.value.unshift(beer)
  const storageKey = `beerDiary_${currentUser.value}`
  localStorage.setItem(storageKey, JSON.stringify(beers.value))

  newBeer.value = {
    name: '',
    brewery: '',
    style: '',
    abv: '',
    notes: '',
    rating: 0
  }
  showAddForm.value = false
}

const deleteBeer = (id) => {
  if (isGuest.value) {
    alert(copy.value.deleteGuestError)
    return
  }

  if (confirm(copy.value.deleteConfirm)) {
    beers.value = beers.value.filter(b => b.id !== id)
    const storageKey = `beerDiary_${currentUser.value}`
    localStorage.setItem(storageKey, JSON.stringify(beers.value))
  }
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).replace(/\//g, '.')
}
</script>
<style scoped>
.diary-page {
  opacity: 0;
  animation: fadeIn 0.6s ease forwards;
}

/* Hero Section */
.page-hero {
  padding: var(--space-md) 0 var(--space-lg);
  border-bottom: 1px solid var(--color-sand);
  margin-bottom: var(--space-xl);
}

.hero-grid {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: var(--space-md);
  align-items: center;
}

.hero-text {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.display-title {
  font-family: var(--font-display);
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 700;
  line-height: 1.1;
  letter-spacing: -0.02em;
  color: var(--color-ink);
  margin: 0;
}

.lead {
  font-size: 1rem;
  color: var(--color-stone);
  line-height: 1.6;
  max-width: 500px;
}

.hero-action {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: var(--space-xs);
}

.btn-primary {
  background: var(--color-amber);
  color: var(--color-paper);
  border: none;
  padding: 1rem 2rem;
  font-family: var(--font-body);
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  border-radius: 4px;
  white-space: nowrap;
}

.btn-primary:hover {
  background: var(--color-gold);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(212, 165, 116, 0.3);
}

.record-count {
  font-family: var(--font-mono);
  font-size: 0.875rem;
  color: var(--color-stone);
}

.guest-notice {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: var(--color-cream);
  border: 1px solid var(--color-sand);
  border-radius: 4px;
}

.guest-icon {
  font-size: 1.5rem;
}

.guest-notice p {
  font-family: var(--font-mono);
  font-size: 0.875rem;
  color: var(--color-charcoal);
  margin: 0;
  font-weight: 500;
}

/* Form Section */
.add-form-section {
  margin-bottom: var(--space-xl);
  background: var(--color-cream);
  border: 1px solid var(--color-sand);
  padding: var(--space-lg);
  border-radius: 4px;
}

.form-container h2 {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: var(--space-md);
  color: var(--color-ink);
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-sm);
  margin-bottom: var(--space-md);
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group.span-2 {
  grid-column: span 2;
}

.form-group label {
  font-family: var(--font-body);
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-charcoal);
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  background: var(--color-paper);
  border: 1px solid var(--color-sand);
  padding: 0.75rem 1rem;
  font-family: var(--font-body);
  font-size: 0.95rem;
  color: var(--color-ink);
  transition: border-color 0.2s;
  border-radius: 2px;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: var(--color-amber);
}

.form-group textarea {
  resize: vertical;
  line-height: 1.5;
}

.style-select {
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23666' d='M6 9L1 4h10z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.75rem center;
  padding-right: 2.5rem;
}

/* Autocomplete */
.autocomplete-wrapper {
  position: relative;
}

.autocomplete-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: var(--color-paper);
  border: 1px solid var(--color-amber);
  border-top: none;
  max-height: 200px;
  overflow-y: auto;
  z-index: 100;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.autocomplete-item {
  padding: 0.75rem 1rem;
  cursor: pointer;
  transition: background 0.15s;
  font-size: 0.9rem;
  color: var(--color-ink);
}

.autocomplete-item:hover {
  background: var(--color-cream);
}

/* Star Rating */
.star-rating {
  display: flex;
  gap: 0.25rem;
}

.star-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: var(--color-sand);
  cursor: pointer;
  transition: all 0.2s;
  padding: 0;
  line-height: 1;
}

.star-btn.active {
  color: var(--color-gold);
}

.star-btn:hover {
  transform: scale(1.15);
}

.btn-submit {
  background: var(--color-amber);
  color: var(--color-paper);
  border: none;
  padding: 0.875rem 2rem;
  font-family: var(--font-body);
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  border-radius: 4px;
  width: 100%;
}

.btn-submit:hover {
  background: var(--color-gold);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(212, 165, 116, 0.3);
}

/* Records Section */
.records-section {
  margin-top: var(--space-lg);
}

.empty-state {
  text-align: center;
  padding: var(--space-2xl);
  color: var(--color-stone);
}

.empty-text {
  font-size: 1.5rem;
  margin-bottom: var(--space-sm);
  color: var(--color-charcoal);
}

.empty-hint {
  font-size: 1rem;
}

.records-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
  gap: var(--space-lg);
}

.beer-entry {
  background: var(--color-paper);
  border: 1px solid var(--color-sand);
  padding: var(--space-md);
  opacity: 0;
  animation: fadeInUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  transition: all 0.25s;
  border-radius: 2px;
}

.beer-entry:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  border-color: var(--color-amber);
}

.entry-label {
  margin-bottom: var(--space-md);
  border-radius: 2px;
  overflow: hidden;
}

.entry-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-sm);
  padding-bottom: var(--space-sm);
  border-bottom: 1px solid var(--color-sand);
}

.entry-meta {
  display: flex;
  gap: var(--space-sm);
  font-size: 0.75rem;
  font-family: var(--font-mono);
}

.entry-number {
  color: var(--color-amber);
  font-weight: 600;
}

.entry-date {
  color: var(--color-stone);
}

.btn-delete {
  background: none;
  border: none;
  color: var(--color-stone);
  font-size: 0.8rem;
  cursor: pointer;
  font-family: var(--font-mono);
  transition: color 0.2s;
  padding: 0.25rem 0.5rem;
}

.btn-delete:hover {
  color: var(--color-rust);
}

.entry-title {
  font-size: 1.5rem;
  margin-bottom: var(--space-sm);
  line-height: 1.3;
  font-weight: 600;
}

.entry-tags {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-bottom: var(--space-sm);
}

.tag {
  font-family: var(--font-mono);
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 0.25rem 0.625rem;
  background: var(--color-cream);
  color: var(--color-charcoal);
  border: 1px solid var(--color-sand);
  border-radius: 2px;
}

.style-tag {
  background: var(--color-amber);
  color: var(--color-paper);
  border-color: var(--color-amber);
  font-weight: 600;
}

.entry-rating {
  margin-bottom: var(--space-sm);
  font-size: 1.125rem;
  letter-spacing: 0.125rem;
}

.star {
  color: var(--color-sand);
}

.star.filled {
  color: var(--color-gold);
}

.entry-notes {
  color: var(--color-charcoal);
  line-height: 1.6;
  font-size: 0.9rem;
  font-style: italic;
}

/* Transitions */
.form-slide-enter-active,
.form-slide-leave-active {
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.form-slide-enter-from,
.form-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Responsive */
@media (max-width: 1024px) {
  .records-grid {
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  }
}

@media (max-width: 768px) {
  .hero-grid {
    grid-template-columns: 1fr;
    gap: var(--space-md);
  }

  .hero-action {
    align-items: stretch;
  }

  .btn-primary {
    width: 100%;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }

  .form-group.span-2 {
    grid-column: span 1;
  }

  .records-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .display-title {
    font-size: 2rem;
  }

  .page-hero {
    padding: var(--space-sm) 0 var(--space-md);
  }
}
</style>

