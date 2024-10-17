# 使用官方的 Node.js 作为基础镜像
FROM node:18

# 设置工作目录
WORKDIR /app

# 复制 package.json 并安装依赖
COPY package*.json ./
RUN npm install

# 复制应用代码
COPY . .

# 暴露后端的端口（4000，假设你后端运行在 4000 端口）
EXPOSE 4000

# 启动后端服务
CMD ["npm", "start"]
