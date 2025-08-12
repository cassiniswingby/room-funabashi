import React from 'react';
import { CheckCircle, Calendar, Users, Mail, FileText, Clock, Phone, User, DollarSign, Dog } from 'lucide-react';
import type { ReservationPlan } from '../../types/supabase';
import { useReservations } from '../../hooks/useReservations';
import Button from '../Button';

interface BookingConfirmationProps {
  bookingData: {
    reservationDate: Date | null;
    planType: ReservationPlan | null;
    customStartTime?: string;
    customEndTime?: string;
    guestName: string;
    guestEmail: string;
    phoneNumber: string;
    numGuests: number;
    childrenInfant: number;
    childrenPreschool: number;
    childrenElementary: number;
    petSmallOutdoor: number;
    petSmallIndoor: number;
    petLarge: number;
    notes: string;
    totalPrice?: number;
    reservationCode?: string;
  };
  reservationId: string;
  onBookAgain: () => void;
}

const PLAN_DETAILS = {
  day: {
    name: 'デイプラン',
    time: '10:00 - 16:00'
  },
  night: {
    name: 'ナイトプラン',
    time: '17:00 - 24:00'
  },
  oneday: {
    name: 'ワンデイプラン',
    time: '10:00 - 24:00'
  },
  allnight: {
    name: 'オールナイトプラン（ナイトプラン＋ミッドナイトプラン）',
    time: '17:00 - 翌9:00'
  },
  oneday_allnight: {
    name: 'ワンデイオールナイトプラン（ワンデイプラン＋ミッドナイトプラン）',
    time: '10:00 - 翌9:00'
  },
  custom: {
    name: 'イベントプラン',
    time: 'カスタム'
  }
};

const SEASON_LABELS = {
  regular: 'レギュラーシーズン',
  high: 'ハイシーズン',
  special: 'スペシャルシーズン'
}

const BookingConfirmation: React.FC<BookingConfirmationProps> = ({
  bookingData,
  reservationId,
  onBookAgain
}) => {
  const { getSeasonType } = useReservations();


  // コンポーネントマウント時にGoogle Calendarに追加（Edge Function経由）
  React.useEffect(() => {
    const addToCalendar = async () => {
      if (!bookingData.reservationDate || !bookingData.planType) {
        return;
      }

      try {
        const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/add-google-calendar-event`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            guestName: bookingData.guestName,
            guestEmail: bookingData.guestEmail,
            guestPhone: bookingData.phoneNumber,
            reservationDate: bookingData.reservationDate.toISOString(),
            planType: bookingData.planType,
            customStartTime: bookingData.customStartTime,
            customEndTime: bookingData.customEndTime,
            numGuests: bookingData.numGuests,
            childrenInfant: bookingData.childrenInfant,
            childrenPreschool: bookingData.childrenPreschool,
            childrenElementary: bookingData.childrenElementary,
            petSmallOutdoor: bookingData.petSmallOutdoor,
            petSmallIndoor: bookingData.petSmallIndoor,
            petLarge: bookingData.petLarge,
            notes: bookingData.notes,
            totalPrice: bookingData.totalPrice,
            reservationCode: bookingData.reservationCode,
          }),
        });

        const result = await response.json();
        
        if (result.success) {
          console.log('Reservation added to Google Calendar successfully');
        } else if (result.skipped) {
          console.log('Google Calendar integration skipped - not configured');
        } else {
          console.error('Failed to add reservation to Google Calendar:', result.error);
        }
      } catch (error) {
        console.error('Failed to add reservation to Google Calendar:', error);
      }
    };

    addToCalendar();
  }, [bookingData]);

  if (!bookingData.reservationDate || !bookingData.planType) {
    return null;
  }

  const seasonType = getSeasonType(bookingData.reservationDate);

  const getPlanTimeDisplay = () => {
    if (bookingData.planType === 'custom' && bookingData.customStartTime && bookingData.customEndTime) {
      return `${bookingData.customStartTime} - ${bookingData.customEndTime}`;
    }
    return PLAN_DETAILS[bookingData.planType].time;
  };

  const hasPets = bookingData.petSmallOutdoor > 0 || bookingData.petSmallIndoor > 0 || bookingData.petLarge > 0;
  const hasChildren = bookingData.childrenInfant > 0 || bookingData.childrenPreschool > 0 || bookingData.childrenElementary > 0;

  return (
    <div className="text-center">
      <div className="flex justify-center mb-6">
        <CheckCircle size={80} className="text-green-500" />
      </div>
      
      <h2 className="text-xl md:text-2xl font-bold text-sky-800 mb-2">予約リクエストを受け付けました</h2>
      <p className="text-gray-600 mb-8 text-sm md:text-base leading-relaxed">
        ご予約内容を確認後、メールにてご連絡させていただきます。
        {bookingData.planType === 'custom' && (
          <span className="block mt-2 text-sky-600">
            ※イベントプランは管理者の承認後に予約が確定します
          </span>
        )}
      </p>
      
      <div className="bg-sky-50 p-6 rounded-lg mb-8">
        <h3 className="font-medium text-sky-800 mb-6 text-sm md:text-base">ご予約内容</h3>
        
        <div className="space-y-6 text-left">
          {/* ご連絡先 */}
          <div className="bg-white p-4 rounded-lg">
            <h4 className="font-medium text-sky-700 mb-3 flex items-center text-sm md:text-base">
              <User size={18} className="mr-2" />
              ご連絡先
            </h4>
            <div className="space-y-2 pl-6">
              <p className="text-gray-700 text-sm md:text-base leading-relaxed">
                <span className="font-medium">予約番号：</span>
                {bookingData.reservationCode}
              </p>
              <p className="text-gray-700 text-sm md:text-base leading-relaxed">
                <span className="font-medium">お名前：</span>
                {bookingData.guestName}
              </p>
              <p className="text-gray-700 text-sm md:text-base leading-relaxed">
                <span className="font-medium">携帯番号：</span>
                {bookingData.phoneNumber}
              </p>
              <p className="text-gray-700 text-sm md:text-base leading-relaxed">
                <span className="font-medium">メールアドレス：</span>
                {bookingData.guestEmail}
              </p>
            </div>
          </div>

          {/* ご利用日時 */}
          <div className="bg-white p-4 rounded-lg">
            <h4 className="font-medium text-sky-700 mb-3 flex items-center text-sm md:text-base">
              <Calendar size={18} className="mr-2" />
              ご利用日時
            </h4>
            <div className="space-y-2 pl-6">
              <p className="text-gray-700 text-sm md:text-base leading-relaxed">
                {bookingData.reservationDate.toLocaleDateString('ja-JP', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}（{SEASON_LABELS[seasonType]}）
              </p>
              <p className="text-gray-700 text-sm md:text-base leading-relaxed">
                {PLAN_DETAILS[bookingData.planType].name}（{getPlanTimeDisplay()}）
              </p>
            </div>
          </div>

          {/* ご利用人数 */}
          <div className="bg-white p-4 rounded-lg">
            <h4 className="font-medium text-sky-700 mb-3 flex items-center text-sm md:text-base">
              <Users size={18} className="mr-2" />
              ご利用人数
            </h4>
            <div className="space-y-2 pl-6">
              <p className="text-gray-700 text-sm md:text-base leading-relaxed">
                <span className="font-medium">大人（中学生以上）：</span>
                {bookingData.numGuests}名
              </p>
              
              {hasChildren && (
                <div className="mt-2">
                  <p className="font-medium text-gray-700 mb-1 text-sm md:text-base">お子様</p>
                  <div className="space-y-1 pl-4">
                    {bookingData.childrenInfant > 0 && (
                      <p className="text-gray-700 text-sm md:text-base leading-relaxed">
                        未就園児（0〜2歳）：{bookingData.childrenInfant}名
                      </p>
                    )}
                    {bookingData.childrenPreschool > 0 && (
                      <p className="text-gray-700 text-sm md:text-base leading-relaxed">
                        未就学児（3〜5歳）：{bookingData.childrenPreschool}名
                      </p>
                    )}
                    {bookingData.childrenElementary > 0 && (
                      <p className="text-gray-700 text-sm md:text-base leading-relaxed">
                        小学生（6〜12歳）：{bookingData.childrenElementary}名
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ペット同伴 */}
          {hasPets && (
            <div className="bg-white p-4 rounded-lg">
              <h4 className="font-medium text-sky-700 mb-3 flex items-center text-sm md:text-base">
                <Dog size={18} className="mr-2" />
                ペット同伴
              </h4>
              <div className="space-y-2 pl-6">
                {bookingData.petSmallOutdoor > 0 && (
                  <p className="text-gray-700 text-sm md:text-base leading-relaxed">
                    小型犬（屋外のみ）：{bookingData.petSmallOutdoor}頭
                  </p>
                )}
                {bookingData.petSmallIndoor > 0 && (
                  <p className="text-gray-700 text-sm md:text-base leading-relaxed">
                    小型犬（室内利用）：{bookingData.petSmallIndoor}頭
                  </p>
                )}
                {bookingData.petLarge > 0 && (
                  <p className="text-gray-700 text-sm md:text-base leading-relaxed">
                    大型犬（屋外のみ）：{bookingData.petLarge}頭
                  </p>
                )}
              </div>
            </div>
          )}
          
          {/* 特別なご要望 */}
          {bookingData.notes && (
            <div className="bg-white p-4 rounded-lg">
              <h4 className="font-medium text-sky-700 mb-3 flex items-center text-sm md:text-base">
                <FileText size={18} className="mr-2" />
                特別なご要望
              </h4>
              <p className="text-gray-700 pl-6 whitespace-pre-wrap text-sm md:text-base leading-relaxed">
                {bookingData.notes}
              </p>
            </div>
          )}
        </div>
        
        {/* 合計金額表示 */}
        {bookingData.totalPrice && (
          <div className="mt-6 pt-4 border-t border-sky-100">
            <div className="flex items-center justify-between">
              <p className="text-base md:text-xl font-medium flex items-center">
                <DollarSign size={20} className="mr-1 text-sky-600" />
                合計（税込・現地決済）
              </p>
              <p className="text-lg md:text-xl font-bold text-sky-800">
                {bookingData.totalPrice.toLocaleString()}円
              </p>
            </div>
            <p className="text-sm text-gray-500 mt-2 leading-relaxed text-left">
                ※表示価格は概算です。<br className="sm:hidden" />実際の料金は現地でご確認ください。
            </p>
          </div>
        )}
      </div>
      
      <div className="flex flex-col sm:flex-row justify-center gap-4">
        <Button onClick={onBookAgain}>
          別の日程で予約する
        </Button>
        
        <Button variant="outline" href="/">
          トップページに戻る
        </Button>
      </div>
    </div>
  );
};

export default BookingConfirmation;