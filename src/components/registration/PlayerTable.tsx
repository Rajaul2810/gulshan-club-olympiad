'use client';

import {
  GENDER_OPTIONS,
  MEMBER_TYPE_OPTIONS,
  ROLE_OPTIONS,
  ageOn,
  labelOf,
  sizeLabel,
  type Player,
} from '@/lib/registration/constants';

interface PlayerTableProps {
  players: Player[];
  showClub?: boolean;
  canEdit?: boolean;
  onEdit?: (player: Player) => void;
  onDelete?: (player: Player) => void;
  emptyText?: string;
}

function Avatar({ player }: { player: Player }) {
  if (player.photo_url) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={player.photo_url} alt={player.name} className="w-10 h-10 rounded-full object-cover border border-white/20" />;
  }
  return (
    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500/40 to-pink-500/40 flex items-center justify-center text-white font-semibold">
      {player.name.charAt(0).toUpperCase()}
    </div>
  );
}

export default function PlayerTable({ players, showClub, canEdit, onEdit, onDelete, emptyText = 'No players registered yet.' }: PlayerTableProps) {
  if (players.length === 0) {
    return <div className="text-center text-gray-400 py-16 bg-white/5 rounded-2xl border border-white/10">{emptyText}</div>;
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-white/10 bg-white/5">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-gray-400 border-b border-white/10 bg-white/5">
            <th className="px-4 py-3 font-medium">Player</th>
            {showClub && <th className="px-4 py-3 font-medium">Club</th>}
            <th className="px-4 py-3 font-medium">Phone</th>
            <th className="px-4 py-3 font-medium">Details</th>
            <th className="px-4 py-3 font-medium">A/C · T-shirt</th>
            <th className="px-4 py-3 font-medium">Games</th>
            {canEdit && <th className="px-4 py-3 font-medium text-right">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {players.map((p) => (
            <tr key={p.id} className="border-b border-white/5 last:border-0 hover:bg-white/5 align-top">
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <Avatar player={p} />
                  <div>
                    <div className="text-white font-medium">{p.name}</div>
                    <div className="text-gray-500 text-xs">{p.email || '—'}</div>
                  </div>
                </div>
              </td>
              {showClub && <td className="px-4 py-3 text-gray-300">{p.club?.name ?? '—'}</td>}
              <td className="px-4 py-3 text-gray-300 whitespace-nowrap">{p.phone}</td>
              <td className="px-4 py-3">
                <div className="flex flex-wrap gap-1">
                  <span className={`px-2 py-0.5 rounded-full text-xs ${p.gender === 'male' ? 'bg-blue-500/20 text-blue-300' : 'bg-pink-500/20 text-pink-300'}`}>
                    {labelOf(GENDER_OPTIONS, p.gender)}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-xs bg-white/10 text-gray-300">{labelOf(MEMBER_TYPE_OPTIONS, p.member_type)}</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs ${p.role === 'team_manager' ? 'bg-amber-500/20 text-amber-300' : 'bg-green-500/20 text-green-300'}`}>
                    {labelOf(ROLE_OPTIONS, p.role)}
                  </span>
                </div>
                <div className="text-gray-500 text-xs mt-1">Age {ageOn(p.birthday) ?? '—'}</div>
              </td>
              <td className="px-4 py-3 text-gray-300 whitespace-nowrap">
                {p.account_no}
                <div className="text-gray-500 text-xs">Size {sizeLabel(p.tshirt_size)}</div>
                {p.bgf_id && <div className="text-green-300/80 text-xs">BGF {p.bgf_id}</div>}
              </td>
              <td className="px-4 py-3">
                <div className="flex flex-wrap gap-1 max-w-sm">
                  {p.games.map((g) => (
                    <span key={g} className="px-2 py-0.5 rounded-md text-xs bg-orange-500/15 text-orange-200 border border-orange-500/20">
                      {g}
                    </span>
                  ))}
                </div>
              </td>
              {canEdit && (
                <td className="px-4 py-3 text-right whitespace-nowrap">
                  <button onClick={() => onEdit?.(p)} className="px-3 py-1.5 rounded-lg text-xs bg-white/10 text-white hover:bg-white/20 mr-2">
                    Edit
                  </button>
                  <button onClick={() => onDelete?.(p)} className="px-3 py-1.5 rounded-lg text-xs bg-red-500/20 text-red-300 hover:bg-red-500/30">
                    Delete
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
