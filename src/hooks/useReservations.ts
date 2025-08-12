import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { format } from 'date-fns';
import { utcToZonedTime, format as formatTZ } from 'date-fns-tz';
import Holidays from 'date-holidays';
import type { ReservationPlan, SeasonType } from '../types/supabase';

export type Reservation = Database['public']['Tables']['reservations']['Row'];
export type ReservationInsert = Database['public']['Tables']['reservations']['Insert'];
export type BlockedDate = Database['public']['Tables']['blocked_dates']['Row'];

export const PLAN_TIMES = {
  day: { start: '10:00', end: '16:00' },
  night: { start: '17:00', end: '24:00' },
  oneday: { start: '10:00', end: '24:00' },
  allnight: { start: '17:00', end: '33:00' }, // 翌朝 9時
  oneday_allnight: { start: '10:00', end: '33:00' },
};

export const ALL_PLANS: ReservationPlan[] = [
  'day',
  'night',
  'oneday',
  'allnight',
  'oneday_allnight',
];

const hd = new Holidays('JP');

const timeToMinutes = (time: string): number => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};

export const doTimesOverlap = (
  start1: string,
  end1: string,
  start2: string,
  end2: string
): boolean => {
  const start1Min = timeToMinutes(start1);
  const end1Min = timeToMinutes(end1);
  const start2Min = timeToMinutes(start2);
  const end2Min = timeToMinutes(end2);

  return start1Min < end2Min && end1Min > start2Min;
};

export const getSeasonType = (date: Date): SeasonType => {
  const jstDate = utcToZonedTime(date, 'Asia/Tokyo');
  const month = jstDate.getMonth() + 1;
  const day = jstDate.getDate();
  const dateStr = format(jstDate, 'yyyy-MM-dd');

  const isNewYear = (month === 12 && day >= 27) || (month === 1 && day <= 4);
  const isObon = month === 8 && day >= 9 && day <= 17;

  if (isNewYear || isObon) return 'special';

  const isWeekendOrHoliday =
    hd.isHoliday(dateStr) || [0, 6].includes(jstDate.getDay());
  const isSpringBreak =
    (month === 3 && day >= 18) || (month === 4 && day <= 6);
  const isSummerBreak =
    (month === 7 && day >= 19) || (month === 8 && day <= 31);
  const isWinterBreak = month === 12 && day >= 24 && day <= 26;

  if (isWeekendOrHoliday || isSpringBreak || isSummerBreak || isWinterBreak)
    return 'high';

  return 'regular';
};

export const useReservations = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [blockedDates, setBlockedDates] = useState<BlockedDate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);

        const { data: reservationData, error: reservationError } =
          await supabase
            .from('reservations')
            .select('*')
            .order('reservation_date', { ascending: true });

        if (reservationError) throw reservationError;

        const { data: blockedData, error: blockedError } = await supabase
          .from('blocked_dates')
          .select('*')
          .order('date', { ascending: true });

        if (blockedError) throw blockedError;

        setReservations(reservationData ?? []);
        setBlockedDates(blockedData ?? []);
      } catch (err) {
        console.error('[fetchAllData error]', err);
        setError(
          err instanceof Error
            ? err.message
            : '予期せぬエラーが発生しました'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();

    const reservationsSub = supabase
      .channel('reservations_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'reservations' },
        () => {
          console.log("[Supabase] reservations change event");
          fetchAllData();
        }
      )
      .subscribe();

    const blockedDatesSub = supabase
      .channel('blocked_dates_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'blocked_dates' },
        () => {
          console.log("[Supabase] blocked_dates change event");
          fetchAllData();
        }
      )
      .subscribe();

    return () => {
      reservationsSub.unsubscribe();
      blockedDatesSub.unsubscribe();
    };
  }, []);

  const hasReservationOrBlock = useCallback((dateStr: string): boolean => {
    const hasReservation = reservations.some(
      (res) =>
        res.reservation_date === dateStr && res.status === 'reserved'
    );

    const hasBlock = blockedDates.some(
      (block) =>
        formatTZ(
          utcToZonedTime(new Date(block.date), 'Asia/Tokyo'),
          'yyyy-MM-dd',
          { timeZone: 'Asia/Tokyo' }
        ) === dateStr
    );

    return hasReservation || hasBlock;
  }, [reservations, blockedDates]);

  const getAvailablePlans = useCallback(
    async (dateStr: string): Promise<ReservationPlan[]> => {
      if (!hasReservationOrBlock(dateStr)) {
        console.log(`${dateStr}: no reservations or blocks → all plans available`);
        return ALL_PLANS;
      }

      const reservationsOnDate = reservations.filter(
        (res) =>
          res.reservation_date === dateStr && res.status !== 'cancelled'
      );

      const blocksOnDate = blockedDates.filter(
        (block) =>
          formatTZ(
            utcToZonedTime(new Date(block.date), 'Asia/Tokyo'),
            'yyyy-MM-dd',
            { timeZone: 'Asia/Tokyo' }
          ) === dateStr
      );

      const timeBlocks = blocksOnDate.filter(
        (b) => b.start_time && b.end_time
      );

      const hasFullDayBlock = blocksOnDate.some(
        (b) => !b.start_time && !b.end_time
      );

      if (hasFullDayBlock) {
        console.log(`${dateStr}: full day blocked → no plans available`);
        return [];
      }

      const availablePlans = ALL_PLANS.filter((plan) => {
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

      console.log(`${dateStr}: available plans →`, availablePlans);
      return availablePlans;
    },
    [reservations, blockedDates, hasReservationOrBlock]
  );

  const createReservation = async (reservationData: ReservationInsert) => {
    try {
      const { data, error } = await supabase
        .from('reservations')
        .insert(reservationData)
        .select()
        .single();

      if (error) {
        console.error('[createReservation error]', error);
        return {
          success: false,
          data: null,
          error: error.message || '予約の作成に失敗しました'
        };
      }

      console.log('[createReservation success]', data);
      return {
        success: true,
        data,
        error: null
      };
    } catch (err) {
      console.error('[createReservation error]', err);
      return {
        success: false,
        data: null,
        error: err instanceof Error ? err.message : '予期せぬエラーが発生しました'
      };
    }
  };

  return {
    reservations,
    blockedDates,
    loading,
    error,
    hasReservationOrBlock,
    getAvailablePlans,
    getSeasonType,
    createReservation,
  };
};
