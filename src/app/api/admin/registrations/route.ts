import { NextResponse } from 'next/server';
import { errorResponse } from '@/lib/registration/errors';
import { requireAdmin } from '@/lib/registration/session';
import { getCurrentEvent, getEventById, listPlayers } from '@/lib/registration/server';

const UUID = /^[0-9a-f-]{36}$/i;

/** All players of an event (?eventId=...; defaults to the current event). */
export async function GET(req: Request) {
  try {
    await requireAdmin();
    const eventId = new URL(req.url).searchParams.get('eventId');
    const event = eventId && UUID.test(eventId) ? await getEventById(eventId) : await getCurrentEvent();
    const players = await listPlayers(event.id);
    return NextResponse.json({ event, players });
  } catch (err) {
    return errorResponse(err);
  }
}
