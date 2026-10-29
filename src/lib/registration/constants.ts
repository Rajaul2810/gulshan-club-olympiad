import { GAME_LIMITS, sportsCategories, type GameLimit } from '@/data/sports';

export type Gender = 'male' | 'female';
export type MemberType = 'member' | 'spouse' | 'child';
export type PlayerRole = 'player' | 'team_manager';

export const GENDER_OPTIONS: { value: Gender; label: string }[] = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
];

export const MEMBER_TYPE_OPTIONS: { value: MemberType; label: string }[] = [
  { value: 'member', label: 'Member' },
  { value: 'spouse', label: 'Spouse' },
  { value: 'child', label: 'Child' },
];

export const ROLE_OPTIONS: { value: PlayerRole; label: string }[] = [
  { value: 'player', label: 'Player' },
  { value: 'team_manager', label: 'Team Manager' },
];

export const TSHIRT_SIZES = ['S', 'M', 'L', 'XL', 'XXL', 'XXXL'] as const;
export type TshirtSize = (typeof TSHIRT_SIZES)[number];

export const TSHIRT_CHART_IMAGE = '/images/t-shirt-size.jpg';

/** Polo T-shirt, Asian size chart (inches), matches the chart image. */
export const TSHIRT_MEASUREMENTS: Record<TshirtSize, { label: string; chest: number; length: number }> = {
  S: { label: 'S', chest: 19, length: 27 },
  M: { label: 'M', chest: 20, length: 28 },
  L: { label: 'L', chest: 21, length: 29 },
  XL: { label: 'XL', chest: 22, length: 30 },
  XXL: { label: '2XL', chest: 23, length: 31 },
  XXXL: { label: '3XL', chest: 24, length: 32 },
};

export const sizeLabel = (size: string) => TSHIRT_MEASUREMENTS[size as TshirtSize]?.label ?? size;

export const MAX_PHOTO_BYTES = 500 * 1024;
export const MAX_PHOTO_LABEL = '500 KB';
export const PHOTO_BUCKET = 'player-photos';

export const DECLARATION_POINTS = [
  'All information provided above is true and correct to the best of my knowledge.',
  'I am a bona fide member (or the spouse or child of a member) of the club I am registering under, and I am not registered under any other club in this Olympiad.',
  'For a child participant, the parent/guardian member gives consent and takes responsibility for the child.',
  'I am physically and medically fit to take part, and I participate at my own risk.',
  'I will abide by the rules, regulations and decisions of the organising committee and referees.',
  'I consent to photos and videos taken during the event being used for Olympiad publicity.',
];

const NO_LIMIT: GameLimit = { min: 0, max: Infinity, maxChildren: Infinity };

export const GAMES = sportsCategories.map((s) => ({
  name: s.name,
  icon: s.icon,
  gender: s.gender,
  ...(GAME_LIMITS[s.name] ?? NO_LIMIT),
}));

export type Game = (typeof GAMES)[number];

export const GAME_NAMES = GAMES.map((g) => g.name);

export const gameByName = (name: string) => GAMES.find((g) => g.name === name);

function genderAllowed(g: Game, gender: Gender | '') {
  if (!gender || /mix/i.test(g.name)) return true;
  if (g.gender === 'Male') return gender === 'male';
  if (g.gender === 'Female') return gender === 'female';
  return true;
}

/** Games a person can pick: men/women-only games follow gender; children only see games that allow children. */
export function gamesForPlayer(gender: Gender | '', memberType: MemberType | '') {
  return GAMES.filter((g) => genderAllowed(g, gender) && (memberType !== 'child' || g.maxChildren > 0));
}

export interface GameCount {
  players: number;
  children: number;
  male: number;
  female: number;
}

const EMPTY_COUNT: GameCount = { players: 0, children: 0, male: 0, female: 0 };

/** Per-game counts of a club's players (team managers excluded). Pass excludeId when editing. */
export function countGameEntries(players: Player[], excludeId?: string) {
  const counts: Record<string, GameCount> = {};
  for (const p of players) {
    if (p.id === excludeId || p.role !== 'player') continue;
    for (const g of p.games) {
      counts[g] ??= { ...EMPTY_COUNT };
      counts[g].players++;
      if (p.member_type === 'child') counts[g].children++;
      if (p.gender === 'male') counts[g].male++;
      if (p.gender === 'female') counts[g].female++;
    }
  }
  return counts;
}

/** Returns one message per game that would go over its limit; empty array means OK. */
export function checkGameCapacity(
  games: string[],
  role: PlayerRole | '',
  memberType: MemberType | '',
  gender: Gender | '',
  counts: Record<string, GameCount>
) {
  if (role !== 'player') return [];
  const problems: string[] = [];
  for (const name of games) {
    const g = gameByName(name);
    if (!g) continue;
    const c = counts[name] ?? EMPTY_COUNT;
    if (memberType === 'child' && g.maxChildren === 0) problems.push(`Children cannot play ${name}`);
    else if (c.players >= g.max) problems.push(`${name} is full (${c.players}/${g.max})`);
    else if (gender === 'male' && g.maxMale !== undefined && c.male >= g.maxMale) {
      problems.push(`${name}: male places full (${c.male}/${g.maxMale})`);
    } else if (gender === 'female' && g.maxFemale !== undefined && c.female >= g.maxFemale) {
      problems.push(`${name}: female places full (${c.female}/${g.maxFemale})`);
    } else if (memberType === 'child' && c.children >= g.maxChildren) {
      problems.push(`${name}: child limit reached (${c.children}/${g.maxChildren})`);
    }
  }
  return problems;
}

/** What a club still needs to reach the minimum, e.g. "1 more male"; empty when the minimum is met. */
export function shortfall(g: Game, c: GameCount): string[] {
  const needs: string[] = [];
  const male = Math.max(0, (g.minMale ?? 0) - c.male);
  const female = Math.max(0, (g.minFemale ?? 0) - c.female);
  if (male) needs.push(`${male} more male`);
  if (female) needs.push(`${female} more female`);
  const other = g.min - c.players - male - female;
  if (other > 0) needs.push(`${other} more`);
  return needs;
}

export type TeamStatus = 'short' | 'ok' | 'full';

export function teamStatus(g: Game, c: GameCount): TeamStatus {
  if (shortfall(g, c).length > 0) return 'short';
  if (c.players >= g.max) return 'full';
  return 'ok';
}

export function labelOf<T extends string>(options: { value: T; label: string }[], value: T) {
  return options.find((o) => o.value === value)?.label ?? value;
}

/** Digits only; Bangladeshi +880 numbers become 01XXXXXXXXX so duplicates match. */
export function normalizePhone(raw: string) {
  const digits = raw.replace(/\D/g, '');
  if (digits.startsWith('880') && digits.length === 13) return digits.slice(2);
  return digits;
}

export function ageOn(birthday: string, on = new Date()) {
  const b = new Date(birthday);
  if (Number.isNaN(b.getTime())) return null;
  let age = on.getFullYear() - b.getFullYear();
  const m = on.getMonth() - b.getMonth();
  if (m < 0 || (m === 0 && on.getDate() < b.getDate())) age--;
  return age;
}

export interface PlayerInput {
  name: string;
  phone: string;
  email: string;
  gender: Gender | '';
  member_type: MemberType | '';
  birthday: string;
  role: PlayerRole | '';
  account_no: string;
  bgf_id: string;
  tshirt_size: TshirtSize | '';
  games: string[];
  declaration_accepted: boolean;
}

export const isGolfGame = (name: string) => /^golf/i.test(name);

/** BGF (Bangladesh Golf Federation) ID is required only when a Golf event is selected. */
export const needsBgfId = (games: string[]) => games.some(isGolfGame);

export interface Player {
  id: string;
  event_id: string;
  club_id: string;
  name: string;
  phone: string;
  email: string | null;
  gender: Gender;
  member_type: MemberType;
  birthday: string;
  role: PlayerRole;
  account_no: string;
  bgf_id: string | null;
  tshirt_size: TshirtSize;
  photo_url: string | null;
  declaration_accepted: boolean;
  created_at: string;
  updated_at: string;
  games: string[];
  club?: { id: string; name: string; slug: string; logo: string } | null;
}

export const EMPTY_PLAYER: PlayerInput = {
  name: '',
  phone: '',
  email: '',
  gender: '',
  member_type: '',
  birthday: '',
  role: '',
  account_no: '',
  bgf_id: '',
  tshirt_size: '',
  games: [],
  declaration_accepted: false,
};

/** Returns a field -> message map; empty object means valid. */
export function validatePlayer(input: PlayerInput) {
  const errors: Partial<Record<keyof PlayerInput, string>> = {};
  if (input.name.trim().length < 2) errors.name = 'Name is required';
  const phone = normalizePhone(input.phone);
  if (phone.length < 7 || phone.length > 15) errors.phone = 'Enter a valid phone number';
  if (input.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email.trim())) {
    errors.email = 'Enter a valid email';
  }
  if (!GENDER_OPTIONS.some((o) => o.value === input.gender)) errors.gender = 'Select gender';
  if (!MEMBER_TYPE_OPTIONS.some((o) => o.value === input.member_type)) errors.member_type = 'Select type';
  if (!input.birthday || ageOn(input.birthday) === null) errors.birthday = 'Birthday is required';
  else if (new Date(input.birthday) > new Date()) errors.birthday = 'Birthday cannot be in the future';
  if (!ROLE_OPTIONS.some((o) => o.value === input.role)) errors.role = 'Select role';
  if (!input.account_no.trim()) errors.account_no = 'A/C number is required';
  if (needsBgfId(input.games) && !(input.bgf_id ?? '').trim()) errors.bgf_id = 'BGF ID is required for Golf events';
  if (!TSHIRT_SIZES.includes(input.tshirt_size as TshirtSize)) errors.tshirt_size = 'Select T-shirt size';
  if (input.games.length === 0) errors.games = 'Select at least one game';
  else if (input.games.some((g) => !GAME_NAMES.includes(g))) errors.games = 'Unknown game selected';
  else if (input.member_type === 'child') {
    const blocked = input.games.filter((g) => gameByName(g)?.maxChildren === 0);
    if (blocked.length) errors.games = `Children cannot play: ${blocked.join(', ')}`;
  }
  if (!input.declaration_accepted) errors.declaration_accepted = 'You must accept the declaration';
  return errors;
}
