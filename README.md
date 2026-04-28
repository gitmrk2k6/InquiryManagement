# InquiryManagement — 問い合わせ管理アプリ

問い合わせ受付・対応状況管理を行う Web アプリケーション。
RaiseTech AI エンジニアコース 第3回課題として、TaskManagement とは異なる技術スタックで構築する。

## 技術スタック

| レイヤー | 主要技術 |
| ------- | ------- |
| フロントエンド | Next.js（最新安定版） + TypeScript + Tailwind CSS |
| バックエンド | NestJS（最新安定版） + TypeScript |
| データベース | MySQL 8 |
| インフラ | AWS EC2 + RDS（最小構成） + Terraform |

## ステータス

🚧 足場作成のみ完了。要件定義・実装はこれから。

## ドキュメント

詳細な要件定義・画面設計・DB設計などは、今後 `docs/` ディレクトリに作成予定:

- `docs/requirements.md` — 要件定義
- `docs/functional-requirements.md` — 機能要件
- `docs/screen-design.md` — 画面設計
- `docs/database-design.md` — DB設計
- `docs/tech-stack.md` — 技術スタック詳細
- `docs/infrastructure.md` — インフラ構成

## 開発ルール

開発を進める際は [CLAUDE.md](./CLAUDE.md) の命名規則・GitHub ワークフロー・サーバー起動ルールを参照すること。
