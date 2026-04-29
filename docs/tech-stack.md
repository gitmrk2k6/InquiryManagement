# 技術スタック定義書

最終更新: 2026-04-29

---

## バージョン一覧

| レイヤー | 技術 | バージョン |
| --- | --- | --- |
| ランタイム | Node.js | 24.15.0 LTS |
| 言語 | TypeScript | 6.0 |
| フロントエンド | Next.js | 16.2.4 |
| スタイリング | Tailwind CSS | 4.2.4 |
| バックエンド | NestJS | 11.1.19 |
| データベース | MySQL | 8.4 |
| コンテナ | Docker / Docker Compose | 最新安定版 |
| IaC | Terraform | 最新安定版 |
| クラウド | AWS（EC2 + RDS） | — |

> バージョンを変更した場合はこの表をあわせて更新すること。

---

## フロントエンド

### Next.js 16.2.4

**選定理由**

- App Router による直感的なファイルベースルーティング
- Server Components により、管理画面の初期ロードを軽量化できる
- Vercel 製の React フレームワークとして OSS コミュニティが活発
- TypeScript・Tailwind CSS との公式統合が充実している

**主な利用機能**

| 機能 | 用途 |
| --- | --- |
| App Router | ページ・レイアウト・ルートグループの定義 |
| Server Components | 管理画面の一覧・詳細データ取得 |
| Server Actions | フォーム送信処理（問い合わせ送信・ステータス更新） |
| `next/navigation` | ページ遷移・リダイレクト |

### Tailwind CSS 4.2.4

**選定理由**

- ユーティリティファースト設計により、デザインの一貫性を保ちやすい
- JIT コンパイルにより未使用スタイルが本番ビルドに含まれない
- レスポンシブ対応（顧客向けフォームはモバイルからのアクセスを想定）
- Next.js 16 との公式統合（`@tailwindcss/vite` / Webpack プラグイン）が提供されている

### TypeScript 6.0

**選定理由**

- フロントエンド・バックエンド双方で同一言語を使用し、型定義を共有できる
- 6.0 から `strict` がデフォルト有効になり、設定の手間が減った
- NestJS・Next.js ともに TypeScript ファーストの設計

---

## バックエンド

### NestJS 11.1.19

**選定理由**

- Angular ライクなモジュール構成により、機能ごとに疎結合な設計ができる
- TypeScript ファーストで型安全な実装が標準
- 認証・バリデーション・ORM などのエコシステムが充実している
- REST API 構築のベストプラクティスが組み込まれている

**主要ライブラリ**

| ライブラリ | バージョン | 用途 |
| --- | --- | --- |
| `@nestjs/typeorm` | 最新安定版 | TypeORM との統合（MySQL 接続・エンティティ管理） |
| `typeorm` | 最新安定版 | ORM（テーブルマッピング・クエリビルダー） |
| `mysql2` | 最新安定版 | MySQL ドライバ |
| `@nestjs/jwt` | 最新安定版 | JWT 生成・検証 |
| `@nestjs/passport` | 最新安定版 | 認証ストラテジー管理 |
| `passport-jwt` | 最新安定版 | JWT 認証ストラテジー |
| `bcrypt` | 最新安定版 | パスワードハッシュ化（bcrypt） |
| `cookie-parser` | 最新安定版 | HttpOnly Cookie の読み書き |
| `class-validator` | 最新安定版 | DTO バリデーション |
| `class-transformer` | 最新安定版 | リクエストボディの DTO 変換 |

### ORM: TypeORM

**選定理由**

- NestJS の公式ドキュメントで推奨されている
- デコレーターベースのエンティティ定義が NestJS の設計思想と一致する
- MySQL 8 との実績が豊富

### 認証方式

- **JWT**（JSON Web Token）を HttpOnly Cookie に格納
- ブラウザの JavaScript からアクセス不可にすることで XSS 対策
- トークン有効期限: 8 時間（セッション管理はステートレス）

---

## データベース

### MySQL 8.4

**選定理由**

- 国内の Web 開発現場での採用率が高く、学習コストが低い
- RaiseTech カリキュラムの既習技術と一致
- AWS RDS での提供バージョンに対応（8.0 / 8.4 が利用可能）
- 文字コード `utf8mb4` により日本語・絵文字を安全に扱える

---

## ローカル開発環境

### Docker / Docker Compose

MySQL をコンテナで起動し、開発環境と本番環境の差異をなくす。

```yaml
# docker-compose.yml（概要）
services:
  db:
    image: mysql:8.4
    ports:
      - "3306:3306"
    environment:
      MYSQL_ROOT_PASSWORD: secret
      MYSQL_DATABASE: inquiry_management
```

**起動順序**

```bash
# 1. MySQL（Docker）
docker compose up -d

# 2. バックエンド（port 3001）
cd backend && npm run start:dev

# 3. フロントエンド（port 3000）
cd frontend && npm run dev
```

---

## インフラ（本番）

### AWS

| サービス | 用途 |
| --- | --- |
| EC2 | アプリケーションサーバー（NestJS / Next.js） |
| RDS（MySQL 8.4） | マネージドデータベース |

最小構成（学習用途）のため、ロードバランサー・Auto Scaling は対象外。

### Terraform

**選定理由**

- インフラをコードで管理し、再現性を確保する
- `terraform plan` により変更差分を事前確認できる
- RaiseTech カリキュラムの学習目標に含まれる

詳細は `docs/infrastructure.md` を参照。

---

## バージョン更新ポリシー

- 各技術は**常に最新安定版**を採用する
- メジャーバージョンアップ時は破壊的変更の有無を確認してから適用する
- バージョンを変更した場合は、このファイルの「バージョン一覧」表を同時に更新する
