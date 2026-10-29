export interface RulesDocument {
  title: string;
  /** Path of the PDF inside /public */
  file: string;
}

// Add a new year here; the Rules page picks the brochure for the selected Olympiad year.
export const RULES_BY_YEAR: Record<number, RulesDocument> = {
  2026: { title: 'Olympiad Rules Brochure 2026', file: '/Olympiad_Rules_Brochure_2026.pdf' },
};

/** Rules for the year, or the nearest available year if that year has none. */
export function rulesForYear(year: number) {
  const years = Object.keys(RULES_BY_YEAR).map(Number).sort((a, b) => b - a);
  const match = years.find((y) => y <= year) ?? years[years.length - 1];
  return { year: match, rules: RULES_BY_YEAR[match] };
}
