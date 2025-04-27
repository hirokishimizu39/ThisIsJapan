-- 初期化スクリプト

-- ユーザーロールの確認と作成
DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'postgres') THEN
    CREATE ROLE postgres WITH LOGIN PASSWORD 'password';
  END IF;
END
$$;

-- データベースが存在しない場合は作成
CREATE DATABASE "thisIsJapan" WITH OWNER postgres;

-- 既存のデータベースに接続
\c "thisIsJapan"

-- スキーマは自動的に作成されるため、
-- ここでは追加の初期データや追加設定など必要な場合に記述できます