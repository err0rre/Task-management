# 使用官方的 Node.js 作为基础镜像
FROM node:18

# 设置工作目录
WORKDIR /app

# 复制 package.json 并安装依赖
COPY package*.json ./
RUN npm install

# 复制前端代码并构建
COPY . .
RUN npm run build

# 使用 serve 作为静态文件服务器
RUN npm install -g serve
CMD ["serve", "-s", "build"]

# 暴露前端的端口（3000，假设前端运行在 3000 端口）
EXPOSE 3000
