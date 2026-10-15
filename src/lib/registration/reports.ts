import {
  GENDER_OPTIONS,
  MEMBER_TYPE_OPTIONS,
  ROLE_OPTIONS,
  GAMES,
  TSHIRT_SIZES,
  ageOn,
  countGameEntries,
  labelOf,
  sizeLabel,
  teamStatus,
  type Player,
} from './constants';

type Cell = string | number;

export interface ReportSection {
  title: string;
  head: string[];
  body: Cell[][];
  foot?: Cell[];
}

export interface Report {
  key: ReportKey;
  title: string;
  description: string;
  sections: ReportSection[];
  landscape?: boolean;
  /** Excel: one sheet per section instead of stacking sections in one sheet. */
  sheetPerSection?: boolean;
}

export type ReportKey = 'club-list' | 'club-summary' | 'game-list' | 'game-summary' | 'eligibility' | 'unique' | 'tshirt';

export const REPORTS: { key: ReportKey; label: string }[] = [
  { key: 'club-summary', label: 'Club-wise Count' },
  { key: 'club-list', label: 'Club-wise Participants' },
  { key: 'game-summary', label: 'Game-wise Count' },
  { key: 'game-list', label: 'Game-wise Participants' },
  { key: 'eligibility', label: 'Team Eligibility' },
  { key: 'unique', label: 'Unique Players' },
  { key: 'tshirt', label: 'T-shirt Sizes' },
];

const gender = (p: Player) => labelOf(GENDER_OPTIONS, p.gender);
const type = (p: Player) => labelOf(MEMBER_TYPE_OPTIONS, p.member_type);
const role = (p: Player) => labelOf(ROLE_OPTIONS, p.role);
const clubName = (p: Player) => p.club?.name ?? '-';
const byName = (a: Player, b: Player) => a.name.localeCompare(b.name);

function groupBy<K extends string>(items: Player[], key: (p: Player) => K | K[]) {
  const map = new Map<K, Player[]>();
  for (const p of items) {
    const keys = key(p);
    for (const k of Array.isArray(keys) ? keys : [keys]) {
      if (!map.has(k)) map.set(k, []);
      map.get(k)!.push(p);
    }
  }
  return [...map.entries()].sort(([a], [b]) => a.localeCompare(b));
}

const count = (list: Player[], fn: (p: Player) => boolean) => list.filter(fn).length;

function clubList(players: Player[]): Report {
  const head = ['#', 'Name', 'Phone', 'Gender', 'Type', 'Role', 'A/C No', 'T-shirt', 'Games'];
  return {
    key: 'club-list',
    title: 'Club-wise Participant List',
    description: 'Every club with its registered players.',
    landscape: true,
    sheetPerSection: true,
    sections: groupBy(players, clubName).map(([club, list]) => ({
      title: `${club} (${list.length})`,
      head,
      body: list
        .sort(byName)
        .map((p, i) => [i + 1, p.name, p.phone, gender(p), type(p), role(p), p.account_no, sizeLabel(p.tshirt_size), p.games.join(', ')]),
    })),
  };
}

function clubSummary(players: Player[]): Report {
  const rows = groupBy(players, clubName).map(([club, list]) => [
    club,
    list.length,
    count(list, (p) => p.gender === 'male'),
    count(list, (p) => p.gender === 'female'),
    count(list, (p) => p.member_type === 'member'),
    count(list, (p) => p.member_type === 'spouse'),
    count(list, (p) => p.member_type === 'child'),
    count(list, (p) => p.role === 'player'),
    count(list, (p) => p.role === 'team_manager'),
    list.reduce((n, p) => n + p.games.length, 0),
  ]);
  const total = (i: number) => rows.reduce((n, r) => n + (r[i] as number), 0);
  return {
    key: 'club-summary',
    title: 'Club-wise Participant Count',
    description: 'Totals per club. Game entries count one row per player per game.',
    landscape: true,
    sections: [
      {
        title: 'Club-wise Count',
        head: ['Club', 'Players', 'Male', 'Female', 'Members', 'Spouses', 'Children', 'Player Role', 'Team Managers', 'Game Entries'],
        body: rows,
        foot: ['TOTAL', ...[1, 2, 3, 4, 5, 6, 7, 8, 9].map(total)],
      },
    ],
  };
}

function gameList(players: Player[]): Report {
  const head = ['#', 'Name', 'Club', 'Gender', 'Role', 'Phone', 'Age'];
  return {
    key: 'game-list',
    title: 'Game-wise Participant List',
    description: 'Every game with its registered players.',
    sheetPerSection: true,
    sections: groupBy(players, (p) => p.games).map(([game, list]) => ({
      title: `${game} (${list.length})`,
      head,
      body: list
        .sort((a, b) => clubName(a).localeCompare(clubName(b)) || byName(a, b))
        .map((p, i) => [i + 1, p.name, clubName(p), gender(p), role(p), p.phone, ageOn(p.birthday) ?? '-']),
    })),
  };
}

function gameSummary(players: Player[]): Report {
  const rows = groupBy(players, (p) => p.games).map(([game, list]) => {
    const clubs = groupBy(list, clubName);
    return [
      game,
      list.length,
      count(list, (p) => p.gender === 'male'),
      count(list, (p) => p.gender === 'female'),
      clubs.length,
      clubs.map(([c, l]) => `${c} (${l.length})`).join(', '),
    ];
  });
  return {
    key: 'game-summary',
    title: 'Game-wise Participant Count',
    description: 'Entries per game with club breakdown.',
    landscape: true,
    sections: [
      {
        title: 'Game-wise Count',
        head: ['Game', 'Entries', 'Male', 'Female', 'Clubs', 'Club Breakdown'],
        body: rows,
        foot: ['TOTAL', ...[1, 2, 3].map((i) => rows.reduce((n, r) => n + (r[i] as number), 0)), '', ''],
      },
    ],
  };
}

function uniquePlayers(players: Player[]): Report {
  return {
    key: 'unique',
    title: 'Unique Player List',
    description: 'Each person once, with all games they entered.',
    landscape: true,
    sections: [
      {
        title: `Unique Players (${players.length})`,
        head: ['#', 'Name', 'Club', 'Phone', 'Email', 'Gender', 'Type', 'Role', 'Birthday', 'Age', 'A/C No', 'T-shirt', 'Games', 'No. of Games'],
        body: [...players]
          .sort((a, b) => clubName(a).localeCompare(clubName(b)) || byName(a, b))
          .map((p, i) => [
            i + 1,
            p.name,
            clubName(p),
            p.phone,
            p.email ?? '',
            gender(p),
            type(p),
            role(p),
            p.birthday,
            ageOn(p.birthday) ?? '-',
            p.account_no,
            sizeLabel(p.tshirt_size),
            p.games.join(', '),
            p.games.length,
          ]),
      },
    ],
  };
}

function tshirtSummary(players: Player[]): Report {
  const rows = groupBy(players, clubName).map(([club, list]) => [
    club,
    ...TSHIRT_SIZES.map((s) => count(list, (p) => p.tshirt_size === s)),
    list.length,
  ]);
  return {
    key: 'tshirt',
    title: 'T-shirt Size Summary',
    description: 'T-shirt sizes needed per club.',
    sections: [
      {
        title: 'T-shirt Sizes',
        head: ['Club', ...TSHIRT_SIZES.map(sizeLabel), 'Total'],
        body: rows,
        foot: ['TOTAL', ...TSHIRT_SIZES.map((_, i) => rows.reduce((n, r) => n + (r[i + 1] as number), 0)), players.length],
      },
    ],
  };
}

const STATUS_LABEL = { short: 'Below minimum', ok: 'OK', full: 'Full' } as const;

function eligibility(players: Player[]): Report {
  const body: Cell[][] = [];
  for (const [club, list] of groupBy(players, clubName)) {
    const counts = countGameEntries(list);
    for (const g of GAMES) {
      const c = counts[g.name];
      if (!c) continue;
      const status = teamStatus(g, c);
      body.push([
        club,
        g.name,
        c.players,
        c.children,
        g.min,
        g.max,
        g.maxChildren,
        status === 'short' ? `${STATUS_LABEL.short} (needs ${g.min - c.players})` : STATUS_LABEL[status],
      ]);
    }
  }
  const short = body.filter((r) => String(r[7]).startsWith(STATUS_LABEL.short)).length;
  return {
    key: 'eligibility',
    title: 'Team Eligibility',
    description: 'Each club team vs the minimum/maximum player rules (team managers not counted).',
    landscape: true,
    sections: [
      {
        title: `Team Eligibility (${short} below minimum)`,
        head: ['Club', 'Game', 'Players', 'Children', 'Min', 'Max', 'Max Children', 'Status'],
        body,
      },
    ],
  };
}

const BUILDERS: Record<ReportKey, (players: Player[]) => Report> = {
  eligibility,
  'club-list': clubList,
  'club-summary': clubSummary,
  'game-list': gameList,
  'game-summary': gameSummary,
  unique: uniquePlayers,
  tshirt: tshirtSummary,
};

export function buildReport(key: ReportKey, players: Player[]) {
  return BUILDERS[key](players);
}

export interface ExportMeta {
  eventName: string;
  subtitle?: string;
}

const fileSafe = (s: string) => s.replace(/[^\w-]+/g, '_').replace(/_+/g, '_');

export async function exportPdf(report: Report, meta: ExportMeta) {
  const { jsPDF } = await import('jspdf');
  const autoTable = (await import('jspdf-autotable')).default;
  const doc = new jsPDF({ orientation: report.landscape ? 'landscape' : 'portrait', unit: 'pt', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const generated = new Date().toLocaleString('en-GB');

  doc.setFontSize(16).setFont('helvetica', 'bold').text(`${meta.eventName} - ${report.title}`, 40, 40);
  doc.setFontSize(9).setFont('helvetica', 'normal').setTextColor(110);
  doc.text(`Generated: ${generated}${meta.subtitle ? `   |   ${meta.subtitle}` : ''}`, 40, 56);
  doc.setTextColor(0);

  let y = 72;
  for (const section of report.sections) {
    if (report.sections.length > 1) {
      if (y > doc.internal.pageSize.getHeight() - 80) {
        doc.addPage();
        y = 40;
      }
      doc.setFontSize(11).setFont('helvetica', 'bold').text(section.title, 40, y + 10);
      y += 16;
    }
    autoTable(doc, {
      startY: y,
      head: [section.head],
      body: section.body,
      foot: section.foot ? [section.foot] : undefined,
      margin: { left: 40, right: 40 },
      styles: { fontSize: 8, cellPadding: 3, overflow: 'linebreak' },
      headStyles: { fillColor: [234, 88, 12], textColor: 255 },
      footStyles: { fillColor: [240, 240, 240], textColor: 20, fontStyle: 'bold' },
      alternateRowStyles: { fillColor: [250, 247, 245] },
      showFoot: 'lastPage',
    });
    y = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 20;
  }

  const pages = doc.getNumberOfPages();
  for (let i = 1; i <= pages; i++) {
    doc.setPage(i);
    doc.setFontSize(8).setTextColor(130);
    doc.text(`Page ${i} of ${pages}`, pageWidth - 40, doc.internal.pageSize.getHeight() - 20, { align: 'right' });
  }

  doc.save(`${fileSafe(`${meta.eventName}_${report.title}`)}.pdf`);
}

function sheetName(title: string, used: Set<string>) {
  const base = title.replace(/[[\]:*?/\\]/g, '').slice(0, 28) || 'Sheet';
  let name = base;
  for (let i = 2; used.has(name.toLowerCase()); i++) name = `${base.slice(0, 26)}_${i}`;
  used.add(name.toLowerCase());
  return name;
}

function sectionRows(section: ReportSection) {
  return [section.head, ...section.body, ...(section.foot ? [section.foot] : [])];
}

function columnWidths(rows: Cell[][]) {
  const widths: number[] = [];
  for (const row of rows) row.forEach((c, i) => (widths[i] = Math.min(60, Math.max(widths[i] ?? 6, String(c).length + 2))));
  return widths.map((wch) => ({ wch }));
}

/** Pass several reports to build one workbook (e.g. "Download all"). */
export async function exportExcel(reports: Report[], meta: ExportMeta, fileTitle?: string) {
  const XLSX = await import('xlsx');
  const wb = XLSX.utils.book_new();
  const used = new Set<string>();

  for (const report of reports) {
    if (report.sheetPerSection) {
      for (const section of report.sections) {
        const rows = sectionRows(section);
        const ws = XLSX.utils.aoa_to_sheet(rows);
        ws['!cols'] = columnWidths(rows);
        XLSX.utils.book_append_sheet(wb, ws, sheetName(section.title.replace(/\s*\(\d+\)$/, ''), used));
      }
    } else {
      const rows: Cell[][] = [];
      report.sections.forEach((section, i) => {
        if (i > 0) rows.push([]);
        if (report.sections.length > 1) rows.push([section.title]);
        rows.push(...sectionRows(section));
      });
      const ws = XLSX.utils.aoa_to_sheet(rows);
      ws['!cols'] = columnWidths(rows);
      XLSX.utils.book_append_sheet(wb, ws, sheetName(report.title, used));
    }
  }

  if (wb.SheetNames.length === 0) {
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet([['No data']]), 'Empty');
  }

  XLSX.writeFile(wb, `${fileSafe(`${meta.eventName}_${fileTitle ?? reports[0]?.title ?? 'Report'}`)}.xlsx`);
}
