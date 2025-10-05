'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const clubs = [
  {
    id: 1,
    name: 'AEEA (The American Club)',
    logo: '/images/clubLogos/AEEA(TheAmericanClub)-01.png',
  },
  {
    id: 2,
    name: 'All Community Club',
    logo: '/images/clubLogos/AllCommunityClub-01.png',
  },
  {
    id: 3,
    name: 'Banani Club',
    logo: '/images/clubLogos/BananiClub-01.png',
  },
  {
    id: 4,
    name: 'Bangladesh China Club Ltd',
    logo: '/images/clubLogos/BangladeshChinaClubLtd.jpg',
  },
  {
    id: 5,
    name: 'Baridhara Cosmopolitan Club Limited',
    logo: '/images/clubLogos/BaridharaCosmopolitanClubLimited-01.png',
  },
  {
    id: 6,
    name: 'British High Commission Club',
    logo: '/images/clubLogos/BritishHighCommissionClub-01.png',
  },
  {
    id: 7,
    name: 'Cadet College Club Limited',
    logo: '/images/clubLogos/CadetCollegeClubLimited-01.png',
  },
  {
    id: 8,
    name: 'Chittagong Boat Club Limited',
    logo: '/images/clubLogos/ChittagongBoatClubLimited-01.png',
  },
  {
    id: 9,
    name: 'Chittagong Club',
    logo: '/images/clubLogos/ChittagongClub-01.png',
  },
  {
    id: 10,
    name: 'Dhaka Boat Club',
    logo: '/images/clubLogos/DhakaBoatClub-01.png',
  },
  {
    id: 11,
    name: 'Dhaka Club Ltd',
    logo: '/images/clubLogos/DhakaClubLtd-01.png',
  },
  {
    id: 12,
    name: 'German Club',
    logo: '/images/clubLogos/GermanClub-01.png',
  },
  {
    id: 13,
    name: 'Gulshan Club',
    logo: '/images/clubLogos/GulshanClubLogo-01.png',
  },
  {
    id: 14,
    name: 'Gulshan Youth Club',
    logo: '/images/clubLogos/GulshanYouthClubLogo-01.png',
  },
  {
    id: 15,
    name: 'Narayanganj Club Limited',
    logo: '/images/clubLogos/NarayanganjClubLimited-01.png',
  },
  {
    id: 16,
    name: 'Saints Club Limited',
    logo: '/images/clubLogos/SaintsClubLimited-01.png',
  },
  {
    id: 17,
    name: 'Sylhet Club Limited',
    logo: '/images/clubLogos/SylhetClubLimited-01.png',
  },
  {
    id: 18,
    name: 'The British Aid Guest House Association Club',
    logo: '/images/clubLogos/TheBritishAidGuestHouseAssociationClub-01.png',
  },
  {
    id: 19,
    name: 'The International Club Dhaka',
    logo: '/images/clubLogos/TheInternationalClubDhaka-01.png',
  },
  {
    id: 20,
    name: 'Uttara Club Limited',
    logo: '/images/clubLogos/UttaraClubLimited-01.png',
  },
  {
    id: 21,
    name: 'Dutch Club',
    logo: '/images/clubLogos/Dutchclub.jpg',
  },
  {
    id: 22,
    name: 'Gulshan North Club',
    logo: '/images/clubLogos/GulshanNorthClub.jpg',
  },
];

const ClubPage = () => {
  return (
    <div className="min-h-screen bg-neutral-900">
      <main className="">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-neutral-900 via-orange-900 to-neutral-800 py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-tr from-orange-500 to-pink-500 opacity-20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-20 right-10 w-40 h-40 bg-gradient-to-br from-yellow-400 to-orange-500 opacity-15 rounded-full blur-3xl"></div>
            <div className="absolute top-1/2 left-1/2 w-24 h-24 bg-gradient-to-tl from-blue-400 to-cyan-400 opacity-10 rounded-full blur-2xl -translate-x-1/2 -translate-y-1/2"></div>
          </div>
          <div className="relative z-10 max-w-7xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-6 tracking-tight">
              Participating Clubs
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-orange-500 to-pink-500 mx-auto rounded-full mb-6"></div>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              20 esteemed clubs from across Bangladesh joining us for Olympiad 2025
            </p>
          </div>
        </section>

        {/* Clubs Grid */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-neutral-900">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {clubs.map((club, index) => (
                <div
                  key={club.id}
                  className="relative group flex flex-col items-center bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 shadow-xl"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="mb-4 w-full flex justify-center">
                    <div className="relative bg-white rounded-xl p-2 border border-white/20 shadow-lg flex items-center justify-center h-24 w-36">
                      <Image
                        src={club.logo}
                        alt={`${club.name} Logo`}
                        width={200}
                        height={200}
                        className="max-w-full max-h-full object-contain"
                      />
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-4 text-center line-clamp-2">{club.name}</h3>
                  <Link
                    href={`http://olympiad2025.gulshanclub.com/myweb01/defaultgcl`}
                    target="_blank"
                    className="mt-auto px-4 py-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white font-semibold rounded-full shadow hover:from-orange-600 hover:to-pink-600 transition"
                  >
                    Participate
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default ClubPage;