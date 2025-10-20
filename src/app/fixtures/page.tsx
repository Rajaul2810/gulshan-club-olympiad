"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
// import { useFixtures } from "@/hooks/useFixtures";
// import { useClubs } from "@/hooks/useClubs";
// import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import SportsCategorySection from "@/components/SportsCategory";
import Image from "next/image";

const FixturesPage = () => {
  const router = useRouter();
  // const { fixtures } = useFixtures();
  // const { clubs } = useClubs();
  
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    // Set target date (you can adjust this)
    const targetDate = new Date("2025-10-30T00:00:00").getTime();

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

  // Get all fixtures (no status filtering needed for images)
    // const upcomingFixtures = useMemo(() => {
    //   return fixtures.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    // }, [fixtures]);

  // Helper to get team name (not needed for fixture images)
  // const getTeamName = (teamId: string) => {
  //   const team = clubs.find((c) => c.id === teamId);
  //   return team?.name || 'TBA';
  // };

  // Group fixtures by sport
  // const fixturesBySport = useMemo(() => {
  //   // eslint-disable-next-line @typescript-eslint/no-explicit-any
  //   const grouped: { [key: string]: any[] } = {};
  //   // eslint-disable-next-line @typescript-eslint/no-explicit-any
  //   upcomingFixtures.forEach((fixture: any) => {
  //     if (!grouped[fixture.sport]) {
  //       grouped[fixture.sport] = [];
  //     }
  //     grouped[fixture.sport].push(fixture);
  //   });
  //   return grouped;
  // }, [upcomingFixtures]);

  return (
    <div className="min-h-screen bg-neutral-900">
      <main>
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-neutral-900 via-orange-900 to-neutral-800 py-10 px-4 sm:px-4 lg:px-4 overflow-hidden">
          {/* Background Elements */}
          <div className="absolute inset-0">
            <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-tr from-orange-500 to-pink-500 opacity-20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-20 right-10 w-40 h-40 bg-gradient-to-br from-yellow-400 to-orange-500 opacity-15 rounded-full blur-3xl animate-bounce"></div>
            <div className="absolute top-1/2 left-1/2 w-24 h-24 bg-gradient-to-tl from-blue-400 to-cyan-400 opacity-10 rounded-full blur-2xl animate-ping"></div>
          </div>

          <div className="relative z-10 mx-auto text-center">
            <Image
              src="/images/heroLogo-01.png"
              alt="Gulshan Club Olympiad 2025"
              width={200}
              height={200}
              className="mx-auto w-1/3 h-1/3 object-contain"
            />
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold text-white mb-6 tracking-tight">
              {/* <span className="block">Olympiad 2025</span> */}
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-500 text-3xl sm:text-4xl lg:text-5xl mt-2">
                Fixtures
              </span>
            </h1>

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

        

        <SportsCategorySection />
      </main>
    </div>
  );
};

export default FixturesPage;
