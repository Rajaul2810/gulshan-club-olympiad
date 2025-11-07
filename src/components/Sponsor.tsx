'use client';

import React from 'react';
import Image from 'next/image';

const sponsors = [
  {
    tier: 'Diamond',
    name: 'Standard Chartered Bank',
    logo: '/images/sponser/Standard_Chartered_(2021).png',
    description: 'Diamond Partner',
    color: 'from-cyan-400 to-blue-500',
    bgColor: 'bg-gradient-to-br from-cyan-500/20 to-blue-600/20',
    borderColor: 'border-cyan-400/30',
    glowColor: 'shadow-cyan-500/20',
  },
  {
    tier: 'Platinum',
    name: 'Prime Bank PLC',
    logo: '/images/sponser/prime.jpg',
    description: 'Platinum Partner',
    color: 'from-gray-400 to-gray-600',
    bgColor: 'bg-gradient-to-br from-gray-900/20 to-gray-900/20',
    borderColor: 'border-gray-400/30',
    glowColor: 'shadow-gray-500/20',
  },
  {
    tier: 'Gold',
    name: 'Brac Bank PLC',
    logo: '/images/sponser/Brac-Bank-Logo-Vector.png',
    description: 'Gold Partner',
    color: 'from-yellow-400 to-orange-500',
    bgColor: 'bg-gradient-to-br from-yellow-500/20 to-orange-600/20',
    borderColor: 'border-yellow-400/30',
    glowColor: 'shadow-yellow-500/20',
  },
  {
    tier: 'Silver',
    name: 'Mutual Trust Bank PLC',
    logo: '/images/sponser/MtbLogo-01.png',
    description: 'Silver Partner',
    color: 'from-green-400 to-green-600',
    bgColor: 'bg-gradient-to-br from-green-500/20 to-green-600/20',
    borderColor: 'border-green-400/30',
    glowColor: 'shadow-green-500/20',
  },
];

const additionalPartners = [
  {
    tier: 'Broadcast Partner',
    name: 'T-Sports',
    logo: '/images/sponser/BroadcastPartner-01.png',
  },
  {
    tier: 'Apparel Partner',
    name: 'Dour',
    logo: '/images/sponser/ApparelPartner-01.png',
  },
  { 
    tier: 'Hydration Partner',
    name: 'sportsh2o',
    logo: '/images/sponser/HydrationPartner-01.png',
  },
  {
    tier: 'Refreshment Partner',
    name: 'ifad',
    logo: '/images/sponser/RefreshmentPartner-01.png',
  },
  {
    tier: 'Ice-Cream Partner',
    name: 'igloo',
    logo: '/images/sponser/ICECREAMPartner-01.png',
  },
  {
    tier: 'Beverage Partner',
    name: 'mum',
    logo: '/images/sponser/BeveragePartner-01.png',
  },
  {
    tier: 'Health Partner',
    name: 'Yeak hospital',
    logo: '/images/sponser/health.png',
  },
  {
    tier: 'Media Partner',
    name: 'chenel i',
    logo: '/images/sponser/MediaPartner-01.png',
  },
  {
    tier: 'Media Partner',
    name: 'DBC NEWS',
    logo: '/images/sponser/DBCNews-01.png',
  },
  {
    tier: 'Media Partner',
    name: 'atn',
    logo: '/images/sponser/MediaPartner-02.png',
  },
  {
    tier: 'Media Partner',
    name: 'Ananda TV',
    logo: '/images/sponser/MediaPartner-03.png',
  },
  {
    tier: 'Media Partner',
    name: 'boisakhai TV',
    logo: '/images/sponser/MediaPartner-04.png',
  },
  {
    tier: 'Print & Media Partner',
    name: 'Prothom Alo',
    logo: '/images/sponser/Printandmediapartners-01.png',
  },
  {
    tier: 'Print & Media Partner',
    name: 'Daily Star',
    logo: '/images/sponser/Printandmediapartners-02.png',
  },
  {
    tier: 'Print & Media Partner',
    name: 'the business standard',
    logo: '/images/sponser/Printandmediapartners-03.png',
  },
  {
    tier: 'Print & Media Partner',
    name: 'Daily Observer',
    logo: '/images/sponser/PrintMediaPartnerDailyOvserber-01.png',
  },
  {
    tier: 'Print & Media Partner',
    name: 'Daily Sun',
    logo: '/images/sponser/PrintMediaPartnerDailySun-01.png',
  },

];


const SponsorSection = () => {
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
            We are grateful to our esteemed partners who make Gulshan Club Olympiad 2025 possible
          </p>
        </div>

        <div className="text-center mb-16">
          <Image src="/images/venue.png" alt="Sponsor Background" width={200} height={200} className="w-100 h-100 object-contain mx-auto" />
        </div>

        {/* Sponsors Grid */}
        <div className="space-y-8 lg:space-y-12">
          {/* Diamond Sponsor - Full Width, Large */}
          {sponsors
            .filter(sponsor => sponsor.tier === 'Diamond')
            .map((sponsor, index) => (
              <div
                key={sponsor.tier}
                className="relative group max-w-4xl mx-auto"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                {/* Card Background Glow */}
                <div className={`absolute inset-0 ${sponsor.bgColor} rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500 ${sponsor.glowColor}`}></div>
                
                {/* Main Card */}
                <div className={`relative bg-white/10 backdrop-blur-md rounded-3xl p-8 sm:p-12 border ${sponsor.borderColor} shadow-2xl group-hover:shadow-3xl transition-all duration-500 group-hover:scale-105`}>
                  
                  {/* Tier Badge */}
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className={`px-6 py-3 bg-gradient-to-r ${sponsor.color} text-white rounded-full text-base sm:text-lg font-bold shadow-lg`}>
                      {sponsor.tier} Partner
                    </div>
                  </div>

                  {/* Logo Section */}
                  <div className="pt-8 mb-6">
                    <div className="relative">
                      {/* Logo Background Glow */}
                      <div className={`absolute inset-0 bg-gradient-to-r ${sponsor.color} opacity-20 rounded-2xl blur-lg group-hover:opacity-30 transition-all duration-500`}></div>
                      
                      {/* Logo Container */}
                      <div className="relative bg-white rounded-2xl p-8 sm:p-10 border border-white/20 shadow-lg">
                        <div className="flex items-center justify-center h-40 sm:h-48">
                          <Image
                            src={sponsor.logo}
                            alt={`${sponsor.name} Logo`}
                            width={350}
                            height={175}
                            className="max-w-full max-h-full object-contain"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Decorative Elements */}
                  <div className="absolute top-4 right-4 opacity-20 group-hover:opacity-40 transition-opacity duration-300">
                    <div className={`w-10 h-10 bg-gradient-to-r ${sponsor.color} rounded-full flex items-center justify-center`}>
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                      </svg>
                    </div>
                  </div>

                  {/* Bottom Accent */}
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2">
                    <div className={`w-20 h-1 bg-gradient-to-r ${sponsor.color} rounded-full`}></div>
                  </div>
                </div>
              </div>
            ))}

          {/* Other Sponsors - Smaller, Two Columns on Desktop, Stacked on Mobile */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 lg:gap-8 max-w-4xl mx-auto">
            {sponsors
              .filter(sponsor => sponsor.tier !== 'Diamond')
              .map((sponsor, index) => (
                <div
                  key={sponsor.tier}
                  className="relative group"
                  style={{ animationDelay: `${(index + 1) * 200}ms` }}
                >
                  {/* Card Background Glow */}
                  <div className={`absolute inset-0 ${sponsor.bgColor} rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500 ${sponsor.glowColor}`}></div>
                  
                  {/* Main Card */}
                  <div className={`relative bg-white/10 backdrop-blur-md rounded-3xl p-6 border ${sponsor.borderColor} shadow-2xl group-hover:shadow-3xl transition-all duration-500 group-hover:scale-105`}>
                    
                    {/* Tier Badge */}
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <div className={`px-4 py-2 bg-gradient-to-r ${sponsor.color} text-white rounded-full text-xs sm:text-sm font-bold shadow-lg`}>
                        {sponsor.tier} Partner
                      </div>
                    </div>

                    {/* Logo Section */}
                    <div className="pt-6 mb-4">
                      <div className="relative">
                        {/* Logo Background Glow */}
                        <div className={`absolute inset-0 bg-gradient-to-r ${sponsor.color} opacity-20 rounded-2xl blur-lg group-hover:opacity-30 transition-all duration-500`}></div>
                        
                        {/* Logo Container */}
                        <div className="relative bg-white rounded-2xl p-4 sm:p-5 border border-white/20 shadow-lg">
                          <div className="flex items-center justify-center h-24 sm:h-28">
                            <Image
                              src={sponsor.logo}
                              alt={`${sponsor.name} Logo`}
                              width={180}
                              height={90}
                              className="max-w-full max-h-full object-contain"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Decorative Elements */}
                    <div className="absolute top-3 right-3 opacity-20 group-hover:opacity-40 transition-opacity duration-300">
                      <div className={`w-7 h-7 bg-gradient-to-r ${sponsor.color} rounded-full flex items-center justify-center`}>
                        <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                        </svg>
                      </div>
                    </div>

                    {/* Bottom Accent */}
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2">
                      <div className={`w-14 h-1 bg-gradient-to-r ${sponsor.color} rounded-full`}></div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Additional Partners Section */}
        <div className="mt-20">
          <div className="text-center mb-12">
            <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4">
              Other Partners
            </h3>
            <p className="text-gray-300">
              Special thanks to all our valued other partners
            </p>
          </div>

          {/* Partners Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
            {additionalPartners.map((partner, index) => (
              <div
                key={index}
                className="relative group"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Card Background Glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/5 rounded-2xl blur-lg group-hover:blur-xl transition-all duration-500"></div>
                
                {/* Main Card */}
                <div className="relative bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 shadow-lg group-hover:shadow-2xl transition-all duration-500 group-hover:scale-105">
                  
                  {/* Logo Container */}
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

                  {/* Partner Info */}
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

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-md rounded-full px-8 py-4 border border-white/20">
            <div className="w-3 h-3 bg-orange-400 rounded-full animate-pulse"></div>
            <span className="text-white font-semibold">Thank you for making Gulshan Club Olympiad 2025 possible</span>
            <div className="w-3 h-3 bg-pink-400 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SponsorSection;
