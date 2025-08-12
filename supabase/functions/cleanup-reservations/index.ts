import { createClient } from 'npm:@supabase/supabase-js@2.39.7';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

interface CleanupResult {
  ok: boolean;
  deleted_count: number;
  upper_limit_hit: boolean;
  started_at: string;
  finished_at: string;
  error?: string;
  keep_alive_success?: boolean;
}

// 削除上限（誤削除防止）
const DELETE_LIMIT = 2000;

/**
 * Supabase Keep-Alive & Old Reservations Cleanup Function
 * 
 * Purpose:
 * 1. Keep Supabase Free plan active with daily access
 * 2. Clean up old reservations (older than 3 months)
 * 
 * Schedule: Daily at 03:00 JST (18:00 UTC)
 */
Deno.serve(async (req) => {
  const startedAt = new Date().toISOString();
  console.log(`[${startedAt}] Cleanup function started`);

  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    // Environment variables validation
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    const softDelete = Deno.env.get('SOFT_DELETE') === 'true';

    if (!supabaseUrl || !serviceRoleKey) {
      throw new Error('Missing required environment variables: SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
    }

    console.log(`[INFO] Soft delete mode: ${softDelete}`);

    // Create Supabase client with Service Role key (bypasses RLS)
    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    // Step 1: Keep-alive ping (light query)
    console.log('[STEP 1] Performing keep-alive ping...');
    const { count: totalCount, error: pingError } = await supabase
      .from('reservations')
      .select('*', { count: 'exact', head: true });

    if (pingError) {
      console.error('[ERROR] Keep-alive ping failed:', pingError);
      throw new Error(`Keep-alive ping failed: ${pingError.message}`);
    }

    console.log(`[SUCCESS] Keep-alive ping successful. Total reservations: ${totalCount}`);

    // Step 2: Calculate cutoff date (3 months ago from today UTC)
    const today = new Date();
    const cutoffDate = new Date(today);
    cutoffDate.setMonth(cutoffDate.getMonth() - 3);
    const cutoffDateStr = cutoffDate.toISOString().split('T')[0]; // YYYY-MM-DD format

    console.log(`[INFO] Cleanup cutoff date: ${cutoffDateStr} (3 months ago from ${today.toISOString().split('T')[0]})`);

    // Step 3: Find old reservations to delete/update
    console.log('[STEP 2] Finding old reservations...');
    const { data: oldReservations, error: findError } = await supabase
      .from('reservations')
      .select('id, reservation_date, guest_name, status')
      .lt('reservation_date', cutoffDateStr)
      .lte('reservation_date', today.toISOString().split('T')[0]) // Safety: never delete future dates
      .limit(DELETE_LIMIT + 1); // +1 to detect if we hit the limit

    if (findError) {
      console.error('[ERROR] Failed to find old reservations:', findError);
      throw new Error(`Failed to find old reservations: ${findError.message}`);
    }

    const foundCount = oldReservations?.length || 0;
    const upperLimitHit = foundCount > DELETE_LIMIT;
    const recordsToProcess = upperLimitHit ? oldReservations!.slice(0, DELETE_LIMIT) : (oldReservations || []);

    console.log(`[INFO] Found ${foundCount} old reservations. Processing ${recordsToProcess.length} records.`);
    
    if (upperLimitHit) {
      console.log(`[WARNING] Upper limit (${DELETE_LIMIT}) reached. Some old reservations will remain.`);
    }

    let processedCount = 0;

    if (recordsToProcess.length > 0) {
      // Extract IDs for batch operation
      const idsToProcess = recordsToProcess.map(r => r.id);

      if (softDelete) {
        // Step 4a: Soft delete (update deleted_at)
        console.log(`[STEP 3] Soft deleting ${recordsToProcess.length} old reservations...`);
        
        // Note: This assumes a deleted_at column exists. If not, this will fail gracefully.
        const { error: updateError } = await supabase
          .from('reservations')
          .update({ 
            deleted_at: new Date().toISOString(),
            status: 'cancelled' 
          })
          .in('id', idsToProcess);

        if (updateError) {
          console.error('[ERROR] Soft delete failed:', updateError);
          throw new Error(`Soft delete failed: ${updateError.message}`);
        }

        processedCount = recordsToProcess.length;
        console.log(`[SUCCESS] Soft deleted ${processedCount} reservations`);

      } else {
        // Step 4b: Hard delete (physical removal)
        console.log(`[STEP 3] Hard deleting ${recordsToProcess.length} old reservations...`);
        
        const { error: deleteError } = await supabase
          .from('reservations')
          .delete()
          .in('id', idsToProcess);

        if (deleteError) {
          console.error('[ERROR] Hard delete failed:', deleteError);
          throw new Error(`Hard delete failed: ${deleteError.message}`);
        }

        processedCount = recordsToProcess.length;
        console.log(`[SUCCESS] Hard deleted ${processedCount} reservations`);
      }

      // Log some details about deleted records
      console.log('[INFO] Processed reservations details:');
      recordsToProcess.slice(0, 5).forEach(r => {
        console.log(`  - ID: ${r.id}, Date: ${r.reservation_date}, Guest: ${r.guest_name}, Status: ${r.status}`);
      });
      if (recordsToProcess.length > 5) {
        console.log(`  ... and ${recordsToProcess.length - 5} more`);
      }
    } else {
      console.log('[INFO] No old reservations found to clean up');
    }

    const finishedAt = new Date().toISOString();
    const result: CleanupResult = {
      ok: true,
      deleted_count: processedCount,
      upper_limit_hit: upperLimitHit,
      started_at: startedAt,
      finished_at: finishedAt,
      keep_alive_success: true
    };

    console.log(`[${finishedAt}] Cleanup completed successfully:`, result);

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
    });

  } catch (error) {
    const finishedAt = new Date().toISOString();
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    
    console.error(`[${finishedAt}] Cleanup failed:`, error);

    const errorResult: CleanupResult = {
      ok: false,
      deleted_count: 0,
      upper_limit_hit: false,
      started_at: startedAt,
      finished_at: finishedAt,
      error: errorMessage,
      keep_alive_success: false
    };

    return new Response(JSON.stringify(errorResult), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
    });
  }
});