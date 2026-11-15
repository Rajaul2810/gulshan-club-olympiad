import { NextResponse } from 'next/server';
import { errorResponse, RegistrationError } from '@/lib/registration/errors';
import { requireClub } from '@/lib/registration/session';
import {
  getClubBySlug,
  getCurrentEvent,
  isRegistrationOpen,
  listPlayers,
  readPlayerForm,
  savePlayer,
} from '@/lib/registration/server';

/** Logged-in club's info + its players for the current event. */
export async function GET() {
  try {
    const session = await requireClub();
    const [club, event] = await Promise.all([getClubBySlug(session.slug), getCurrentEvent()]);
    const players = await listPlayers(event.id, club.id);
    return NextResponse.json({ club, event, isOpen: isRegistrationOpen(event, club.slug), players });
  } catch (err) {
    return errorResponse(err);
  }
}

export async function POST(req: Request) {
  try {
    const session = await requireClub();
    const event = await getCurrentEvent();
    if (!isRegistrationOpen(event, session.slug)) {
      throw new RegistrationError('Registration is closed. You can view your list, but only organisers can make changes.', 403);
    }

    const club = await getClubBySlug(session.slug);
    const player = await savePlayer({ event, club, form: await readPlayerForm(req) });
    return NextResponse.json({ player }, { status: 201 });
  } catch (err) {
    return errorResponse(err);
  }
}
