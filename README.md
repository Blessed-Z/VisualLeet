# 🧠 LeetCode AI Visualizer (刷题神器)

一个基于 AI 的单页应用 (SPA)，支持 **Google Gemini**, **DeepSeek**, **OpenAI**, **Moonshot (Kimi)** 等多种大模型。
旨在通过**可视化**、**智能修正**和**思路巧记**，全方位辅助你的 LeetCode 刷题之旅。

---

## ✨ 核心功能

1.  **🎨 算法可视化**: AI 生成专属 HTML5/Canvas 动画，直观演示算法过程。
2.  **🛠️ 智能代码修正**: 自动纠错并提供修复原因。
3.  **📖 深度逻辑解释**: 生成 Markdown 格式的详细步骤解析。
4.  **💡 思路巧记**: 生成记忆口诀和 Mental Model。
5.  **📚 历史记录与收藏**: 自动保存，随时回顾。

---

## 🚀 快速配置指南

本项目支持所有兼容 OpenAI 接口标准的模型。

### 1. 配置 Google Gemini (默认推荐)
最简单、免费且强大的选择。

```properties
# .env.local
AI_PROVIDER=google
AI_API_KEY=AIzaSy...你的密钥...
AI_MODEL_NAME=gemini-1.5-flash  # 或 gemini-1.5-pro
```

### 2. 配置 DeepSeek (深度求索)
国产之光，推理能力强，性价比极高。

```properties
# .env.local
AI_PROVIDER=deepseek
AI_API_KEY=sk-xxxxxxxxxxxxxxxx
AI_MODEL_NAME=deepseek-chat
# 系统会自动使用 https://api.deepseek.com 作为 Base URL
```

### 3. 配置 OpenAI (GPT-4)
最强模型，但在国内需要特殊网络环境。

```properties
# .env.local
AI_PROVIDER=openai
AI_API_KEY=sk-xxxxxxxxxxxxxxxx
AI_MODEL_NAME=gpt-4-turbo
```

### 4. 配置 Moonshot (Kimi)
支持超长上下文。

```properties
# .env.local
AI_PROVIDER=moonshot
AI_API_KEY=sk-xxxxxxxxxxxxxxxx
AI_MODEL_NAME=moonshot-v1-8k
```

### 5. 自定义厂商 (OneAPI / Ollama 等)
如果你使用 OneAPI 分发或者本地 Ollama。

```properties
# .env.local
AI_PROVIDER=custom
AI_API_KEY=sk-custom-key
AI_BASE_URL=http://localhost:11434/v1  # 你的 API 地址
AI_MODEL_NAME=llama3
```

---

## 🛠️ 安装与运行

```bash
# 1. 克隆项目
git clone https://github.com/your-username/leetcode-html.git

# 2. 安装依赖
cd leetcode-html/web
npm install

# 3. 配置环境 (参考上方指南)
touch .env.local
# 编辑 .env.local 填入配置

# 4. 启动
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000)。

---

## 📂 技术栈

*   **Frontend**: Next.js 14 (App Router), Tailwind CSS, Monaco Editor
*   **AI Integration**: OpenAI SDK (Universal Adapter), Google Generative AI SDK
*   **Storage**: LocalStorage (Privacy first)

License: MIT
