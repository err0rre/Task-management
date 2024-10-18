FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

HEALTHCHECK --interval=30s --timeout=10s --retries=3 CMD curl --fail http://localhost:4000/health || exit 1

EXPOSE $PORT

CMD ["npm", "start"]
