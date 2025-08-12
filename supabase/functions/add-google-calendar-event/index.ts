import { google } from 'npm:googleapis@118.0.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// 予約データの型定義
interface ReservationData {
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  reservationDate: string; // ISO string
  planType: string;
  customStartTime?: string;
  customEndTime?: string;
  numGuests: number;
  childrenInfant?: number;
  childrenPreschool?: number;
  childrenElementary?: number;
  petSmallOutdoor?: number;
  petSmallIndoor?: number;
  petLarge?: number;
  notes?: string;
  totalPrice?: number;
  reservationCode?: string;
}

// プラン詳細の定義
const PLAN_DETAILS = {
  day: {
    name: 'デイプラン',
    startTime: '10:00',
    endTime: '16:00'
  },
  night: {
    name: 'ナイトプラン',
    startTime: '17:00',
    endTime: '24:00'
  },
  oneday: {
    name: 'ワンデイプラン',
    startTime: '10:00',
    endTime: '24:00'
  },
  allnight: {
    name: 'オールナイトプラン',
    startTime: '17:00',
    endTime: '09:00+1'
  },
  oneday_allnight: {
    name: 'ワンデイオールナイトプラン',
    startTime: '10:00',
    endTime: '09:00+1'
  },
  custom: {
    name: 'イベントプラン',
    startTime: '10:00',
    endTime: '16:00'
  }
} as const;

/**
 * 日付と時間文字列からISO形式の日時を生成
 */
function createDateTime(dateStr: string, timeString: string): string {
  console.log(`[createDateTime] Input: ${dateStr}, ${timeString}`);
  
  const date = new Date(dateStr);
  
  // 翌日の時間処理（例：09:00+1）
  if (timeString.includes('+1')) {
    date.setDate(date.getDate() + 1);
    timeString = timeString.replace('+1', '');
    console.log(`[createDateTime] Next day time detected, adjusted date: ${date.toISOString()}`);
  }
  
  // 24:00を翌日00:00として処理
  if (timeString === '24:00') {
    date.setDate(date.getDate() + 1);
    timeString = '00:00';
    console.log(`[createDateTime] 24:00 converted to next day 00:00`);
  }
  
  const [hours, minutes] = timeString.split(':').map(Number);
  
  // Asia/Tokyoタイムゾーンで時間を設定
  const jstDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), hours, minutes, 0, 0);
  
  console.log(`[createDateTime] Result: ${jstDate.toISOString()}`);
  return jstDate.toISOString();
}

/**
 * イベント説明文を生成
 */
function generateEventDescription(data: ReservationData): string {
  const lines: string[] = [];
  
  // 基本情報
  lines.push(`予約番号: ${data.reservationCode || 'N/A'}`);
  lines.push(`お名前: ${data.guestName}`);
  lines.push(`電話番号: ${data.guestPhone}`);
  lines.push(`メールアドレス: ${data.guestEmail}`);
  lines.push('');
  
  // プラン情報
  const planDetails = PLAN_DETAILS[data.planType as keyof typeof PLAN_DETAILS] || PLAN_DETAILS.custom;
  lines.push(`プラン: ${planDetails.name}`);
  lines.push(`ご利用人数: ${data.numGuests}名`);
  
  // 子供情報
  const childInfo = [];
  if (data.childrenInfant && data.childrenInfant > 0) childInfo.push(`未就園児: ${data.childrenInfant}名`);
  if (data.childrenPreschool && data.childrenPreschool > 0) childInfo.push(`未就学児: ${data.childrenPreschool}名`);
  if (data.childrenElementary && data.childrenElementary > 0) childInfo.push(`小学生: ${data.childrenElementary}名`);
  
  if (childInfo.length > 0) {
    lines.push(`お子様: ${childInfo.join(', ')}`);
  }
  
  // ペット情報
  const petInfo = [];
  if (data.petSmallOutdoor && data.petSmallOutdoor > 0) petInfo.push(`小型犬(屋外): ${data.petSmallOutdoor}頭`);
  if (data.petSmallIndoor && data.petSmallIndoor > 0) petInfo.push(`小型犬(室内): ${data.petSmallIndoor}頭`);
  if (data.petLarge && data.petLarge > 0) petInfo.push(`大型犬(屋外): ${data.petLarge}頭`);
  
  if (petInfo.length > 0) {
    lines.push(`ペット: ${petInfo.join(', ')}`);
  }
  
  // 料金情報
  if (data.totalPrice) {
    lines.push(`料金: ${data.totalPrice.toLocaleString()}円（税込）`);
  }
  
  // 特別な要望
  if (data.notes) {
    lines.push('');
    lines.push('特別なご要望:');
    lines.push(data.notes);
  }
  
  return lines.join('\n');
}

/**
 * Google Calendar認証を設定
 */
async function setupGoogleAuth(): Promise<any> {
  console.log('[setupGoogleAuth] Starting authentication setup');
  
  const env = Deno.env.toObject();
  const credentialsBase64 = env.GOOGLE_SERVICE_ACCOUNT_CREDENTIALS;
  const calendarId = env.GOOGLE_CALENDAR_ID;
  
  if (!credentialsBase64 || !calendarId) {
    console.log('[setupGoogleAuth] Missing credentials or calendar ID');
    throw new Error('Google Calendar credentials not configured');
  }
  
  // Base64デコード
  let credentials;
  try {
    const credentialsJson = atob(credentialsBase64);
    credentials = JSON.parse(credentialsJson);
    console.log('[setupGoogleAuth] Successfully decoded service account credentials');
  } catch (error) {
    console.error('[setupGoogleAuth] Failed to decode credentials:', error);
    throw new Error('Invalid service account credentials format');
  }
  
  // JWT認証設定
  const auth = new google.auth.JWT(
    credentials.client_email,
    undefined,
    credentials.private_key,
    ['https://www.googleapis.com/auth/calendar']
  );
  
  // 認証実行
  await auth.authorize();
  console.log('[setupGoogleAuth] Google Calendar API authentication successful');
  
  return { auth, calendarId };
}

/**
 * カレンダーイベントを作成
 */
async function createCalendarEvent(data: ReservationData): Promise<{ success: boolean; eventId?: string; error?: string }> {
  try {
    console.log('[createCalendarEvent] Starting event creation for:', data.guestName);
    
    // Google認証設定
    const { auth, calendarId } = await setupGoogleAuth();
    
    // カレンダークライアント作成
    const calendar = google.calendar({ version: 'v3', auth });
    
    // 開始・終了時間の決定
    const planDetails = PLAN_DETAILS[data.planType as keyof typeof PLAN_DETAILS] || PLAN_DETAILS.custom;
    
    let startTime: string;
    let endTime: string;
    
    if (data.planType === 'custom' && data.customStartTime && data.customEndTime) {
      startTime = data.customStartTime;
      endTime = data.customEndTime;
      console.log('[createCalendarEvent] Using custom times:', { startTime, endTime });
    } else {
      startTime = planDetails.startTime;
      endTime = planDetails.endTime;
      console.log('[createCalendarEvent] Using plan times:', { startTime, endTime });
    }
    
    // イベント日時の作成
    const eventStart = createDateTime(data.reservationDate, startTime);
    const eventEnd = createDateTime(data.reservationDate, endTime);
    
    // イベントオブジェクトの作成
    const event = {
      summary: `${data.guestName}様（${planDetails.name}）`,
      description: generateEventDescription(data),
      start: {
        dateTime: eventStart,
        timeZone: 'Asia/Tokyo',
      },
      end: {
        dateTime: eventEnd,
        timeZone: 'Asia/Tokyo',
      },
      attendees: [
        {
          email: data.guestEmail,
          displayName: data.guestName,
        }
      ],
      location: '〒273-0866 千葉県船橋市夏見台6-15−15 room船橋',
      colorId: '9', // 青色
    };
    
    console.log('[createCalendarEvent] Event object created:', JSON.stringify(event, null, 2));
    
    // カレンダーにイベントを挿入
    const response = await calendar.events.insert({
      calendarId: calendarId,
      requestBody: event,
    });
    
    console.log('[createCalendarEvent] Event created successfully:', response.data.id);
    
    return {
      success: true,
      eventId: response.data.id || undefined
    };
    
  } catch (error) {
    console.error('[createCalendarEvent] Error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

/**
 * メインハンドラー
 */
Deno.serve(async (req) => {
  console.log(`[Handler] ${req.method} request received`);
  
  // CORS対応
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }
  
  try {
    // リクエストデータの取得
    const data: ReservationData = await req.json();
    console.log('[Handler] Request data received:', {
      guestName: data.guestName,
      guestEmail: data.guestEmail,
      reservationDate: data.reservationDate,
      planType: data.planType,
      numGuests: data.numGuests
    });
    
    // 必須フィールドの検証
    if (!data.guestName || !data.guestEmail || !data.reservationDate || !data.planType) {
      throw new Error('Missing required fields: guestName, guestEmail, reservationDate, planType');
    }
    
    // 設定確認
    const env = Deno.env.toObject();
    if (!env.GOOGLE_SERVICE_ACCOUNT_CREDENTIALS || !env.GOOGLE_CALENDAR_ID) {
      console.log('[Handler] Google Calendar not configured - skipping');
      return new Response(JSON.stringify({ 
        success: true,
        skipped: true,
        message: 'Google Calendar integration not configured'
      }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      });
    }
    
    // カレンダーイベント作成
    const result = await createCalendarEvent(data);
    
    if (result.success) {
      console.log('[Handler] Calendar event created successfully');
      return new Response(JSON.stringify({ 
        success: true,
        eventId: result.eventId,
        message: 'Calendar event created successfully'
      }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      });
    } else {
      console.error('[Handler] Failed to create calendar event:', result.error);
      return new Response(JSON.stringify({ 
        success: false,
        error: `Failed to create calendar event: ${result.error}`
      }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      });
    }
    
  } catch (error) {
    console.error('[Handler] Unexpected error:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    const errorStack = error instanceof Error ? error.stack : undefined;
    
    return new Response(JSON.stringify({ 
      success: false,
      error: errorMessage,
      details: errorStack,
      timestamp: new Date().toISOString()
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
    });
  }
});