'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { api, ApiError } from '@/lib/registration/client';
import { GAMES, type Player } from '@/lib/registration/constants';
import TeamStatusCard from '@/components/registration/TeamStatusCard';
import { buildReport, exportExcel, exportPdf } from '@/lib/registration/reports';
import ClubLoginModal from '@/components/registration/ClubLoginModal';
import PlayerForm from '@/components/registration/PlayerForm';
import PlayerTable from '@/components/registration/PlayerTable';

interface ClubInfo {
  id: string;
  name: string;
  slug: string;
  logo: string;
}

interface Dashboard {
  club: ClubInfo;
  event: { id: string; year: number; name: string; registration_deadline: string | null };
  isOpen: boolean;
  players: Player[];
}

type Status = 'loading' | 'login' | 'ready' | 'error';

export default function ClubRegistrationPage() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();
  const [status, setStatus] = useState<Status>('loading');
  const [error, setError] = useState('');
  const [data, setData] = useState<Dashboard | null>(null);
  const [loginClub, setLoginClub] = useState<ClubInfo | null>(null);
  const [editing, setEditing] = useState<Player | null | undefined>(undefined);
  const [search, setSearch] = useState('');
  const [gameFilter, setGameFilter] = useState('');
  const [toast, setToast] = useState('');

  const showLogin = useCallback(async () => {
    const { data: club } = await supabase.from('clubs').select('id, name, slug, logo').eq('slug', slug).maybeSingle();
    if (!club) {
      setError('Club not found.');
      setStatus('error');
      return;
    }
    setLoginClub(club as ClubInfo);
    setStatus('login');
  }, [slug]);

  const load = useCallback(async () => {
    try {
      const res = await api<Dashboard>('/api/registration/players');
      if (res.club.slug !== slug) return showLogin();
      setData(res);
      setStatus('ready');
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) return showLogin();
      setError(err instanceof Error ? err.message : 'Failed to load');
      setStatus('error');
    }
  }, [slug, showLogin]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(''), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  const players = useMemo(() => data?.players ?? [], [data]);
  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return players.filter(
      (p) =>
        (!gameFilter || p.games.includes(gameFilter)) &&
        (!q || p.name.toLowerCase().includes(q) || p.phone.includes(q) || p.account_no.toLowerCase().includes(q))
    );
  }, [players, search, gameFilter]);

  const stats = useMemo(
    () => [
      { label: 'Registered', value: players.length, color: 'text-white' },
      { label: 'Players', value: players.filter((p) => p.role === 'player').length, color: 'text-green-400' },
      { label: 'Team Managers', value: players.filter((p) => p.role === 'team_manager').length, color: 'text-amber-400' },
      { label: 'Game Entries', value: players.reduce((n, p) => n + p.games.length, 0), color: 'text-orange-400' },
    ],
    [players]
  );

  const onSaved = (player: Player) => {
    setData((d) => {
      if (!d) return d;
      const exists = d.players.some((p) => p.id === player.id);
      const list = exists ? d.players.map((p) => (p.id === player.id ? player : p)) : [...d.players, player];
      return { ...d, players: list.sort((a, b) => a.name.localeCompare(b.name)) };
    });
    setToast(editing ? 'Player updated' : 'Player registered');
    setEditing(undefined);
  };

  const onDelete = async (player: Player) => {
    if (!confirm(`Remove ${player.name} from your club's registration?`)) return;
    try {
      await api(`/api/registration/players/${player.id}`, { method: 'DELETE' });
      setData((d) => (d ? { ...d, players: d.players.filter((p) => p.id !== player.id) } : d));
      setToast('Player removed');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Delete failed');
    }
  };

  const logout = async () => {
    await fetch('/api/registration/logout', { method: 'POST' });
    router.push('/registration');
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-neutral-900 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-white/20 border-t-orange-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen bg-neutral-900 flex flex-col items-center justify-center gap-4 px-4 text-center">
        <p className="text-red-300">{error}</p>
        <Link href="/registration" className="text-orange-400 hover:text-orange-300">← Back to clubs</Link>
      </div>
    );
  }

  if (status === 'login' && loginClub) {
    return (
      <div className="min-h-screen bg-neutral-900">
        <ClubLoginModal club={loginClub} onClose={() => router.push('/registration')} onSuccess={() => { setStatus('loading'); load(); }} />
      </div>
    );
  }

  if (!data) return null;
  const { club, event, isOpen } = data;
  const exportMeta = { eventName: event.name, subtitle: club.name };
  const clubReport = () => ({ ...buildReport('unique', players), title: `${club.name} Participants` });

  return (
    <div className="min-h-screen bg-neutral-900">
      <section className="bg-gradient-to-br from-neutral-900 via-orange-950/60 to-neutral-900 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row md:items-center gap-6">
          <div className="w-20 h-20 rounded-2xl bg-white p-2 shrink-0">
            <Image src={club.logo} alt={club.name} width={80} height={80} className="w-full h-full object-contain" />
          </div>
          <div className="flex-1">
            <p className="text-orange-400 text-sm font-medium">{event.name} · Player Registration</p>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">{club.name}</h1>
            <p className={`text-sm mt-1 ${isOpen ? 'text-green-400' : 'text-red-400'}`}>
              {isOpen
                ? event.registration_deadline
                  ? `Open until ${new Date(`${event.registration_deadline}T00:00:00`).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}`
                  : 'Registration open'
                : 'Registration closed — view only'}
            </p>
          </div>
          <div className="flex gap-2">
            <button onClick={logout} className="px-4 py-2 rounded-xl bg-white/10 text-white hover:bg-white/20 text-sm">
              Logout
            </button>
            {isOpen && (
              <button
                onClick={() => setEditing(null)}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-pink-500 text-white font-semibold hover:from-orange-600 hover:to-pink-600 text-sm"
              >
                + Add Player
              </button>
            )}
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((s) => (
            <div key={s.label} className="bg-white/5 border border-white/10 rounded-2xl p-5">
              <div className={`text-3xl font-bold ${s.color}`}>{s.value}</div>
              <div className="text-gray-400 text-sm">{s.label}</div>
            </div>
          ))}
        </div>

        <TeamStatusCard players={players} onSelectGame={setGameFilter} />

        <div className="flex flex-col lg:flex-row gap-3 lg:items-center">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, phone or A/C no..."
            className="flex-1 px-4 py-2.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          <select
            value={gameFilter}
            onChange={(e) => setGameFilter(e.target.value)}
            className="lg:w-72 px-4 py-2.5 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option className="bg-neutral-900" value="">All games</option>
            {GAMES.map((g) => (
              <option className="bg-neutral-900" key={g.name} value={g.name}>
                {g.name} ({players.filter((p) => p.games.includes(g.name)).length})
              </option>
            ))}
          </select>
          <div className="flex gap-2">
            <button
              onClick={() => exportPdf(clubReport(), exportMeta)}
              disabled={players.length === 0}
              className="px-4 py-2.5 rounded-xl bg-red-500/20 text-red-200 hover:bg-red-500/30 text-sm disabled:opacity-40"
            >
              PDF
            </button>
            <button
              onClick={() => exportExcel([clubReport()], exportMeta)}
              disabled={players.length === 0}
              className="px-4 py-2.5 rounded-xl bg-green-500/20 text-green-200 hover:bg-green-500/30 text-sm disabled:opacity-40"
            >
              Excel
            </button>
          </div>
        </div>

        <PlayerTable
          players={filtered}
          canEdit={isOpen}
          onEdit={(p) => setEditing(p)}
          onDelete={onDelete}
          emptyText={players.length === 0 ? 'No players yet. Click "+ Add Player" to register your first player.' : 'No players match your search.'}
        />
      </main>

      {editing !== undefined && (
        <PlayerForm
          clubName={club.name}
          player={editing}
          endpoint="/api/registration/players"
          clubPlayers={players}
          onSaved={onSaved}
          onClose={() => setEditing(undefined)}
        />
      )}

      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-xl bg-green-600 text-white shadow-2xl text-sm font-medium">
          {toast}
        </div>
      )}
    </div>
  );
}
