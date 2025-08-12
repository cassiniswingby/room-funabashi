export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type ReservationPlan = 'day' | 'night' | 'oneday' | 'allnight' | 'oneday_allnight' | 'custom';
export type SeasonType = 'regular' | 'high' | 'special';
export type ReservationStatus = 'reserved' | 'cancelled';

export interface Database {
  public: {
    Tables: {
      reservations: {
        Row: {
          id: string
          reservation_date: string
          guest_name: string
          guest_email: string
          guest_phone: string
          num_guests: number
          num_adults: number
          num_infants: number
          num_preschoolers: number
          num_children: number
          num_dogs_small_outdoor: number
          num_dogs_small_indoor: number
          num_dogs_large_outdoor: number
          created_at: string
          notes: string | null
          plan_type: ReservationPlan
          status: ReservationStatus
          custom_start_time: string | null
          custom_end_time: string | null
          total_price: number | null
          reservation_code: string
        }
        Insert: {
          id?: string
          reservation_date: string
          guest_name: string
          guest_email: string
          guest_phone: string
          num_guests: number
          num_adults: number
          num_infants?: number
          num_preschoolers?: number
          num_children?: number
          num_dogs_small_outdoor?: number
          num_dogs_small_indoor?: number
          num_dogs_large_outdoor?: number
          created_at?: string
          notes?: string | null
          plan_type: ReservationPlan
          status?: ReservationStatus
          custom_start_time?: string | null
          custom_end_time?: string | null
          total_price?: number | null
          reservation_code?: string
        }
        Update: {
          id?: string
          reservation_date?: string
          guest_name?: string
          guest_email?: string
          guest_phone?: string
          num_guests?: number
          num_adults?: number
          num_infants?: number
          num_preschoolers?: number
          num_children?: number
          num_dogs_small_outdoor?: number
          num_dogs_small_indoor?: number
          num_dogs_large_outdoor?: number
          created_at?: string
          notes?: string | null
          plan_type?: ReservationPlan
          status?: ReservationStatus
          custom_start_time?: string | null
          custom_end_time?: string | null
          total_price?: number | null
          reservation_code?: string
        }
      }
      blocked_dates: {
        Row: {
          id: string
          date: string
          start_time: string | null
          end_time: string | null
          reason: string | null
          created_at: string
        }
        Insert: {
          id?: string
          date: string
          start_time?: string | null
          end_time?: string | null
          reason?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          date?: string
          start_time?: string | null
          end_time?: string | null
          reason?: string | null
          created_at?: string
        }
      }
    }
  }
}