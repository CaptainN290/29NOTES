import { NextResponse } from 'next/server';
import { isAuthenticated } from '@/lib/auth';
import { getAdminClient } from '@/lib/supabase-server';

export async function GET() {
  if (!(await isAuthenticated())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const supabase = getAdminClient();
  const { data, error } = await supabase
    .from('notes')
    .select('*')
    .order('pinned', { ascending: false })
    .order('order_index', { ascending: true });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data || []);
}

export async function POST(req: Request) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const supabase = getAdminClient();
  const body = await req.json();
  const { data: existing } = await supabase
    .from('notes')
    .select('order_index')
    .order('order_index', { ascending: false })
    .limit(1);
  const maxOrder = existing && existing.length > 0 ? existing[0].order_index + 1 : 0;
  const { data, error } = await supabase
    .from('notes')
    .insert({
      title:       body.title   || 'Untitled',
      content:     body.content || '<p></p>',
      order_index: maxOrder,
      pinned:      body.pinned  ?? false,
      color:       body.color   ?? null,
    })
    .select()
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
