export type SponsorTier = 'Diamond' | 'Platinum' | 'Gold' | 'Silver';

export interface Sponsor {
  tier: SponsorTier;
  name: string;
  logo: string;
}

export interface Partner {
  tier: string;
  name: string;
  logo: string;
}

export interface YearSponsors {
  venue: string;
  sponsors: Sponsor[];
  partners: Partner[];
}

export const TIER_ORDER: SponsorTier[] = ['Diamond', 'Platinum', 'Gold', 'Silver'];

export const TIER_STYLE: Record<SponsorTier, { color: string; bgColor: string; borderColor: string; glowColor: string }> = {
  Diamond: {
    color: 'from-cyan-400 to-blue-500',
    bgColor: 'bg-gradient-to-br from-cyan-500/20 to-blue-600/20',
    borderColor: 'border-cyan-400/30',
    glowColor: 'shadow-cyan-500/20',
  },
  Platinum: {
    color: 'from-gray-400 to-gray-600',
    bgColor: 'bg-gradient-to-br from-gray-900/20 to-gray-900/20',
    borderColor: 'border-gray-400/30',
    glowColor: 'shadow-gray-500/20',
  },
  Gold: {
    color: 'from-yellow-400 to-orange-500',
    bgColor: 'bg-gradient-to-br from-yellow-500/20 to-orange-600/20',
    borderColor: 'border-yellow-400/30',
    glowColor: 'shadow-yellow-500/20',
  },
  Silver: {
    color: 'from-green-400 to-green-600',
    bgColor: 'bg-gradient-to-br from-green-500/20 to-green-600/20',
    borderColor: 'border-green-400/30',
    glowColor: 'shadow-green-500/20',
  },
};

const DIR_2025 = '/images/sponser';
const DIR_2026 = '/images/sponser/2026';

const DIAMOND: Sponsor = { tier: 'Diamond', name: 'Standard Chartered Bank', logo: `${DIR_2025}/Standard_Chartered_(2021).png` };
const VENUE = '/images/venue.png';

export const SPONSORS_BY_YEAR: Record<number, YearSponsors> = {
  2026: {
    venue: VENUE,
    sponsors: [
      DIAMOND,
      { tier: 'Platinum', name: 'Eastern Bank PLC', logo: `${DIR_2026}/platinum.jpeg` },
      { tier: 'Gold', name: 'Prime Bank PLC', logo: `${DIR_2026}/gold3.jpeg` },
      { tier: 'Gold', name: 'Shahjalal Islami Bank PLC', logo: `${DIR_2026}/gold4.jpeg` },
      { tier: 'Gold', name: 'Commercial Bank', logo: `${DIR_2026}/gold1.jpeg` },
      { tier: 'Gold', name: 'IDLC Finance PLC', logo: `${DIR_2026}/gold2.jpeg` },
     

      { tier: 'Silver', name: 'BRAC Bank PLC', logo: `${DIR_2026}/silver.jpeg` },
      { tier: 'Silver', name: 'Mutual Trust Bank PLC', logo: `${DIR_2026}/silver2.jpeg` },
    ],
    partners: [],
  },
  2025: {
    venue: VENUE,
    sponsors: [
      DIAMOND,
      { tier: 'Platinum', name: 'Prime Bank PLC', logo: `${DIR_2025}/prime.jpg` },
      { tier: 'Gold', name: 'Brac Bank PLC', logo: `${DIR_2025}/Brac-Bank-Logo-Vector.png` },
      { tier: 'Silver', name: 'Mutual Trust Bank PLC', logo: `${DIR_2025}/MtbLogo-01.png` },
    ],
    partners: [
      { tier: 'Broadcast Partner', name: 'T-Sports', logo: `${DIR_2025}/BroadcastPartner-01.png` },
      { tier: 'Apparel Partner', name: 'Dour', logo: `${DIR_2025}/ApparelPartner-01.png` },
      { tier: 'Hydration Partner', name: 'Sports H2O', logo: `${DIR_2025}/HydrationPartner-01.png` },
      { tier: 'Refreshment Partner', name: 'IFAD', logo: `${DIR_2025}/RefreshmentPartner-01.png` },
      { tier: 'Ice-Cream Partner', name: 'Igloo', logo: `${DIR_2025}/ICECREAMPartner-01.png` },
      { tier: 'Beverage Partner', name: 'Mum', logo: `${DIR_2025}/BeveragePartner-01.png` },
      { tier: 'Health Partner', name: 'Yeak Hospital', logo: `${DIR_2025}/health.png` },
      { tier: 'Media Partner', name: 'Channel i', logo: `${DIR_2025}/MediaPartner-01.png` },
      { tier: 'Media Partner', name: 'DBC News', logo: `${DIR_2025}/DBCNews-01.png` },
      { tier: 'Media Partner', name: 'ATN', logo: `${DIR_2025}/MediaPartner-02.png` },
      { tier: 'Media Partner', name: 'Ananda TV', logo: `${DIR_2025}/MediaPartner-03.png` },
      { tier: 'Media Partner', name: 'Boishakhi TV', logo: `${DIR_2025}/MediaPartner-04.png` },
      { tier: 'Print & Media Partner', name: 'Prothom Alo', logo: `${DIR_2025}/Printandmediapartners-01.png` },
      { tier: 'Print & Media Partner', name: 'The Daily Star', logo: `${DIR_2025}/Printandmediapartners-02.png` },
      { tier: 'Print & Media Partner', name: 'The Business Standard', logo: `${DIR_2025}/Printandmediapartners-03.png` },
      { tier: 'Print & Media Partner', name: 'Daily Observer', logo: `${DIR_2025}/PrintMediaPartnerDailyOvserber-01.png` },
      { tier: 'Print & Media Partner', name: 'Daily Sun', logo: `${DIR_2025}/PrintMediaPartnerDailySun-01.png` },
    ],
  },
};

/** Sponsors for the year, or the most recent earlier year if that year has none yet. */
export function sponsorsForYear(year: number) {
  const years = Object.keys(SPONSORS_BY_YEAR).map(Number).sort((a, b) => b - a);
  const match = years.find((y) => y <= year) ?? years[years.length - 1];
  return { year: match, ...SPONSORS_BY_YEAR[match] };
}
