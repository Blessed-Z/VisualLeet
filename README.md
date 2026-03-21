# 🎨 VisualLeet - 算法不再是天书

[![Vercel](https://vercel.com/button)](https://visual-leet.vercel.app)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![GitHub Stars](https://img.shields.io/github/stars/Blessed-Z/VisualLeet.svg)](https://github.com/Blessed-Z/VisualLeet/stargazers)

**VisualLeet** 是一款将 LeetCode 刷题体验带入 2.0 时代的 AI 辅助工具。通过 **可视化动画**、**小朋友视角比喻**、**儿歌顺口溜巧记**，让复杂的算法逻辑变得像看动画片一样简单有趣。

---

## 📸 界面预览

### 🏠 沉浸式主界面
在这里开启你的算法之旅，选择 Hot 100 题目或输入新题。
<p align="center">
  <img src="https://raw.githubusercontent.com/Blessed-Z/VisualLeet/main/web/public/187557909f0df9a74030b52593b8cdef.png" alt="VisualLeet Main Dashboard" width="850px" style="border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.5); border: 1px solid rgba(255,255,255,0.1);" />
</p>

### 🎬 动态算法演示
点击“下一步”，亲眼见证数据结构的流转，配合通俗易懂的“小朋友版”笔记。
<p align="center">
  <img src="https://raw.githubusercontent.com/Blessed-Z/VisualLeet/main/web/public/64f19f012ca68cdc137955ab79d86fa9.png" alt="VisualLeet Problem Visualization" width="850px" style="border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.5); border: 1px solid rgba(255,255,255,0.1);" />
</p>

---

## ✨ 核心卖点

*   🎬 **独家可视化生成**: AI 为每一道题生成专属的动态演示，支持断点式单步调试。
*   🧒 **小朋友模式解析**: 拒绝冷冰冰的技术术语，用“魔法口袋”、“舞伴匹配”等比喻拆解算法。
*   🎵 **押韵巧记口诀**: 每道题都配有朗朗上口的儿歌顺口溜，帮你把套路刻在脑子里。
*   🤖 **团子 (Tuanzi) 伴读**: 原创 AI 看板娘全程陪同，通过丰富的表情提供情绪价值。
*   📱 **全平台适配**: 完美支持手机端，随时随地利用碎片时间温习算法。

---

## 🚀 快速本地部署 (体验完整 AI 功能)

在线展示版受限于 API 额度，仅提供 Hot 100 静态查阅。**强烈建议你本地部署**，以解锁实时代码诊断、一键分析新题目以及团子实时聊天功能。

### 1. 克隆与安装
```bash
git clone https://github.com/Blessed-Z/VisualLeet.git
cd VisualLeet/web
npm install
```

### 2. 配置你的“魔法钥匙”
在 `web` 目录下创建 `.env.local` 文件，参考 `.env.example` 填入你的密钥（支持 Gemini, DeepSeek, OpenAI 等）。

### 3. 开启旅程
```bash
npm run dev
```

---

## 📂 目录架构

```text
.
├── web/                  # Next.js 前端应用核心
│   ├── src/
│   │   ├── app/          # 路由与主页面
│   │   ├── components/   # UI 组件 (看板娘、编辑器、仪表盘等)
│   ├── public/           # 静态资源 (含 Hot 100 离线数据)
├── sop.md                # 标准作业程序 (如何贡献新题解)
└── README.md             # 项目说明文档
```

---

## 🤝 贡献与共建

本项目欢迎任何形式的贡献！如果你想参与开发或补充题解：

1.  **Fork** 本仓库。
2.  **创建特性分支** (`git checkout -b feature/AmazingFeature`)。
3.  **提交更改** (`git commit -m 'Add some AmazingFeature'`)。
4.  **推送分支** (`git push origin feature/AmazingFeature`)。
5.  **开启一个 Pull Request**。

---

## 📈 Star History

<a href="https://star-history.com/#Blessed-Z/VisualLeet&Date">
 <picture>
   <source media="(prefers-color-scheme: dark)" srcset="https://api.star-history.com/svg?repos=Blessed-Z/VisualLeet&type=Date&theme=dark" />
   <source media="(prefers-color-scheme: light)" srcset="https://api.star-history.com/svg?repos=Blessed-Z/VisualLeet&type=Date" />
   <img alt="Star History Chart" src="https://raw.githubusercontent.com/Blessed-Z/VisualLeet/main/web/public/star-history-2026321.png" />
 </picture>
</a>

---

## 📄 License

本项目采用 [MIT License](LICENSE) 开源。

---

*Made with ❤️ by [Blessed-Z](https://github.com/Blessed-Z)*
