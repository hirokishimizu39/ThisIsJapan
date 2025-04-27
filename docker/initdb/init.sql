-- 初期化スクリプト

-- エラーを無視するように設定
\set ON_ERROR_STOP off

-- ユーザーロールの確認と作成
DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'postgres') THEN
    CREATE ROLE postgres WITH LOGIN PASSWORD 'password';
  END IF;
END
$$;

-- データベースが存在しない場合のみ作成
DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_database WHERE datname = 'thisIsJapan') THEN
    PERFORM dblink_exec('', 'CREATE DATABASE "thisIsJapan" WITH OWNER postgres');
  END IF;
EXCEPTION
  WHEN OTHERS THEN
    -- エラーを無視して続行
    NULL;
END
$$;

-- 既存のデータベースに接続
\c "thisIsJapan"

-- スキーマは自動的に作成されるため、
-- ここでは追加の初期データや追加設定など必要な場合に記述できます