# 使用轻量级的 Node.js 镜像
FROM node:18-alpine AS base

# 1. 安装依赖
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
# 这里的路径改为指向 web 子目录
COPY web/package.json web/package-lock.json ./
RUN npm install --frozen-lockfile

# 2. 构建项目
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY web/ .

# 设置构建时的环境变量
ENV TCB_ENV_ID=env-0gj9n1ly0bae52b9
ENV AI_PROVIDER=custom
ENV AI_API_KEY=sk-8347c9eae0534e4399219b78ee9cddbf
ENV AI_BASE_URL=https://dashscope.aliyuncs.com/compatible-mode/v1
ENV AI_MODEL_NAME=qwen-coder-plus

RUN npm run build

# 3. 运行环境
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV PORT 80

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

USER nextjs

EXPOSE 80

# 启动 Next.js
CMD ["npm", "start", "--", "-p", "80"]
