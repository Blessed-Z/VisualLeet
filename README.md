# 🎨 VisualLeet - 算法不再是天书

[![Vercel](https://vercel.com/button)](https://visual-leet.vercel.app)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**VisualLeet** 是一款将 LeetCode 刷题体验带入 2.0 时代的 AI 辅助工具。它不仅仅是一个解题器，更是你的算法“私人教练”。通过 **可视化动画**、**小朋友视角比喻**、**儿歌顺口溜巧记**，让复杂的算法逻辑变得像看动画片一样简单有趣。

---

## ✨ 为什么选择 VisualLeet?

*   **🎬 独家可视化生成**: AI 会为每一道题生成专属的动态演示网页，你可以亲自点击“下一步”，看数据结构如何流转。
*   **🧒 小朋友模式解析**: 厌倦了冷冰冰的技术文档？我们用最通俗的比喻（如“魔法口袋”、“蝴蝶翅膀”、“舞伴匹配”）来解释每一个核心步骤。
*   **🎵 押韵巧记口诀**: 每道题都配有朗朗上口的儿歌口诀，帮你把算法套路刻在脑子里。
*   **🤖 赛芙 (Cypher) 伴读**: 原创 AI 看板娘赛芙全程陪同，通过丰富的表情反馈你的分析状态。
*   **📂 Hot 100 全量收录**: 离线预置了 LeetCode Hot 100 的全套精品解析与动画，无需 API Key 即可查看。

---

## 🚀 快速本地部署 (体验完整 AI 功能)

在线展示版受限于 API 额度，仅提供 Hot 100 静态查阅。**强烈建议你本地部署**，以解锁实时代码诊断、一键分析新题目以及赛芙实时聊天功能。

### 1. 克隆与安装
```bash
git clone https://github.com/Blessed-Z/VisualLeet.git
cd VisualLeet/web
npm install
```

### 2. 配置你的“魔法钥匙”
在 `web` 目录下创建 `.env.local` 文件，填入你常用的 AI 密钥：

```env
# Google Gemini (推荐，目前速度极快且有免费档)
AI_PROVIDER=google
AI_API_KEY=AIzaSy...你的密钥...
AI_MODEL_NAME=gemini-3.1-flash

# 或者使用 DeepSeek (性价比之王)
# AI_PROVIDER=deepseek
# AI_API_KEY=sk-xxxxxxxx
# AI_MODEL_NAME=deepseek-chat
```

### 3. 开启旅程
```bash
npm run dev
```
访问 [http://localhost:3000](http://localhost:3000)，把 LeetCode 链接丢给赛芙吧！

---

## 📂 目录架构

```text
.
├── web/                  # Next.js 前端应用核心
│   ├── src/
│   │   ├── app/          # 路由与主页面
│   │   ├── components/   # UI 组件 (看板娘、编辑器、仪表盘等)
│   │   ├── lib/          # 工具函数
│   │   └── types/        # TypeScript 类型定义
│   ├── public/           # 静态资源
│   │   └── data/         # 同步后的 Hot 100 离线数据
│   └── .env.example      # AI 密钥配置模板
├── sop.md                # 标准作业程序 (如何贡献新题解)
└── README.md             # 项目说明文档
```

---

## 🛠️ 技术栈

*   **Core**: [Next.js 15](https://nextjs.org/) (App Router)
*   **Styling**: Tailwind CSS + Framer Motion (动画核心)
*   **Editor**: Monaco Editor (VS Code 同款体验)
*   **AI**: OpenAI SDK & Google Generative AI
*   **Icons**: Lucide React

---

## 🤝 贡献与共建

本项目致力于构建一个“有温度”的算法百科。
*   如果你有更好的比喻或顺口溜，欢迎提交 PR。
*   如果发现了 Bug，请通过 [Issue](https://github.com/Blessed-Z/VisualLeet/issues) 告知我们。

---

## 📄 License

本项目采用 [MIT License](LICENSE) 开源。

---

*Made with ❤️ by [Blessed-Z](https://github.com/Blessed-Z)*
