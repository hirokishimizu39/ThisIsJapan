# ThisIsJapan

日本の文化的価値と精神性を共有するプラットフォーム。写真や言葉を通じて日本の美しさや考え方を伝えることを目的としています。

## 技術スタック

- **フロントエンド**: React + TypeScript (Vite)
- **バックエンド**: Express.js
- **データベース**: PostgreSQL
- **ORM**: Drizzle ORM
- **スタイリング**: TailwindCSS + shadcn/ui
- **コンテナ化**: Docker

## 特徴

- 日本の風景や文化的な写真の共有
- 日本語の美しい言葉や概念の紹介
- 文化体験の紹介
- いいね機能による人気コンテンツのランキング表示

## 開発環境のセットアップ

### 通常の開発環境

```bash
# 依存関係のインストール
npm install

# 開発サーバーの起動
npm run dev
```

### Docker開発環境

Docker を使用した開発環境のセットアップについては、[DOCKER.md](DOCKER.md) を参照してください。

## データベース

このプロジェクトはPostgreSQLデータベースを使用しています。データベーススキーマの更新は以下のコマンドで行います：

```bash
npm run db:push
```

## 本番環境へのデプロイ

本番環境へのデプロイは、Docker Composeを使用して行うことができます。詳細は [DOCKER.md](DOCKER.md) を参照してください。

## ライセンス

[MIT](LICENSE)
