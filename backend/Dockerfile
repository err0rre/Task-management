# 使用官方的 Node.js 作为基础镜像
FROM node:18

# 设置工作目录
WORKDIR /app

# 复制 package.json 并安装依赖
COPY package*.json ./
RUN npm install

# 复制应用代码
COPY . .

HEALTHCHECK --interval=30s --timeout=10s --retries=3 CMD curl --fail http://localhost:4000/health || exit 1


# 暴露后端的端口（4000，假设你后端运行在 4000 端口）
EXPOSE $PORT


# 启动后端服务
CMD ["npm", "start"]
