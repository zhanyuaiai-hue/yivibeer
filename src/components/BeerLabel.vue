<template>
  <canvas ref="canvas" :width="width" :height="height" class="beer-label"></canvas>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'

const props = defineProps({
  beerName: String,
  style: String,
  width: { type: Number, default: 400 },
  height: { type: Number, default: 200 }
})

const canvas = ref(null)

const hashCode = (str) => {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i)
    hash |= 0
  }
  return Math.abs(hash)
}

class Random {
  constructor(seed) {
    this.m = 0x80000000
    this.a = 1103515245
    this.c = 12345
    this.state = seed ? seed : Math.floor(Math.random() * (this.m - 1))
  }
  nextInt() {
    this.state = (this.a * this.state + this.c) % this.m
    return this.state
  }
  nextFloat() {
    return this.nextInt() / (this.m - 1)
  }
  range(min, max) {
    return min + this.nextFloat() * (max - min)
  }
}

const draw = () => {
  if (!canvas.value) return
  const ctx = canvas.value.getContext('2d')
  const w = props.width
  const h = props.height
  const seed = hashCode((props.beerName || 'default') + (props.style || ''))
  const rng = new Random(seed)
  
  ctx.clearRect(0, 0, w, h)
  
  const st = (props.style || '').toLowerCase()
  
  if (st.includes('ipa')) {
    ctx.fillStyle = '#1A1A2E'
    ctx.fillRect(0, 0, w, h)
    const colors = ['#FF6B35', '#F7931E', '#00D9FF', '#6A4C93']
    for (let i = 0; i < 8; i++) {
      ctx.save()
      ctx.translate(rng.range(0, w), rng.range(0, h))
      ctx.rotate(rng.range(0, 6.28))
      ctx.fillStyle = colors[Math.floor(rng.nextFloat() * colors.length)]
      ctx.globalAlpha = 0.7
      const s = rng.range(30, 70)
      if (rng.nextFloat() > 0.5) {
        ctx.beginPath()
        ctx.moveTo(0, -s)
        ctx.lineTo(s, s)
        ctx.lineTo(-s, s)
        ctx.fill()
      } else {
        ctx.fillRect(-s/2, -s/2, s, s)
      }
      ctx.restore()
    }
  } else if (st.includes('wheat') || st.includes('小麦')) {
    const g = ctx.createLinearGradient(0, 0, w, h)
    g.addColorStop(0, '#FFF8DC')
    g.addColorStop(1, '#DEB887')
    ctx.fillStyle = g
    ctx.fillRect(0, 0, w, h)
    for (let i = 0; i < 12; i++) {
      ctx.beginPath()
      ctx.strokeStyle = 'rgba(218, 165, 32, 0.4)'
      ctx.lineWidth = rng.range(3, 8)
      ctx.lineCap = 'round'
      const y = rng.range(0, h)
      ctx.moveTo(0, y)
      for (let x = 0; x < w; x += 10) {
        ctx.lineTo(x, y + Math.sin(x / 20) * rng.range(15, 30))
      }
      ctx.stroke()
    }
  } else if (st.includes('stout') || st.includes('世涛')) {
    const g = ctx.createRadialGradient(w/2, h/2, 0, w/2, h/2, Math.max(w, h))
    g.addColorStop(0, '#1C0A00')
    g.addColorStop(1, '#000000')
    ctx.fillStyle = g
    ctx.fillRect(0, 0, w, h)
    for (let i = 0; i < 20; i++) {
      ctx.save()
      ctx.translate(rng.range(0, w), rng.range(0, h))
      ctx.rotate(rng.range(0, 3.14))
      ctx.fillStyle = 'rgba(70, 40, 20, 0.5)'
      ctx.fillRect(0, 0, rng.range(50, 100), rng.range(20, 40))
      ctx.restore()
    }
  } else if (st.includes('lager') || st.includes('拉格')) {
    ctx.fillStyle = '#F5F5DC'
    ctx.fillRect(0, 0, w, h)
    const colors = ['#2C3E50', '#7F8C8D']
    for (let i = 0; i < 5; i++) {
      const x = rng.range(w * 0.2, w * 0.8)
      ctx.strokeStyle = colors[Math.floor(rng.nextFloat() * 2)]
      ctx.lineWidth = 3
      ctx.beginPath()
      ctx.moveTo(x, h * 0.2)
      ctx.lineTo(x, h * 0.8)
      ctx.stroke()
    }
  } else if (st.includes('sour') || st.includes('酸')) {
    const g = ctx.createLinearGradient(0, 0, w, h)
    g.addColorStop(0, '#FF1744')
    g.addColorStop(0.5, '#D500F9')
    g.addColorStop(1, '#651FFF')
    ctx.fillStyle = g
    ctx.fillRect(0, 0, w, h)
    for (let i = 0; i < 10; i++) {
      ctx.save()
      ctx.translate(rng.range(0, w), rng.range(0, h))
      ctx.rotate(rng.range(0, 6.28))
      ctx.beginPath()
      const pts = Math.floor(rng.range(3, 7))
      for (let j = 0; j < pts; j++) {
        const a = (j / pts) * 6.28
        const r = rng.range(20, 50)
        const x = Math.cos(a) * r
        const y = Math.sin(a) * r
        if (j === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      }
      ctx.closePath()
      ctx.fillStyle = 'rgba(255, 255, 0, 0.5)'
      ctx.fill()
      ctx.restore()
    }
  } else {
    ctx.fillStyle = '#333'
    ctx.fillRect(0, 0, w, h)
    const colors = ['#FF6B35', '#F7931E', '#00D9FF']
    for (let i = 0; i < 6; i++) {
      ctx.fillStyle = colors[i % 3]
      ctx.globalAlpha = 0.6
      ctx.fillRect(rng.range(0, w-50), rng.range(0, h-50), 50, 50)
    }
  }
}

onMounted(() => draw())
watch(() => [props.beerName, props.style], () => draw())
</script>

<style scoped>
.beer-label {
  display: block;
  width: 100%;
  height: auto;
}
</style>
