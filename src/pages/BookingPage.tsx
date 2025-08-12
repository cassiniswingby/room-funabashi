import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { utcToZonedTime, format as formatTZ } from 'date-fns-tz';
import BookingCalendar from '../components/booking/BookingCalendar';
import BookingForm from '../components/booking/BookingForm';
import BookingConfirmation from '../components/booking/BookingConfirmation';
import { useReservations } from '../hooks/useReservations';
import type { ReservationPlan } from '../types/supabase';

// Import background image
import bgImg3 from '../assets/bg-image3.png';

type BookingStep = 'calendar' | 'form' | 'confirmation';

type BookingData = {
  reservationDate: Date | null;
  planType: ReservationPlan | null;
  customStartTime?: string | null;
  customEndTime?: string | null;
  guestName: string;
  guestPhone: string;
  guestEmail: string;
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
  reservationCode?: string;
};

const initialBookingData: BookingData = {
  reservationDate: null,
  planType: null,
  customStartTime: null,
  customEndTime: null,
  guestName: '',
  guestPhone: '',
  guestEmail: '',
  numGuests: 2,
  childrenInfant: 0,
  childrenPreschool: 0,
  childrenElementary: 0,
  petSmallOutdoor: 0,
  petSmallIndoor: 0,
  petLarge: 0,
  notes: '',
  totalPrice: undefined,
  reservationCode: undefined,
};

const BookingPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<BookingStep>('calendar');
  const [bookingData, setBookingData] = useState<BookingData>(initialBookingData);
  const [reservationId, setReservationId] = useState<string | null>(null);
  const [bookingError, setBookingError] = useState<string | null>(null);
  
  const { isDateBooked, createReservation, loading, getSeasonType } = useReservations();

  useEffect(() => {
    document.title = 'room船橋｜予約';
  }, []);

  // ステップ変更時にスクロールをトップに戻す
  useEffect(() => {
    const scrollToTop = () => {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      
      requestAnimationFrame(() => {
        window.scrollTo(0, 0);
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
      });
      
      setTimeout(() => {
        window.scrollTo(0, 0);
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
      }, 0);
      
      setTimeout(() => {
        window.scrollTo(0, 0);
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
      }, 100);
    };

    scrollToTop();
  }, [currentStep]);

  const handleDateAndPlanSelection = (date: Date, plan: ReservationPlan, customTimes?: { start: string; end: string }) => {
    setBookingData(prev => ({
      ...prev,
      reservationDate: date,
      planType: plan,
      customStartTime: customTimes?.start || null,
      customEndTime: customTimes?.end || null
    }));
    setBookingError(null);
    setCurrentStep('form');
  };

  const handleFormSubmit = async (formData: Omit<BookingData, 'reservationDate' | 'planType' | 'customStartTime' | 'customEndTime'>) => {
    if (!bookingData.reservationDate || !bookingData.planType) {
      setBookingError('予約日とプランを選択してください');
      return;
    }
    
    // 合計金額を計算
    const totalPrice = calculateTotalPrice(
      bookingData.reservationDate,
      bookingData.planType,
      formData.numGuests,
      formData.childrenInfant,
      formData.childrenPreschool,
      formData.childrenElementary,
      formData.petSmallOutdoor,
      formData.petSmallIndoor,
      formData.petLarge,
      getSeasonType
    );
    
    const updatedBookingData = {
      ...bookingData,
      ...formData,
      totalPrice: totalPrice,
    };
    
    setBookingData(updatedBookingData);
    setBookingError(null);

    // Convert the date to Asia/Tokyo timezone and format it consistently
    const tokyoDate = utcToZonedTime(bookingData.reservationDate, 'Asia/Tokyo');
    const formattedDate = formatTZ(tokyoDate, 'yyyy-MM-dd', { timeZone: 'Asia/Tokyo' });
    
    const { success, data, error } = await createReservation({
      reservation_date: formattedDate,
      plan_type: bookingData.planType,
      custom_start_time: bookingData.customStartTime || null,
      custom_end_time: bookingData.customEndTime || null,
      guest_name: formData.guestName,
      guest_phone: formData.guestPhone || '', // Ensure guest_phone is never null
      guest_email: formData.guestEmail,
      num_guests: formData.numGuests,
      num_adults: formData.numGuests,
      num_infants: formData.childrenInfant,
      num_preschoolers: formData.childrenPreschool,
      num_children: formData.childrenElementary,
      num_dogs_small_outdoor: formData.petSmallOutdoor,
      num_dogs_small_indoor: formData.petSmallIndoor,
      num_dogs_large_outdoor: formData.petLarge,
      status: 'reserved' as const,
      notes: formData.notes || null,
      total_price: totalPrice,
    });
    
    if (success && data) {
      setReservationId(data.id);
      
      // Update booking data with reservation code
      const updatedBookingDataWithCode = {
        ...updatedBookingData,
        reservationCode: data.reservation_code
      };
      setBookingData(updatedBookingDataWithCode);
      
      // Send confirmation emails
      const emailData = {
        reservationId: data.id,
        guestName: formData.guestName,
        guestEmail: formData.guestEmail,
        guestPhone: formData.guestPhone,
        reservationDate: bookingData.reservationDate,
        seasonType: getSeasonType(bookingData.reservationDate),
        planType: bookingData.planType,
        customStartTime: bookingData.customStartTime || undefined,
        customEndTime: bookingData.customEndTime || undefined,
        numGuests: formData.numGuests,
        childrenInfant: formData.childrenInfant,
        childrenPreschool: formData.childrenPreschool,
        childrenElementary: formData.childrenElementary,
        petSmallOutdoor: formData.petSmallOutdoor,
        petSmallIndoor: formData.petSmallIndoor,
        petLarge: formData.petLarge,
        notes: formData.notes,
        totalPrice: totalPrice,
        reservationCode: data.reservation_code,
      };
      
      // Send emails (don't block the UI if email fails)
      await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-reservation-email`, {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailData),
      })
        .then((res) => res.json())
        .then((result) => {
          console.log('[debug] email send result:', result);
          if (!result.success && !result.skipped) {
            console.error('Failed to send confirmation emails:', result.error);
          } else if (result.skipped) {
            console.info('Email sending skipped - service not configured');
          }
        })
        .catch((error) => {
          console.error('Failed to send confirmation emails:', error);
        });
      
      setCurrentStep('confirmation');
    } else if (error) {
      setBookingError(error instanceof Error ? error.message : '予約の作成に失敗しました。');
    }
  };

  // 合計金額計算関数
  const calculateTotalPrice = (
    reservationDate: Date,
    planType: ReservationPlan,
    numGuests: number,
    childrenInfant: number,
    childrenPreschool: number,
    childrenElementary: number,
    petSmallOutdoor: number,
    petSmallIndoor: number,
    petLarge: number,
    getSeasonType: (date: Date) => SeasonType
  ): number => {
    const seasonType = getSeasonType(reservationDate);
    
    const FACILITY_FEE = 2000;
    const PET_PRICING = {
      small: { outdoor: 550, indoor: 1100 },
      large: { outdoor: 1100 }
    };
    
    const PLAN_DETAILS = {
      day: {
        prices: {
          regular: { base: 11000, perPerson: 2200 },
          high: { base: 12500, perPerson: 2500 },
          special: { base: 16500, perPerson: 3300 }
        }
      },
      night: {
        prices: {
          regular: { base: 11000, perPerson: 2200 },
          high: { base: 12500, perPerson: 2500 },
          special: { base: 16500, perPerson: 3300 }
        }
      },
      oneday: {
        prices: {
          regular: { base: 22000, perPerson: 4400 },
          high: { base: 22500, perPerson: 4500 },
          special: { base: 26500, perPerson: 5300 }
        }
      },
      allnight: {
        prices: {
          regular: { base: 18000, perPerson: 3600 },
          high: { base: 19500, perPerson: 3900 },
          special: { base: 23500, perPerson: 4700 }
        }
      },
      oneday_allnight: {
        prices: {
          regular: { base: 29000, perPerson: 5800 },
          high: { base: 29500, perPerson: 5900 },
          special: { base: 33500, perPerson: 6700 }
        }
      },
      custom: {
        prices: {
          regular: { base: 0, perPerson: 0 },
          high: { base: 0, perPerson: 0 },
          special: { base: 0, perPerson: 0 }
        }
      }
    };
    
    const CHILD_PRICING = [
      { price: { short: 0, long: 0 } },      // 未就園児
      { price: { short: 330, long: 660 } },  // 未就学児
      { price: { short: 550, long: 1100 } }  // 小学生
    ];
    
    // カスタムプランの場合は0を返す（管理者が別途設定）
    if (planType === 'custom') {
      return 0;
    }
    
    const planPrices = PLAN_DETAILS[planType].prices[seasonType];
    const isLongDay = ['oneday', 'allnight', 'oneday_allnight'].includes(planType);
    
    // 大人料金
    const adultFee = numGuests <= 5 
      ? planPrices.base 
      : planPrices.perPerson * numGuests;
    
    // 子ども料金
    const childRateType = isLongDay ? 'long' : 'short';
    const childFees = 
      childrenInfant * CHILD_PRICING[0].price[childRateType] +
      childrenPreschool * CHILD_PRICING[1].price[childRateType] +
      childrenElementary * CHILD_PRICING[2].price[childRateType];
    
    // ペット料金
    const petFees = 
      petSmallOutdoor * PET_PRICING.small.outdoor +
      petSmallIndoor * PET_PRICING.small.indoor +
      petLarge * PET_PRICING.large.outdoor;
    
    return adultFee + childFees + petFees + FACILITY_FEE;
  };
  const handleReset = () => {
    setBookingData(initialBookingData);
    setCurrentStep('calendar');
    setReservationId(null);
    setBookingError(null);
  };

  return (
    <div className="min-h-screen bg-sky-50">
      {/* ヘッダーセクション */}
      <section className="relative h-[50vh] flex items-center">
        <div 
          className="absolute inset-0 bg-cover bg-center" 
          style={{ 
            backgroundImage: `url(${bgImg3})`,
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
            <h1 className="text-2xl md:text-3xl font-bold mb-6">ご予約</h1>
            <p className="text-base md:text-xl text-sky-100 max-w-lg md:max-w-3xl mx-auto leading-relaxed px-4">
              ご利用日とプランを選択し、<br className="sm:hidden" />必要事項をご入力ください
            </p>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-4 md:px-2 py-10">
        <div className="flex justify-center mb-12">
          <div className="flex items-center">
            {[
              { id: 'calendar', label: '日程・プラン選択' },
              { id: 'form', label: '予約情報入力' },
              { id: 'confirmation', label: '予約完了' }
            ].map((step, index) => (
              <React.Fragment key={step.id}>
                <div className="flex flex-col items-center">
                  <div
                    className={`rounded-full h-8 w-8 md:h-10 md:w-10 flex items-center justify-center text-sm md:text-base ${
                      currentStep === step.id
                        ? 'bg-sky-600 text-white'
                        : step.id === 'form' && currentStep === 'confirmation'
                        ? 'bg-sky-600 text-white'
                        : step.id === 'calendar' && (currentStep === 'form' || currentStep === 'confirmation')
                        ? 'bg-sky-600 text-white'
                        : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {index + 1}
                  </div>
                  <span
                    className={`mt-2 text-xs md:text-sm text-center max-w-20 md:max-w-none ${
                      currentStep === step.id ? 'text-sky-600 font-medium' : 'text-gray-500'
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
                {index < 2 && (
                  <div
                    className={`w-8 md:w-12 h-1 mx-1 md:mx-2 ${
                      (index === 0 && (currentStep === 'form' || currentStep === 'confirmation')) ||
                      (index === 1 && currentStep === 'confirmation')
                        ? 'bg-sky-600'
                        : 'bg-gray-200'
                    }`}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6 md:p-8"
        >
          {bookingError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-600 text-sm md:text-base leading-relaxed">{bookingError}</p>
            </div>
          )}

          {currentStep === 'calendar' && (
            <BookingCalendar
              onDateAndPlanSelection={handleDateAndPlanSelection}
            />
          )}

          {currentStep === 'form' && bookingData.reservationDate && bookingData.planType && (
            <BookingForm
              startDate={bookingData.reservationDate}
              planType={bookingData.planType}
              customTimes={
                bookingData.customStartTime && bookingData.customEndTime
                  ? { start: bookingData.customStartTime, end: bookingData.customEndTime }
                  : undefined
              }
              onSubmit={handleFormSubmit}
              onBack={() => setCurrentStep('calendar')}
              isLoading={loading}
            />
          )}

          {currentStep === 'confirmation' && reservationId && (
            <BookingConfirmation 
              bookingData={{
                ...bookingData,
                phoneNumber: bookingData.guestPhone,
                totalPrice: bookingData.totalPrice,
                reservationCode: bookingData.reservationCode
              }}
              reservationId={reservationId}
              onBookAgain={handleReset}
            />
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default BookingPage;