"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useFixtures } from "@/hooks/useFixtures";
import { useEvent } from "@/contexts/EventContext";
// import { useClubs } from "@/hooks/useClubs";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import SportsCategorySection from "@/components/SportsCategory";
import { sportsCategories } from "@/data/sports";
import Image from "next/image";
import Link from "next/link";

type SortKey = "newest" | "oldest" | "sport";

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "sport", label: "Sport (A–Z)" },
];

const SPORT_ORDER = new Map(sportsCategories.map((s, i) => [s.name, i]));
const sportIcon = (name: string) => sportsCategories.find((s) => s.name === name)?.icon ?? "🏆";

const FixturesPage = () => {
  const router = useRouter();
  const { eventLabel } = useEvent();
  const { fixtures, loading } = useFixtures();
  const [sport, setSport] = useState("");
  const [sort, setSort] = useState<SortKey>("newest");

  useEffect(() => {
    setSport(new URLSearchParams(window.location.search).get("sport") ?? "");
  }, []);

  const selectSport = (value: string) => {
    setSport(value);
    const url = value ? `/fixtures?sport=${encodeURIComponent(value)}` : "/fixtures";
    window.history.replaceState(null, "", url);
  };

  // Only sports that actually have fixtures, in the official event order
  const sportOptions = useMemo(() => {
    const counts = new Map<string, number>();
    fixtures.forEach((f) => counts.set(f.sport, (counts.get(f.sport) ?? 0) + 1));
    if (sport && !counts.has(sport)) counts.set(sport, 0);
    return [...counts.entries()]
      .map(([name, count]) => ({ name, count }))
      .sort(
        (a, b) =>
          (SPORT_ORDER.get(a.name) ?? Infinity) - (SPORT_ORDER.get(b.name) ?? Infinity) ||
          a.name.localeCompare(b.name)
      );
  }, [fixtures, sport]);

  const upcomingFixtures = useMemo(() => {
    const time = (d: string) => new Date(d).getTime();
    return fixtures
      .filter((f) => !sport || f.sport === sport)
      .sort((a, b) => {
        if (sort === "oldest") return time(a.created_at) - time(b.created_at);
        if (sort === "sport") return a.sport.localeCompare(b.sport) || time(b.created_at) - time(a.created_at);
        return time(b.created_at) - time(a.created_at);
      });
  }, [fixtures, sport, sort]);

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
                alt={`Gulshan Club ${eventLabel}`}
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

        {/* Category filter */}
        {!loading && fixtures.length > 0 && (
          <div className="flex flex-col sm:flex-row sm:items-end gap-3 mb-8 p-4 rounded-2xl bg-white/5 border border-white/10">
            <label className="flex-1">
              <span className="block text-xs font-semibold uppercase tracking-wider text-orange-400 mb-1.5">Category</span>
              <select
                value={sport}
                onChange={(e) => selectSport(e.target.value)}
                className="w-full bg-neutral-800 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500"
              >
                <option value="">All categories ({fixtures.length})</option>
                {sportOptions.map((o) => (
                  <option key={o.name} value={o.name}>
                    {sportIcon(o.name)} {o.name} ({o.count})
                  </option>
                ))}
              </select>
            </label>
            <label className="sm:w-48">
              <span className="block text-xs font-semibold uppercase tracking-wider text-orange-400 mb-1.5">Sort by</span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortKey)}
                className="w-full bg-neutral-800 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500"
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </label>
            {sport && (
              <button
                onClick={() => selectSport("")}
                className="px-4 py-3 rounded-xl border border-white/20 text-gray-300 hover:bg-white/10 text-sm"
              >
                Clear
              </button>
            )}
          </div>
        )}

        {!loading && fixtures.length > 0 && (
          <p className="text-gray-400 text-sm mb-4">
            Showing <span className="text-white font-medium">{upcomingFixtures.length}</span>{" "}
            {upcomingFixtures.length === 1 ? "fixture" : "fixtures"}
            {sport && (
              <>
                {" "}for <span className="text-orange-300">{sport}</span>
              </>
            )}
          </p>
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
              {sport ? `No fixtures for ${sport} yet` : "No fixtures available"}
            </div>
            <p className="text-gray-500 text-sm">
              Check back later for upcoming matches
            </p>
            {sport && (
              <button onClick={() => selectSport("")} className="mt-4 text-orange-400 hover:text-orange-300 text-sm font-medium">
                Show all categories
              </button>
            )}
          </div>
        )}
      </main>
      <SportsCategorySection />
    </div>
  );
};
export default FixturesPage;
