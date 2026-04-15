import { cookies } from 'next/headers';
import { isValidSessionToken, sessionCookieName } from '@/lib/auth';
import HomeClient from './pageClient';

export default function Home() {
  const token = cookies().get(sessionCookieName)?.value;
  const initiallyUnlocked = isValidSessionToken(token);
  return <HomeClient initiallyUnlocked={initiallyUnlocked} />;
}
