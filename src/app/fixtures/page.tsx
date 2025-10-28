"use client";

import React, { useMemo } from "react";
import { useRouter } from "next/navigation";
import { useFixtures } from "@/hooks/useFixtures";
// import { useClubs } from "@/hooks/useClubs";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import SportsCategorySection from "@/components/SportsCategory";
import Image from "next/image";
import Link from "next/link";

const FixturesPage = () => {
  const router = useRouter();
  const { fixtures, loading } = useFixtures();
  // const { clubs } = useClubs();

  //Get all fixtures (no status filtering needed for images)
  const upcomingFixtures = useMemo(() => {
    return fixtures.sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }, [fixtures]);

  console.log(upcomingFixtures);

  //Helper to get team name (not needed for fixture images)
  // const getTeamName = (teamId: string) => {
  //   const team = clubs.find((c) => c.id === teamId);
  //   return team?.name || 'TBA';
  // };

  //Group fixtures by sport
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
      {/* Compact Header */}
      <header className="bg-gradient-to-r from-neutral-900 to-orange-900 py-6 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Image
                src="/images/heroLogo-01.png"
                alt="Gulshan Club Olympiad 2025"
                width={60}
                height={60}
                className="object-contain"
              />
              <h1 className="text-2xl sm:text-3xl font-bold text-white">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-500">
                  Fixtures
                </span>
              </h1>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 space-x-4">
              <button
                onClick={() => router.push("/club")}
                className="bg-white/10 backdrop-blur-sm border border-white/20 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-white/20 transition-all duration-300"
              >
                View Clubs
              </button>
              <div className="flex flex-col sm:flex-row gap-4 animate-slide-up-delay justify-center lg:justify-start">
                <Link
                  href="/Fixture.pdf"
                  target="_blank"
                  className="bg-gradient-to-r from-blue-400 via-green-400 to-cyan-400 text-white px-8 py-4 cursor-pointer rounded-xl font-bold text-lg hover:from-blue-500 hover:to-cyan-400 transition-all duration-300 transform hover:scale-105 shadow-xl"
                >
                  Download Fixtures
                </Link>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {loading && (
          <div className="flex items-center justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        )}

        {/* Fixtures Grid */}
        {!loading && upcomingFixtures.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3  gap-6">
            {upcomingFixtures.map((fixture) => (
              <div
                key={fixture.id}
                className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10  hover:border-white/20 transition-all duration-300 group"
              >
                {/* Image Container */}
                <div className="relative aspect-video">
                  <Image
                    src={fixture.fixture_image}
                    alt={`${fixture.sport} fixture`}
                    height={700}
                    width={400}
                    className="object-contain group-hover:scale-105 transition-transform duration-300"
                  />

                  {/* Download Button - Always Visible */}
                  <div className="absolute top-3 right-3">
                    <button
                      onClick={() => {
                        const link = document.createElement("a");
                        link.href = fixture.fixture_image;
                        link.download = `${fixture.sport}-fixture-${fixture.id}.jpg`;
                        link.target = "_blank";
                        link.click();
                      }}
                      className="bg-black/70 backdrop-blur-sm rounded-full p-2 hover:bg-black/90 transition-colors duration-200 shadow-lg"
                      title="Download Image"
                    >
                      <svg
                        className="w-4 h-4 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-white font-semibold text-sm truncate">
                      {fixture.sport}
                    </h3>
                    <span className="bg-orange-500/20 text-orange-300 px-2 py-1 rounded-full text-xs font-medium flex-shrink-0">
                      Fixture
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* No Fixtures Message */}
        {!loading && upcomingFixtures.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-lg mb-4">
              No fixtures available
            </div>
            <p className="text-gray-500 text-sm">
              Check back later for upcoming matches
            </p>
          </div>
        )}
      </main>
      <SportsCategorySection />
    </div>
  );
};
export default FixturesPage;
