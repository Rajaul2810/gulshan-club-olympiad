import { MAX_PHOTO_BYTES, type Player, type PlayerInput } from './constants';

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public fields?: Record<string, string>
  ) {
    super(message);
  }
}

export async function api<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, { cache: 'no-store', ...init });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new ApiError(json.error || 'Request failed', res.status, json.fields);
  return json as T;
}

export function submitPlayer(
  url: string,
  method: 'POST' | 'PUT',
  input: PlayerInput,
  photo: File | null,
  removePhoto: boolean
) {
  const body = new FormData();
  body.append('data', JSON.stringify(input));
  if (photo) body.append('photo', photo);
  if (removePhoto) body.append('removePhoto', 'true');
  return api<{ player: Player }>(url, { method, body });
}

function loadImage(file: File) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Could not read this image. Try a JPG or PNG.'));
    };
    img.src = url;
  });
}

/** Resizes to max 800px and re-encodes as JPEG until it fits under MAX_PHOTO_BYTES. */
export async function compressImage(file: File, maxSide = 800): Promise<File> {
  const img = await loadImage(file);
  let side = maxSide;

  for (let attempt = 0; attempt < 4; attempt++) {
    const scale = Math.min(1, side / Math.max(img.width, img.height));
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(img.width * scale);
    canvas.height = Math.round(img.height * scale);
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    for (const quality of [0.85, 0.75, 0.65, 0.5]) {
      const blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, 'image/jpeg', quality));
      if (blob && blob.size <= MAX_PHOTO_BYTES) {
        const name = file.name.replace(/\.[^.]+$/, '') + '.jpg';
        return new File([blob], name, { type: 'image/jpeg' });
      }
    }
    side = Math.round(side * 0.7);
  }
  throw new Error('Could not compress this photo enough. Please choose a smaller image.');
}

export function playerToInput(p: Player): PlayerInput {
  return {
    name: p.name,
    phone: p.phone,
    email: p.email ?? '',
    gender: p.gender,
    member_type: p.member_type,
    birthday: p.birthday,
    role: p.role,
    account_no: p.account_no,
    bgf_id: p.bgf_id ?? '',
    tshirt_size: p.tshirt_size,
    games: p.games,
    declaration_accepted: true,
  };
}
