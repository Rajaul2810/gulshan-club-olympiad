'use client';

import { useMemo } from 'react';
import { GAMES, countGameEntries, teamStatus, type Player, type TeamStatus } from '@/lib/registration/constants';

const STYLE: Record<TeamStatus, { chip: string; label: (need: number) => string }> = {
  short: { chip: 'bg-red-500/15 border-red-500/40 text-red-200', label: (need) => `needs ${need} more` },
  ok: { chip: 'bg-green-500/15 border-green-500/40 text-green-200', label: () => 'OK' },
  full: { chip: 'bg-amber-500/15 border-amber-500/40 text-amber-200', label: () => 'full' },
};

const ORDER: Record<TeamStatus, number> = { short: 0, full: 1, ok: 2 };

/** Shows each game the club has entered with players vs the min/max limits. */
export default function TeamStatusCard({ players, onSelectGame }: { players: Player[]; onSelectGame?: (game: string) => void }) {
  const rows = useMemo(() => {
    const counts = countGameEntries(players);
    return GAMES.filter((g) => counts[g.name])
      .map((g) => {
        const c = counts[g.name];
        return { game: g, count: c, status: teamStatus(g, c) };
      })
      .sort((a, b) => ORDER[a.status] - ORDER[b.status] || a.game.name.localeCompare(b.game.name));
  }, [players]);

  if (rows.length === 0) return null;
  const shortCount = rows.filter((r) => r.status === 'short').length;

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
        <h2 className="text-white font-semibold">Team Status</h2>
        <span className={`text-xs ${shortCount ? 'text-red-300' : 'text-green-300'}`}>
          {shortCount ? `${shortCount} game${shortCount > 1 ? 's' : ''} below minimum players` : 'All entered games meet the minimum'}
        </span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
        {rows.map(({ game, count, status }) => (
          <button
            key={game.name}
            type="button"
            onClick={() => onSelectGame?.(game.name)}
            className={`text-left px-3 py-2 rounded-xl border text-sm hover:brightness-125 transition ${STYLE[status].chip}`}
          >
            <div className="flex items-center justify-between gap-2">
              <span className="truncate">
                {game.icon} {game.name}
              </span>
              <span className="text-xs font-semibold whitespace-nowrap">{STYLE[status].label(game.min - count.players)}</span>
            </div>
            <div className="text-[11px] opacity-75 mt-0.5">
              {count.players}/{game.max} players{game.min > 0 ? ` (min ${game.min})` : ''}
              {game.maxChildren > 0 ? ` · ${count.children}/${game.maxChildren} children` : ''}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
