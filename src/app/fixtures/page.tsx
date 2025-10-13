"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useFixtures } from "@/hooks/useFixtures";
import { useClubs } from "@/hooks/useClubs";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import SportsCategorySection from "@/components/SportsCategory";

const FixturesPage = () => {
  const router = useRouter();
  const { fixtures, loading } = useFixtures();
  const { clubs } = useClubs();
  
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    // Set target date (you can adjust this)
    const targetDate = new Date("2025-10-15T00:00:00").getTime();

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance > 0) {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor(
            (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
          ),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Filter scheduled and ongoing fixtures
  const upcomingFixtures = useMemo(() => {
    return fixtures
      .filter((f) => f.status === 'scheduled' || f.status === 'ongoing')
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [fixtures]);

  // Helper to get team name
  const getTeamName = (teamId: string) => {
    const team = clubs.find((c) => c.id === teamId);
    return team?.name || 'TBA';
  };

  // Group fixtures by sport
  const fixturesBySport = useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const grouped: { [key: string]: any[] } = {};
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    upcomingFixtures.forEach((fixture: any) => {
      if (!grouped[fixture.sport]) {
        grouped[fixture.sport] = [];
      }
      grouped[fixture.sport].push(fixture);
    });
    return grouped;
  }, [upcomingFixtures]);

  return (
    <div className="min-h-screen bg-neutral-900">
      <main>
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-neutral-900 via-orange-900 to-neutral-800 py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
          {/* Background Elements */}
          <div className="absolute inset-0">
            <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-tr from-orange-500 to-pink-500 opacity-20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-20 right-10 w-40 h-40 bg-gradient-to-br from-yellow-400 to-orange-500 opacity-15 rounded-full blur-3xl animate-bounce"></div>
            <div className="absolute top-1/2 left-1/2 w-24 h-24 bg-gradient-to-tl from-blue-400 to-cyan-400 opacity-10 rounded-full blur-2xl animate-ping"></div>
          </div>

          <div className="relative z-10 max-w-7xl mx-auto text-center">
            <div className="mb-8">
              <div className="inline-flex items-center gap-2 bg-orange-500/20 text-orange-300 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
                {upcomingFixtures.length > 0 ? `${upcomingFixtures.length} Fixtures Scheduled` : 'Fixtures Coming Soon'}
              </div>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold text-white mb-6 tracking-tight">
              <span className="block">Olympiad 2025</span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-500 text-3xl sm:text-4xl lg:text-5xl mt-2">
                Fixtures
              </span>
            </h1>

            <p className="text-xl sm:text-2xl text-gray-200 max-w-3xl mx-auto leading-relaxed mb-12">
              {upcomingFixtures.length > 0 
                ? 'Check out the complete schedule of matches across all sports'
                : 'Get ready for the most exciting sports competition in Bangladesh. Fixtures will be published very soon.'}
            </p>

            {/* Countdown Timer */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 max-w-2xl mx-auto mb-12">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-6 border border-white/20">
                <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-orange-400 mb-2">
                  {timeLeft.days}
                </div>
                <div className="text-white text-sm font-medium">Days</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-6 border border-white/20">
                <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-pink-400 mb-2">
                  {timeLeft.hours}
                </div>
                <div className="text-white text-sm font-medium">Hours</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-6 border border-white/20">
                <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-blue-400 mb-2">
                  {timeLeft.minutes}
                </div>
                <div className="text-white text-sm font-medium">Minutes</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-6 border border-white/20">
                <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-green-400 mb-2">
                  {timeLeft.seconds}
                </div>
                <div className="text-white text-sm font-medium">Seconds</div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => router.push("/club")}
                className="border-2 border-white text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white hover:text-neutral-900 transition-all duration-300 transform hover:scale-105"
              >
                View Participating Clubs
              </button>
            </div>
          </div>
        </section>

        {/* Fixtures List */}
        {upcomingFixtures.length > 0 && (
          <section className="py-16 px-4 sm:px-6 lg:px-8 bg-neutral-900">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4 tracking-tight">
                  Upcoming Matches
                </h2>
                <div className="w-24 h-1 bg-gradient-to-r from-orange-500 to-pink-500 mx-auto rounded-full mb-6"></div>
                <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                  Complete schedule of all matches organized by sport
                </p>
              </div>

              {loading ? (
                <div className="flex justify-center py-12">
                  <LoadingSpinner size="lg" />
                </div>
              ) : (
                <div className="space-y-12">
                  {Object.entries(fixturesBySport).map(([sport, sportFixtures]) => (
                    <div key={sport}>
                      {/* Sport Header */}
                      <div className="mb-6">
                        <h3 className="text-2xl font-bold text-white mb-2 flex items-center gap-3">
                          <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
                          {sport}
                        </h3>
                        <p className="text-gray-400 text-sm">
                          {sportFixtures.length} {sportFixtures.length === 1 ? 'match' : 'matches'} scheduled
                        </p>
                      </div>

                      {/* Fixtures Grid */}
                      <div className="grid gap-4">
                        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                        {sportFixtures.map((fixture: any) => {
                          const team1Name = getTeamName(fixture.team1_id);
                          const team2Name = getTeamName(fixture.team2_id);

                          return (
                            <div
                              key={fixture.id}
                              className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:border-orange-400/50 transition-all duration-300 group"
                            >
                              <div className="grid md:grid-cols-3 gap-6 items-center">
                                {/* Date & Time */}
                                <div className="text-center md:text-left">
                                  <div className="text-orange-400 font-bold text-lg mb-1">
                                    {new Date(fixture.date).toLocaleDateString("en-US", {
                                      weekday: "short",
                                      month: "short",
                                      day: "numeric",
                                    })}
                                  </div>
                                  <div className="text-gray-300 text-sm">{fixture.time}</div>
                                  <div className="text-gray-400 text-xs mt-2 flex items-center justify-center md:justify-start gap-1">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    {fixture.venue}
                                  </div>
                                </div>

                                {/* Teams */}
                                <div className="flex items-center justify-center gap-4">
                                  <div className="text-center flex-1">
                                    <div className="text-white font-bold text-lg">{team1Name}</div>
                                  </div>
                                  <div className="text-2xl font-bold text-gray-500 group-hover:text-orange-400 transition-colors">
                                    VS
                                  </div>
                                  <div className="text-center flex-1">
                                    <div className="text-white font-bold text-lg">{team2Name}</div>
                                  </div>
                                </div>

                                {/* Status */}
                                <div className="text-center md:text-right">
                                  <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${
                                    fixture.status === 'scheduled' 
                                      ? 'bg-blue-500/20 text-blue-300' 
                                      : 'bg-green-500/20 text-green-300'
                                  }`}>
                                    {fixture.status === 'scheduled' ? 'Scheduled' : 'Ongoing'}
                                  </span>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        )}

        <SportsCategorySection />
      </main>
    </div>
  );
};

export default FixturesPage;
