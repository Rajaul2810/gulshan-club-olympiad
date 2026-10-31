"use client";

import React from "react";
import Link from "next/link";
import { useEvent } from "@/contexts/EventContext";
import { sportsCategories, sportNameToSlug } from "@/data/sports";

export { sportsCategories, sportNameToSlug };

const SportsCategorySection = () => {
  const { eventLabel } = useEvent();

  return (
    <div className="min-h-screen bg-neutral-900">
      <main className="pt-10">
        {/* Sports Preview Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-neutral-900">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-6 tracking-tight">
                Sports Categories
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-orange-500 to-pink-500 mx-auto rounded-full mb-6"></div>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Discover the exciting range of sports that will be featured in
                {` ${eventLabel}`}
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
              {sportsCategories.map((sport, index) => (
                <Link
                  key={sport.name}
                  href={`/sports/${sportNameToSlug(sport.name)}`}
                  className="relative group"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Card Background Glow */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${sport.color} opacity-20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500`}
                  ></div>

                  {/* Main Card */}
                  <div className="relative bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-2xl group-hover:shadow-3xl transition-all duration-500 group-hover:scale-105 text-center cursor-pointer">
                    {/* Gender Badge - Top Corner */}
                    <div className="absolute top-3 right-3">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-white ${sport.genderColor}`}
                      >
                        {sport.gender}
                      </span>
                    </div>

                    {/* Sport Icon */}
                    <div className="text-4xl sm:text-5xl mb-4">
                      {sport.icon}
                    </div>

                    {/* Sport Name */}
                    <h3 className="text-sm font-bold text-white leading-tight">
                      {sport.name}
                    </h3>

                    {/* View Details Indicator */}
                    <div className="mt-3 text-xs text-gray-400 group-hover:text-orange-400 transition-colors duration-300 font-bold border border-orange-400 rounded-md px-2 py-1">
                      Fixtures & Results →
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Sports Summary */}
            <div className="mt-16 text-center">
              <div className="inline-flex items-center gap-4 bg-white/10 backdrop-blur-md rounded-2xl px-8 py-6 border border-white/20">
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-400 mb-1">
                    17
                  </div>
                  <div className="text-white text-sm">Events</div>
                </div>
                <div className="w-px h-12 bg-white/20"></div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-pink-400 mb-1">
                    34
                  </div>
                  <div className="text-white text-sm">Categories</div>
                </div>
                <div className="w-px h-12 bg-white/20"></div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-400 mb-1">
                    24
                  </div>
                  <div className="text-white text-sm">Clubs</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default SportsCategorySection;
