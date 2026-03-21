# 使用 Node.js 20 轻量版
FROM node:20-alpine AS base

# 1. 安装构建依赖
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
# 显式指向 web 目录下的依赖文件
COPY web/package.json web/package-lock.json ./
RUN npm install --frozen-lockfile

# 2. 构建项目
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
# 先拷贝 web 核心代码
COPY web/ .
# 关键：拷贝根目录下的 data，并放在容器内的正确物理位置，替代软链接
COPY data/hot100 ./public/data

# 构建时不需要 API Key，只需基础环境
ENV NEXT_TELEMETRY_DISABLED 1
RUN npm run build

# 3. 生产运行环境
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1
ENV PORT 80
ENV HOSTNAME "0.0.0.0"

# 拷贝 Next.js standalone 构建产物
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

EXPOSE 80

# 运行 Next.js 优化的 server.js
CMD ["node", "server.js"]
