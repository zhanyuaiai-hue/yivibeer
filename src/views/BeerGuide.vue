<template>
  <div class="guide-container">
    <h1>酒神教义</h1>
    <p class="subtitle">探索精酿啤酒的酒神精神</p>

    <div class="guide-section">
      <div class="icon">🍺</div>
      <h2>精酿 vs 工业啤酒</h2>
      <div class="comparison">
        <div class="column">
          <h3>精酿啤酒</h3>
          <ul>
            <li>小规模酿造</li>
            <li>使用优质原料</li>
            <li>风味丰富多样</li>
            <li>强调创新和个性</li>
          </ul>
        </div>
        <div class="column">
          <h3>工业啤酒</h3>
          <ul>
            <li>大规模生产</li>
            <li>成本控制为主</li>
            <li>口味标准化</li>
            <li>追求清爽易饮</li>
          </ul>
        </div>
      </div>
    </div>

    <div class="guide-section">
      <div class="icon">🌾</div>
      <h2>四大原料</h2>
      <div class="ingredients">
        <div class="ingredient-card">
          <h3>麦芽</h3>
          <p>提供糖分和颜色，决定啤酒的基础风味</p>
        </div>
        <div class="ingredient-card">
          <h3>啤酒花</h3>
          <p>带来苦味和香气，是精酿的灵魂</p>
        </div>
        <div class="ingredient-card">
          <h3>酵母</h3>
          <p>将糖转化为酒精，产生独特风味</p>
        </div>
        <div class="ingredient-card">
          <h3>水</h3>
          <p>占啤酒90%以上，影响口感和质量</p>
        </div>
      </div>
    </div>

    <div class="guide-section">
      <div class="icon">🎨</div>
      <h2>常见风格速记</h2>
      <div class="styles">
        <div class="style-card">
          <h3>IPA（印度淡色艾尔）</h3>
          <div class="tags">
            <span class="tag">苦味明显</span>
            <span class="tag">花香浓郁</span>
            <span class="tag">酒精度中高</span>
          </div>
          <p>最受欢迎的精酿风格，啤酒花香气突出，口感清爽</p>
        </div>
        <div class="style-card">
          <h3>世涛（Stout）</h3>
          <div class="tags">
            <span class="tag">深色浓郁</span>
            <span class="tag">咖啡味</span>
            <span class="tag">口感厚重</span>
          </div>
          <p>黑色啤酒，带有咖啡、巧克力、焦糖等风味</p>
        </div>
        <div class="style-card">
          <h3>小麦啤酒（Wheat）</h3>
          <div class="tags">
            <span class="tag">果香明显</span>
            <span class="tag">口感柔滑</span>
            <span class="tag">适合入门</span>
          </div>
          <p>使用小麦酿造，带有香蕉、丁香等香气，清爽易饮</p>
        </div>
      </div>
    </div>

    <div class="guide-section final">
      <h2>开始你的精酿之旅</h2>
      <p>建议从小麦啤酒或淡色IPA开始，逐步尝试更多风格。每个人的口味不同，找到自己喜欢的才是最重要的！</p>
    </div>
  </div>
</template>

<style scoped>
.guide-container { max-width: 900px; margin: 0 auto; }
h1 { font-size: 2.5rem; font-weight: 700; text-align: center; margin-bottom: 0.5rem; }
.subtitle { text-align: center; color: #8E8E93; font-size: 1.125rem; margin-bottom: 3rem; }
.guide-section { background: white; padding: 2rem; border-radius: 16px; margin-bottom: 2rem; box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
.icon { font-size: 3rem; text-align: center; margin-bottom: 1rem; }
.guide-section h2 { font-size: 1.75rem; font-weight: 600; text-align: center; margin-bottom: 1.5rem; }
.comparison { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; margin-top: 1.5rem; }
.column h3 { font-size: 1.25rem; font-weight: 600; margin-bottom: 1rem; color: #007AFF; }
.column ul { list-style: none; padding: 0; }
.column li { padding: 0.5rem 0; padding-left: 1.5rem; position: relative; }
.column li::before { content: '•'; position: absolute; left: 0; color: #007AFF; font-weight: bold; }
.ingredients { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-top: 1.5rem; }
.ingredient-card { background: #F2F2F7; padding: 1.5rem; border-radius: 12px; text-align: center; }
.ingredient-card h3 { font-size: 1.125rem; font-weight: 600; margin-bottom: 0.5rem; }
.ingredient-card p { color: #3A3A3C; font-size: 0.875rem; line-height: 1.5; }
.styles { display: grid; gap: 1.5rem; margin-top: 1.5rem; }
.style-card { background: #F2F2F7; padding: 1.5rem; border-radius: 12px; transition: transform 0.2s; }
.style-card:hover { transform: translateX(4px); }
.style-card h3 { font-size: 1.25rem; font-weight: 600; margin-bottom: 0.75rem; }
.tags { display: flex; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 0.75rem; }
.tag { background: white; color: #007AFF; padding: 0.375rem 0.75rem; border-radius: 8px; font-size: 0.75rem; font-weight: 500; }
.style-card p { color: #3A3A3C; line-height: 1.6; }
.final { text-align: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; }
.final h2 { color: white; }
.final p { font-size: 1.125rem; line-height: 1.8; }
</style>
