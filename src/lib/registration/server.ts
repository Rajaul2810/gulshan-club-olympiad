import crypto from 'crypto';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { RegistrationError } from './errors';
import {
  MAX_PHOTO_BYTES,
  MAX_PHOTO_LABEL,
  PHOTO_BUCKET,
  checkGameCapacity,
  countGameEntries,
  normalizePhone,
  validatePlayer,
  type Player,
  type PlayerInput,
} from './constants';

let adminClient: SupabaseClient | null = null;

export function db() {
  if (adminClient) return adminClient;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new RegistrationError('Server is missing SUPABASE_SERVICE_ROLE_KEY in .env.local', 500);
  }
  adminClient = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
  return adminClient;
}

export interface EventInfo {
  id: string;
  year: number;
  name: string;
  registration_deadline: string | null;
}

export interface ClubInfo {
  id: string;
  name: string;
  slug: string;
  logo: string;
}

export async function getCurrentEvent(): Promise<EventInfo> {
  const { data, error } = await db()
    .from('events')
    .select('id, year, name, registration_deadline')
    .eq('is_current', true)
    .maybeSingle();
  if (error) throw error;
  if (!data) throw new RegistrationError('No current Olympiad is set. Ask the admin to set one in Events.', 500);
  return data as EventInfo;
}

export async function getEventById(id: string): Promise<EventInfo> {
  const { data, error } = await db()
    .from('events')
    .select('id, year, name, registration_deadline')
    .eq('id', id)
    .maybeSingle();
  if (error) throw error;
  if (!data) throw new RegistrationError('Event not found', 404);
  return data as EventInfo;
}

/** Deadline is inclusive and compared in Dhaka time. */
export function isRegistrationOpen(event: EventInfo) {
  if (!event.registration_deadline) return true;
  const today = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Dhaka' }).format(new Date());
  return today <= event.registration_deadline;
}

export async function getClubBySlug(slug: string): Promise<ClubInfo> {
  const { data, error } = await db().from('clubs').select('id, name, slug, logo').eq('slug', slug).maybeSingle();
  if (error) throw error;
  if (!data) throw new RegistrationError('Club not found', 404);
  return data as ClubInfo;
}

const PLAYER_SELECT = '*, player_games(game), club:clubs(id, name, slug, logo)';

type PlayerRow = Omit<Player, 'games'> & { player_games: { game: string }[] };

function toPlayer(row: PlayerRow): Player {
  const { player_games, ...rest } = row;
  return { ...rest, games: (player_games ?? []).map((g) => g.game).sort() };
}

export async function listPlayers(eventId: string, clubId?: string): Promise<Player[]> {
  let query = db().from('players').select(PLAYER_SELECT).eq('event_id', eventId).order('name');
  if (clubId) query = query.eq('club_id', clubId);
  const { data, error } = await query;
  if (error) throw error;
  return ((data ?? []) as PlayerRow[]).map(toPlayer);
}

async function getPlayer(id: string) {
  const { data, error } = await db().from('players').select(PLAYER_SELECT).eq('id', id).maybeSingle();
  if (error) throw error;
  if (!data) throw new RegistrationError('Player not found', 404);
  return toPlayer(data as PlayerRow);
}

export interface PlayerFormData {
  input: PlayerInput;
  photo: File | null;
  removePhoto: boolean;
}

/** Client sends multipart: `data` (JSON of PlayerInput), optional `photo`, optional `removePhoto`. */
export async function readPlayerForm(req: Request): Promise<PlayerFormData> {
  const form = await req.formData();
  let input: PlayerInput;
  try {
    input = JSON.parse(String(form.get('data') ?? '{}'));
  } catch {
    throw new RegistrationError('Invalid form data');
  }
  const photo = form.get('photo');
  return {
    input: {
      ...input,
      games: Array.isArray(input.games) ? [...new Set(input.games)] : [],
    },
    photo: photo instanceof File && photo.size > 0 ? photo : null,
    removePhoto: form.get('removePhoto') === 'true',
  };
}

function photoPathFromUrl(url: string | null) {
  if (!url) return null;
  const marker = `/object/public/${PHOTO_BUCKET}/`;
  const i = url.indexOf(marker);
  return i === -1 ? null : decodeURIComponent(url.slice(i + marker.length));
}

async function uploadPhoto(photo: File, folder: string) {
  if (!photo.type.startsWith('image/')) throw new RegistrationError('Photo must be an image', 400, { photo: 'Photo must be an image' });
  if (photo.size > MAX_PHOTO_BYTES) {
    const msg = `Photo must be ${MAX_PHOTO_LABEL} or smaller`;
    throw new RegistrationError(msg, 400, { photo: msg });
  }
  const ext = (photo.name.split('.').pop() || 'jpg').toLowerCase().replace(/[^a-z0-9]/g, '');
  const path = `${folder}/${crypto.randomUUID()}.${ext}`;
  const { error } = await db().storage.from(PHOTO_BUCKET).upload(path, photo, { contentType: photo.type, upsert: false });
  if (error) throw new RegistrationError(`Photo upload failed: ${error.message}`, 500);
  return db().storage.from(PHOTO_BUCKET).getPublicUrl(path).data.publicUrl;
}

async function removePhoto(url: string | null) {
  const path = photoPathFromUrl(url);
  if (path) await db().storage.from(PHOTO_BUCKET).remove([path]);
}

/** Enforces: one person (phone) can only be registered under one club per event. */
async function assertPhoneAvailable(eventId: string, clubId: string, phone: string, playerId?: string) {
  const { data, error } = await db()
    .from('players')
    .select('id, club_id, club:clubs(name)')
    .eq('event_id', eventId)
    .eq('phone', phone)
    .maybeSingle();
  if (error) throw error;
  if (!data || data.id === playerId) return;

  const clubName = (data.club as unknown as { name: string } | null)?.name ?? 'another club';
  const message =
    data.club_id === clubId
      ? 'This phone number is already registered in your club. Edit the existing player instead.'
      : `This person is already registered under ${clubName}. A player can only represent one club.`;
  throw new RegistrationError(message, 409, { phone: message });
}

/** Enforces per-club max players and max children for each selected game. */
async function assertGameCapacity(eventId: string, clubId: string, input: PlayerInput, playerId?: string) {
  const clubPlayers = await listPlayers(eventId, clubId);
  const problems = checkGameCapacity(input.games, input.role, input.member_type, countGameEntries(clubPlayers, playerId));
  if (problems.length > 0) {
    const message = problems.join('. ');
    throw new RegistrationError(message, 409, { games: message });
  }
}

interface SaveOptions {
  event: EventInfo;
  club: Pick<ClubInfo, 'id' | 'slug'>;
  form: PlayerFormData;
  playerId?: string;
}

export async function savePlayer({ event, club, form, playerId }: SaveOptions): Promise<Player> {
  const { input, photo } = form;
  const fields = validatePlayer(input);
  if (Object.keys(fields).length > 0) {
    throw new RegistrationError('Please fix the highlighted fields', 400, fields as Record<string, string>);
  }

  const phone = normalizePhone(input.phone);
  await assertPhoneAvailable(event.id, club.id, phone, playerId);
  await assertGameCapacity(event.id, club.id, input, playerId);

  const existing = playerId ? await getPlayer(playerId) : null;
  if (existing && (existing.club_id !== club.id || existing.event_id !== event.id)) {
    throw new RegistrationError('Player not found', 404);
  }

  let photoUrl = existing?.photo_url ?? null;
  if (photo) photoUrl = await uploadPhoto(photo, `${event.year}/${club.slug}`);
  else if (form.removePhoto) photoUrl = null;

  const row = {
    event_id: event.id,
    club_id: club.id,
    name: input.name.trim(),
    phone,
    email: input.email.trim() || null,
    gender: input.gender,
    member_type: input.member_type,
    birthday: input.birthday,
    role: input.role,
    account_no: input.account_no.trim(),
    tshirt_size: input.tshirt_size,
    photo_url: photoUrl,
    declaration_accepted: true,
  };

  const { data, error } = existing
    ? await db().from('players').update(row).eq('id', existing.id).select('id').single()
    : await db().from('players').insert(row).select('id').single();

  if (error) {
    if (photo && photoUrl) await removePhoto(photoUrl);
    if (error.code === '23505') {
      throw new RegistrationError('This phone number is already registered for this Olympiad', 409, {
        phone: 'This phone number is already registered for this Olympiad',
      });
    }
    throw error;
  }

  const id = data.id as string;
  await db().from('player_games').delete().eq('player_id', id);
  const { error: gamesError } = await db()
    .from('player_games')
    .insert(input.games.map((game) => ({ player_id: id, game })));
  if (gamesError) {
    if (!existing) await db().from('players').delete().eq('id', id);
    throw gamesError;
  }

  if (existing?.photo_url && existing.photo_url !== photoUrl) await removePhoto(existing.photo_url);

  return getPlayer(id);
}

/** When clubId is given, the player must belong to that club. */
export async function deletePlayer(id: string, clubId?: string) {
  const player = await getPlayer(id);
  if (clubId && player.club_id !== clubId) throw new RegistrationError('Player not found', 404);
  const { error } = await db().from('players').delete().eq('id', id);
  if (error) throw error;
  await removePhoto(player.photo_url);
}

export async function getPlayerForAdmin(id: string) {
  return getPlayer(id);
}
