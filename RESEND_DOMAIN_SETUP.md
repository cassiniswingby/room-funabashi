# Resend ドメイン検証手順

## 📋 room-funabashi.com のドメイン検証手順

### 1. Resend Dashboard でドメインを追加

1. [Resend Dashboard](https://resend.com/domains) にログイン
2. 「Add Domain」をクリック
3. `room-funabashi.com` を入力
4. 「Add Domain」をクリック

### 2. DNS レコードを追加

以下のDNSレコードをドメインのDNS設定に追加してください：

#### SPF レコード
```
タイプ: TXT
名前: room-funabashi.com (または @)
値: v=spf1 include:_spf.resend.com ~all
```

#### DKIM レコード
```
タイプ: TXT
名前: resend._domainkey.room-funabashi.com
値: (Resend Dashboard で表示される値)
```

#### DMARC レコード
```
タイプ: TXT
名前: _dmarc.room-funabashi.com
値: v=DMARC1; p=none; rua=mailto:dmarc@room-funabashi.com
```

#### MX レコード（オプション）
```
タイプ: MX
名前: room-funabashi.com (または @)
値: 10 feedback-smtp.resend.com
```

### 3. 検証の確認

1. DNS レコードを追加後、最大48時間待機
2. Resend Dashboard で「Verify」をクリック
3. 検証が完了すると緑色のチェックマークが表示されます

### 4. 検証状況の確認方法

```bash
# SPF レコードの確認
dig TXT room-funabashi.com

# DKIM レコードの確認
dig TXT resend._domainkey.room-funabashi.com

# DMARC レコードの確認
dig TXT _dmarc.room-funabashi.com
```

## ⚠️ 重要な注意事項

- DNS の反映には最大48時間かかる場合があります
- 検証が完了するまでは `yourname@resend.dev` を使用してテストしてください
- 検証完了後は `info@room-funabashi.com` に変更してください

## 🔧 トラブルシューティング

### よくある問題

1. **DNS レコードが見つからない**
   - DNS の反映を待つ（最大48時間）
   - レコードの値に余分なスペースがないか確認

2. **DKIM 検証が失敗する**
   - DKIM レコードの値が正確にコピーされているか確認
   - 値が長い場合は分割されていないか確認

3. **SPF レコードが重複している**
   - 既存のSPFレコードがある場合は統合する
   - 例：`v=spf1 include:_spf.google.com include:_spf.resend.com ~all`