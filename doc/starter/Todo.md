# 專案重構計畫 (Astro + React)

本文件列出了將現有的 React 單檔應用程式（`doc/starter/Code.md`）重構並遷移至 **Astro + React** 框架的完整代辦事項（Todo List）。由於這是一個具備高度互動性的單頁應用程式（SPA），我們會利用 Astro 的群島架構（Islands Architecture）與 NanoStores（或 Context）來進行狀態管理。

## 📍 1. 專案初始化與環境設置 (Phase 1)
- [ ] **建立 Astro 專案庫**
  - 使用 `npm create astro@latest` 初始化專案 (選擇 "Empty" 或 "Basic" 模板)。
- [ ] **安裝與設定 React 整合**
  - 執行 `npx astro add react`。
- [ ] **安裝與設定 Tailwind CSS**
  - 執行 `npx astro add tailwind` 來處理原有的 Tailwind 樣式。
- [ ] **安裝依賴套件**
  - 圖示庫：`npm install lucide-react`
  - 狀態管理（跨組件狀態分享推薦）：`npm install nanostores @nanostores/react`

## 📂 2. 架構與目錄結構規劃 (Phase 2)
- [ ] **建立基礎目錄結構**
  - `src/components/`：存放所有的 React 組件。
  - `src/layouts/`：存放 Astro 頁面佈局。
  - `src/pages/`：存放 Astro 路徑頁面。
  - `src/store/`：存放 NanoStores 狀態管理邏輯。
  - `src/utils/`：存放共用的輔助函式與商業邏輯。
  - `src/data/`：存放初始的模擬數據（Mock Data）。

## 🗄️ 3. 狀態管理與資料抽離 (Phase 3)
原有的狀態全部寫在 `App` 內，這在 Astro 中若分成多個 Island 會失去狀態同步，因此建議將共用狀態抽離：
- [ ] **抽離初始資料**
  - 建立 `src/data/mockStudents.js` 存放 `INITIAL_STUDENTS`。
- [ ] **建立全域狀態 Store (NanoStores)**
  - 建立 `src/store/studentsStore.js` (管理所有學員資料與增刪改查邏輯)。
  - 建立 `src/store/uiStore.js` (管理當前啟用的 Tab、選擇的學員、Modal 開關狀態)。
- [ ] **將原有的事件邏輯移植至 Store 或 Utils**
  - `handleAddStudent` (新增學員)
  - `handleRenewCourse` (續約課程)
  - `handleCheckIn` (簽到扣課)
  - `handleConfirmPayment` (確認入帳)

## 🧩 4. React 組件拆分 (Phase 4)
將龐大的 `App.jsx` 依照功能切分為獨立的 React 組件：
- [ ] **導覽列組件**
  - `TopNav.jsx` (頂部標題)
  - `BottomNav.jsx` (底部 Tab 切換)
- [ ] **頁面視圖組件**
  - `DashboardView.jsx` (數據總覽與日期篩選邏輯)
  - `StudentsView.jsx` (學員列表與搜尋功能)
  - `BillingView.jsx` (帳務中心與待繳費清單)
  - `StudentDetailsView.jsx` (學員歷史明細與續約按鈕)
- [ ] **彈窗組件 (Modals)**
  - `AddStudentModal.jsx` (新增學員表單)
  - `CheckInModal.jsx` (確認簽到)
  - `PaymentModal.jsx` (確認到帳紀錄)
  - `RenewModal.jsx` (續約課程表單)
- [ ] **主應用容器組件**
  - `AppContainer.jsx` (用來根據狀態切換 `Dashboard`, `Students`, `Billing`, `Details`，並掛載所有 Modals)

## 🚀 5. Astro 頁面與佈局設定 (Phase 5)
- [ ] **建立全域版型 (`src/layouts/Layout.astro`)**
  - 設定 HTML 結構、`<head>` 資訊（Title, Meta）。
  - 設定全域字體與背景顏色 (如：深色模式 `bg-black text-zinc-300`)。
- [ ] **重構首頁 (`src/pages/index.astro`)**
  - 引入並使用 `Layout.astro`。
  - 掛載 React 主應用容器 `<AppContainer client:only="react" />` 或是用 `client:load`。
  - *備註：因為這是高度互動的 SPA，直接使用 `client:only="react"` 可以避免 SSR 造成的 state hydration 問題，並保持開發速度。*

## 🎨 6. 樣式與細節優化 (Phase 6)
- [ ] **全域 CSS 設定**
  - 建立 `src/styles/global.css` 並引入 Tailwind 指令。
  - 確保動畫效果（如原有的 `animate-in fade-in` 類別）正常運作，必要時補充 `tailwindcss-animate` 插件。
  - 確保底部導航列在手機版上的安全距離（Safe Area）與排版不會跑位。
- [ ] **RWD 與測試**
  - 確保以 `max-w-md mx-auto` 的行動端佈局在各大螢幕尺寸上的顯示正確。

## 📅 執行順序建議
1. 先執行 **Phase 1** 與 **Phase 2** 把空殼建好。
2. 創建 **Phase 3** 的資料與 Store，確定你的應用在沒有 UI 也能更新數據。
3. 進行 **Phase 4** 組件拆分，將視覺與按鈕綁定到對應的狀態上。
4. 進行 **Phase 5** 與 **Phase 6**，讓專案跑起來並優化視覺細節。
