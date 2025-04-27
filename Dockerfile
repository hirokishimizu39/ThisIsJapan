FROM node:20-alpine as base

WORKDIR /app

# 依存関係のインストールのための基本イメージ
FROM base as deps
COPY package.json package-lock.json ./
RUN npm ci

# 開発環境用イメージ
FROM base as development
COPY --from=deps /app/node_modules ./node_modules
COPY . .
EXPOSE 5000
CMD ["npm", "run", "dev"]

# ビルド用イメージ
FROM base as builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# 本番環境用イメージ
FROM base as production
ENV NODE_ENV=production
COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY package.json ./
EXPOSE 5000
CMD ["npm", "run", "start"]