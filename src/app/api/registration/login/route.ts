import { NextResponse } from 'next/server';
import { errorResponse, RegistrationError } from '@/lib/registration/errors';
import { checkClubCredentials, startClubSession } from '@/lib/registration/session';
import { getClubBySlug } from '@/lib/registration/server';

export async function POST(req: Request) {
  try {
    const { slug, username, password } = await req.json();
    if (!slug || !username || !password) throw new RegistrationError('Username and password are required');

    if (!checkClubCredentials(String(slug), String(username), String(password))) {
      throw new RegistrationError('Wrong username or password', 401);
    }

    const club = await getClubBySlug(String(slug));
    await startClubSession(club.id, club.slug);
    return NextResponse.json({ club });
  } catch (err) {
    return errorResponse(err);
  }
}
