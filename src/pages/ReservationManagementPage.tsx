import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Calendar, Users, Mail, User, AlertCircle, CheckCircle, X } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { format } from 'date-fns';
import Button from '../components/Button';

// Import background image
import bgImg2 from '../assets/bg-image2.png';

interface Reservation {
  id: string;
  reservation_code: string;
  guest_name: string;
  guest_email: string;
  guest_phone: string;
  reservation_date: string;
  plan_type: string;
  num_guests: number;
  num_adults: number;
  num_infants: number;
  num_preschoolers: number;
  num_children: number;
  status: string;
  notes: string | null;
  total_price: number | null;
  created_at: string;
}

const PLAN_DETAILS = {
  day: { name: 'デイプラン', time: '10:00 - 16:00' },
  night: { name: 'ナイトプラン', time: '17:00 - 24:00' },
  oneday: { name: 'ワンデイプラン', time: '10:00 - 24:00' },
  allnight: { name: 'オールナイトプラン', time: '17:00 - 翌9:00' },
  oneday_allnight: { name: 'ワンデイオールナイトプラン', time: '10:00 - 翌9:00' },
  custom: { name: 'イベントプラン', time: 'カスタム' }
};

const STATUS_LABELS = {
  reserved: '予約済み',
  cancelled: 'キャンセル済み'
};

const ReservationManagementPage: React.FC = () => {
  const [reservationCode, setReservationCode] = useState('');
  const [email, setEmail] = useState('');
  const [reservation, setReservation] = useState<Reservation | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [cancelled, setCancelled] = useState(false);

  React.useEffect(() => {
    document.title = 'room船橋｜予約の確認・キャンセル';
  }, []);

  const handleSearch = async () => {
    if (!reservationCode.trim() || !email.trim()) {
      setError('予約番号とメールアドレスを入力してください');
      return;
    }

    setLoading(true);
    setError(null);
    setReservation(null);

    try {
      const { data, error: supabaseError } = await supabase
        .from('reservations')
        .select('*')
        .eq('reservation_code', reservationCode.toUpperCase())
        .eq('guest_email', email)
        .maybeSingle();

      if (supabaseError) {
        setError('予約の検索中にエラーが発生しました。');
        return;
      }

      if (data === null) {
        setError('予約が見つかりませんでした。予約番号とメールアドレスをご確認ください。');
        return;
      }

      setReservation(data);
    } catch (err) {
      console.error('Search error:', err);
      setError('予約の検索中にエラーが発生しました。');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!reservation) return;
  
    setCancelling(true);
    setError(null);

    if (!reservation?.id) {
      console.error("Reservation ID is missing!");
      return;
    }


    try {
      const { data, error: supabaseError } = await supabase
        .from('reservations')
        .update({ status: 'cancelled' as any })
        .eq('id', reservation.id)
        .eq('guest_email', reservation.guest_email)
        .select()
        .maybeSingle();

      console.log('update結果:', { data, error });
      console.log("🔄 更新対象ID:", reservation.id);
      console.log("📦 送信したstatus:", 'cancelled');
      console.log("✅ 更新結果データ:", data);
      console.log("❌ Supabaseエラー:", supabaseError);
  
      if (supabaseError) {
        console.error('Supabase update error:', supabaseError);
        setError('キャンセル処理中にエラーが発生しました。');
        return;
      }
  
      if (data) {
        // Google Calendarからイベントを削除（Edge Function経由）
        try {
          const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/remove-google-calendar-event`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              reservationCode: reservation.reservation_code,
              guestEmail: reservation.guest_email,
            }),
          });

          const result = await response.json();
          
          if (result.success) {
            console.log('Reservation removed from Google Calendar successfully');
          } else if (result.skipped) {
            console.log('Google Calendar integration skipped - not configured');
          } else {
            console.error('Failed to remove from Google Calendar:', result.error);
          }
        } catch (calendarError) {
          console.error('Failed to remove from Google Calendar:', calendarError);
        }
        
        setReservation(data);
        setCancelled(true);
        setShowCancelModal(false);
      } else {
        console.error('No data returned from update - reservation not found or already cancelled');
        setError('予約が見つからないか、既にキャンセル済みです。');
      }
    } catch (err) {
      console.error('Cancel error:', err);
      setError('キャンセル処理中にエラーが発生しました。');
    } finally {
      setCancelling(false);
    }
  };


  const handleReset = () => {
    setReservationCode('');
    setEmail('');
    setReservation(null);
    setError(null);
    setCancelled(false);
  };

  return (
    <div className="min-h-screen bg-sky-50">
      {/* ヘッダーセクション */}
      <section className="relative h-[50vh] flex items-center">
        <div 
          className="absolute inset-0 bg-cover bg-center" 
          style={{ 
            backgroundImage: `url(${bgImg2})`,
            filter: "brightness(0.6)"
          }} 
        />
        <div className="absolute inset-0 bg-gradient-to-b from-sky-950/50 to-sky-950/70" />
        <div className="container mx-auto px-6 md:px-4 relative z-10">
          <motion.div 
            className="text-center text-white"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-2xl md:text-3xl font-bold mb-6">予約の確認・キャンセル</h1>
            <p className="text-base md:text-xl text-sky-100 max-w-lg md:max-w-3xl mx-auto leading-relaxed px-4">
              ご予約内容の確認やキャンセル手続きは<br className="sm:hidden" />こちらから行えます
            </p>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-6 md:px-4 py-12">
        <div className="max-w-2xl mx-auto">
          {cancelled ? (
            /* キャンセル完了メッセージ */
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-green-50 border border-green-200 rounded-lg p-8 text-center"
            >
              <CheckCircle size={64} className="mx-auto mb-4 text-green-500" />
              <h2 className="text-xl font-bold text-green-800 mb-4">キャンセルが完了しました</h2>
              <p className="text-green-700 mb-6 text-sm md:text-base leading-relaxed">
                確認メールをお送りしました。<br />
                ご不明な点がございましたら、お気軽にお問い合わせください。
              </p>
              <Button onClick={handleReset}>
                別の予約を確認する
              </Button>
            </motion.div>
          ) : !reservation ? (
            /* 検索フォーム */
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow-md p-6 md:p-8"
            >
              <div className="text-center mb-8">
                <Search size={48} className="mx-auto mb-4 text-sky-600" />
                <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                  予約番号とメールアドレスを入力してください
                </p>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
                  <div className="flex items-center">
                    <AlertCircle size={20} className="text-red-600 mr-2" />
                    <p className="text-red-600 text-sm md:text-base">{error}</p>
                  </div>
                </div>
              )}

              <div className="space-y-6">
                <div>
                  <label className="block text-gray-700 font-medium mb-2 text-sm md:text-base">
                    予約番号
                  </label>
                  <input
                    type="text"
                    value={reservationCode}
                    onChange={(e) => setReservationCode(e.target.value.toUpperCase())}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring focus:ring-sky-200 focus:border-sky-500 text-sm md:text-base"
                    placeholder="例：ABC12345"
                    maxLength={8}
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2 text-sm md:text-base">
                    メールアドレス
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring focus:ring-sky-200 focus:border-sky-500 text-sm md:text-base"
                    placeholder="例：example@email.com"
                  />
                </div>

                <Button
                  onClick={handleSearch}
                  disabled={loading || !reservationCode.trim() || !email.trim()}
                  className="w-full"
                >
                  {loading ? '検索中...' : '予約を確認する'}
                </Button>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="space-y-2 text-sm text-gray-600">
                  <p className="flex items-start">
                    <AlertCircle size={16} className="mr-2 mt-0.5 text-gray-400 flex-shrink-0" />
                    予約番号が不明な方は info@room-funabashi.jp までご連絡ください
                  </p>
                  <p className="flex items-start">
                    <AlertCircle size={16} className="mr-2 mt-0.5 text-gray-400 flex-shrink-0" />
                    キャンセル料はプランによって異なります。キャンセルポリシーをご確認ください
                  </p>
                </div>
              </div>
            </motion.div>
          ) : (
            /* 予約詳細表示 */
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow-md p-6 md:p-8"
            >
              <div className="text-center mb-8">
                <h2 className="text-xl md:text-2xl font-bold text-sky-800 mb-2">予約内容</h2>
                <p className="text-gray-600 text-sm md:text-base">
                  予約番号：{reservation.reservation_code}
                </p>
              </div>

              <div className="space-y-6">
                {/* 基本情報 */}
                <div className="bg-sky-50 p-4 rounded-lg">
                  <h3 className="font-medium text-sky-800 mb-3 flex items-center text-sm md:text-base">
                    <User size={18} className="mr-2" />
                    ご予約者情報
                  </h3>
                  <div className="space-y-2 pl-6">
                    <p className="text-gray-700 text-sm md:text-base">
                      <span className="font-medium">お名前：</span>{reservation.guest_name}
                    </p>
                    <p className="text-gray-700 text-sm md:text-base">
                      <span className="font-medium">メールアドレス：</span>{reservation.guest_email}
                    </p>
                    <p className="text-gray-700 text-sm md:text-base">
                      <span className="font-medium">電話番号：</span>{reservation.guest_phone}
                    </p>
                  </div>
                </div>

                {/* 予約詳細 */}
                <div className="bg-sky-50 p-4 rounded-lg">
                  <h3 className="font-medium text-sky-800 mb-3 flex items-center text-sm md:text-base">
                    <Calendar size={18} className="mr-2" />
                    ご利用詳細
                  </h3>
                  <div className="space-y-2 pl-6">
                    <p className="text-gray-700 text-sm md:text-base">
                      <span className="font-medium">ご利用日：</span>
                      {format(new Date(reservation.reservation_date), 'yyyy年M月d日')}
                    </p>
                    <p className="text-gray-700 text-sm md:text-base">
                      <span className="font-medium">プラン：</span>
                      {PLAN_DETAILS[reservation.plan_type as keyof typeof PLAN_DETAILS]?.name || reservation.plan_type}
                    </p>
                    <p className="text-gray-700 text-sm md:text-base">
                      <span className="font-medium">ご利用人数：</span>{reservation.num_guests}名
                    </p>
                    <p className="text-gray-700 text-sm md:text-base">
                      <span className="font-medium">ステータス：</span>
                      <span className={`font-medium ${
                        reservation.status === 'reserved' ? 'text-green-600' :
                        reservation.status === 'cancelled' ? 'text-red-600' :
                        'text-gray-600'
                      }`}>
                        {STATUS_LABELS[reservation.status as keyof typeof STATUS_LABELS] || reservation.status}
                      </span>
                    </p>
                    {reservation.total_price && (
                      <p className="text-gray-700 text-sm md:text-base">
                        <span className="font-medium">料金：</span>{reservation.total_price.toLocaleString()}円（税込）
                      </p>
                    )}
                  </div>
                </div>

                {/* 特別なご要望 */}
                {reservation.notes && (
                  <div className="bg-sky-50 p-4 rounded-lg">
                    <h3 className="font-medium text-sky-800 mb-3 text-sm md:text-base">特別なご要望</h3>
                    <p className="text-gray-700 pl-6 whitespace-pre-wrap text-sm md:text-base">
                      {reservation.notes}
                    </p>
                  </div>
                )}

                {/* アクションボタン */}
                <div className="flex flex-col sm:flex-row gap-4 pt-6">
                  <Button onClick={handleReset} variant="outline" className="flex-1">
                    別の予約を確認する
                  </Button>
                  
                  {reservation.status !== 'cancelled' && (
                    <Button
                      onClick={() => setShowCancelModal(true)}
                      variant="danger"
                      className="flex-1"
                    >
                      この予約をキャンセルする
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* キャンセル確認モーダル */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg p-6 max-w-md w-full"
          >
            <div className="text-center mb-6">
              <AlertCircle size={48} className="mx-auto mb-4 text-red-500" />
              <h3 className="text-lg font-bold text-gray-800 mb-2">予約をキャンセルしますか？</h3>
              <p className="text-gray-600 text-sm">
                この操作は取り消すことができません。<br />
                キャンセル料が発生する場合があります。
              </p>
            </div>

            <div className="flex gap-4">
              <Button
                onClick={() => setShowCancelModal(false)}
                variant="outline"
                className="flex-1"
                disabled={cancelling}
              >
                戻る
              </Button>
              <Button
                onClick={handleCancel}
                variant="danger"
                className="flex-1"
                disabled={cancelling}
              >
                {cancelling ? 'キャンセル中...' : 'キャンセルする'}
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default ReservationManagementPage;