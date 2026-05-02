# InquiryManagement — 問い合わせ管理アプリ

問い合わせ受付・対応状況管理を行う Web アプリケーション。

## 課題情報

| 項目 | 内容 |
| --- | --- |
| コース | RaiseTech AI エンジニアコース |
| 課題 | 初級編最終課題 |
| 方針 | TaskManagement とは異なる技術スタックで構築 |
| MVP 機能 | F-01 〜 F-06（公開フォーム送信・管理者ログイン・問い合わせ管理） |
| スコープ外 | F-07 〜 F-11（メール通知・担当者割当・社内コメント等） |

> 本 README のデモ画像は **AWS にデプロイした本番環境（<http://54.248.22.131>）** で撮影したもの。URL バーから本番アクセスであることが確認できる。

---

## デモ（画面証跡）

### F-01: 問い合わせ送信フォーム

公開ページから顧客が問い合わせを送信できる機能。バリデーションとスパム対策（IP レートリミット 5 回/分）を実装。

| 内容 | スクショ |
| --- | --- |
| 入力済み（送信前） | ![F-01 入力済み](docs/evidence/03-form-filled.png) |
| バリデーションエラー | ![F-01 バリデーション](docs/evidence/02-form-validation.png) |

> レートリミット（429）の発動は実装コード（[`backend/src/inquiry/inquiry.controller.ts`](backend/src/inquiry/inquiry.controller.ts) の `@Throttle` デコレーター）と PR #34 のテスト結果で確認可能。

### F-02: 送信完了画面

送信成功後に受付番号を表示する画面。

| 内容 | スクショ |
| --- | --- |
| 完了画面（受付番号表示） | ![F-02 完了](docs/evidence/05-complete.png) |

### F-03: 管理者ログイン / ログアウト

JWT（HttpOnly Cookie）で認証する管理者ログイン。

| 内容 | スクショ |
| --- | --- |
| ログイン画面 | ![F-03 ログイン](docs/evidence/06-login-form.png) |
| 認証エラー | ![F-03 エラー](docs/evidence/07-login-error.png) |
| ログイン後の管理画面 | ![F-03 ログイン後](docs/evidence/08-after-login-list.png) |

> ログアウトボタン押下後は `/admin/login` にリダイレクトされる（画面はログイン画面と同一のため省略）。

### F-04: 問い合わせ一覧

受信日時降順で一覧表示。1ページ 20 件のページング。

| 内容 | スクショ |
| --- | --- |
| 一覧表示（複数件） | ![F-04 一覧](docs/evidence/08-after-login-list.png) |

### F-05: 問い合わせ詳細・ステータス変更

詳細閲覧と「未対応 / 対応中 / 完了」のステータス変更。

| 内容 | スクショ |
| --- | --- |
| 詳細画面（変更前: 未対応） | ![F-05 変更前](docs/evidence/11-detail-before.png) |
| 詳細画面（変更後: 対応中） | ![F-05 変更後](docs/evidence/12-detail-after.png) |

### F-06: 一覧の絞り込み・ソート

ステータスフィルタ、受信日時ソート、経過日数表示。

| 内容 | スクショ |
| --- | --- |
| ステータスフィルタ適用（対応中） | ![F-06 フィルタ](docs/evidence/13-filter-status.png) |
| ソート切替（経過日数の長い順） | ![F-06 ソート](docs/evidence/14-sort-elapsed.png) |
| 経過日数の強調表示（4 日以上の未対応） | ![F-06 経過日数](docs/evidence/15-elapsed-highlight.png) |

---

## AWS デプロイ証跡

> Terraform で AWS にインフラを構築し、本番環境（<http://54.248.22.131>）で動作することを確認済み。
> 本番アクセスの証跡は上記デモセクションの各スクショ（URL バー参照）で確認可能。

| 内容 | スクショ |
| --- | --- |
| AWS コンソール: EC2 インスタンス | ![EC2](docs/evidence/21-aws-ec2.png) |
| AWS コンソール: RDS | ![RDS](docs/evidence/22-aws-rds.png) |
| AWS コンソール: VPC リソースマップ | ![VPC](docs/evidence/23-aws-vpc.png) |

**本番アクセス URL**: <http://54.248.22.131>/

---

## アーキテクチャ

### システム構成図

```mermaid
graph LR
    Customer[顧客 ブラウザ]
    Admin[管理者 ブラウザ]

    subgraph EC2["EC2 / Amazon Linux 2023"]
        Nginx["Nginx :80"]
        Next["Next.js :3000"]
        Nest["NestJS :3001"]
    end

    subgraph RDS["RDS / MySQL 8.0"]
        DB[(inquiry_db)]
    end

    Customer -->|HTTP| Nginx
    Admin -->|HTTP| Nginx
    Nginx -->|/api/*| Nest
    Nginx -->|/*| Next
    Nest -->|MySQL 3306| DB
```

### AWS インフラ構成図

```mermaid
graph TD
    Internet[インターネット]

    subgraph AWS["AWS ap-northeast-1"]
        IGW[Internet Gateway]

        subgraph VPC["VPC 10.0.0.0/16"]
            subgraph Public["パブリックサブネット 10.0.1.0/24"]
                EC2[EC2 t3.micro]
            end

            subgraph PrivA["プライベートサブネット 10.0.2.0/24 AZ-a"]
                RDSA[RDS Subnet]
            end

            subgraph PrivC["プライベートサブネット 10.0.3.0/24 AZ-c"]
                RDSC[RDS Subnet]
            end

            RDS[(RDS db.t3.micro)]
        end
    end

    Internet --- IGW
    IGW --- EC2
    EC2 --- RDS
    RDSA -.- RDS
    RDSC -.- RDS
```

詳細は [docs/infrastructure.md](docs/infrastructure.md) を参照。

---

## 技術スタック

| レイヤー | 技術 | バージョン |
| --- | --- | --- |
| フロントエンド | Next.js + TypeScript + Tailwind CSS | 16.x |
| バックエンド | NestJS + TypeScript + TypeORM | 11.x |
| データベース | MySQL | 8.0 |
| 認証 | JWT（HttpOnly Cookie）/ bcrypt | — |
| スパム対策 | `@nestjs/throttler`（IP レートリミット） | — |
| インフラ | AWS（VPC + EC2 + RDS）+ Terraform | TF 1.5+ |
| プロセス管理 | PM2 | — |
| リバースプロキシ | Nginx | — |

---

## 実装した機能（MVP）

| ID | 機能 | 概要 |
| --- | --- | --- |
| F-01 | 問い合わせ送信フォーム | 公開フォームから問い合わせを送信。バリデーション + IP レートリミット（5回/分） |
| F-02 | 送信完了画面 | 受付番号を表示 |
| F-03 | 管理者ログイン / ログアウト | JWT + HttpOnly Cookie + bcrypt ハッシュ |
| F-04 | 問い合わせ一覧 | 受信日時降順、20件ページング |
| F-05 | 問い合わせ詳細・ステータス変更 | 未対応 / 対応中 / 完了 の遷移 |
| F-06 | 一覧の絞り込み・ソート | ステータスフィルタ、受信日時ソート、経過日数の強調表示 |

### スコープ外（フェーズ2）

F-07 社内コメント / F-08 担当者割当 / F-09 受付完了メール / F-10 ステータス変更通知メール / F-11 管理者ユーザー管理（ロール）

---

## ドキュメント

| ドキュメント | 内容 |
| --- | --- |
| [docs/requirements.md](docs/requirements.md) | 要件定義 |
| [docs/functional-requirements.md](docs/functional-requirements.md) | 機能要件・ユースケース |
| [docs/screen-design.md](docs/screen-design.md) | 画面設計・遷移図 |
| [docs/database-design.md](docs/database-design.md) | DB 設計・ER 図 |
| [docs/tech-stack.md](docs/tech-stack.md) | 技術スタック詳細 |
| [docs/infrastructure.md](docs/infrastructure.md) | インフラ構成・Terraform |

---

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
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local

# 3. MySQL を起動
docker compose up -d

# 4. バックエンドを起動（port 3001）
cd backend
npm install
npm run start:dev

# 5. 別ターミナルで管理者ユーザーを作成
cd backend
npm run seed
# → admin@example.com / password123

# 6. フロントエンドを起動（port 3000）
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

### 開発ルール

[CLAUDE.md](./CLAUDE.md) の命名規則・GitHub ワークフロー・サーバー起動ルールを参照。

---

## 本番デプロイ手順（AWS）

```bash
# 1. キーペアを AWS に作成（初回のみ）
aws ec2 create-key-pair --region ap-northeast-1 \
  --key-name inquiry-management-key --query 'KeyMaterial' --output text \
  > ~/.ssh/inquiry-management-key.pem
chmod 600 ~/.ssh/inquiry-management-key.pem

# 2. terraform.tfvars を作成
cd terraform
cp terraform.tfvars.example terraform.tfvars
# terraform.tfvars を編集（key_pair_name と db_password を本物に置換）

# 3. インフラを構築
terraform init
terraform plan
terraform apply

# 4. 出力された EC2 public IP に SSH 接続
ssh -i ~/.ssh/inquiry-management-key.pem ec2-user@<EC2_PUBLIC_IP>

# 5. EC2 上でアプリをセットアップ（詳細は docs/infrastructure.md 参照）
git clone <repo-url>
# .env を作成、npm install、build、seed、PM2 で起動
```

学習終了時は `terraform destroy` で全リソースを削除すること。
