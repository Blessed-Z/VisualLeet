# 使用 Node.js 20
FROM node:20-alpine AS base

# 1. 安装构建依赖
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY web/package.json web/package-lock.json ./
RUN npm install --frozen-lockfile

# 2. 构建项目
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY web/ .

# 构建环境变量
ENV TCB_ENV_ID=env-0gj9n1ly0bae52b9
ENV AI_PROVIDER=custom
ENV AI_API_KEY=sk-8347c9eae0534e4399219b78ee9cddbf
ENV AI_BASE_URL=https://dashscope.aliyuncs.com/compatible-mode/v1
ENV AI_MODEL_NAME=qwen-coder-plus

RUN npm run build

# 3. 运行环境 (使用 standalone 优化版)
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV PORT 80
ENV HOSTNAME "0.0.0.0"

# 拷贝 standalone 构建产物
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

EXPOSE 80

# 运行 server.js 而不是 npm start
CMD ["node", "server.js"]
