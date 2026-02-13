// 文案配置中心 - 集中管理所有页面文案
export const copyConfig = {
  // 网站基础信息
  site: {
    name: 'YIVI',
    tagline: '精酿手记',
    description: '一个关于精酿啤酒的个人志',
    copyright: '© 2026 YIVI'
  },

  // 登录页面
  login: {
    welcome: '欢迎回来',
    subtitle: '登录以记录你的精酿之旅',
    usernamePlaceholder: '用户名',
    passwordPlaceholder: '密码',
    loginButton: '登录',
    guestButton: '以游客身份继续',
    hint: '初次使用？输入任意用户名密码即可创建账号',
    hintDetail: '数据将保存在本地浏览器中',
    errorRequired: '请输入用户名和密码',
    errorPassword: '密码错误'
  },

  // 导航栏
  nav: {
    diary: '酒神日记',
    guide: '酒神教义',
    hall: '酒神宣言',
    logout: '退出',
    guestBadge: '游客模式',
    logoutConfirm: '确定要退出登录吗？'
  },

  // 酒神日记页面（原品鉴日记）
  diary: {
    title: '酒神日记',
    subtitle: '记录每一次与精酿的相遇，那些值得铭记的味觉瞬间。',
    addButton: '记录新的一杯',
    cancelButton: '取消',
    recordCount: '条记录',
    guestNotice: '游客模式 - 仅可查看',

    // 表单
    formTitle: '新的品鉴记录',
    formBeerName: '啤酒名称',
    formBeerNamePlaceholder: '例如：浑浊IPA、帝国世涛...',
    formBrewery: '酒厂',
    formBreweryPlaceholder: '品牌或酒厂名称',
    formStyle: '风格',
    formStylePlaceholder: '选择风格...',
    formAbv: '酒精度 %',
    formAbvPlaceholder: '5.0',
    formRating: '评分',
    formNotes: '品鉴笔记',
    formNotesPlaceholder: '记录你的感受：香气、口感、余味、整体印象...',
    submitButton: '保存到日记',
    deleteButton: '删除',

    // 提示信息
    emptyText: '日记本还是空白的',
    emptyHint: '点击上方按钮，开始记录你的第一次品鉴',
    errorRequired: '请至少填写啤酒名称',
    errorGuest: '游客模式无法添加记录，请登录后使用',
    deleteConfirm: '确定要删除这条记录吗？',
    deleteGuestError: '游客模式无法删除记录，请登录后使用',

    // 风格选项
    styles: {
      ipa: 'IPA (印度淡色艾尔)',
      stout: 'Stout (世涛)',
      wheat: 'Wheat (小麦啤酒)',
      lager: 'Lager (拉格)',
      sour: 'Sour (酸啤)',
      porter: 'Porter (波特)',
      paleAle: 'Pale Ale (淡色艾尔)',
      belgian: 'Belgian (比利时风格)',
      amber: 'Amber (琥珀艾尔)',
      pilsner: 'Pilsner (皮尔森)'
    }
  },

  // 酒神教义页面
  guide: {
    title: '酒神教义',
    subtitle: '探索精酿啤酒的酒神精神',

    // 精酿 vs 工业
    comparisonTitle: '精酿 vs 工业啤酒',
    craftTitle: '精酿啤酒',
    craftFeatures: [
      '小规模酿造',
      '使用优质原料',
      '风味丰富多样',
      '强调创新和个性'
    ],
    industrialTitle: '工业啤酒',
    industrialFeatures: [
      '大规模生产',
      '成本控制为主',
      '口味标准化',
      '追求清爽易饮'
    ],

    // 四大原料
    ingredientsTitle: '四大原料',
    malt: {
      name: '麦芽',
      desc: '提供糖分和颜色，决定啤酒的基础风味'
    },
    hop: {
      name: '啤酒花',
      desc: '带来苦味和香气，是精酿的灵魂'
    },
    yeast: {
      name: '酵母',
      desc: '将糖转化为酒精，产生独特风味'
    },
    water: {
      name: '水',
      desc: '占啤酒90%以上，影响口感和质量'
    },

    // 常见风格
    stylesTitle: '常见风格速记',
    ipaTitle: 'IPA（印度淡色艾尔）',
    ipaTags: ['苦味明显', '花香浓郁', '酒精度中高'],
    ipaDesc: '最受欢迎的精酿风格，啤酒花香气突出，口感清爽',

    stoutTitle: '世涛（Stout）',
    stoutTags: ['深色浓郁', '咖啡味', '口感厚重'],
    stoutDesc: '黑色啤酒，带有咖啡、巧克力、焦糖等风味',

    wheatTitle: '小麦啤酒（Wheat）',
    wheatTags: ['果香明显', '口感柔滑', '适合入门'],
    wheatDesc: '使用小麦酿造，带有香蕉、丁香等香气，清爽易饮',

    // 结束语
    finalTitle: '开始你的精酿之旅',
    finalDesc: '建议从小麦啤酒或淡色IPA开始，逐步尝试更多风格。每个人的口味不同，找到自己喜欢的才是最重要的！'
  },

  // 酒神宣言页面（原酣战榜）
  hall: {
    title: '酒神宣言',
    subtitle: '记录那些征服你的精酿',

    // 空状态
    emptyText: '还没有添加最爱的啤酒',
    addFirstButton: '添加第一个',
    guestHint: '游客模式无法添加，请登录后使用',

    // 表单
    formTitle: '添加最爱的啤酒',
    formNamePlaceholder: '啤酒名称',
    formBreweryPlaceholder: '酒厂',
    formStylePlaceholder: '风格',
    formReasonPlaceholder: '为什么喜欢它？',
    submitButton: '添加到荣誉墙',
    cancelButton: '取消',

    // 卡片
    removeButton: '移除',

    // 提示信息
    errorRequired: '请至少填写啤酒名称和喜欢的理由',
    errorGuest: '游客模式无法添加记录，请登录后使用',
    removeConfirm: '确定要从荣誉墙移除这款啤酒吗？',
    removeGuestError: '游客模式无法删除记录，请登录后使用'
  }
}

// 导出文案获取函数
export function getCopy(path) {
  const keys = path.split('.')
  let value = copyConfig
  for (const key of keys) {
    value = value[key]
    if (value === undefined) return path
  }
  return value
}

// 导出文案设置函数
export function setCopy(path, newValue) {
  const keys = path.split('.')
  const lastKey = keys.pop()
  let obj = copyConfig

  for (const key of keys) {
    obj = obj[key]
    if (obj === undefined) return false
  }

  obj[lastKey] = newValue

  // 保存到 localStorage
  localStorage.setItem('yivi_copy_config', JSON.stringify(copyConfig))

  return true
}

// 初始化：从 localStorage 加载自定义文案
export function initCopyConfig() {
  const saved = localStorage.getItem('yivi_copy_config')
  if (saved) {
    try {
      const savedConfig = JSON.parse(saved)
      Object.assign(copyConfig, savedConfig)
    } catch (e) {
      console.error('Failed to load copy config:', e)
    }
  }
}

// 重置为默认文案
export function resetCopyConfig() {
  localStorage.removeItem('yivi_copy_config')
  location.reload()
}

// 导出配置为JSON
export function exportCopyConfig() {
  const dataStr = JSON.stringify(copyConfig, null, 2)
  const dataBlob = new Blob([dataStr], { type: 'application/json' })
  const url = URL.createObjectURL(dataBlob)
  const link = document.createElement('a')
  link.href = url
  link.download = 'yivi-copy-config.json'
  link.click()
  URL.revokeObjectURL(url)
}
