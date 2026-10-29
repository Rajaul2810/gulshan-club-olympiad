'use client';

import React from 'react';
import Image from 'next/image';
import { useEvent } from '@/contexts/EventContext';
import { sponsorsForYear, TIER_ORDER, TIER_STYLE, type Sponsor, type SponsorTier } from '@/data/sponsors';

type CardSize = 'lg' | 'md' | 'sm';

const TIER_SIZE: Record<SponsorTier, CardSize> = { Diamond: 'lg', Platinum: 'md', Gold: 'sm', Silver: 'sm' };

const SIZE = {
  lg: { wrap: 'w-full max-w-4xl', card: 'p-8 sm:p-12', badgeTop: '-top-4', badge: 'px-6 py-3 text-base sm:text-lg', logoBox: 'p-8 sm:p-10', logoH: 'h-40 sm:h-48', w: 350, h: 175, dot: 'w-10 h-10', icon: 'w-5 h-5', accent: 'w-20' },
  md: { wrap: 'w-full max-w-xl', card: 'p-6 sm:p-8', badgeTop: '-top-3.5', badge: 'px-5 py-2 text-sm sm:text-base', logoBox: 'p-6', logoH: 'h-28 sm:h-32', w: 260, h: 130, dot: 'w-8 h-8', icon: 'w-4 h-4', accent: 'w-16' },
  sm: { wrap: 'w-full sm:w-[calc(50%_-_0.75rem)] lg:w-[calc(25%_-_1.5rem)] max-w-xs', card: 'p-6', badgeTop: '-top-3', badge: 'px-4 py-2 text-xs sm:text-sm', logoBox: 'p-4 sm:p-5', logoH: 'h-24 sm:h-28', w: 180, h: 90, dot: 'w-7 h-7', icon: 'w-3.5 h-3.5', accent: 'w-14' },
} as const;

function SponsorCard({ sponsor, index }: { sponsor: Sponsor; index: number }) {
  const style = TIER_STYLE[sponsor.tier];
  const s = SIZE[TIER_SIZE[sponsor.tier]];

  return (
    <div className={`relative group ${s.wrap}`} style={{ animationDelay: `${index * 200}ms` }}>
      <div className={`absolute inset-0 ${style.bgColor} rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500 ${style.glowColor}`}></div>

      <div className={`relative bg-white/10 backdrop-blur-md rounded-3xl ${s.card} border ${style.borderColor} shadow-2xl group-hover:shadow-3xl transition-all duration-500 group-hover:scale-105`}>
        <div className={`absolute left-1/2 transform -translate-x-1/2 ${s.badgeTop}`}>
          <div className={`bg-gradient-to-r ${style.color} text-white rounded-full font-bold shadow-lg whitespace-nowrap ${s.badge}`}>
            {sponsor.tier} Partner
          </div>
        </div>

        <div className="pt-6 mb-4">
          <div className="relative">
            <div className={`absolute inset-0 bg-gradient-to-r ${style.color} opacity-20 rounded-2xl blur-lg group-hover:opacity-30 transition-all duration-500`}></div>
            <div className={`relative bg-white rounded-2xl ${s.logoBox} border border-white/20 shadow-lg`}>
              <div className={`flex items-center justify-center ${s.logoH}`}>
                <Image src={sponsor.logo} alt={`${sponsor.name} Logo`} width={s.w} height={s.h} className="max-w-full max-h-full object-contain" />
              </div>
            </div>
          </div>
        </div>

        <div className="absolute top-3 right-3 opacity-20 group-hover:opacity-40 transition-opacity duration-300">
          <div className={`${s.dot} bg-gradient-to-r ${style.color} rounded-full flex items-center justify-center`}>
            <svg className={`${s.icon} text-white`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
          </div>
        </div>

        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2">
          <div className={`${s.accent} h-1 bg-gradient-to-r ${style.color} rounded-full`}></div>
        </div>
      </div>
    </div>
  );
}

const SponsorSection = () => {
  const { eventLabel, year: selectedYear } = useEvent();
  const { venue, sponsors, partners } = sponsorsForYear(selectedYear);

  const tiers = TIER_ORDER.map((tier) => ({ tier, list: sponsors.filter((s) => s.tier === tier) })).filter((t) => t.list.length > 0);

  return (
    <section className="relative bg-neutral-900 py-10 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 right-10 w-32 h-32 bg-gradient-to-tr from-orange-500 to-pink-500 opacity-20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-10 w-40 h-40 bg-gradient-to-br from-yellow-400 to-orange-500 opacity-15 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 right-1/4 w-24 h-24 bg-gradient-to-tl from-blue-400 to-cyan-400 opacity-10 rounded-full blur-2xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-6 tracking-tight">
            Our Partners
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-orange-500 to-pink-500 mx-auto rounded-full"></div>
          <p className="text-xl text-gray-300 mt-6 max-w-3xl mx-auto">
            We are grateful to our esteemed partners who make Gulshan Club {eventLabel} possible
          </p>
        </div>

        <div className="text-center mb-16">
          <Image src={venue} alt="Venue Partner" width={200} height={200} className="w-100 h-100 object-contain mx-auto" />
        </div>

        {/* Sponsors, one row per tier */}
        <div className="space-y-12 lg:space-y-14">
          {tiers.map(({ tier, list }) => (
            <div key={tier} className="flex flex-wrap justify-center gap-6 lg:gap-8">
              {list.map((sponsor, index) => (
                <SponsorCard key={sponsor.name} sponsor={sponsor} index={index} />
              ))}
            </div>
          ))}
        </div>

        {/* Additional Partners Section */}
        {partners.length > 0 && (
          <div className="mt-20">
            <div className="text-center mb-12">
              <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                Other Partners
              </h3>
              <p className="text-gray-300">
                Special thanks to all our valued other partners
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
              {partners.map((partner, index) => (
                <div
                  key={partner.logo}
                  className="relative group"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/5 rounded-2xl blur-lg group-hover:blur-xl transition-all duration-500"></div>
                  <div className="relative bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 shadow-lg group-hover:shadow-2xl transition-all duration-500 group-hover:scale-105">
                    <div className="bg-white rounded-xl p-3 mb-3">
                      <div className="flex items-center justify-center h-16 sm:h-20">
                        <Image
                          src={partner.logo}
                          alt={`${partner.name} Logo`}
                          width={120}
                          height={60}
                          className="max-w-full max-h-full object-contain"
                        />
                      </div>
                    </div>
                    <div className="text-center">
                      <p className="text-xs sm:text-sm text-gray-300 font-medium">
                        {partner.tier}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-md rounded-full px-8 py-4 border border-white/20">
            <div className="w-3 h-3 bg-orange-400 rounded-full animate-pulse"></div>
            <span className="text-white font-semibold">Thank you for making Gulshan Club {eventLabel} possible</span>
            <div className="w-3 h-3 bg-pink-400 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SponsorSection;
