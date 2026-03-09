# 使用轻量级的 Node.js 镜像
FROM node:18-alpine AS base

# 1. 安装系统依赖
RUN apk add --no-cache libc6-compat
WORKDIR /app

# 2. 拷贝依赖描述文件并安装 (利用 Docker 缓存)
# 这里的 ./web/ 指的是相对于仓库根目录的路径
COPY web/package.json web/package-lock.json ./
RUN npm install --frozen-lockfile

# 3. 拷贝所有源代码并构建
COPY web/ .

# 设置构建时的环境变量
ENV TCB_ENV_ID=env-0gj9n1ly0bae52b9
ENV AI_PROVIDER=custom
ENV AI_API_KEY=sk-8347c9eae0534e4399219b78ee9cddbf
ENV AI_BASE_URL=https://dashscope.aliyuncs.com/compatible-mode/v1
ENV AI_MODEL_NAME=qwen-coder-plus

RUN npm run build

# 4. 运行阶段
ENV NODE_ENV production
ENV PORT 80
EXPOSE 80

# 启动 Next.js
CMD ["npm", "start", "--", "-p", "80"]
