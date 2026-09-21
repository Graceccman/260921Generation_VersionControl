# 產品企劃書 (Product Brief)
# 「葵興食乜好 / Kwai Hing Eats」

---

## 1. 產品概述 (Executive Summary)

- **產品名稱**：葵興食乜好 (Kwai Hing Eats)
- **核心定位**：專為葵興工作、生活街坊打造的**「極速午餐決策與餐廳探索神器」**。
- **核心問句**：
  > **「今日食咩？」**
- **產品形態**：輕量級響應式 Web 應用程式 (Mobile-first Responsive Web App)
- **一句話願景**：告別選擇困難症，讓葵興打工仔在 30 秒內決定今日食乜好！

---

## 2. 問題陳述與市場痛點 (Problem Statement & Pain Points)

### 2.1 地理與生活場景痛點
葵興作為香港典型的新興商業與傳統工業交匯區（KCC、KC100、大連排道工廈、新葵興廣場、光輝圍）：
1. **午市時間緊迫**：上班族午膳時間通常僅有 45 至 60 分鐘，餐廳排隊時間長，決策時間被嚴重壓縮。
2. **選擇困難症 (Decision Fatigue)**：每日 12:30 同事之間重複提問「今日食咩」，缺乏快速收窄範圍的工具。
3. **天氣影響極大**：下雨天或酷熱天氣下，上班族極度依賴「冷氣天橋直達（免淋雨免開遮）」的特定路線。
4. **資訊過載而非精準決策**：現有平台（如 OpenRice、Google Maps）功能偏向綜合搜尋或食評打分，充斥廣告與非即時資訊，無法針對「葵興在地情境」給出直覺建議。

### 2.2 我們的價值主張 (Value Proposition)
我們**不是另一個 OpenRice**，亦不打算複製 Google Maps：
- **決策優先 (Decision-First)**：透過隨機輪盤「幫我揀！」與 6 大心情/情境快選，將決策時間從 10 分鐘縮短至 30 秒。
- **在地維度 (Hyper-Local Context)**：標注葵興港鐵站出口（A/B/E）、步行時間、全天橋覆蓋避雨路線。
- **零門檻、零負擔**：無須註冊登入、無廣告騷擾、介面簡潔極速。

---

## 3. 目標受眾與使用者畫像 (Target Audience & Personas)

| 用戶畫像 | 身份特徵 | 核心痛點與需求 | 推薦功能 |
| :--- | :--- | :--- | :--- |
| **Persona A：趕時間白領** | KCC / 九龍貿易中心科技與金融外移員工 | 午餐只有45分鐘，趕住返去開會，追求出餐快或外賣 | ⚡️ **急急子** 快選、港鐵步行分鐘數 |
| **Persona B：避雨上班族** | 葵興站周邊辦公室員工 | 雨季或酷暑不想走到露天街道，希望全程室內走天橋 | 🌧️ **落雨唔想淋**（天橋直達過濾） |
| **Persona C：平民性價比追求者** | 工廈打工仔、葵興邨街坊 | 糧尾預算有限，尋求 $50-$60 抵食茶記、粉麵、雙餸飯 | 💰 **平靚正** 篩選、價格分級標籤 |
| **Persona D：慢活文青 / 業務洽談** | 自由工作者、業務代表 | 需要安靜環境、良好採光與精品咖啡，方便傾偈交流 | ☕️ **慢慢嘆 / 傾偈**、工廈特色 Cafe |
| **Persona E：Team Lunch 搞手** | 部門行政、帶新人聚餐的主管 | 4-8人聚餐，需要大枱、酒樓點心或合菜 | 👥 **同事聚餐** 標籤 |

---

## 4. 產品原則與非目標 (Product Principles & Non-Goals)

### 4.1 核心設計原則 (Design Principles)
1. **極速決策 (Speed to Decision)**：任何流程不超過 3 次點擊即可抵達推薦結果。
2. **直覺易懂 (Human-Centered & Local)**：使用地道廣東話情境標籤（如「急急子」、「平靚正」、「落雨唔想淋」）。
3. **輕量極簡 (Zero Bloat)**：拒絕過度工程，不依賴複雜資料庫，保持極速載入。

### 4.2 非目標 (Non-Goals)
- ❌ **不做外賣平台**：不提供在線下單與外送騎手派送功能。
- ❌ **不做長篇食評社群**：不鼓勵用戶撰寫千字食評，聚焦於星級、評分人數與推薦菜式。
- ❌ **不做全港綜合美食目錄**：範圍嚴格鎖定葵興生活圈（半徑約 800m - 1000m）。

---

## 5. 核心功能規格 (Key Features Specification)

### 5.1 幸運決策引擎 (「幫我揀！」Lucky Draw Decision Hub)
- **互動輪盤 / 抽卡動畫**：隨機在目前篩選的候選名單中抽出一間餐廳。
- **慶祝視覺反饋**：抽中時觸發 `canvas-confetti` 彩帶特效與音效提示。
- **雙重行動呼籲 (CTA)**：
  - **「就食呢間！」**：一鍵直開 Google Maps 步行導航。
  - **「唔啱食，再抽一次 🔄」**：重新隨機抽取下一間。

### 5.2 6 大午市情境快選 (Lifestyle Scenario Bar)
- ⚡️ **急急子**：15分鐘搞掂、快餐、出餐快、外賣專線。
- 🌧️ **落雨唔想淋**：港鐵出口天橋直達（KCC / 新葵興廣場），免開遮。
- 💰 **平靚正**：人均 $60 以下平民茶記、水餃粉麵、車仔麵。
- ☕️ **慢慢嘆 / 傾偈**：環境舒適、精品咖啡、文青日式定食。
- 👥 **同事聚餐**：大枱合菜、酒樓飲茶點心、燒肉放題。
- 🥗 **健康輕食**：沙律、Poke Bowl、少油低卡。

### 5.3 4 大在地生活分區 (Kwai Hing Sub-Zones)
- **全部區域 (All)**：全區精選。
- **🏢 KCC (九龍貿易中心)**：甲級商廈、多國連鎖、冷氣天橋直通。
- **🚉 新葵興廣場 (Sun Kwai Hing)**：港鐵站出口直連上蓋、交通樞紐。
- **🏭 KC100 & 大連排工廈區**：隱世工廈美食、文青 Cafe、高性價比飯堂。
- **🏘️ 光輝圍 / 葵興邨**：地道街坊老字號、生滾粥、車仔麵、平民宵夜。

### 5.4 雙重視覺檢視模式 (Dual View Modes)
- **卡片/列表模式 (Grid / List View)**：展示餐廳照片、步行分鐘、招牌菜、評分與價格。
- **地圖釘選模式 (Interactive Map View)**：以葵興站為核心的地圖標註，支援點擊查看氣泡卡片。

### 5.5 心水收藏庫 (Favorites Drawer)
- 點擊卡片愛心 ❤️ 即可將心水食肆加入清單。
- 支援「只從我的收藏中隨機抽取」功能。

---

## 6. 技術架構與核心約束 (Technical Architecture & Constraints)

### 6.1 嚴格遵守「無後端資料庫 (No Database)」約束
- **無任何傳統資料庫**：不使用 PostgreSQL, MySQL, MongoDB, Firebase, Supabase 或 SQLite。
- **資料來源雙軌制**：
  1. **Google Places API / Google Maps JS API**：客戶端直連，支援動態搜尋半徑與 Place Details。
  2. **地膽種子精選資料庫 (Curated Seed Engine)**：內建 28+ 間葵興真實食肆高質量資料（座標、實拍相片、招牌菜、營業時間），無 API Key 亦能開箱即用。

### 6.2 系統架構一覽 (System Architecture)
```
[ Browser Client ]
   ├── UI Components (Header, ScenarioBar, ZoneTabs, FilterBar, RestaurantGrid, DecisionMaker)
   ├── Client Services
   │    ├── GooglePlacesService (Maps JS API loader + PlacesService nearbySearch)
   │    └── StorageService (LocalStorage: API Key, Favorites, History)
   └── Data Layer
        └── KwaiHingConfig (Center Lat/Lng, Zones, Scenarios, 28+ Curated Seed Places)
```

### 6.3 技術棧清單 (Tech Stack)
- **框架**：React 19 + TypeScript
- **建置工具**：Vite 8
- **樣式**：Tailwind CSS v4
- **圖示庫**：Lucide React
- **特效**：canvas-confetti, HTML5 Web Audio API

---

## 7. 成功指標與衡量標準 (Key Metrics & Success Criteria)

1. **決策速度 (Time-to-Decision)**：使用者進入網站到決定餐廳（點擊導航或收藏）平均中位數時間 $\le 30$ 秒。
2. **決策引擎使用率 (Randomizer Adoption Rate)**：超過 40% 的訪客主動點擊「幫我揀！」或情境快選。
3. **導航轉換率 (Navigation CTR)**：展示卡片中點擊「即刻去 / 導航」的比率 $\ge 25\%$。
4. **載入效能 (Performance)**：Lighthouse Performance Score $\ge 95$，初次內容繪製 (FCP) $\le 0.8$ 秒。

---

## 8. 未來發展藍圖 (Future Horizons / Roadmap)

- **Phase 1 (當前版本 MVP)**：
  - ✅ 完整決策輪盤、6大情境、4大分區、無資料庫架構、Google Places 連接、離線精選模式。
- **Phase 2 (近期優化)**：
  - 🕒 **下午茶時段模式 (Tea Time Mode)**：下午 2:30 後自動切換為茶記特餐、炸脾西多士、咖啡下午茶推薦。
  - ☔ **即時天氣連動**：連線天文台 API，若葵青區下雨自動預選「落雨唔想淋」天橋模式。
- **Phase 3 (社群擴展)**：
  - 🔗 **同事拼單 / 一鍵分享到 WhatsApp**：一鍵將抽中的餐廳卡片以美觀預覽圖傳送到團隊群組。
