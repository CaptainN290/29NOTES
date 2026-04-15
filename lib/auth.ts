import { cookies } from 'next/headers';
import crypto from 'crypto';

const COOKIE_NAME = 'vault_session';

function getSecret() {
  return process.env.VAULT_SESSION_SECRET || 'change-me-in-env';
}

function sign(value: string) {
  return crypto.createHmac('sha256', getSecret()).update(value).digest('hex');
}

export function createSessionToken() {
  const payload = `${Date.now()}`;
  return `${payload}.${sign(payload)}`;
}

export function isValidSessionToken(token?: string) {
  if (!token) return false;
  const [payload, sig] = token.split('.');
  if (!payload || !sig) return false;
  return crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(sign(payload)));
}

export function getVaultPassword() {
  return process.env.VAULT_PASSWORD || '';
}

export async function isAuthenticated() {
  const token = cookies().get(COOKIE_NAME)?.value;
  return isValidSessionToken(token);
}

export const sessionCookieName = COOKIE_NAME;
