import crypto from 'crypto';
import { cookies } from 'next/headers';
import clubCredentials from '@/data/club-credentials.json';
import { RegistrationError } from './errors';

export const CLUB_COOKIE = 'club_session';
export const ADMIN_COOKIE = 'admin_session';
const SESSION_HOURS = 12;

const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? 'admin@gulshanclubolympiad.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? 'Olympiad@2025';

type Credentials = Record<string, { username: string; password: string }>;

export interface ClubSession {
  type: 'club';
  clubId: string;
  slug: string;
  exp: number;
}

export interface AdminSession {
  type: 'admin';
  email: string;
  exp: number;
}

function secret() {
  const s = process.env.REGISTRATION_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!s) throw new RegistrationError('Server is missing REGISTRATION_SECRET / SUPABASE_SERVICE_ROLE_KEY', 500);
  return s;
}

function hmac(value: string) {
  return crypto.createHmac('sha256', secret()).update(value).digest('base64url');
}

function safeEqual(a: string, b: string) {
  const ha = crypto.createHash('sha256').update(a).digest();
  const hb = crypto.createHash('sha256').update(b).digest();
  return crypto.timingSafeEqual(ha, hb);
}

function sign(payload: ClubSession | AdminSession) {
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url');
  return `${body}.${hmac(body)}`;
}

function verify<T extends { exp: number }>(token: string | undefined): T | null {
  if (!token) return null;
  const [body, sig] = token.split('.');
  if (!body || !sig || !safeEqual(sig, hmac(body))) return null;
  try {
    const payload = JSON.parse(Buffer.from(body, 'base64url').toString()) as T;
    return payload.exp > Date.now() ? payload : null;
  } catch {
    return null;
  }
}

const cookieOptions = {
  httpOnly: true,
  sameSite: 'lax' as const,
  secure: process.env.NODE_ENV === 'production',
  path: '/',
  maxAge: SESSION_HOURS * 60 * 60,
};

const expiry = () => Date.now() + SESSION_HOURS * 60 * 60 * 1000;

export function checkClubCredentials(slug: string, username: string, password: string) {
  const cred = (clubCredentials as Credentials)[slug];
  if (!cred) return false;
  const userOk = safeEqual(cred.username.toLowerCase(), username.trim().toLowerCase());
  const passOk = safeEqual(cred.password, password);
  return userOk && passOk;
}

export function hasClubCredentials(slug: string) {
  return Boolean((clubCredentials as Credentials)[slug]);
}

export function checkAdminCredentials(email: string, password: string) {
  return safeEqual(ADMIN_EMAIL.toLowerCase(), email.trim().toLowerCase()) && safeEqual(ADMIN_PASSWORD, password);
}

export async function startClubSession(clubId: string, slug: string) {
  (await cookies()).set(CLUB_COOKIE, sign({ type: 'club', clubId, slug, exp: expiry() }), cookieOptions);
}

export async function startAdminSession(email: string) {
  (await cookies()).set(ADMIN_COOKIE, sign({ type: 'admin', email, exp: expiry() }), cookieOptions);
}

export async function endSession(name: typeof CLUB_COOKIE | typeof ADMIN_COOKIE) {
  (await cookies()).delete(name);
}

export async function requireClub() {
  const session = verify<ClubSession>((await cookies()).get(CLUB_COOKIE)?.value);
  if (!session || session.type !== 'club') throw new RegistrationError('Please log in with your club username and password', 401);
  return session;
}

export async function requireAdmin() {
  const session = verify<AdminSession>((await cookies()).get(ADMIN_COOKIE)?.value);
  if (!session || session.type !== 'admin') throw new RegistrationError('Admin login required', 401);
  return session;
}
