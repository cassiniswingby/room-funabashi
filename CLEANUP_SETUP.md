# 予約データ自動削除機能 セットアップガイド

## 概要

Supabase Free プランの停止防止と古い予約データの自動削除を行うEdge Functionです。

## 機能

1. **Keep-Alive**: 毎日Supabaseにアクセスしてプロジェクトを活性化
2. **データクリーンアップ**: 3ヶ月より古い予約データを自動削除
3. **安全機能**: 削除上限設定、未来日保護、ソフトデリート対応

## セットアップ手順

### 1. データベースマイグレーション

```bash
# インデックスとポリシーを追加
supabase db push
```

### 2. 環境変数の設定

```bash
# Supabase Secretsに環境変数を設定
supabase secrets set SUPABASE_URL="your-supabase-url"
supabase secrets set SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"

# オプション: ソフトデリートを有効にする場合
supabase secrets set SOFT_DELETE="true"
```

### 3. Edge Functionのデプロイ

```bash
# 関数をデプロイ
supabase functions deploy cleanup-reservations
```

### 4. スケジュール設定

Supabase Dashboard で以下を設定：

1. **Edge Functions** → **cleanup-reservations** を選択
2. **Schedule** タブを開く
3. **Cron Expression**: `0 18 * * *` (毎日18:00 UTC = 03:00 JST)
4. **Enable** をオンにする

### 5. 動作確認

```bash
# 手動実行でテスト
supabase functions invoke cleanup-reservations
```

## レスポンス例

### 成功時
```json
{
  "ok": true,
  "deleted_count": 5,
  "upper_limit_hit": false,
  "started_at": "2025-01-27T18:00:00.000Z",
  "finished_at": "2025-01-27T18:00:02.150Z",
  "keep_alive_success": true
}
```

### エラー時
```json
{
  "ok": false,
  "deleted_count": 0,
  "upper_limit_hit": false,
  "started_at": "2025-01-27T18:00:00.000Z",
  "finished_at": "2025-01-27T18:00:01.500Z",
  "error": "Missing required environment variables",
  "keep_alive_success": false
}
```

## 設定オプション

### ソフトデリート

`SOFT_DELETE=true` を設定すると、物理削除の代わりに以下を実行：
- `deleted_at` カラムに現在時刻を設定
- `status` を `'cancelled'` に変更

### 削除上限

- デフォルト: 2000件/回
- `upper_limit_hit: true` の場合、まだ削除対象が残っている

## 安全機能

1. **未来日保護**: `reservation_date > current_date` は絶対に削除しない
2. **削除上限**: 1回の実行で最大2000件まで
3. **Service Role**: RLSを適切にバイパスして削除実行
4. **詳細ログ**: 削除対象の詳細をログ出力

## トラブルシューティング

### よくある問題

1. **環境変数エラー**
   ```bash
   supabase secrets list
   ```

2. **RLSエラー**
   - Service Role Keyが正しく設定されているか確認
   - マイグレーションでポリシーが追加されているか確認

3. **スケジュール実行されない**
   - Dashboard でスケジュールが有効になっているか確認
   - Cron式が正しいか確認: `0 18 * * *`

### ログ確認

```bash
# 関数のログを確認
supabase functions logs cleanup-reservations
```

## 監視

- 毎日の実行結果をログで確認
- `deleted_count` が異常に多い場合は調査
- `upper_limit_hit: true` が続く場合は削除上限の調整を検討