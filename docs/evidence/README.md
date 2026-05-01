# 画面証跡

README.md から参照されるスクリーンショットを配置するディレクトリ。

## ファイル一覧（撮影予定）

### アプリ機能（F-01〜F-06）

| # | ファイル名 | 内容 |
| --- | --- | --- |
| 01 | `01-form-empty.png` | F-01 フォーム初期表示（空） |
| 02 | `02-form-validation.png` | F-01 必須項目未入力でのバリデーションエラー |
| 03 | `03-form-filled.png` | F-01 入力済み（送信前） |
| 04 | `04-rate-limit.png` | F-01 6回連続送信で 429 エラー |
| 05 | `05-complete.png` | F-02 送信完了画面（受付番号表示） |
| 06 | `06-login-form.png` | F-03 ログイン画面 |
| 07 | `07-login-error.png` | F-03 認証エラー表示 |
| 08 | `08-after-login.png` | F-03 ログイン直後の管理画面 |
| 09 | `09-after-logout.png` | F-03 ログアウト後の画面 |
| 10 | `10-inquiry-list.png` | F-04 一覧（複数件表示） |
| 11 | `11-detail-before.png` | F-05 詳細画面（変更前: 未対応） |
| 12 | `12-detail-after.png` | F-05 詳細画面（変更後: 対応中 / 完了） |
| 13 | `13-filter-status.png` | F-06 ステータスフィルタ適用 |
| 14 | `14-sort-asc.png` | F-06 ソート切替（昇順） |
| 15 | `15-elapsed-highlight.png` | F-06 経過日数 3 日以上の `open` が強調表示 |

### AWS デプロイ証跡

| # | ファイル名 | 内容 |
| --- | --- | --- |
| 20 | `20-terraform-apply.png` | `terraform apply` の Outputs 出力 |
| 21 | `21-aws-ec2.png` | EC2 コンソール（インスタンス running 状態） |
| 22 | `22-aws-rds.png` | RDS コンソール（available 状態） |
| 23 | `23-aws-vpc.png` | VPC リソースマップ |
| 24 | `24-prod-form.png` | 本番 URL でフォーム表示 |
| 25 | `25-prod-complete.png` | 本番 URL で送信完了画面 |
| 26 | `26-prod-admin-list.png` | 本番管理画面で問い合わせを受信確認 |

## 撮影のコツ

- macOS の `Cmd + Shift + 4` で範囲選択スクショ
- 個人情報や本物のパスワードが映らないようテストデータを使う
- 経過日数強調（#15）の確認には、テスト用に `received_at` を 4 日以上前にしたデータを用意する

```sql
UPDATE inquiry SET received_at = DATE_SUB(NOW(), INTERVAL 4 DAY) WHERE id = <id>;
```
