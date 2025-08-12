const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

interface RemoveEventData {
  reservationCode: string;
  guestEmail: string;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const data: RemoveEventData = await req.json();

    // Check if Google Calendar credentials are available
    const env = Deno.env.toObject();
    const credentialsBase64 = env.GOOGLE_SERVICE_ACCOUNT_CREDENTIALS;
    const calendarId = env.GOOGLE_CALENDAR_ID;
    
    if (!credentialsBase64 || !calendarId) {
      console.log('Google Calendar credentials not configured - skipping calendar removal');
      return new Response(JSON.stringify({ 
        success: true,
        skipped: true,
        message: 'Google Calendar not configured'
      }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      });
    }

    // For now, we'll skip the actual Google Calendar integration
    // This can be implemented later when needed
    console.log('Google Calendar integration would remove event:', {
      reservationCode: data.reservationCode,
      guestEmail: data.guestEmail
    });

    return new Response(JSON.stringify({ 
      success: true,
      message: 'Calendar event removal logged (integration pending)'
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
    });

  } catch (error) {
    console.error('Calendar removal error:', error);
    
    return new Response(JSON.stringify({ 
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
    });
  }
});