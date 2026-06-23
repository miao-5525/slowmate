FROM node:20-alpine

WORKDIR /app

# 只需复制构建产物和服务端代码
COPY package.json package-lock.json ./
RUN npm ci --production

COPY server.js ./
COPY docs/ ./docs/

ENV PORT=3000
ENV DEEPSEEK_API_KEY=""

EXPOSE 3000

CMD ["node", "server.js"]
