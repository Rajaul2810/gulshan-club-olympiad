'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useClubs } from '@/hooks/useClubs';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';


const ClubPage = () => {
  const { clubs, loading } = useClubs();

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
              {loading ? 'Loading clubs...' : `${clubs.length} esteemed clubs from across Bangladesh joining us for Olympiad 2025`}
            </p>
          </div>
        </section>

        {/* Clubs Grid */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-neutral-900">
          <div className="max-w-7xl mx-auto">
            {loading ? (
              <div className="flex justify-center py-12">
                <LoadingSpinner size="lg" />
              </div>
            ) : clubs.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {clubs.map((club, index) => (
                  <div
                    key={club.id}
                    className="relative group flex flex-col items-center bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 shadow-xl hover:border-orange-400/50 transition-all duration-300"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="mb-4 w-full flex justify-center">
                      <div className="relative bg-white rounded-xl p-2 border border-white/20 shadow-lg flex items-center justify-center h-24 w-36 group-hover:scale-105 transition-transform duration-300">
                        <Image
                          src={club.logo}
                          alt={`${club.name} Logo`}
                          width={200}
                          height={200}
                          className="max-w-full max-h-full object-contain"
                        />
                      </div>
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2 text-center line-clamp-2">{club.name}</h3>
                    
                    {/* Club Details */}
                    <div className="text-center mb-4 space-y-1">
                      {club.contact_person && (
                        <p className="text-gray-400 text-sm">Contact: {club.contact_person}</p>
                      )}
                      {club.email && (
                        <p className="text-gray-400 text-sm">{club.email}</p>
                      )}
                      {club.phone && (
                        <p className="text-gray-400 text-sm">{club.phone}</p>
                      )}
                    </div>

                    <Link
                      href={"/registration"}
                      className="mt-auto px-4 py-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white font-semibold rounded-full shadow hover:from-orange-600 hover:to-pink-600 transition-all duration-300 hover:scale-105"
                    >
                      Participate
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white/5 rounded-2xl">
                <p className="text-gray-400 text-lg">No clubs available yet</p>
                <p className="text-gray-500 text-sm mt-2">Clubs will be added soon</p>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default ClubPage;