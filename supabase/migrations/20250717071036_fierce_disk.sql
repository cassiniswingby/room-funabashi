/*
  # Add reservation code column

  1. New Column
    - `reservation_code` (text, unique)
      - 8文字の予約番号（例：ABC12345）
      - 既存の予約にもランダムな予約番号を生成

  2. Function
    - 新規予約作成時に自動で予約番号を生成する関数

  3. Trigger
    - INSERT時に予約番号を自動生成するトリガー
*/

-- 予約番号生成関数
CREATE OR REPLACE FUNCTION generate_reservation_code()
RETURNS text AS $$
DECLARE
  chars text := 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  result text := '';
  i integer;
  code_exists boolean;
BEGIN
  LOOP
    result := '';
    FOR i IN 1..8 LOOP
      result := result || substr(chars, floor(random() * length(chars) + 1)::integer, 1);
    END LOOP;
    
    -- 重複チェック
    SELECT EXISTS(SELECT 1 FROM reservations WHERE reservation_code = result) INTO code_exists;
    
    IF NOT code_exists THEN
      EXIT;
    END IF;
  END LOOP;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- 予約番号カラムを追加
ALTER TABLE reservations ADD COLUMN IF NOT EXISTS reservation_code text;

-- 既存の予約に予約番号を生成
UPDATE reservations 
SET reservation_code = generate_reservation_code() 
WHERE reservation_code IS NULL;

-- 予約番号にユニーク制約を追加
ALTER TABLE reservations ADD CONSTRAINT unique_reservation_code UNIQUE (reservation_code);

-- 新規予約作成時に予約番号を自動生成するトリガー関数
CREATE OR REPLACE FUNCTION set_reservation_code()
RETURNS trigger AS $$
BEGIN
  IF NEW.reservation_code IS NULL THEN
    NEW.reservation_code := generate_reservation_code();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- トリガーを作成
DROP TRIGGER IF EXISTS set_reservation_code_trigger ON reservations;
CREATE TRIGGER set_reservation_code_trigger
  BEFORE INSERT ON reservations
  FOR EACH ROW
  EXECUTE FUNCTION set_reservation_code();