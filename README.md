# Archero 2 聯盟寶藏助手

一個用於規劃 Archero 2 聯盟寶藏地圖配置的互動式工具。幫助玩家在 10x12 的網格地圖上安排寶藏物件，並提供視覺化回饋來優化配置。

## 功能特色

- **10x12 網格地圖**：提供標準的遊戲地圖尺寸
- **拖曳放置**：從右側面板拖曳寶藏物件到地圖上
- **物件旋轉**：點擊旋轉按鈕來旋轉已放置的物件
- **物件移除**：點擊垃圾桶按鈕來移除地圖上的物件
- **視覺回饋**：顯示有效/無效的放置位置
- **重置功能**：一鍵清除整個地圖配置

## 技術棧

- **框架**：Next.js 15 (使用 Turbopack)
- **語言**：TypeScript
- **樣式**：Tailwind CSS 4
- **UI 組件**：Radix UI
- **圖標**：Lucide React
- **主題**：支援深色/淺色模式 (next-themes)

## 開始使用

### 環境需求

- Node.js 20 或更高版本
- npm 或 yarn 套件管理器

### 安裝

```bash
npm install
```

### 開發模式

```bash
npm run dev
```

在瀏覽器中開啟 [http://localhost:3000/archero2-treasure-companion](http://localhost:3000/archero2-treasure-companion)

### 建置生產版本

```bash
npm run build
```

### 啟動生產伺服器

```bash
npm start
```

### 程式碼檢查

```bash
npm run lint
```

## 使用說明

1. **放置寶藏物件**：從右側面板拖曳寶藏物件到 10x12 網格地圖上
2. **旋轉物件**：點擊已放置物件上的旋轉按鈕來改變方向
3. **移除物件**：點擊已放置物件上的垃圾桶按鈕來移除該物件
4. **重置地圖**：使用「重置全部」按鈕來清除整個地圖配置

## 專案結構

```
treasure-companion/
├── app/                    # Next.js App Router
│   ├── _utils/            # 工具函數
│   ├── globals.css        # 全域樣式
│   ├── layout.tsx         # 根布局
│   └── page.tsx           # 主頁面
├── components/            # React 組件
│   ├── ui/                # UI 組件庫
│   └── theme-provider.tsx # 主題提供者
├── lib/                   # 共用函數庫
├── public/                # 靜態資源（寶藏物件圖片）
└── package.json           # 專案配置
```

## 授權

本專案為私人專案。

## 版本

目前版本：0.1.0
