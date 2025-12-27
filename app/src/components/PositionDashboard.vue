<template>
    <div class="dashboard-container">
      <div class="header">
        <h2 class="title"><span class="rect"></span> 投资分析仪表盘</h2>
        <p class="subtitle" v-if="latestData">
          每日自动更新 | 技术指标分析 | 数据日期: {{ latestData.date }}
        </p>
      </div>
  
      <div class="card-grid" v-if="latestData">
        <div 
          v-for="(data, symbol) in latestData.positions" 
          :key="symbol" 
          class="analysis-card"
          :class="{ 'highlight-border': symbol === 'cf2605' }"
        >
          <div class="tag" :class="getSymbolTag(symbol).type">
            {{ getSymbolTag(symbol).label }}
          </div>
  
          <div class="card-header">
            <div class="symbol-icon">
              <span v-if="symbol.startsWith('cf')">🚜</span>
              <span v-else-if="symbol.startsWith('sr')">🍬</span>
            </div>
            <h3 class="symbol-name">{{ symbol.toUpperCase() }} 持仓分析</h3>
          </div>
  
          <div class="stat-content">
            <div class="stat-row">
              <span>前20多头总持仓</span>
              <span class="value long">{{ formatNum(getTotal(data.longPosition, 'buy')) }}</span>
            </div>
            <div class="stat-row">
              <span>前20空头总持仓</span>
              <span class="value short">{{ formatNum(getTotal(data.shortPosition, 'ss')) }}</span>
            </div>
            
            <div class="ratio-bar">
              <div class="long-fill" :style="{ width: getRatio(data) + '%' }"></div>
            </div>
            
            <div class="trend-box">
              <div class="trend-item">
                <span class="label">20日多头净变</span>
                <span :class="getChangeClass(getTotal(data.longPosition, 'buy_chge'))">
                  {{ getTotal(data.longPosition, 'buy_chge') > 0 ? '↑' : '↓' }}
                  {{ formatNum(Math.abs(getTotal(data.longPosition, 'buy_chge'))) }}
                </span>
              </div>
            </div>
          </div>
  
          <p class="description">
            {{ getDescription(symbol, data) }}
          </p>
        </div>
  
        <div class="analysis-card">
          <div class="tag recommend">推荐</div>
          <div class="card-header">
            <div class="symbol-icon">🌐</div>
            <h3 class="symbol-name">更多维度分析</h3>
          </div>
          <p class="description" style="margin-top: 20px;">
            包含技术指标评分、席位集中度监控、资金流向等深度数据。
          </p>
        </div>
      </div>
      
      <div v-else class="loading">加载中...</div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue';
  
  const rawArrayData = ref([]);
  
  // 模拟接口获取数组数据
  const fetchData = async () => {
    try {
      // 假设你的 variety.json 返回的是 [ {date: '...', positions: {...}}, ... ]
      const response = await fetch(process.env.BASE_URL + 'data/variety.json');
      const data = await response.json();
      rawArrayData.value = Array.isArray(data) ? data : [data];
    } catch (error) {
      console.error('Fetch Error:', error);
    }
  };
  
  // 获取数组中最后一条（最新）数据
  const latestData = computed(() => {
    if (rawArrayData.value.length === 0) return null;
    return rawArrayData.value[rawArrayData.value.length - 1];
  });
  
  // 计算总持仓或总变动
  const getTotal = (list, key) => {
    if (!list) return 0;
    return list.reduce((acc, curr) => acc + (Number(curr[key]) || 0), 0);
  };
  
  // 计算多空占比
  const getRatio = (data) => {
    const long = getTotal(data.longPosition, 'buy');
    const short = getTotal(data.shortPosition, 'ss');
    if (long + short === 0) return 50;
    return ((long / (long + short)) * 100).toFixed(1);
  };
  
  const getSymbolTag = (s) => {
    return s.startsWith('cf') ? { label: 'HOT', type: 'hot' } : { label: 'NEW', type: 'new' };
  };
  
  const getChangeClass = (val) => val >= 0 ? 'up-text' : 'down-text';
  
  const formatNum = (num) => new Intl.NumberFormat().format(num);
  
  const getDescription = (symbol, data) => {
    const ratio = getRatio(data);
    if (symbol.startsWith('cf')) {
      return `棉花：多头占比${ratio}%。今日主力席位动作明显，建议关注近期多空博弈区间。`;
    }
    return `白糖：多头占比${ratio}%。前20名空头力量较集中，乾坤期货等席位维持重仓。`;
  };
  
  fetchData();
  </script>
  
  <style scoped>
  /* 核心布局参考图片暗色调 */
  .dashboard-container {
    background-color: #0d1117;
    min-height: 100vh;
    padding: 60px 20px;
    color: #e6edf3;
  }
  
  .header {
    text-align: center;
    margin-bottom: 60px;
  }
  
  .title {
    font-size: 32px;
    letter-spacing: 2px;
    color: #ffffff;
  }
  
  .rect {
    display: inline-block;
    width: 12px;
    height: 24px;
    background-color: #00d4ff;
    margin-right: 12px;
    vertical-align: middle;
  }
  
  .subtitle {
    color: #8b949e;
    margin-top: 15px;
    font-size: 14px;
  }
  
  .card-grid {
    display: flex;
    justify-content: center;
    gap: 25px;
    flex-wrap: wrap;
  }
  
  .analysis-card {
    background-color: #161b22;
    width: 300px;
    min-height: 380px;
    padding: 40px 25px;
    border-radius: 20px;
    position: relative;
    border: 1.5px solid #30363d;
    transition: transform 0.3s;
  }
  
  .analysis-card:hover {
    transform: translateY(-5px);
  }
  
  /* 图片中高亮选中的黄色边框效果 */
  .highlight-border {
    border: 2px solid #f0b90b;
    box-shadow: 0 0 20px rgba(240, 185, 11, 0.1);
  }
  
  .tag {
    position: absolute;
    top: 20px;
    right: 20px;
    padding: 2px 12px;
    border-radius: 10px;
    font-size: 11px;
    font-weight: 800;
  }
  
  .hot { background: linear-gradient(135deg, #ff9d00, #ff4d00); color: white; }
  .new { border: 1px solid #00c087; color: #00c087; }
  .recommend { border: 1px solid #00c087; color: #00c087; }
  
  .symbol-icon {
    font-size: 45px;
    margin-bottom: 20px;
  }
  
  .symbol-name {
    font-size: 22px;
    margin: 0 0 25px 0;
    color: #f0f6fc;
  }
  
  .stat-row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 12px;
    font-size: 14px;
    color: #8b949e;
  }
  
  .value { font-family: 'Courier New', Courier, monospace; font-weight: bold; }
  .long { color: #23d18b; }
  .short { color: #f85149; }
  
  /* 多空对比条 */
  .ratio-bar {
    height: 8px;
    background-color: #f85149; /* 空头底色 */
    border-radius: 4px;
    margin: 20px 0;
    overflow: hidden;
  }
  
  .long-fill {
    height: 100%;
    background-color: #23d18b; /* 多头颜色 */
    transition: width 0.5s ease-in-out;
  }
  
  .trend-box {
    margin-top: 15px;
    padding-top: 15px;
    border-top: 1px solid #30363d;
  }
  
  .trend-item {
    display: flex;
    justify-content: space-between;
    font-size: 13px;
  }
  
  .up-text { color: #23d18b; }
  .down-text { color: #f85149; }
  
  .description {
    margin-top: 25px;
    font-size: 14px;
    color: #8b949e;
    line-height: 1.6;
  }
  </style>