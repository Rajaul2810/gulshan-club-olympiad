import { NextResponse } from 'next/server';
import { errorResponse, RegistrationError } from '@/lib/registration/errors';
import { checkAdminCredentials, startAdminSession } from '@/lib/registration/session';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    if (!checkAdminCredentials(String(email ?? ''), String(password ?? ''))) {
      throw new RegistrationError('Invalid email or password', 401);
    }
    await startAdminSession(String(email).trim().toLowerCase());
    return NextResponse.json({ email: String(email).trim().toLowerCase() });
  } catch (err) {
    return errorResponse(err);
  }
}
