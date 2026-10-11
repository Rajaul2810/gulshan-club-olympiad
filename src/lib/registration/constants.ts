import { sportsCategories } from '@/data/sports';

export type Gender = 'male' | 'female';
export type MemberType = 'member' | 'spouse';
export type PlayerRole = 'player' | 'team_manager';

export const GENDER_OPTIONS: { value: Gender; label: string }[] = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
];

export const MEMBER_TYPE_OPTIONS: { value: MemberType; label: string }[] = [
  { value: 'member', label: 'Member' },
  { value: 'spouse', label: 'Spouse' },
];

export const ROLE_OPTIONS: { value: PlayerRole; label: string }[] = [
  { value: 'player', label: 'Player' },
  { value: 'team_manager', label: 'Team Manager' },
];

export const TSHIRT_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'] as const;
export type TshirtSize = (typeof TSHIRT_SIZES)[number];

export const MAX_PHOTO_BYTES = 500 * 1024;
export const MAX_PHOTO_LABEL = '500 KB';
export const PHOTO_BUCKET = 'player-photos';

export const DECLARATION_POINTS = [
  'All information provided above is true and correct to the best of my knowledge.',
  'I am a bona fide member (or spouse of a member) of the club I am registering under, and I am not registered under any other club in this Olympiad.',
  'I am physically and medically fit to take part, and I participate at my own risk.',
  'I will abide by the rules, regulations and decisions of the organising committee and referees.',
  'I consent to photos and videos taken during the event being used for Olympiad publicity.',
];

export const GAMES = sportsCategories.map((s) => ({
  name: s.name,
  icon: s.icon,
  gender: s.gender,
}));

export const GAME_NAMES = GAMES.map((g) => g.name);

/** Men-only / women-only games are hidden for the other gender; mixed events stay open. */
export function gamesForGender(gender: Gender | '') {
  if (!gender) return GAMES;
  return GAMES.filter((g) => {
    if (/mix/i.test(g.name)) return true;
    if (g.gender === 'Men') return gender === 'male';
    if (g.gender === 'Women') return gender === 'female';
    return true;
  });
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
  tshirt_size: TshirtSize | '';
  games: string[];
  declaration_accepted: boolean;
}

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
  if (!TSHIRT_SIZES.includes(input.tshirt_size as TshirtSize)) errors.tshirt_size = 'Select T-shirt size';
  if (input.games.length === 0) errors.games = 'Select at least one game';
  else if (input.games.some((g) => !GAME_NAMES.includes(g))) errors.games = 'Unknown game selected';
  if (!input.declaration_accepted) errors.declaration_accepted = 'You must accept the declaration';
  return errors;
}
