import { NextResponse } from 'next/server';
import { errorResponse, RegistrationError } from '@/lib/registration/errors';
import { requireClub } from '@/lib/registration/session';
import {
  deletePlayer,
  getClubBySlug,
  getCurrentEvent,
  isRegistrationOpen,
  readPlayerForm,
  savePlayer,
} from '@/lib/registration/server';

type Params = { params: Promise<{ id: string }> };

async function openEventForClub() {
  const session = await requireClub();
  const event = await getCurrentEvent();
  if (!isRegistrationOpen(event)) throw new RegistrationError('Registration is closed. Contact the organisers for changes.', 403);
  return { session, event };
}

export async function PUT(req: Request, { params }: Params) {
  try {
    const { id } = await params;
    const { session, event } = await openEventForClub();
    const club = await getClubBySlug(session.slug);
    const player = await savePlayer({ event, club, form: await readPlayerForm(req), playerId: id });
    return NextResponse.json({ player });
  } catch (err) {
    return errorResponse(err);
  }
}

export async function DELETE(_req: Request, { params }: Params) {
  try {
    const { id } = await params;
    const { session } = await openEventForClub();
    await deletePlayer(id, session.clubId);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return errorResponse(err);
  }
}
