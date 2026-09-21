# 葵興食乜好 (Kwai Hing Eats) 🍽️

> **「今日食咩？」** — 專為葵興打工仔與街坊打造的極速午餐決策與餐廳探索神器。
> A fast restaurant discovery & decision-making tool for people living and working around **Kwai Hing, Hong Kong**.

---

## ✨ 核心特色 (Core Features)

1. 🎲 **一鍵「幫我揀！」(Lucky Draw Decision Maker)**
   - 解決選擇困難症，一鍵輪盤 / 翻牌隨機抽取心水餐廳。
   - 慶祝彩帶特效 (`canvas-confetti`)、特色招牌菜提示與一鍵「就食呢間！」出發導航。

2. ⚡️ **6 大午市情境快選 (Lifestyle Scenarios)**
   - ⚡️ **急急子**：15分鐘快食、出餐秒速、趕開會外賣自取。
   - 🌧️ **落雨唔想淋**：全空調行人天橋直達（KCC 九龍貿易中心 / 新葵興廣場），免開遮無懼風雨。
   - 💰 **平靚正**：人均 $60 以下抵食茶餐廳、雙餸飯、粉麵、車仔麵。
   - ☕️ **慢慢嘆 / 傾偈**：環境舒適、精品咖啡、文青日式定食、放鬆慢活。
   - 👥 **同事聚餐**：大枱、酒樓點心合菜、燒肉放題，Team lunch 必選。
   - 🥗 **健康輕食**：沙律、Poke、低卡少油健康飲食。

3. 📍 **4 大葵興在地分區 (Local Kwai Hing Zones)**
   - **🏢 KCC (九龍貿易中心)**：甲級寫字樓、連鎖名店、空調天橋直達。
   - **🚉 新葵興廣場**：港鐵站 Exit B 直連上蓋、交通交匯處快捷美食。
   - **🏭 KC100 & 大連排工廈區**：隱世工廈 Cafe、高性價比食堂、特色私房料理。
   - **🏘️ 光輝圍 / 葵興邨**：地道老字號、生滾粥、街坊車仔麵、宵夜熱點。

4. 🚶‍♂️ **港鐵步行時間與即時導航**
   - 實時計算距離葵興港鐵站（A/B/E 出口）的步行分鐘數。
   - 一鍵開啟 Google Maps 步行導航。

5. 🗺️ **雙檢視模式 (List / Grid / Map View)**
   - 卡片清單檢視與地圖釘選互動檢視。

6. 🌐 **Google Places API 連線 + 零後端資料庫架構**
   - **嚴格遵守無資料庫 (No Database) 架構限制**。
   - 支援即時載入 Google Places API / Google Maps JavaScript API。
   - 內置 28+ 間葵興真實食肆精選，未輸入 API Key 亦能開箱即用、流暢體驗。

---

## 🛠️ 技術棧 (Tech Stack)

- **前端核心**：React 19 + TypeScript + Vite 8
- **樣式系統**：Tailwind CSS v4
- **圖示庫**：Lucide React
- **互動特效**：canvas-confetti, Web Audio API
- **地圖服務**：Google Maps JavaScript API & Google Places API Client-side Integration

---

## 🚀 快速啟動 (Getting Started)

### 1. 安裝依賴 (Install dependencies)
```bash
npm install
```

### 2. 本地開發 (Run local dev server)
```bash
npm run dev
```
瀏覽器打開 `http://localhost:5173` 即可立即使用！

### 3. 編譯生產環境 (Build for production)
```bash
npm run build
```

---

## 🔑 Google Maps API Key 設定 (選填)

1. 點擊頂部導航欄右上角的 **「API 設定」** (金鑰圖示)。
2. 輸入您的 Google Maps JavaScript API Key（需啟用 `Places API` 與 `Maps JavaScript API`）。
3. 系統即會動態載入葵興即時 Places 資料；金鑰僅存於您的本地瀏覽器 `localStorage` 中，絕不外流。
4. 亦可在 `.env` 中設定：
```env
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
```

---

## 📄 授權 (License)

MIT License. Designed with ❤️ for Kwai Hing workers & residents.
