'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import PlayerForm from '@/components/registration/PlayerForm';
import PlayerTable from '@/components/registration/PlayerTable';
import { useEvent } from '@/contexts/EventContext';
import { clearLocalAuth } from '@/lib/auth/adminAuth';
import { api, ApiError } from '@/lib/registration/client';
import { GAMES, GENDER_OPTIONS, ROLE_OPTIONS, labelOf, type Player } from '@/lib/registration/constants';
import { REPORTS, buildReport, exportExcel, exportPdf, type Report, type ReportKey } from '@/lib/registration/reports';

const selectClass =
  'w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-orange-500';

function ReportPreview({ report }: { report: Report }) {
  if (report.sections.length === 0) {
    return <div className="text-center text-gray-400 py-16 bg-white/5 rounded-2xl border border-white/10">No data for the selected filters.</div>;
  }
  return (
    <div className="space-y-6">
      {report.sections.map((s) => (
        <div key={s.title} className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
          {report.sections.length > 1 && <div className="px-4 py-3 bg-white/5 text-white font-semibold border-b border-white/10">{s.title}</div>}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-400 border-b border-white/10">
                  {s.head.map((h) => (
                    <th key={h} className="px-4 py-2.5 font-medium whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {s.body.map((row, i) => (
                  <tr key={i} className="border-b border-white/5 last:border-0 hover:bg-white/5">
                    {row.map((c, j) => (
                      <td key={j} className={`px-4 py-2 ${typeof c === 'number' ? 'text-white font-medium' : 'text-gray-300'}`}>{c}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
              {s.foot && (
                <tfoot>
                  <tr className="bg-orange-500/10 text-orange-200 font-semibold">
                    {s.foot.map((c, j) => (
                      <td key={j} className="px-4 py-2.5">{c}</td>
                    ))}
                  </tr>
                </tfoot>
              )}
            </table>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function AdminRegistrationsPage() {
  const { selectedEvent, eventLabel } = useEvent();
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tab, setTab] = useState<ReportKey>('club-summary');
  const [clubFilter, setClubFilter] = useState('');
  const [gameFilter, setGameFilter] = useState('');
  const [genderFilter, setGenderFilter] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState<Player | null>(null);
  const [exporting, setExporting] = useState(false);

  const load = useCallback(async () => {
    if (!selectedEvent) return;
    setLoading(true);
    setError('');
    try {
      const res = await api<{ players: Player[] }>(`/api/admin/registrations?eventId=${selectedEvent.id}`);
      setPlayers(res.players);
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        clearLocalAuth();
        window.location.reload();
        return;
      }
      setError(err instanceof Error ? err.message : 'Failed to load registrations');
    } finally {
      setLoading(false);
    }
  }, [selectedEvent]);

  useEffect(() => {
    load();
  }, [load]);

  const clubs = useMemo(() => {
    const map = new Map<string, string>();
    players.forEach((p) => p.club && map.set(p.club.id, p.club.name));
    return [...map.entries()].sort((a, b) => a[1].localeCompare(b[1]));
  }, [players]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return players.filter(
      (p) =>
        (!clubFilter || p.club_id === clubFilter) &&
        (!gameFilter || p.games.includes(gameFilter)) &&
        (!genderFilter || p.gender === genderFilter) &&
        (!roleFilter || p.role === roleFilter) &&
        (!q || p.name.toLowerCase().includes(q) || p.phone.includes(q) || p.account_no.toLowerCase().includes(q))
    );
  }, [players, clubFilter, gameFilter, genderFilter, roleFilter, search]);

  /** Game reports only count the filtered game, other reports keep all of a player's games. */
  const reportFor = useCallback(
    (key: ReportKey) => {
      const isGameReport = key === 'game-list' || key === 'game-summary';
      const list = gameFilter && isGameReport ? filtered.map((p) => ({ ...p, games: [gameFilter] })) : filtered;
      return buildReport(key, list);
    },
    [filtered, gameFilter]
  );

  const report = useMemo(() => reportFor(tab), [reportFor, tab]);

  const subtitle = [
    clubFilter && `Club: ${clubs.find(([id]) => id === clubFilter)?.[1]}`,
    gameFilter && `Game: ${gameFilter}`,
    genderFilter && `Gender: ${labelOf(GENDER_OPTIONS, genderFilter as 'male')}`,
    roleFilter && `Role: ${labelOf(ROLE_OPTIONS, roleFilter as 'player')}`,
  ]
    .filter(Boolean)
    .join(' · ');
  const meta = { eventName: eventLabel, subtitle: subtitle || undefined };

  const stats = [
    { label: 'Unique Players', value: filtered.length, color: 'text-white' },
    { label: 'Game Entries', value: filtered.reduce((n, p) => n + p.games.length, 0), color: 'text-orange-400' },
    { label: 'Clubs', value: new Set(filtered.map((p) => p.club_id)).size, color: 'text-blue-400' },
    { label: 'Male / Female', value: `${filtered.filter((p) => p.gender === 'male').length} / ${filtered.filter((p) => p.gender === 'female').length}`, color: 'text-pink-400' },
    { label: 'Team Managers', value: filtered.filter((p) => p.role === 'team_manager').length, color: 'text-amber-400' },
  ];

  const run = async (fn: () => Promise<void>) => {
    setExporting(true);
    try {
      await fn();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Export failed');
    } finally {
      setExporting(false);
    }
  };

  const downloadAll = () =>
    run(() =>
      exportExcel(
        (['club-summary', 'game-summary', 'eligibility', 'tshirt', 'unique'] as ReportKey[]).map(reportFor),
        meta,
        'Registration_Summary'
      )
    );

  const onDelete = async (p: Player) => {
    if (!confirm(`Delete ${p.name} (${p.club?.name})? This cannot be undone.`)) return;
    try {
      await api(`/api/admin/registrations/${p.id}`, { method: 'DELETE' });
      setPlayers((list) => list.filter((x) => x.id !== p.id));
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Delete failed');
    }
  };

  const onSaved = (saved: Player) => {
    setPlayers((list) => list.map((p) => (p.id === saved.id ? saved : p)));
    setEditing(null);
  };

  const clearFilters = () => {
    setClubFilter('');
    setGameFilter('');
    setGenderFilter('');
    setRoleFilter('');
    setSearch('');
  };

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">Registrations</h1>
            <p className="text-gray-400 mt-1">{eventLabel} · club-wise and game-wise participant reports</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button onClick={load} className="px-4 py-2.5 rounded-xl bg-white/10 text-white hover:bg-white/20 text-sm">
              Refresh
            </button>
            <button
              onClick={downloadAll}
              disabled={exporting || filtered.length === 0}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-pink-500 text-white font-semibold text-sm disabled:opacity-40"
            >
              Download All (Excel)
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {stats.map((s) => (
            <div key={s.label} className="bg-white/5 border border-white/10 rounded-2xl p-5">
              <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
              <div className="text-gray-400 text-sm">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          <select value={clubFilter} onChange={(e) => setClubFilter(e.target.value)} className={selectClass}>
            <option className="bg-neutral-900" value="">All clubs</option>
            {clubs.map(([id, name]) => (
              <option className="bg-neutral-900" key={id} value={id}>{name}</option>
            ))}
          </select>
          <select value={gameFilter} onChange={(e) => setGameFilter(e.target.value)} className={selectClass}>
            <option className="bg-neutral-900" value="">All games</option>
            {GAMES.map((g) => (
              <option className="bg-neutral-900" key={g.name} value={g.name}>{g.name}</option>
            ))}
          </select>
          <select value={genderFilter} onChange={(e) => setGenderFilter(e.target.value)} className={selectClass}>
            <option className="bg-neutral-900" value="">All genders</option>
            {GENDER_OPTIONS.map((o) => (
              <option className="bg-neutral-900" key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
          <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} className={selectClass}>
            <option className="bg-neutral-900" value="">All roles</option>
            {ROLE_OPTIONS.map((o) => (
              <option className="bg-neutral-900" key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
          <div className="flex gap-2">
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search..." className={selectClass} />
            <button onClick={clearFilters} className="px-3 rounded-xl bg-white/10 text-gray-300 hover:bg-white/20 text-sm whitespace-nowrap">
              Clear
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            {REPORTS.map((r) => (
              <button
                key={r.key}
                onClick={() => setTab(r.key)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                  tab === r.key ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white' : 'bg-white/5 text-gray-300 hover:bg-white/10'
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => run(() => exportPdf(report, meta))}
              disabled={exporting || report.sections.length === 0}
              className="px-4 py-2 rounded-xl bg-red-500/20 text-red-200 hover:bg-red-500/30 text-sm disabled:opacity-40"
            >
              Export PDF
            </button>
            <button
              onClick={() => run(() => exportExcel([report], meta))}
              disabled={exporting || report.sections.length === 0}
              className="px-4 py-2 rounded-xl bg-green-500/20 text-green-200 hover:bg-green-500/30 text-sm disabled:opacity-40"
            >
              Export Excel
            </button>
          </div>
        </div>

        <p className="text-gray-500 text-sm -mt-2">{report.description}</p>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-white/20 border-t-orange-500 rounded-full animate-spin" />
          </div>
        ) : error ? (
          <div className="bg-red-500/10 border border-red-500/30 text-red-300 rounded-2xl p-6">{error}</div>
        ) : tab === 'unique' ? (
          <PlayerTable players={filtered} showClub canEdit onEdit={setEditing} onDelete={onDelete} emptyText="No registrations for the selected filters." />
        ) : (
          <ReportPreview report={report} />
        )}
      </div>

      {editing && (
        <PlayerForm
          clubName={editing.club?.name ?? ''}
          player={editing}
          endpoint="/api/admin/registrations"
          clubPlayers={players.filter((p) => p.club_id === editing.club_id)}
          onSaved={onSaved}
          onClose={() => setEditing(null)}
        />
      )}
    </AdminLayout>
  );
}
