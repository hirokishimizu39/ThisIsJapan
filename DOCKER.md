# Dockerによる開発環境・本番環境の構築

このプロジェクトはDockerを使用して開発および本番環境を構築することができます。以下の手順に従って環境をセットアップしてください。

## 前提条件

- [Docker](https://www.docker.com/get-started) がインストールされていること
- [Docker Compose](https://docs.docker.com/compose/install/) がインストールされていること

## 開発環境のセットアップ

### 1. 開発環境を起動する

```bash
docker-compose up
```

バックグラウンドで実行する場合:

```bash
docker-compose up -d
```

### 2. アプリケーションにアクセスする

開発サーバーが起動したら、ブラウザで以下のURLにアクセスしてください:

```
http://localhost:5000
```

### 3. データベースにアクセスする

PostgreSQLデータベースには以下の接続情報でアクセスできます:

- ホスト: `localhost`
- ポート: `5432`
- ユーザー名: `postgres`
- パスワード: `password`
- データベース名: `thisIsJapan`

### 4. 開発環境を停止する

```bash
docker-compose down
```

データボリュームを削除する場合:

```bash
docker-compose down -v
```

## 本番環境のセットアップ

### 1. 環境変数ファイルを作成する

`.env`ファイルをプロジェクトルートに作成し、以下の環境変数を設定してください:

```
DB_PASSWORD=your_secure_password
```

### 2. 本番環境を起動する

```bash
docker-compose -f docker-compose.prod.yml up -d
```

### 3. アプリケーションにアクセスする

本番サーバーが起動したら、ブラウザで以下のURLにアクセスしてください:

```
http://localhost (ポート80)
```

### 4. 本番環境を停止する

```bash
docker-compose -f docker-compose.prod.yml down
```

## Docker構成ファイルについて

- `Dockerfile`: マルチステージビルドを実装したDockerfile。開発環境と本番環境の両方に対応しています。
- `docker-compose.yml`: 開発環境用の構成ファイル。
- `docker-compose.prod.yml`: 本番環境用の構成ファイル。
- `docker/initdb/init.sql`: PostgreSQLデータベースの初期化スクリプト。

## データベースマイグレーション

新しいスキーマを適用するには、アプリケーションコンテナ内で以下のコマンドを実行します:

```bash
# 開発環境の場合
docker-compose exec app npm run db:push

# 本番環境の場合
docker-compose -f docker-compose.prod.yml exec app npm run db:push
```