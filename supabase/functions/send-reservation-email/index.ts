import { createClient } from 'npm:@supabase/supabase-js@2.39.7';
import { Resend } from 'npm:resend@4.6.0';

console.log("DEBUG Edge Function called");
console.log("Headers:", JSON.stringify(Object.fromEntries(new Headers())));
console.log("Request method:", "will be logged below");

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

const PLAN_DETAILS = {
  day: {
    name: 'デイプラン',
    time: '10:00 - 16:00',
  },
  night: {
    name: 'ナイトプラン',
    time: '17:00 - 24:00',
  },
  allnight: {
    name: 'オールナイトプラン',
    time: '17:00 - 翌9:00',
  },
  oneday: {
    name: 'ワンデイプラン',
    time: '10:00 - 24:00',
  },
  oneday_allnight: {
    name: 'ワンデイ＋オールナイトプラン',
    time: '10:00 - 翌9:00',
  },
  custom: {
    name: 'イベントプラン',
    time: 'カスタム',
  }
};

const SEASON_LABELS = {
  regular: 'レギュラーシーズン',
  high: 'ハイシーズン',
  special: 'スペシャルシーズン'
};

Deno.serve(async (req) => {
  console.log("Request method:", req.method);
  console.log("Headers:", JSON.stringify(Object.fromEntries(req.headers.entries())));

  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const data = await req.json();
    console.log("[DEBUG] received data:", data);

    if (!data) {
      throw new Error('予約データが見つかりません');
    }

    // Check if Resend API key is available
    const env = Deno.env.toObject();
    console.log('[DEBUG] Edge Function ENV:', env);
    const resendApiKey = env.RESEND_API_KEY;
    console.log('[DEBUG] RESEND_API_KEY:', resendApiKey);
    
    if (!resendApiKey) {
      console.log('RESEND_API_KEY not configured - skipping email sending');
      const result = { 
        success: true,
        skipped: true,
        message: 'Email service not configured'
      };
      
      return new Response(JSON.stringify(result), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    const resend = new Resend(resendApiKey);

    const formatDate = (dateStr: string) => {
      const date = new Date(dateStr);
      return date.toLocaleDateString('ja-JP', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        timeZone: 'Asia/Tokyo',
      });
    };

    const planDetails = PLAN_DETAILS[data.planType] || PLAN_DETAILS.custom;
    const planTime = data.planType === 'custom' && data.customStartTime && data.customEndTime
      ? `${data.customStartTime} - ${data.customEndTime}`
      : planDetails.time;

    const seasonLabel = SEASON_LABELS[data.seasonType] || 'レギュラーシーズン';
    const formattedDate = formatDate(data.reservationDate);
    const reservationNumber = data.reservationCode;

    // Create email content
    const createEmailContent = (isForAdmin = false) => {
      const greeting = isForAdmin 
        ? '<h2>新しい予約が入りました</h2>'
        : `<h2>${data.guestName}様</h2><p>この度は、room船橋をご予約いただき、誠にありがとうございます。</p>`;

      const petInfo = [];
      if (data.petSmallOutdoor > 0) petInfo.push(`小型犬（屋外のみ）：${data.petSmallOutdoor}頭`);
      if (data.petSmallIndoor > 0) petInfo.push(`小型犬（室内利用）：${data.petSmallIndoor}頭`);
      if (data.petLarge > 0) petInfo.push(`大型犬（屋外のみ）：${data.petLarge}頭`);

      const childInfo = [];
      if (data.childrenInfant > 0) childInfo.push(`未就園児（0〜2歳）：${data.childrenInfant}名`);
      if (data.childrenPreschool > 0) childInfo.push(`未就学児（3〜5歳）：${data.childrenPreschool}名`);
      if (data.childrenElementary > 0) childInfo.push(`小学生（6〜12歳）：${data.childrenElementary}名`);

      return `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #0ea5e9; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background-color: #f8fafc; }
            .section { margin-bottom: 20px; padding: 15px; background-color: white; border-radius: 8px; }
            .label { font-weight: bold; color: #0369a1; }
            .total { font-size: 18px; font-weight: bold; color: #0369a1; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>room船橋 予約完了</h1>
            </div>
            <div class="content">
              ${greeting}
              
              <div class="section">
                <h3>ご予約内容</h3>
                <p><span class="label">予約番号：</span>${reservationNumber}</p>
                <p><span class="label">お名前：</span>${data.guestName}</p>
                <p><span class="label">電話番号：</span>${data.guestPhone}</p>
                <p><span class="label">メールアドレス：</span>${data.guestEmail}</p>
              </div>
              
              <div class="section">
                <h3>ご利用日時</h3>
                <p><span class="label">日程：</span>${formattedDate}（${seasonLabel}）</p>
                <p><span class="label">プラン：</span>${planDetails.name}（${planTime}）</p>
              </div>
              
              <div class="section">
                <h3>ご利用人数</h3>
                <p><span class="label">大人（中学生以上）：</span>${data.numGuests}名</p>
                ${childInfo.length > 0 ? `<p><span class="label">お子様：</span><br>${childInfo.join('<br>')}</p>` : ''}
                ${petInfo.length > 0 ? `<p><span class="label">ペット：</span><br>${petInfo.join('<br>')}</p>` : ''}
              </div>
              
              ${data.notes ? `
              <div class="section">
                <h3>特別なご要望</h3>
                <p>${data.notes.replace(/\n/g, '<br>')}</p>
              </div>
              ` : ''}
              
              ${data.totalPrice ? `
              <div class="section">
                <p class="total">合計金額（税込・現地決済）：${data.totalPrice.toLocaleString()}円</p>
                <p style="font-size: 14px; color: #666;">※表示価格は概算です。実際の料金は現地でご確認ください。</p>
              </div>
              ` : ''}
              
              ${!isForAdmin ? `
              <div class="section">
                <p>ご不明な点がございましたら、お気軽にお問い合わせください。</p>
                <p>皆様のお越しを心よりお待ちしております。</p>
                <br>
                <p>room船橋<br>
                電話：047-402-2332<br>
                メール：info@roomfunabashi.jp</p>
              </div>
              ` : ''}
            </div>
          </div>
        </body>
        </html>
      `;
    };

    // Send email to admin
    // ⚠️ ドメイン検証が完了していない場合は yourname@resend.dev を使用
    // 検証完了後は info@room-funabashi.com に変更してください
    const adminResult = await resend.emails.send({
      from: 'onboarding@resend.dev', // 一時的にResendのテスト用アドレスを使用
      to: ['info@room-funabashi.com'],
      subject: `【新規予約】${data.guestName}様 - ${formattedDate}`,
      html: createEmailContent(true),
    });
    
    console.log("[DEBUG] Admin email result:", adminResult);
    if (adminResult.error) {
      console.error("[ERROR] Admin email failed:", adminResult.error);
      throw new Error(`Admin email failed: ${JSON.stringify(adminResult.error)}`);
    }

    // Send confirmation email to customer
    const customerResult = await resend.emails.send({
      from: 'onboarding@resend.dev', // 一時的にResendのテスト用アドレスを使用
      // to: [data.guestEmail],
      to: ['info@room-funabashi.com'], // 一時的にinfo@room-funabashi.comを使用
      subject: `【予約完了】room船橋のご予約ありがとうございます - ${formattedDate}`,
      html: createEmailContent(false),
    });
    
    console.log("[DEBUG] Customer email result:", customerResult);
    if (customerResult.error) {
      console.error("[ERROR] Customer email failed:", customerResult.error);
      console.error("[ERROR] Customer email error details:", JSON.stringify(customerResult.error, null, 2));
      throw new Error(`Customer email failed: ${JSON.stringify(customerResult.error)}`);
    }

    const result = { 
      success: true,
      message: '予約完了メールを送信しました'
    };

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });

  } catch (error) {
    console.error('処理中のエラー:', error);
    console.error('エラーの詳細:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : undefined,
    });
    
    const errorMessage = error instanceof Error 
      ? `メール送信エラー: ${error.message}`
      : 'メール送信に失敗しました';

    const errorResult = { 
      success: false,
      error: errorMessage,
      details: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString()
    };

    return new Response(JSON.stringify(errorResult), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
});