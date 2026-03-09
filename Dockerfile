# 使用 Node.js 18
FROM node:18-alpine

# 安装构建依赖
RUN apk add --no-cache libc6-compat
WORKDIR /app

# 1. 先拷贝 package.json
# 注意：这里我们假设构建上下文是项目根目录
COPY web/package.json web/package-lock.json ./

# 2. 安装依赖
RUN npm install

# 3. 拷贝 web 目录下的所有源代码到当前目录 (/app)
COPY web/ .

# 4. 设置环境变量
ENV TCB_ENV_ID=env-0gj9n1ly0bae52b9
ENV AI_PROVIDER=custom
ENV AI_API_KEY=sk-8347c9eae0534e4399219b78ee9cddbf
ENV AI_BASE_URL=https://dashscope.aliyuncs.com/compatible-mode/v1
ENV AI_MODEL_NAME=qwen-coder-plus

# 5. 构建
RUN npm run build

# 6. 运行
ENV NODE_ENV production
ENV PORT 80
EXPOSE 80

CMD ["npm", "start", "--", "-p", "80"]
