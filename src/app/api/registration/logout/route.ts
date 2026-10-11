import { NextResponse } from 'next/server';
import { CLUB_COOKIE, endSession } from '@/lib/registration/session';

export async function POST() {
  await endSession(CLUB_COOKIE);
  return NextResponse.json({ ok: true });
}
