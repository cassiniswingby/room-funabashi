import React from 'react';
import { useForm } from 'react-hook-form';
import { ChevronLeft, Users, Mail, User, Pencil, Calculator, Calendar, DollarSign, Phone } from 'lucide-react';
import type { ReservationPlan, SeasonType } from '../../types/supabase';
import { useReservations } from '../../hooks/useReservations';
import { format } from 'date-fns';
import Button from '../Button';

interface BookingFormProps {
  startDate: Date;
  planType: ReservationPlan;
  customTimes?: { start: string; end: string };
  onSubmit: (data: FormData) => void;
  onBack: () => void;
  isLoading: boolean;
}

const FACILITY_FEE = 2000; // 設備利用料

const PET_PRICING = {
  small: {
    outdoor: 550,  // 小型犬（屋外）
    indoor: 1100   // 小型犬（室内）
  },
  large: {
    outdoor: 1100  // 大型犬（屋外）
  }
};

const PLAN_DETAILS = {
  day: {
    name: 'デイプラン',
    time: '10:00 - 16:00',
    description: '日中のBBQやパーティーに最適なプラン',
    prices: {
      regular: { base: 11000, perPerson: 2200 },
      high: { base: 12500, perPerson: 2500 },
      special: { base: 16500, perPerson: 3300 }
    }
  },
  night: {
    name: 'ナイトプラン',
    time: '17:00 - 24:00',
    description: '夜のBBQや宴会に最適なプラン',
    prices: {
      regular: { base: 11000, perPerson: 2200 },
      high: { base: 12500, perPerson: 2500 },
      special: { base: 16500, perPerson: 3300 }
    }
  },
  oneday: {
    name: 'ワンデイプラン',
    time: '10:00 - 24:00',
    description: '朝から夜まで思う存分楽しめるプラン',
    prices: {
      regular: { base: 22000, perPerson: 4400 },
      high: { base: 22500, perPerson: 4500 },
      special: { base: 26500, perPerson: 5300 }
    }
  },
  allnight: {
    name: 'オールナイトプラン（ナイトプラン＋ミッドナイトプラン）',
    time: '17:00 - 翌9:00',
    description: '夜通し利用できるプラン',
    prices: {
      regular: { base: 18000, perPerson: 3600 },
      high: { base: 19500, perPerson: 3900 },
      special: { base: 23500, perPerson: 4700 }
    }
  },
  oneday_allnight: {
    name: 'ワンデイオールナイトプラン（ワンデイプラン＋ミッドナイトプラン）',
    time: '10:00 - 翌9:00',
    description: '朝から翌朝まで贅沢に過ごせるプラン',
    prices: {
      regular: { base: 29000, perPerson: 5800 },
      high: { base: 29500, perPerson: 5900 },
      special: { base: 33500, perPerson: 6700 }
    }
  },
  custom: {
    name: 'イベントプラン',
    time: 'カスタム',
    description: '特別なイベントや団体利用向けのカスタマイズプラン',
    prices: {
      regular: { base: 0, perPerson: 0 },
      high: { base: 0, perPerson: 0 },
      special: { base: 0, perPerson: 0 }
    }
  }
};

const CHILD_PRICING = [
  {
    category: '未就園児',
    price: {
      short: 0,
      long: 0
    }
  },
  {
    category: '未就学児',
    price: {
      short: 330,
      long: 660
    }
  },
  {
    category: '小学生',
    price: {
      short: 550,
      long: 1100
    }
  }
];

const SEASON_LABELS: Record<SeasonType, string> = {
  regular: 'レギュラーシーズン',
  high: 'ハイシーズン',
  special: 'スペシャルシーズン'
};

interface FormData {
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  numGuests: number;
  childrenInfant: number;
  childrenPreschool: number;
  childrenElementary: number;
  petSmallOutdoor: number;
  petSmallIndoor: number;
  petLarge: number;
  notes: string;
  hasPets: boolean;
}

const BookingForm: React.FC<BookingFormProps> = ({ 
  startDate, 
  planType,
  customTimes,
  onSubmit, 
  onBack,
  isLoading
}) => {
  const { 
    register, 
    handleSubmit,
    watch,
    formState: { errors } 
  } = useForm<FormData>({
    defaultValues: {
      numGuests: 2,
      childrenInfant: 0,
      childrenPreschool: 0,
      childrenElementary: 0,
      petSmallOutdoor: 0,
      petSmallIndoor: 0,
      petLarge: 0,
      hasPets: false
    }
  });

  const { getSeasonType } = useReservations();
  const formValues = watch();
  const isLongDay = ['oneday', 'allnight', 'oneday_allnight'].includes(planType);

  // Enterキーによるフォーム送信を防ぐ
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.target instanceof HTMLInputElement) {
      e.preventDefault();
    }
  };

  const onFormSubmit = (data: FormData) => {
    // Calculate hasPets based on pet-related fields
    const hasPets = (data.petSmallOutdoor > 0 || data.petSmallIndoor > 0 || data.petLarge > 0);
    onSubmit({
      ...data,
      hasPets
    });
  };

  // 明示的なボタンクリックのみで送信を処理
  const handleConfirmClick = () => {
    handleSubmit(onFormSubmit)();
  };

  const calculatePrice = () => {
    const seasonType = getSeasonType(startDate);
    const planPrices = PLAN_DETAILS[planType].prices[seasonType];
    
    // 大人料金（5名以下の基本料金、または1人あたりの料金）
    const adultFee = formValues.numGuests <= 5 
      ? planPrices.base 
      : planPrices.perPerson * formValues.numGuests;

    // 子ども料金
    const childRateType = isLongDay ? 'long' : 'short';

    const childFees = {
      infant: formValues.childrenInfant * CHILD_PRICING[0].price[childRateType],
      preschool: formValues.childrenPreschool * CHILD_PRICING[1].price[childRateType],
      elementary: formValues.childrenElementary * CHILD_PRICING[2].price[childRateType]
    };

    // ペット料金
    const petFees = {
      smallOutdoor: formValues.petSmallOutdoor * PET_PRICING.small.outdoor,
      smallIndoor: formValues.petSmallIndoor * PET_PRICING.small.indoor,
      large: formValues.petLarge * PET_PRICING.large.outdoor
    };

    const totalChildFee = Object.values(childFees).reduce((sum, fee) => sum + fee, 0);
    const totalPetFee = Object.values(petFees).reduce((sum, fee) => sum + fee, 0);

    return {
      adultFee,
      childFees,
      petFees,
      facilityFee: FACILITY_FEE,
      total: adultFee + totalChildFee + totalPetFee + FACILITY_FEE
    };
  };

  // 合計金額を取得する関数をエクスポート用に作成
  const getTotalPrice = () => {
    return calculatePrice().total;
  };

  // 親コンポーネントに合計金額を渡すためのuseEffectを追加
  React.useEffect(() => {
    if (onSubmit && typeof onSubmit === 'function') {
      // onSubmitに合計金額計算関数を渡す方法を検討
      // ここでは直接計算結果を使用
    }
  }, [formValues, onSubmit]);
  const prices = calculatePrice();
  const seasonType = getSeasonType(startDate);

  // Check if all required fields are filled
  const isFormValid = formValues.guestName && 
                     formValues.guestEmail && 
                     formValues.guestPhone && 
                     formValues.numGuests > 0 &&
                     !Object.keys(errors).length;

  return (
    <div>
      <h2 className="text-xl md:text-2xl font-semibold text-sky-800 mb-6">予約情報の入力</h2>
      
      {/* フォームのonSubmitを削除し、Enterキー送信を無効化 */}
      <form onKeyDown={handleKeyDown} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-gray-700 font-medium mb-2 text-sm md:text-base">お名前</label>
            <div className="relative">
              <input 
                type="text"
                className={`w-full p-3 pl-10 border rounded-lg focus:ring focus:ring-sky-200 focus:border-sky-500 text-sm md:text-base ${
                  errors.guestName ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="例：山田 太郎"
                {...register('guestName', { required: 'お名前を入力してください' })}
              />
              <User className="absolute left-3 top-3 text-gray-400" size={18} />
            </div>
            {errors.guestName && (
              <p className="mt-1 text-red-500 text-sm">{errors.guestName.message}</p>
            )}
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2 text-sm md:text-base">携帯番号</label>
            <div className="relative">
              <input 
                type="tel"
                className={`w-full p-3 pl-10 border rounded-lg focus:ring focus:ring-sky-200 focus:border-sky-500 text-sm md:text-base ${
                  errors.guestPhone ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="例：08012345678"
                {...register('guestPhone', { 
                  required: '携帯番号を入力してください',
                  pattern: {
                    value: /^0[0-9]{9,10}$/,
                    message: 'ハイフンなしで正しい電話番号を入力してください'
                  },
                  validate: {
                    startWithZero: (value) => value.startsWith('0') || '電話番号は0から始まる必要があります',
                    numbersOnly: (value) => /^[0-9]+$/.test(value) || 'ハイフンなしで数字のみを入力してください',
                    length: (value) => (value.length === 10 || value.length === 11) || '電話番号は10桁または11桁で入力してください'
                  }
                })}
              />
              <Phone className="absolute left-3 top-3 text-gray-400" size={18} />
            </div>
            {errors.guestPhone && (
              <p className="mt-1 text-red-500 text-sm">{errors.guestPhone.message}</p>
            )}
          </div>
          
          <div>
            <label className="block text-gray-700 font-medium mb-2 text-sm md:text-base">メールアドレス</label>
            <div className="relative">
              <input 
                type="email"
                className={`w-full p-3 pl-10 border rounded-lg focus:ring focus:ring-sky-200 focus:border-sky-500 text-sm md:text-base ${
                  errors.guestEmail ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="例：example@email.com"
                {...register('guestEmail', { 
                  required: 'メールアドレスを入力してください',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: '有効なメールアドレスを入力してください'
                  }
                })}
              />
              <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
            </div>
            {errors.guestEmail && (
              <p className="mt-1 text-red-500 text-sm">{errors.guestEmail.message}</p>
            )}
          </div>
        </div>
        
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-base md:text-lg font-medium text-gray-800 mb-4">ご利用人数</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 font-medium mb-2 text-sm md:text-base">大人（中学生以上）</label>
              <div className="relative">
                <input
                  type="number"
                  min="1"
                  max="20"
                  className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring focus:ring-sky-200 focus:border-sky-500 text-sm md:text-base"
                  {...register('numGuests', { 
                    required: true,
                    min: 1,
                    max: 20
                  })}
                />
                <Users className="absolute left-3 top-3 text-gray-400" size={18} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-gray-700 font-medium mb-2 text-sm md:text-base">未就園児（0〜2歳）</label>
                <input
                  type="number"
                  min="0"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring focus:ring-sky-200 focus:border-sky-500 text-sm md:text-base"
                  {...register('childrenInfant', { min: 0 })}
                />
              </div>
              
              <div>
                <label className="block text-gray-700 font-medium mb-2 text-sm md:text-base">未就学児（3〜5歳）</label>
                <input
                  type="number"
                  min="0"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring focus:ring-sky-200 focus:border-sky-500 text-sm md:text-base"
                  {...register('childrenPreschool', { min: 0 })}
                />
              </div>
              
              <div>
                <label className="block text-gray-700 font-medium mb-2 text-sm md:text-base">小学生（6〜12歳）</label>
                <input
                  type="number"
                  min="0"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring focus:ring-sky-200 focus:border-sky-500 text-sm md:text-base"
                  {...register('childrenElementary', { min: 0 })}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-base md:text-lg font-medium text-gray-800 mb-4">ペット同伴</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-gray-700 font-medium mb-2 text-sm md:text-base">小型犬（屋外のみ）</label>
              <input
                type="number"
                min="0"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring focus:ring-sky-200 focus:border-sky-500 text-sm md:text-base"
                {...register('petSmallOutdoor', { min: 0 })}
              />
            </div>
            
            <div>
              <label className="block text-gray-700 font-medium mb-2 text-sm md:text-base">小型犬（室内利用）</label>
              <input
                type="number"
                min="0"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring focus:ring-sky-200 focus:border-sky-500 text-sm md:text-base"
                {...register('petSmallIndoor', { min: 0 })}
              />
            </div>
            
            <div>
              <label className="block text-gray-700 font-medium mb-2 text-sm md:text-base">大型犬（屋外のみ）</label>
              <input
                type="number"
                min="0"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring focus:ring-sky-200 focus:border-sky-500 text-sm md:text-base"
                {...register('petLarge', { min: 0 })}
              />
            </div>
          </div>
        </div>
        
        <div>
          <label className="block text-gray-700 font-medium mb-2 text-sm md:text-base">特別なご要望</label>
          <div className="relative">
            <textarea
              className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring focus:ring-sky-200 focus:border-sky-500 h-32 text-sm md:text-base"
              placeholder="アレルギーや到着予定時刻など、ご要望がございましたらご記入ください"
              {...register('notes')}
            ></textarea>
            <Pencil className="absolute left-3 top-3 text-gray-400" size={18} />
          </div>
        </div>

        {/* 料金概算 */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <div className="flex items-center mb-4">
            <Calculator className="text-sky-600 mr-2" size={20} />
            <h3 className="text-base md:text-lg font-medium text-gray-800">料金内訳（概算）</h3>
          </div>
          
          <div className="space-y-2 text-gray-700">
            <div className="flex items-center text-sky-800 mb-3">
              <Calendar size={16} className="mr-2" />
              <p className="text-sm md:text-base">{format(startDate, 'yyyy年M月d日')}（{SEASON_LABELS[seasonType]}）</p>
            </div>
            
            <p className="font-medium text-sm md:text-base">
              {PLAN_DETAILS[planType].name}（{PLAN_DETAILS[planType].time}）
            </p>

            <div className="mt-4 space-y-2">
              {/* 大人料金 */}
              <p className="text-sm md:text-base leading-relaxed">
                {formValues.numGuests <= 5 ? (
                  `基本料金（5名まで）：${prices.adultFee.toLocaleString()}円`
                ) : (
                  `大人${formValues.numGuests}名 × ${PLAN_DETAILS[planType].prices[seasonType].perPerson.toLocaleString()}円 = ${prices.adultFee.toLocaleString()}円`
                )}
              </p>

              {/* 子ども料金 */}
              {formValues.childrenPreschool > 0 && (
                <p className="text-sm md:text-base leading-relaxed">未就学児 {formValues.childrenPreschool}名 × {CHILD_PRICING[1].price[isLongDay ? 'long' : 'short'].toLocaleString()}円 = {prices.childFees.preschool.toLocaleString()}円</p>
              )}
              {formValues.childrenElementary > 0 && (
                <p className="text-sm md:text-base leading-relaxed">小学生 {formValues.childrenElementary}名 × {CHILD_PRICING[2].price[isLongDay ? 'long' : 'short'].toLocaleString()}円 = {prices.childFees.elementary.toLocaleString()}円</p>
              )}

              {/* ペット料金 */}
              {formValues.petSmallOutdoor > 0 && (
                <p className="text-sm md:text-base leading-relaxed">小型犬（屋外） {formValues.petSmallOutdoor}頭 × {PET_PRICING.small.outdoor.toLocaleString()}円 = {prices.petFees.smallOutdoor.toLocaleString()}円</p>
              )}
              {formValues.petSmallIndoor > 0 && (
                <p className="text-sm md:text-base leading-relaxed">小型犬（室内） {formValues.petSmallIndoor}頭 × {PET_PRICING.small.indoor.toLocaleString()}円 = {prices.petFees.smallIndoor.toLocaleString()}円</p>
              )}
              {formValues.petLarge > 0 && (
                <p className="text-sm md:text-base leading-relaxed">大型犬（屋外） {formValues.petLarge}頭 × {PET_PRICING.large.outdoor.toLocaleString()}円 = {prices.petFees.large.toLocaleString()}円</p>
              )}

              <p className="text-sm md:text-base leading-relaxed">設備費：{prices.facilityFee.toLocaleString()}円</p>
            </div>

            <div className="border-t border-gray-200 mt-4 pt-4">
              <div className="flex items-center justify-between">
                <p className="text-base md:text-xl font-medium flex items-center">
                  <DollarSign size={20} className="mr-1 text-sky-600" />
                  合計<br className="sm:hidden" />（税込・現地決済）
                </p>
                <p className="text-lg md:text-xl font-bold text-sky-800">
                  {prices.total.toLocaleString()}円
                </p>
              </div>
              <p className="text-sm text-gray-500 mt-2 leading-relaxed">
                ※表示価格は概算です。<br className="sm:hidden" />実際の料金は現地でご確認ください。
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex justify-between pt-4">
          <Button
            onClick={onBack}
            variant="outline"
            showArrow={false}
          >
            <ChevronLeft size={18} className="mr-1" />
            戻る
          </Button>
          
          <Button
            onClick={handleConfirmClick}
            disabled={isLoading || !isFormValid}
          >
            {isLoading ? '送信中...' : '予約を確定する'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default BookingForm;