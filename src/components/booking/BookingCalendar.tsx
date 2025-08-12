import React, { useState, useMemo, useRef } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  Clock,
} from 'lucide-react';
import {
  format,
  addMonths,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  startOfDay,
} from 'date-fns';
import { utcToZonedTime, format as formatTZ } from 'date-fns-tz';
import ja from 'date-fns/locale/ja';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import type { ReservationPlan, SeasonType } from '../../types/supabase';
import {
  useReservations,
  getSeasonType,
  ALL_PLANS,
  PLAN_TIMES,
  doTimesOverlap,
} from '../../hooks/useReservations';
import Button from '../Button';

interface BookingCalendarProps {
  onDateAndPlanSelection: (
    date: Date,
    plan: ReservationPlan,
    customTimes?: { start: string; end: string }
  ) => void;
}

const PLAN_DETAILS: Record<
  ReservationPlan,
  { name: string; time: string; description: string }
> = {
  day: {
    name: 'デイプラン',
    time: '10:00 - 16:00',
    description: '日中のBBQやパーティーに最適なプラン',
  },
  night: {
    name: 'ナイトプラン',
    time: '17:00 - 24:00',
    description: '夜のBBQや宴会に最適なプラン',
  },
  oneday: {
    name: 'ワンデイプラン',
    time: '10:00 - 24:00',
    description: '朝から夜まで思う存分楽しめるプラン',
  },
  allnight: {
    name: 'オールナイトプラン',
    time: '17:00 - 翌9:00',
    description: '夜通し利用できるプラン',
  },
  oneday_allnight: {
    name: 'ワンデイオールナイトプラン',
    time: '10:00 - 翌9:00',
    description: '朝から翌朝まで贅沢に過ごせるプラン',
  },
  custom: {
    name: 'イベントプラン',
    time: 'カスタム',
    description: '特別なイベントや団体利用向けのプラン',
  },
};

const SEASON_LABELS: Record<SeasonType, string> = {
  regular: 'レギュラーシーズン',
  high: 'ハイシーズン',
  special: 'スペシャルシーズン',
};

type AvailabilityStatus =
  | 'available'
  | 'partial'
  | 'unavailable'
  | 'out-of-range'
  | 'loading'
  | undefined;

const BookingCalendar: React.FC<BookingCalendarProps> = ({
  onDateAndPlanSelection,
}) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<ReservationPlan | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [availablePlans, setAvailablePlans] = useState<ReservationPlan[]>([]);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const swiperRef = useRef<any>(null);

  const {
    reservations,
    blockedDates,
    loading,
    getAvailablePlans,
  } = useReservations();

  const today = utcToZonedTime(new Date(), 'Asia/Tokyo');
  const minDate = startOfDay(today);
  const maxDate = startOfDay(addMonths(minDate, 3));

  const months = useMemo(() => {
    const currentMonth = startOfMonth(today);
    return [
      [currentMonth, addMonths(currentMonth, 1)],
      [addMonths(currentMonth, 2), addMonths(currentMonth, 3)],
    ];
  }, [today]);

  const availability = useMemo(() => {
    if (loading) {
      // When loading, mark all dates in range as loading
      const loadingMap = new Map<string, AvailabilityStatus>();
      const currentMonth = startOfMonth(today);
      const endOfRange = addMonths(currentMonth, 3);
      
      const allDaysInRange = eachDayOfInterval({
        start: minDate,
        end: maxDate,
      });
      
      allDaysInRange.forEach((day) => {
        const dateStr = formatTZ(day, 'yyyy-MM-dd', {
          timeZone: 'Asia/Tokyo',
        });
        loadingMap.set(dateStr, 'loading');
      });
      
      return loadingMap;
    }

    const availabilityMap = new Map<string, AvailabilityStatus>();
    const dateSet = new Set<string>();

    reservations.forEach((r) => {
      if (r.status !== 'cancelled') {
        const resDate = utcToZonedTime(
          new Date(r.reservation_date),
          'Asia/Tokyo'
        );
        if (
          startOfDay(resDate) >= minDate &&
          startOfDay(resDate) <= maxDate
        ) {
          const dateStr = formatTZ(resDate, 'yyyy-MM-dd', {
            timeZone: 'Asia/Tokyo',
          });
          dateSet.add(dateStr);
        }
      }
    });

    blockedDates.forEach((b) => {
      const blockDate = utcToZonedTime(new Date(b.date), 'Asia/Tokyo');
      if (
        startOfDay(blockDate) >= minDate &&
        startOfDay(blockDate) <= maxDate
      ) {
        const dateStr = formatTZ(blockDate, 'yyyy-MM-dd', {
          timeZone: 'Asia/Tokyo',
        });
        dateSet.add(dateStr);
      }
    });

    const datesToCheck = [...dateSet].sort();

    const processed = new Set<string>();

    for (const dateStr of datesToCheck) {
      if (processed.has(dateStr)) {
        continue;
      }
      processed.add(dateStr);

      const hasFullDayBlock = blockedDates.some((block) => {
        const blockDateStr = formatTZ(
          utcToZonedTime(new Date(block.date), 'Asia/Tokyo'),
          'yyyy-MM-dd',
          { timeZone: 'Asia/Tokyo' }
        );
        return (
          blockDateStr === dateStr &&
          block.start_time == null &&
          block.end_time == null
        );
      });

      if (hasFullDayBlock) {
        availabilityMap.set(dateStr, 'unavailable');
        continue;
      }

      const reservationsOnDate = reservations.filter(
        (r) =>
          r.reservation_date === dateStr &&
          r.status !== 'cancelled'
      );

      const blocksOnDate = blockedDates.filter((b) => {
        const blockDateStr = formatTZ(
          utcToZonedTime(new Date(b.date), 'Asia/Tokyo'),
          'yyyy-MM-dd',
          { timeZone: 'Asia/Tokyo' }
        );
        return blockDateStr === dateStr;
      });

      const timeBlocks = blocksOnDate.filter(
        (b) => b.start_time && b.end_time
      );

      const availablePlansOnDate = ALL_PLANS.filter((plan) => {
        const planTimes = PLAN_TIMES[plan];

        const overlapsReservation = reservationsOnDate.some((r) => {
          const reservedTimes =
            r.plan_type === 'custom'
              ? {
                  start: r.custom_start_time!,
                  end: r.custom_end_time!,
                }
              : PLAN_TIMES[r.plan_type];

          return doTimesOverlap(
            planTimes.start,
            planTimes.end,
            reservedTimes.start,
            reservedTimes.end
          );
        });

        const overlapsBlock = timeBlocks.some((b) =>
          doTimesOverlap(
            planTimes.start,
            planTimes.end,
            b.start_time!,
            b.end_time!
          )
        );

        return !(overlapsReservation || overlapsBlock);
      });

      if (availablePlansOnDate.length === 0) {
        availabilityMap.set(dateStr, 'unavailable');
      } else if (availablePlansOnDate.length < ALL_PLANS.length) {
        availabilityMap.set(dateStr, 'partial');
      } else {
        availabilityMap.set(dateStr, 'available');
      }
    }

    return availabilityMap;
  }, [reservations, blockedDates, minDate, maxDate, loading]);

  React.useEffect(() => {
    if (!selectedDate) {
      setAvailablePlans([]);
      return;
    }

    const loadPlans = async () => {
      const dateStr = formatTZ(selectedDate, 'yyyy-MM-dd', {
        timeZone: 'Asia/Tokyo',
      });
      const plans = await getAvailablePlans(dateStr);
      setAvailablePlans(plans);
    };

    loadPlans();
  }, [selectedDate, getAvailablePlans]);

  const handleDateClick = (date: Date) => {
    if (
      startOfDay(date) < startOfDay(minDate) ||
      startOfDay(date) > startOfDay(maxDate)
    ) {
      return;
    }
    setSelectedDate(date);
    setSelectedPlan(null);
    setError(null);
  };

  const handlePlanSelection = (plan: ReservationPlan) => {
    if (!selectedDate || !availablePlans.includes(plan)) return;
    setSelectedPlan(plan);
    setError(null);
  };

  const handleSubmit = () => {
    if (!selectedDate) {
      setError('日付を選択してください');
      return;
    }
    if (!selectedPlan) {
      setError('プランを選択してください');
      return;
    }
    onDateAndPlanSelection(selectedDate, selectedPlan);
  };

  const getAvailabilityIcon = (status: AvailabilityStatus) => {
    switch (status) {
      case 'available':
        return '○';
      case 'partial':
        return '△';
      case 'unavailable':
        return '×';
      case 'out-of-range':
        return '-';
      case 'loading':
        return '...';
      case undefined:
        return '○';
      default:
        return '';
    }
  };

  const getAvailabilityColor = (status: AvailabilityStatus) => {
    switch (status) {
      case 'available':
        return 'text-green-600';
      case 'partial':
        return 'text-yellow-600';
      case 'unavailable':
        return 'text-red-600';
      case 'out-of-range':
        return 'text-black';
      case 'loading':
        return 'text-gray-400';
      case undefined:
        return 'text-green-600';
      default:
        return 'text-gray-400';
    }
  };

  const isAtStart = currentSlideIndex === 0;
  const isAtEnd = currentSlideIndex >= months.length - 1;

  const orderedPlanTypes = useMemo(
    () =>
      Object.keys(PLAN_DETAILS).filter(
        (key) => key !== 'custom'
      ) as ReservationPlan[],
    []
  );

  const seasonType = useMemo(
    () => (selectedDate ? getSeasonType(selectedDate) : null),
    [selectedDate]
  );

  const isFormValid =
    selectedDate &&
    selectedPlan &&
    availablePlans.includes(selectedPlan);

  const renderCalendarMonth = (month: Date) => {
    const monthDays = eachDayOfInterval({
      start: startOfMonth(month),
      end: endOfMonth(month),
    });

    return (
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="bg-sky-50 p-4 text-center">
          <h3 className="text-lg font-medium text-sky-800">
            {format(month, 'yyyy年M月', { locale: ja })}
          </h3>
        </div>

        <div className="grid grid-cols-7 bg-gray-50">
          {['日', '月', '火', '水', '木', '金', '土'].map((day, index) => (
            <div
              key={day}
              className={`p-2 text-center text-xs md:text-sm font-medium ${
                index === 0
                  ? 'text-red-600'
                  : index === 6
                  ? 'text-blue-600'
                  : 'text-gray-700'
              }`}
            >
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7">
          {Array.from({ length: startOfMonth(month).getDay() }).map(
            (_, index) => (
              <div
                key={`empty-${index}`}
                className="p-2 h-12 md:h-16 border-b border-r border-gray-100"
              ></div>
            )
          )}

          {monthDays.map((day) => {
            const dateStr = formatTZ(day, 'yyyy-MM-dd', {
              timeZone: 'Asia/Tokyo',
            });
          
            let status: AvailabilityStatus;
            if (
              startOfDay(day) < startOfDay(minDate) ||
              startOfDay(day) > startOfDay(maxDate)
            ) {
              status = 'out-of-range';
            } else {
              status = availability.get(dateStr) ?? 'available';
            }
          
            const isSelected =
              selectedDate && isSameDay(day, selectedDate);
            const isClickable =
              (status === 'available' || status === 'partial') && !loading;
          
            return (
              <div
                key={dateStr}
                onClick={() => isClickable && handleDateClick(day)}
                className={`p-1 md:p-2 h-12 md:h-16 border-b border-r border-gray-100 flex flex-col items-center justify-center text-xs md:text-sm transition-colors ${
                  status === 'out-of-range'
                    ? 'text-gray-700 cursor-not-allowed bg-gray-50'
                    : status === 'loading'
                    ? 'text-gray-400 cursor-not-allowed bg-gray-50'
                    : isClickable
                    ? 'cursor-pointer hover:bg-sky-50'
                    : 'cursor-not-allowed'
                } ${isSelected ? 'bg-sky-100 border border-sky-300' : ''}`}
              >
                <span
                  className={`font-medium ${
                    status === 'out-of-range'
                      ? 'text-gray-700'
                      : status === 'loading'
                      ? 'text-gray-400'
                      : day.getDay() === 0
                      ? 'text-red-600'
                      : day.getDay() === 6
                      ? 'text-blue-600'
                      : 'text-gray-800'
                  }`}
                >
                  {status === 'out-of-range' || status === 'loading'
                    ? format(day, 'd')
                    : format(day, 'd')}
                </span>
                <span
                  className={`text-xs mt-1 ${getAvailabilityColor(
                    status
                  )}`}
                >
                  {getAvailabilityIcon(status)}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="relative">
      <h2 className="text-xl md:text-2xl font-semibold text-sky-800 mb-6">
        ご利用日とプランを選択
      </h2>

      <div className="mb-8 relative z-50">
        <h3 className="text-base md:text-lg font-medium text-gray-800 mb-4">
          ご利用日
        </h3>
        <p className="text-sm text-gray-500 mb-4 text-center">
          予約は本日から3か月先まで可能です。
        </p>

        <div className="flex items-center justify-center mb-6">
          <button
            onClick={() => {
              if (!isAtStart && swiperRef.current) {
                swiperRef.current.slidePrev();
              }
            }}
            disabled={isAtStart}
            className={`flex items-center space-x-2 p-2 rounded-lg transition-all ${
              isAtStart
                ? 'text-gray-300 cursor-not-allowed'
                : 'text-gray-700 hover:bg-sky-50 hover:text-sky-700'
            }`}
            aria-label="前の月へ移動"
          >
            <ChevronLeft size={20} />
            <span className="text-sm md:text-base">前の月</span>
          </button>

          <div className="mx-8 flex-1 text-center"></div>

          <button
            onClick={() => {
              if (!isAtEnd && swiperRef.current) {
                swiperRef.current.slideNext();
              }
            }}
            disabled={isAtEnd}
            className={`flex items-center space-x-2 p-2 rounded-lg transition-all ${
              isAtEnd
                ? 'text-gray-300 cursor-not-allowed'
                : 'text-gray-700 hover:bg-sky-50 hover:text-sky-700'
            }`}
            aria-label="次の月へ移動"
          >
            <span className="text-sm md:text-base">次の月</span>
            <ChevronRight size={20} />
          </button>
        </div>

        <div className="calendar-swiper">
          <Swiper
            modules={[Navigation, Pagination]}
            spaceBetween={20}
            slidesPerView={1}
            onSwiper={(swiper) => {
              swiperRef.current = swiper;
            }}
            onSlideChange={(swiper) => {
              setCurrentSlideIndex(swiper.activeIndex);
            }}
          >
            {months.map((pair, i) => (
              <SwiperSlide key={i}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {pair.map((month) => renderCalendarMonth(month))}
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        <div className="mt-6 flex justify-center flex-wrap gap-x-6 gap-y-2 text-sm">
          <span className="flex items-center space-x-1">
            <span className="text-green-600 font-medium">○</span>
            <span className="text-gray-600">空きあり</span>
          </span>
          <span className="flex items-center space-x-1">
            <span className="text-yellow-600 font-medium">△</span>
            <span className="text-gray-600">一部予約あり</span>
          </span>
          <span className="flex items-center space-x-1">
            <span className="text-red-600 font-medium">×</span>
            <span className="text-gray-600">予約不可</span>
          </span>
          <span className="flex items-center space-x-1">
            <span className="text-gray-700 font-medium">-</span>
            <span className="text-gray-600">予約対象範囲外</span>
          </span>
        </div>

        {selectedDate && seasonType && (
          <div className="mt-4 p-3 bg-sky-50 rounded-md border border-sky-100">
            <p className="text-sky-700 font-medium text-sm md:text-base">
              選択日：
              {format(selectedDate, 'yyyy年M月d日', { locale: ja })}
              （{SEASON_LABELS[seasonType]}）
            </p>
            <Link
              to="/pricing"
              className="text-sm text-sky-600 hover:underline mt-1 block"
            >
              シーズン区分の詳細を見る
            </Link>
          </div>
        )}
      </div>

      <div className="mb-8 relative z-10">
        <h3 className="text-base md:text-lg font-medium text-gray-800 mb-4">
          利用プラン
        </h3>
        {loading ? (
          <div className="bg-gray-50 p-6 rounded-lg text-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-sky-600 mx-auto mb-2"></div>
            <p className="text-gray-600 text-sm md:text-base">
              予約状況を確認中...
            </p>
          </div>
        ) : !selectedDate ? (
          <div className="bg-gray-50 p-6 rounded-lg text-center">
            <Calendar className="mx-auto mb-2 text-gray-400" size={24} />
            <p className="text-gray-600 text-sm md:text-base">
              ご利用日を選択してください
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {orderedPlanTypes.map((key) => {
              const plan = PLAN_DETAILS[key];
              const isAvailable = availablePlans.includes(key);
              return (
                <div
                  key={key}
                  className={`p-4 border rounded-lg transition-all ${
                    selectedPlan === key
                      ? 'border-sky-500 bg-sky-50'
                      : isAvailable
                      ? 'border-gray-200 hover:border-sky-300 cursor-pointer'
                      : 'border-gray-200 bg-gray-50 opacity-60 cursor-not-allowed'
                  }`}
                  onClick={() =>
                    isAvailable && handlePlanSelection(key)
                  }
                >
                  <div className="flex justify-between items-start">
                    <h4 className="font-medium text-sky-800 text-sm md:text-base">
                      {plan.name}
                    </h4>
                    {!isAvailable && (
                      <span className="text-sm font-bold text-red-700 bg-red-100 px-2 py-1 rounded">
                        予約不可
                      </span>
                    )}
                  </div>
                  <div className="flex items-center text-gray-600 mt-1">
                    <Clock size={16} className="mr-1" />
                    <span className="text-sm md:text-base">
                      {plan.time}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mt-2">
                    {plan.description}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 p-3 rounded-lg mb-6 relative z-10">
          <p className="text-sm md:text-base">{error}</p>
        </div>
      )}

      <div className="flex justify-end relative z-10">
        <Button
          onClick={handleSubmit}
          disabled={!isFormValid || loading}
          showArrow={true}
        >
          次へ進む
        </Button>
      </div>
    </div>
  );
};

export default BookingCalendar;
