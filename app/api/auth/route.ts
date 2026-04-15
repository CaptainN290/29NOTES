import { NextResponse } from 'next/server';
import { createSessionToken, getVaultPassword, sessionCookieName } from '@/lib/auth';

export async function POST(req: Request) {
  const { password } = await req.json();
  if (!password || password !== getVaultPassword()) {
    return NextResponse.json({ ok: false, error: 'Invalid password' }, { status: 401 });
  }
  const res = NextResponse.json({ ok: true });
  res.cookies.set(sessionCookieName, createSessionToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
  });
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(sessionCookieName, '', { httpOnly: true, path: '/', maxAge: 0 });
  return res;
}
