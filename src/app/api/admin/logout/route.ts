import { NextResponse } from 'next/server';
import { ADMIN_COOKIE, endSession } from '@/lib/registration/session';

export async function POST() {
  await endSession(ADMIN_COOKIE);
  return NextResponse.json({ ok: true });
}
