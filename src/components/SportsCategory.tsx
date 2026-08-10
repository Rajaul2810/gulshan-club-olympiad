"use client";

import React from "react";
import Link from "next/link";
import { useEvent } from "@/contexts/EventContext";

export const sportsCategories = [
  {
    name: "Arm Wrestling 55-60 KG Women",
    icon: "💪",
    color: "from-pink-400 to-rose-500",
    gender: "Women",
    genderColor: "bg-pink-500",
  },
  {
    name: "Arm Wrestling 60-65kg Women",
    icon: "💪",
    color: "from-pink-400 to-rose-500",
    gender: "Women",
    genderColor: "bg-pink-500",
  },
  {
    name: "Arm Wrestling 65-70kg Men",
    icon: "💪",
    color: "from-blue-400 to-cyan-500",
    gender: "Men",
    genderColor: "bg-blue-500",
  },
  {
    name: "Arm Wrestling 65-75kg Women",
    icon: "💪",
    color: "from-pink-400 to-rose-500",
    gender: "Women",
    genderColor: "bg-pink-500",
  },
  {
    name: "Arm Wrestling 70-75kg Men",
    icon: "💪",
    color: "from-blue-400 to-cyan-500",
    gender: "Men",
    genderColor: "bg-blue-500",
  },
  {
    name: "Arm Wrestling 75-80 kg Women",
    icon: "💪",
    color: "from-pink-400 to-rose-500",
    gender: "Women",
    genderColor: "bg-pink-500",
  },
  {
    name: "Arm Wrestling 75-80kg Men",
    icon: "💪",
    color: "from-blue-400 to-cyan-500",
    gender: "Men",
    genderColor: "bg-blue-500",
  },
  {
    name: "Arm Wrestling 80-85kg Men",
    icon: "💪",
    color: "from-blue-400 to-cyan-500",
    gender: "Men",
    genderColor: "bg-blue-500",
  },
  {
    name: "Arm Wrestling 85-90kg Men",
    icon: "💪",
    color: "from-blue-400 to-cyan-500",
    gender: "Men",
    genderColor: "bg-blue-500",
  },
  {
    name: "Badminton Team Event (Men's)",
    icon: "🏸",
    color: "from-blue-400 to-cyan-500",
    gender: "Men",
    genderColor: "bg-blue-500",
  },
  {
    name: "Badminton Women's & Mixed Doubles",
    icon: "🏸",
    color: "from-pink-400 to-rose-500",
    gender: "Women",
    genderColor: "bg-pink-500",
  },
  {
    name: "Basketball Men's",
    icon: "🏀",
    color: "from-blue-400 to-cyan-500",
    gender: "Men",
    genderColor: "bg-blue-500",
  },
  {
    name: "Basketball Women's",
    icon: "🏀",
    color: "from-pink-400 to-rose-500",
    gender: "Women",
    genderColor: "bg-pink-500",
  },
  {
    name: "Billiards Team Event",
    icon: "🎱",
    color: "from-indigo-400 to-purple-500",
    gender: "Mixed",
    genderColor: "bg-purple-500",
  },
  {
    name: "Chess",
    icon: "♟️",
    color: "from-gray-400 to-slate-500",
    gender: "Mixed",
    genderColor: "bg-gray-500",
  },
  {
    name: "Cricket (T-10)",
    icon: "🏏",
    color: "from-green-400 to-emerald-500",
    gender: "Mixed",
    genderColor: "bg-green-500",
  },
  {
    name: "Football Men (7 a Side)",
    icon: "⚽",
    color: "from-blue-400 to-cyan-500",
    gender: "Men",
    genderColor: "bg-blue-500",
  },
  {
    name: "Golf Team Event Regular",
    icon: "⛳",
    color: "from-green-500 to-emerald-600",
    gender: "Mixed",
    genderColor: "bg-green-500",
  },
  {
    name: "Golf Team Event Seniors",
    icon: "⛳",
    color: "from-amber-500 to-orange-500",
    gender: "Seniors",
    genderColor: "bg-amber-500",
  },
  {
    name: "Padel Men's",
    icon: "🎾",
    color: "from-yellow-400 to-orange-500",
    gender: "Men",
    genderColor: "bg-yellow-500",
  },
  {
    name: "Padel Womens & Mix",
    icon: "🎾",
    color: "from-yellow-400 to-orange-500",
    gender: "Mixed",
    genderColor: "bg-yellow-500",
  },
  {
    name: "Pool Team Event",
    icon: "🎱",
    color: "from-blue-500 to-indigo-500",
    gender: "Mixed",
    genderColor: "bg-blue-500",
  },
  {
    name: "Quiz Team Event",
    icon: "🧠",
    color: "from-purple-500 to-pink-500",
    gender: "Mixed",
    genderColor: "bg-purple-500",
  },
  {
    name: "Snooker",
    icon: "🎱",
    color: "from-red-500 to-pink-500",
    gender: "Mixed",
    genderColor: "bg-red-500",
  },
  {
    name: "Squash",
    icon: "🏓",
    color: "from-teal-400 to-green-500",
    gender: "Mixed",
    genderColor: "bg-teal-500",
  },
  {
    name: "Swimming Men (21 –40 yrs.)",
    icon: "🏊",
    color: "from-blue-400 to-cyan-500",
    gender: "Men",
    genderColor: "bg-blue-500",
  },
  {
    name: "Swimming Men (41 – 60 yrs.)",
    icon: "🏊",
    color: "from-blue-400 to-cyan-500",
    gender: "Men",
    genderColor: "bg-blue-500",
  },
  {
    name: "Swimming Men (Open)",
    icon: "🏊",
    color: "from-blue-400 to-cyan-500",
    gender: "Men",
    genderColor: "bg-blue-500",
  },
  // {
  //   name: "Swimming Open",
  //   icon: "🏊",
  //   color: "from-cyan-400 to-blue-500",
  //   gender: "Open",
  //   genderColor: "bg-cyan-500",
  // },
  {
    name: "Table Tennis Team Event",
    icon: "🏓",
    color: "from-pink-400 to-rose-500",
    gender: "Mixed",
    genderColor: "bg-pink-500",
  },
  {
    name: "Tennis Men's Team",
    icon: "🎾",
    color: "from-blue-400 to-cyan-500",
    gender: "Men",
    genderColor: "bg-blue-500",
  },
  {
    name: "Tennis Women's & Mixed Doubles",
    icon: "🎾",
    color: "from-green-400 to-teal-500",
    gender: "Mixed",
    genderColor: "bg-green-500",
  },
  {
    name: "Weight Lifting Regular",
    icon: "🏋️",
    color: "from-gray-500 to-slate-600",
    gender: "Mixed",
    genderColor: "bg-gray-500",
  },
  {
    name: "Weight Lifting Squat",
    icon: "🏋️",
    color: "from-slate-500 to-gray-600",
    gender: "Mixed",
    genderColor: "bg-slate-500",
  },
];

// Helper function to convert sport name to URL slug
export const sportNameToSlug = (name: string): string => {
  return name
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .trim();
};

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
                      View Results →
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
