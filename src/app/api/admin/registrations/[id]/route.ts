import { NextResponse } from 'next/server';
import { errorResponse } from '@/lib/registration/errors';
import { requireAdmin } from '@/lib/registration/session';
import { deletePlayer, getEventById, getPlayerForAdmin, readPlayerForm, savePlayer } from '@/lib/registration/server';

type Params = { params: Promise<{ id: string }> };

/** Admin can edit any player at any time (deadline does not apply). */
export async function PUT(req: Request, { params }: Params) {
  try {
    await requireAdmin();
    const { id } = await params;
    const existing = await getPlayerForAdmin(id);
    const event = await getEventById(existing.event_id);
    const club = { id: existing.club_id, slug: existing.club?.slug ?? 'club' };
    const player = await savePlayer({ event, club, form: await readPlayerForm(req), playerId: id });
    return NextResponse.json({ player });
  } catch (err) {
    return errorResponse(err);
  }
}

export async function DELETE(_req: Request, { params }: Params) {
  try {
    await requireAdmin();
    const { id } = await params;
    await deletePlayer(id);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return errorResponse(err);
  }
}
