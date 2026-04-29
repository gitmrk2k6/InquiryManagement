# InquiryManagement — 問い合わせ管理アプリ

問い合わせ受付・対応状況管理を行う Web アプリケーション。
RaiseTech AI エンジニアコース 第3回課題として、TaskManagement とは異なる技術スタックで構築する。

## 技術スタック

| レイヤー | 技術 | バージョン |
| ------- | --- | --------- |
| フロントエンド | Next.js + TypeScript + Tailwind CSS | 16.2.4 |
| バックエンド | NestJS + TypeScript | 11.x |
| データベース | MySQL | 8.4 |
| インフラ | AWS EC2 + RDS + Terraform | — |

## ローカル開発環境のセットアップ

### 前提条件

- Node.js 24.x
- Docker / Docker Compose
- npm

### 手順

```bash
# 1. リポジトリをクローン
git clone <repo-url>
cd InquiryManagement

# 2. 環境変数を設定
cp .env.example .env
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local

# 3. MySQL を起動
docker compose up -d

# 4. バックエンドを起動（port 3001）
cd backend
npm install
npm run start:dev

# 5. フロントエンドを起動（port 3000）
cd ../frontend
npm install
npm run dev
```

### アクセス先

| 画面 | URL |
| --- | --- |
| フロントエンド | <http://localhost:3000> |
| バックエンド API | <http://localhost:3001> |
| MySQL | localhost:3306 |

## ドキュメント

- [docs/requirements.md](docs/requirements.md) — 要件定義
- [docs/functional-requirements.md](docs/functional-requirements.md) — 機能要件
- [docs/screen-design.md](docs/screen-design.md) — 画面設計
- [docs/database-design.md](docs/database-design.md) — DB設計
- [docs/tech-stack.md](docs/tech-stack.md) — 技術スタック詳細
- [docs/infrastructure.md](docs/infrastructure.md) — インフラ構成

## 開発ルール

開発を進める際は [CLAUDE.md](./CLAUDE.md) の命名規則・GitHub ワークフロー・サーバー起動ルールを参照すること。
