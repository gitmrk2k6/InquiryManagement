# 画面証跡

README.md から参照される画面ショット・録画を配置するディレクトリ。

## ファイル一覧（撮影予定）

### アプリ機能（F-01〜F-06）

| # | ファイル名 | 形式 | 内容 |
| --- | --- | --- | --- |
| 01 | `01-inquiry-form.png` | スクショ | F-01 フォーム初期表示 |
| 02 | `02-inquiry-form-validation.png` | スクショ | F-01 必須項目未入力のエラー |
| 03 | `03-inquiry-submit.mp4` | 録画 | F-01 入力 → 送信 → F-02 遷移 |
| 04 | `04-inquiry-rate-limit.png` | スクショ | F-01 6回連続送信で 429 |
| 05 | `05-complete.png` | スクショ | F-02 送信完了画面 |
| 06 | `06-admin-login-logout.mp4` | 録画 | F-03 ログイン → 一覧 → ログアウト |
| 07 | `07-admin-login-error.png` | スクショ | F-03 認証エラー表示 |
| 08 | `08-admin-list.png` | スクショ | F-04 一覧（複数件表示） |
| 09 | `09-admin-detail-status.mp4` | 録画 | F-05 詳細閲覧 + ステータス変更 |
| 10 | `10-admin-filter-sort.mp4` | 録画 | F-06 フィルタ・ソート |
| 11 | `11-admin-elapsed-highlight.png` | スクショ | F-06 経過日数強調表示 |

### AWS デプロイ証跡

| # | ファイル名 | 形式 | 内容 |
| --- | --- | --- | --- |
| 20 | `20-terraform-apply.png` | スクショ | `terraform apply` の Outputs 出力 |
| 21 | `21-aws-ec2.png` | スクショ | EC2 コンソール（インスタンス running 状態） |
| 22 | `22-aws-rds.png` | スクショ | RDS コンソール（available 状態） |
| 23 | `23-aws-vpc.png` | スクショ | VPC リソースマップ |
| 24 | `24-prod-access.png` | スクショ | 本番 URL でアプリ表示 |
| 25 | `25-prod-end-to-end.mp4` | 録画 | 本番で問い合わせ送信 → 管理画面で確認 |

## 撮影のコツ

- **スクショ**: macOS の `Cmd + Shift + 4` で範囲選択
- **録画**: macOS の `Cmd + Shift + 5` → 「画面の一部を収録」
- 録画は **30 秒〜1分以内** に収まるよう操作を絞る
- 個人情報や本物のパスワードが映らないようテストデータを使う
