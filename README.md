# 教練管理系統 (Fitness CRM)

基於 Astro + React + Tailwind CSS 開發的單頁應用程式，專為教練量身打造的課程、學員、帳務與簽到管理系統。

## GitHub Pages 自動部署指南

本專案已經設定好 GitHub Actions Workflow (`.github/workflows/deploy.yml`)，只要將程式碼推送到 `main` 分支，系統便會自動將專案建置並發布至 GitHub Pages 上。

### 部署操作流程

為了確保系統能夠順利運作並正確吃到你的環境變數，請在第一次部署前，到 GitHub 上進行以下設定：

#### 1. 設定環境變數 (GitHub Secrets) 🔑
本專案會使用到環境變數（請參考專案根目錄下的 `.env.example` 檔案）。為了讓 GitHub Actions 在雲端順利打包出帶有正確設定的檔案，我們需要把它們存進 GitHub 倉庫的密鑰中：
1. 前往你的 GitHub 專案首頁。
2. 點擊上方的 **Settings** 標籤。
3. 在左側選單中展開 **Secrets and variables**，點擊 **Actions**。
4. 點擊綠色按鈕 **New repository secret**。
5. 以 `.env.example` 為例，將變數名稱 `PUBLIC_API_URL` 填入 Name，並把實際要使用的網址填進 Secret 欄位，最後按下 Add secret。若有其他變數請重複此步驟。

#### 2. 啟用 GitHub Pages (設定來源) 🌐
1. 前往專案的 **Settings**。
2. 在左側選單點選 **Pages**。
3. 在 **Build and deployment** 區塊，將 **Source** 選項從 *Deploy from a branch* 改為 **GitHub Actions**。

#### 3. 推送程式碼並觸發自動部署 🚀
當你完成上述設定後：
1. 確保目前開發的代碼與 `.github/workflows/deploy.yml` 都已經合併推上遠端的 `main` 分支。
2. 系統就會自動觸發部署作業！
3. 切換到專案上方的 **Actions** 標籤，你可以隨時點進去查看執行的進度。
4. 部署一旦成功，GitHub Actions 介面中會直接顯示你的公開網址，點進去就能開始在手機與網頁端使用你的最新服務了！
