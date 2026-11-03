export interface YearLogos {
  /** Large logo on the home hero and page headers */
  hero: string;
  /** Small square-ish logo in the navbar, admin sidebar and login */
  badge: string;
  /** Logos with a solid background get rounded corners so they sit nicely on the dark UI */
  hasBackground: boolean;
}

export const LOGOS_BY_YEAR: Record<number, YearLogos> = {
  2026: {
    hero: '/images/logo_2026_emblem.jpeg',
    badge: '/images/logo_2026_emblem.jpeg',
    hasBackground: true,
  },
  2025: {
    hero: '/images/heroLogo-01.png',
    badge: '/images/Olympiad2025Logo-01.png',
    hasBackground: false,
  },
};

/** Logos for the year, or the most recent earlier year if that year has none yet. */
export function logosForYear(year: number): YearLogos {
  const years = Object.keys(LOGOS_BY_YEAR).map(Number).sort((a, b) => b - a);
  const match = years.find((y) => y <= year) ?? years[years.length - 1];
  return LOGOS_BY_YEAR[match];
}
