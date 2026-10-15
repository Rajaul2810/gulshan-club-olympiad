'use client';

import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from 'react';
import Image from 'next/image';
import {
  DECLARATION_POINTS,
  EMPTY_PLAYER,
  GENDER_OPTIONS,
  MAX_PHOTO_BYTES,
  MAX_PHOTO_LABEL,
  MEMBER_TYPE_OPTIONS,
  ROLE_OPTIONS,
  TSHIRT_CHART_IMAGE,
  TSHIRT_MEASUREMENTS,
  TSHIRT_SIZES,
  checkGameCapacity,
  countGameEntries,
  gamesForPlayer,
  validatePlayer,
  type Player,
  type PlayerInput,
} from '@/lib/registration/constants';
import { ApiError, compressImage, playerToInput, submitPlayer } from '@/lib/registration/client';

interface PlayerFormProps {
  clubName: string;
  player?: Player | null;
  /** POST url for new players; `${url}/${id}` is used with PUT when editing. */
  endpoint: string;
  /** All players of this club, used to show filled places per game */
  clubPlayers: Player[];
  onSaved: (player: Player) => void;
  onClose: () => void;
}

type Errors = Partial<Record<keyof PlayerInput | 'photo' | 'form', string>>;

const inputClass =
  'w-full px-4 py-2.5 bg-white/10 border rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors';

function Field({ label, error, required, children }: { label: string; error?: string; required?: boolean; children: ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-200 mb-1.5">
        {label} {required ? <span className="text-orange-400">*</span> : <span className="text-gray-500 text-xs">(optional)</span>}
      </label>
      {children}
      {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
    </div>
  );
}

export default function PlayerForm({ clubName, player, endpoint, clubPlayers, onSaved, onClose }: PlayerFormProps) {
  const isEdit = Boolean(player);
  const [form, setForm] = useState<PlayerInput>(player ? playerToInput(player) : EMPTY_PLAYER);
  const [photo, setPhoto] = useState<File | null>(null);
  const [removePhoto, setRemovePhoto] = useState(false);
  const [preview, setPreview] = useState<string | null>(player?.photo_url ?? null);
  const [errors, setErrors] = useState<Errors>({});
  const [saving, setSaving] = useState(false);
  const [compressing, setCompressing] = useState(false);
  const [gameSearch, setGameSearch] = useState('');
  const [showSizeChart, setShowSizeChart] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      if (showSizeChart) setShowSizeChart(false);
      else if (!saving) onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose, saving, showSizeChart]);

  useEffect(() => {
    if (!photo) return;
    const url = URL.createObjectURL(photo);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [photo]);

  const availableGames = useMemo(() => gamesForPlayer(form.gender, form.member_type), [form.gender, form.member_type]);
  const visibleGames = availableGames.filter((g) => g.name.toLowerCase().includes(gameSearch.toLowerCase()));
  const counts = useMemo(() => countGameEntries(clubPlayers, player?.id), [clubPlayers, player?.id]);
  const isFull = (name: string) => checkGameCapacity([name], form.role, form.member_type, counts).length > 0;

  const set = <K extends keyof PlayerInput>(key: K, value: PlayerInput[K]) => {
    setForm((f) => {
      const next = { ...f, [key]: value };
      if (key === 'gender' || key === 'member_type') {
        const allowed = new Set(gamesForPlayer(next.gender, next.member_type).map((g) => g.name));
        next.games = f.games.filter((g) => allowed.has(g));
      }
      return next;
    });
    setErrors((e) => ({ ...e, [key]: undefined, form: undefined }));
  };

  const toggleGame = (name: string) =>
    set('games', form.games.includes(name) ? form.games.filter((g) => g !== name) : [...form.games, name]);

  const onPhoto = async (file: File | undefined) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) return setErrors((e) => ({ ...e, photo: 'Please choose an image file' }));
    setCompressing(true);
    setErrors((e) => ({ ...e, photo: undefined }));
    try {
      const compressed = await compressImage(file);
      if (compressed.size > MAX_PHOTO_BYTES) throw new Error(`Photo must be ${MAX_PHOTO_LABEL} or smaller`);
      setPhoto(compressed);
      setRemovePhoto(false);
    } catch (err) {
      setErrors((e) => ({ ...e, photo: err instanceof Error ? err.message : 'Could not process photo' }));
    } finally {
      setCompressing(false);
    }
  };

  const clearPhoto = () => {
    setPhoto(null);
    setPreview(null);
    setRemovePhoto(Boolean(player?.photo_url));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const found: Errors = validatePlayer(form);
    const capacity = checkGameCapacity(form.games, form.role, form.member_type, counts);
    if (!found.games && capacity.length > 0) found.games = capacity.join('. ');
    if (Object.keys(found).length > 0) {
      setErrors({ ...found, form: 'Please fix the highlighted fields' });
      return;
    }
    setSaving(true);
    try {
      const { player: saved } = isEdit
        ? await submitPlayer(`${endpoint}/${player!.id}`, 'PUT', form, photo, removePhoto)
        : await submitPlayer(endpoint, 'POST', form, photo, removePhoto);
      onSaved(saved);
    } catch (err) {
      if (err instanceof ApiError) setErrors({ ...(err.fields ?? {}), form: err.message });
      else setErrors({ form: 'Could not save. Please try again.' });
    } finally {
      setSaving(false);
    }
  };

  const border = (key: keyof Errors) => (errors[key] ? 'border-red-500/70' : 'border-white/20');

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-start sm:items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <form
        onSubmit={handleSubmit}
        className="bg-neutral-900 border border-white/15 rounded-3xl w-full max-w-4xl shadow-2xl my-4 flex flex-col max-h-[calc(100vh-2rem)]"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-gradient-to-r from-orange-500/20 to-pink-500/20 rounded-t-3xl">
          <div>
            <h2 className="text-xl font-bold text-white">{isEdit ? 'Edit Player' : 'Register New Player'}</h2>
            <p className="text-gray-400 text-sm">{clubName}</p>
          </div>
          <button type="button" onClick={onClose} disabled={saving} className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10" aria-label="Close">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="overflow-y-auto custom-scrollbar px-6 py-6 space-y-8">
          {/* Personal details */}
          <section>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-orange-400 mb-4">1. Personal Details</h3>
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex flex-col items-center gap-2 md:w-40 shrink-0">
                <div className="w-32 h-32 rounded-2xl bg-white/5 border border-dashed border-white/20 overflow-hidden flex items-center justify-center">
                  {preview ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={preview} alt="Player" className="w-full h-full object-cover" />
                  ) : (
                    <svg className="w-12 h-12 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  )}
                </div>
                <label className={`text-xs px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg ${compressing ? 'opacity-50 pointer-events-none' : 'cursor-pointer'}`}>
                  {compressing ? 'Compressing...' : preview ? 'Change photo' : 'Upload photo'}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    disabled={compressing}
                    onChange={(e) => {
                      onPhoto(e.target.files?.[0]);
                      e.target.value = '';
                    }}
                  />
                </label>
                {preview && !compressing && (
                  <button type="button" onClick={clearPhoto} className="text-xs text-red-400 hover:text-red-300">
                    Remove photo
                  </button>
                )}
                <p className="text-[11px] text-gray-500 text-center">
                  Optional · max {MAX_PHOTO_LABEL}
                  {photo ? ` · ${Math.round(photo.size / 1024)} KB` : ''}
                  <br />
                  Large photos are compressed automatically
                </p>
                {errors.photo && <p className="text-red-400 text-xs text-center">{errors.photo}</p>}
              </div>

              <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Full Name" required error={errors.name}>
                  <input className={`${inputClass} ${border('name')}`} value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="As per club records" />
                </Field>
                <Field label="Phone" required error={errors.phone}>
                  <input className={`${inputClass} ${border('phone')}`} value={form.phone} onChange={(e) => set('phone', e.target.value)} placeholder="01XXXXXXXXX" inputMode="tel" />
                </Field>
                <Field label="Email" error={errors.email}>
                  <input className={`${inputClass} ${border('email')}`} type="email" value={form.email} onChange={(e) => set('email', e.target.value)} placeholder="name@example.com" />
                </Field>
                <Field label="Birthday" required error={errors.birthday}>
                  <input className={`${inputClass} ${border('birthday')} [color-scheme:dark]`} type="date" value={form.birthday} max={new Date().toISOString().slice(0, 10)} onChange={(e) => set('birthday', e.target.value)} />
                </Field>
                <Field label="Gender" required error={errors.gender}>
                  <select className={`${inputClass} ${border('gender')}`} value={form.gender} onChange={(e) => set('gender', e.target.value as PlayerInput['gender'])}>
                    <option className="bg-neutral-900" value="">Select gender</option>
                    {GENDER_OPTIONS.map((o) => (
                      <option className="bg-neutral-900" key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </Field>
                <Field label="Type" required error={errors.member_type}>
                  <select className={`${inputClass} ${border('member_type')}`} value={form.member_type} onChange={(e) => set('member_type', e.target.value as PlayerInput['member_type'])}>
                    <option className="bg-neutral-900" value="">Select type</option>
                    {MEMBER_TYPE_OPTIONS.map((o) => (
                      <option className="bg-neutral-900" key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </Field>
                <Field label="Role" required error={errors.role}>
                  <select className={`${inputClass} ${border('role')}`} value={form.role} onChange={(e) => set('role', e.target.value as PlayerInput['role'])}>
                    <option className="bg-neutral-900" value="">Select role</option>
                    {ROLE_OPTIONS.map((o) => (
                      <option className="bg-neutral-900" key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </Field>
                <Field label={form.member_type === 'child' ? "Parent's Member A/C No." : 'Member A/C No.'} required error={errors.account_no}>
                  <input
                    className={`${inputClass} ${border('account_no')}`}
                    value={form.account_no}
                    onChange={(e) => set('account_no', e.target.value)}
                    placeholder={form.member_type === 'member' ? 'Membership account no.' : "Member's account no."}
                  />
                </Field>
                <Field label="T-shirt Size" required error={errors.tshirt_size}>
                  <div className="flex gap-2">
                    <select className={`${inputClass} ${border('tshirt_size')}`} value={form.tshirt_size} onChange={(e) => set('tshirt_size', e.target.value as PlayerInput['tshirt_size'])}>
                      <option className="bg-neutral-900" value="">Select size</option>
                      {TSHIRT_SIZES.map((s) => {
                        const m = TSHIRT_MEASUREMENTS[s];
                        return (
                          <option className="bg-neutral-900" key={s} value={s}>
                            {m.label} — Chest {m.chest}″, Length {m.length}″
                          </option>
                        );
                      })}
                    </select>
                    <button
                      type="button"
                      onClick={() => setShowSizeChart(true)}
                      className="shrink-0 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-orange-300 text-xs font-medium"
                    >
                      Size chart
                    </button>
                  </div>
                </Field>
              </div>
            </div>
          </section>

          {/* Games */}
          <section>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-4">
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-orange-400">
                  2. Game Categories <span className="text-orange-400">*</span>
                </h3>
                <p className="text-gray-400 text-xs mt-1">
                  {form.gender ? 'Select every game this person will play.' : 'Select gender first to see the matching games.'}{' '}
                  {form.member_type === 'child' && 'Only games that allow children are shown. '}
                  <span className="text-white font-medium">{form.games.length} selected</span>
                </p>
              </div>
              <input className={`${inputClass} border-white/20 sm:max-w-xs py-2 text-sm`} placeholder="Search games..." value={gameSearch} onChange={(e) => setGameSearch(e.target.value)} />
            </div>
            <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 p-3 rounded-2xl border ${errors.games ? 'border-red-500/70' : 'border-white/10'} bg-white/[0.03]`}>
              {visibleGames.map((g) => {
                const checked = form.games.includes(g.name);
                const full = !checked && isFull(g.name);
                const c = counts[g.name] ?? { players: 0, children: 0 };
                return (
                  <label
                    key={g.name}
                    title={full ? 'No places left for your club' : undefined}
                    className={`flex items-center gap-3 px-3 py-2 rounded-xl border text-sm transition-colors ${
                      full
                        ? 'bg-white/[0.02] border-transparent text-gray-600 cursor-not-allowed'
                        : checked
                          ? 'bg-orange-500/20 border-orange-500/60 text-white cursor-pointer'
                          : 'bg-white/5 border-transparent text-gray-300 hover:bg-white/10 cursor-pointer'
                    }`}
                  >
                    <input type="checkbox" className="accent-orange-500 w-4 h-4" checked={checked} disabled={full} onChange={() => toggleGame(g.name)} />
                    <span className="text-lg leading-none">{g.icon}</span>
                    <span className="flex-1 leading-tight">
                      {g.name}
                      <span className={`block text-[11px] ${full ? 'text-red-400/70' : 'text-gray-500'}`}>
                        {full ? 'Full · ' : ''}
                        {c.players}/{g.max} players
                        {g.maxChildren > 0 ? ` · ${c.children}/${g.maxChildren} children` : ' · no children'}
                        {g.min > 0 ? ` · min ${g.min}` : ''}
                      </span>
                    </span>
                  </label>
                );
              })}
              {visibleGames.length === 0 && <p className="text-gray-500 text-sm p-2">No games match your search.</p>}
            </div>
            {errors.games && <p className="text-red-400 text-xs mt-1">{errors.games}</p>}
          </section>

          {/* Declaration */}
          <section>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-orange-400 mb-4">3. Declaration</h3>
            <div className={`rounded-2xl border p-4 bg-white/[0.03] ${errors.declaration_accepted ? 'border-red-500/70' : 'border-white/10'}`}>
              <ol className="list-decimal list-inside space-y-1.5 text-sm text-gray-300 mb-4">
                {DECLARATION_POINTS.map((d) => (
                  <li key={d}>{d}</li>
                ))}
              </ol>
              <label className="flex items-start gap-3 cursor-pointer">
                <input type="checkbox" className="accent-orange-500 w-5 h-5 mt-0.5" checked={form.declaration_accepted} onChange={(e) => set('declaration_accepted', e.target.checked)} />
                <span className="text-white text-sm font-medium">
                  I have read and agree to the declaration above on behalf of this participant.
                </span>
              </label>
            </div>
            {errors.declaration_accepted && <p className="text-red-400 text-xs mt-1">{errors.declaration_accepted}</p>}
          </section>
        </div>

        <div className="px-6 py-4 border-t border-white/10 flex flex-col-reverse sm:flex-row sm:items-center gap-3 sm:justify-between">
          <p className="text-sm text-red-400 min-h-5">{errors.form}</p>
          <div className="flex gap-3">
            <button type="button" onClick={onClose} disabled={saving} className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-white/10 text-white hover:bg-white/20 disabled:opacity-50">
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving || compressing}
              className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-pink-500 text-white font-semibold hover:from-orange-600 hover:to-pink-600 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {saving && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
              {isEdit ? 'Save Changes' : 'Register Player'}
            </button>
          </div>
        </div>
      </form>

      {showSizeChart && (
        <div className="fixed inset-0 z-[60] bg-black/85 flex items-center justify-center p-4" onClick={() => setShowSizeChart(false)}>
          <div className="relative w-full max-w-4xl" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={() => setShowSizeChart(false)}
              className="absolute -top-10 right-0 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-sm"
            >
              Close ✕
            </button>
            <Image
              src={TSHIRT_CHART_IMAGE}
              alt="Polo T-shirt Asian size chart"
              width={1024}
              height={474}
              className="w-full h-auto rounded-2xl shadow-2xl"
            />
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              {TSHIRT_SIZES.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => {
                    set('tshirt_size', s);
                    setShowSizeChart(false);
                  }}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold ${
                    form.tshirt_size === s ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white' : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  {TSHIRT_MEASUREMENTS[s].label}
                </button>
              ))}
            </div>
            <p className="text-center text-gray-400 text-xs mt-2">Tap a size to select it</p>
          </div>
        </div>
      )}
    </div>
  );
}
