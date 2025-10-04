'use client';

import React from 'react';
import Image from 'next/image';

const sponsors = [
  {
    tier: 'Diamond',
    name: 'Standard Chartered Bank',
    logo: '/images/sponser/Standard_Chartered_(2021).png',
    description: 'Diamond Sponsor',
    color: 'from-cyan-400 to-blue-500',
    bgColor: 'bg-gradient-to-br from-cyan-500/20 to-blue-600/20',
    borderColor: 'border-cyan-400/30',
    glowColor: 'shadow-cyan-500/20',
  },
  {
    tier: 'Platinum',
    name: 'Prime Bank PLC',
    logo: '/images/sponser/prime.jpg',
    description: 'Platinum Sponsor',
    color: 'from-gray-400 to-gray-600',
    bgColor: 'bg-gradient-to-br from-gray-900/20 to-gray-900/20',
    borderColor: 'border-gray-400/30',
    glowColor: 'shadow-gray-500/20',
  },
  {
    tier: 'Gold',
    name: 'Brac Bank PLC',
    logo: '/images/sponser/Brac-Bank-Logo-Vector.png',
    description: 'Gold Sponsor',
    color: 'from-yellow-400 to-orange-500',
    bgColor: 'bg-gradient-to-br from-yellow-500/20 to-orange-600/20',
    borderColor: 'border-yellow-400/30',
    glowColor: 'shadow-yellow-500/20',
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
            Our Sponsors
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-orange-500 to-pink-500 mx-auto rounded-full"></div>
          <p className="text-xl text-gray-300 mt-6 max-w-3xl mx-auto">
            We are grateful to our esteemed sponsors who make Olympiad 2025 possible
          </p>
        </div>

        {/* Sponsors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
          {sponsors.map((sponsor, index) => (
            <div
              key={sponsor.tier}
              className="relative group"
              style={{ animationDelay: `${index * 200}ms` }}
            >
              {/* Card Background Glow */}
              <div className={`absolute inset-0 ${sponsor.bgColor} rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500 ${sponsor.glowColor}`}></div>
              
              {/* Main Card */}
              <div className={`relative bg-white/10 backdrop-blur-md rounded-3xl p-8 border ${sponsor.borderColor} shadow-2xl group-hover:shadow-3xl transition-all duration-500 group-hover:scale-105`}>
                
                {/* Tier Badge */}
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className={`px-4 py-2 bg-gradient-to-r ${sponsor.color} text-white rounded-full text-sm font-bold shadow-lg`}>
                    {sponsor.tier} Sponsor
                  </div>
                </div>

                {/* Logo Section */}
                <div className="pt-8 mb-6">
                  <div className="relative">
                    {/* Logo Background Glow */}
                    <div className={`absolute inset-0 bg-gradient-to-r ${sponsor.color} opacity-20 rounded-2xl blur-lg group-hover:opacity-30 transition-all duration-500`}></div>
                    
                    {/* Logo Container */}
                    <div className="relative bg-white rounded-2xl p-6 border border-white/20 shadow-lg">
                      <div className="flex items-center justify-center h-32">
                        <Image
                          src={sponsor.logo}
                          alt={`${sponsor.name} Logo`}
                          width={200}
                          height={100}
                          className="max-w-full max-h-full object-contain"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sponsor Info */}


                {/* Decorative Elements */}
                <div className="absolute top-4 right-4 opacity-20 group-hover:opacity-40 transition-opacity duration-300">
                  <div className={`w-8 h-8 bg-gradient-to-r ${sponsor.color} rounded-full flex items-center justify-center`}>
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                  </div>
                </div>

                {/* Bottom Accent */}
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2">
                  <div className={`w-16 h-1 bg-gradient-to-r ${sponsor.color} rounded-full`}></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Partners Section */}
        <div className="mt-20">
          <div className="text-center mb-12">
            <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4">
              Additional Partners
            </h3>
            <p className="text-gray-300">
              Special thanks to our venue and media partners
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Venue Partner */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
              <div className="relative bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-green-400/30 shadow-xl group-hover:shadow-2xl transition-all duration-500">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-emerald-500 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-white">Gulshan Youth Club</h4>
                    <p className="text-green-300 text-sm">Venue Partner</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Media Partners */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
              <div className="relative bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-purple-400/30 shadow-xl group-hover:shadow-2xl transition-all duration-500">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-500 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-white">Media Partners</h4>
                    <p className="text-purple-300 text-sm">Broadcasting & Coverage</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-md rounded-full px-8 py-4 border border-white/20">
            <div className="w-3 h-3 bg-orange-400 rounded-full animate-pulse"></div>
            <span className="text-white font-semibold">Thank you for making Olympiad 2025 possible</span>
            <div className="w-3 h-3 bg-pink-400 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SponsorSection;
