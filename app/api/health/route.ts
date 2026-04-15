import { NextResponse } from 'next/server';
import { getAdminClient } from '@/lib/supabase-server';

export async function GET() {
  const checks: Record<string, string> = {};

  checks.supabase_url = process.env.NEXT_PUBLIC_SUPABASE_URL ? 'set' : 'MISSING';
  checks.service_role_key = process.env.SUPABASE_SERVICE_ROLE_KEY ? 'set' : 'MISSING';
  checks.vault_password = process.env.VAULT_PASSWORD ? 'set' : 'MISSING';
  checks.vault_session_secret = process.env.VAULT_SESSION_SECRET ? 'set' : 'MISSING';

  try {
    const supabase = getAdminClient();
    const { data, error } = await supabase.from('notes').select('count').limit(1);
    if (error) {
      checks.supabase_query = `ERROR: ${error.message} (code: ${error.code})`;
    } else {
      checks.supabase_query = 'OK';
    }
  } catch (e: unknown) {
    checks.supabase_query = `EXCEPTION: ${e instanceof Error ? e.message : String(e)}`;
  }

  return NextResponse.json(checks);
}
