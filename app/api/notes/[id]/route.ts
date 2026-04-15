import { NextResponse } from 'next/server';
import { isAuthenticated } from '@/lib/auth';
import { getAdminClient } from '@/lib/supabase-server';

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const supabase = getAdminClient();
  const body = await req.json();
  const { error } = await supabase.from('notes').update({ ...body, updated_at: new Date().toISOString() }).eq('id', params.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const supabase = getAdminClient();
  const { error } = await supabase.from('notes').delete().eq('id', params.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
