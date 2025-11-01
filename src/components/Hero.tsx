"use client";
import React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

const sportsShapes = [
  {
    className:
      "absolute top-10 left-10 w-32 h-32 bg-gradient-to-tr from-yellow-400 via-orange-500 to-pink-500 opacity-30 rounded-full blur-2xl rotate-12",
  },
  {
    className:
      "absolute bottom-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-400 via-green-400 to-cyan-400 opacity-20 rounded-full blur-3xl translate-x-1/3 translate-y-1/3",
  },
  {
    className:
      "absolute top-1/2 left-1/2 w-24 h-24 bg-gradient-to-tl from-pink-400 via-yellow-300 to-orange-400 opacity-20 rounded-full blur-2xl -translate-x-1/2 -translate-y-1/2",
  },
  {
    className:
      "absolute top-1/4 right-1/4 w-16 h-16 bg-gradient-to-br from-green-400 to-blue-400 opacity-30 rounded-full blur-xl",
  },
];

const Hero = () => {
  const router = useRouter();
  return (
    <div className="relative min-h-screen bg-neutral-950 overflow-hidden flex items-center">
      {/* Modern Sports Vibe Background */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Dynamic colorful shapes */}
        {sportsShapes.map((shape, idx) => (
          <div key={idx} className={shape.className}></div>
        ))}
        {/* Subtle grid pattern */}
        <svg
          className="absolute inset-0 w-full h-full opacity-10"
          style={{ zIndex: 0 }}
          xmlns="http://www.w3.org/2000/svg"
          width="100%"
          height="100%"
        >
          <defs>
            <pattern
              id="grid"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke="#fff"
                strokeWidth="0.5"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full">
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Right Side - Text and Stats */}
            <div className="order-1 lg:order-1 text-center lg:text-left">
              {/* Main Heading */}
              <div className="mb-4 animate-slide-up">
                <Image
                  src="/images/heroLogo-01.png"
                  alt="Gulshan Club Olympiad 2025"
                  width={400}
                  height={300}
                  className="w-full h-auto mx-auto object-contain drop-shadow-2xl"
                />
                <blockquote className="mt-2 text-base sm:text-lg text-gray-200 max-w-xl mx-auto lg:mx-0">
                  &quot;Sports do not build character. They reveal it. Through
                  the challenges, victories, and defeats on the field, we come
                  to truly understand the strength, resilience, and unity that
                  lie within us. Here, on this grand occasion, we gather not
                  just to compete, but to celebrate the spirit of sportsmanship
                  that brings out the very best in each of us, forging lifelong
                  friendships and unforgettable memories.&quot;
                </blockquote>
              </div>

              {/* Stats Section */}
              <div className="grid grid-cols-3 gap-6 mb-8 animate-fade-in-delay-2">
                <div className="text-center lg:text-left">
                  <div className="text-3xl sm:text-4xl font-extrabold text-yellow-400 mb-1 drop-shadow">
                    34
                  </div>
                  <div className="text-white text-sm font-medium">
                    Sports Categories
                  </div>
                </div>
                <div className="text-center lg:text-left">
                  <div className="text-3xl sm:text-4xl font-extrabold text-violet-500 mb-1 drop-shadow">
                    24
                  </div>
                  <div className="text-white text-sm font-medium">
                    Participant Clubs
                  </div>
                </div>
                <div className="text-center lg:text-left">
                  <div className="text-3xl sm:text-4xl font-extrabold text-pink-400 mb-1 drop-shadow">
                    1215
                  </div>
                  <div className="text-white text-sm font-medium">
                    Participants
                  </div>
                </div>
              </div>

              {/* Call to Action Buttons */}
              <div className="flex flex-col md:flex-row gap-4 a">
                <div className="flex flex-col sm:flex-row gap-4 animate-slide-up-delay justify-center lg:justify-start">
                  <button
                    onClick={() => router.push("/fixtures")}
                    className="bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-500 text-white px-4 py-3 cursor-pointer rounded-xl font-bold text-md hover:from-pink-500 hover:to-yellow-400 transition-all duration-300 transform hover:scale-105 shadow-xl"
                  >
                    View Fixtures
                  </button>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 animate-slide-up-delay justify-center lg:justify-start">
                  <Link
                    href="/Fixture.pdf"
                    target="_blank"
                    className="bg-gradient-to-r from-blue-400 via-green-400 to-cyan-400 text-white px-4 py-3 cursor-pointer rounded-xl font-bold text-md hover:from-blue-500 hover:to-cyan-400 transition-all duration-300 transform hover:scale-105 shadow-xl"
                  >
                    Download Fixtures
                  </Link>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 animate-slide-up-delay justify-center lg:justify-start">
                  <Link
                    href="https://docs.google.com/spreadsheets/d/1lKne5H-xRCX-T9Txe58c2JPERqgm_fQCRIhFAz_Q3Fc/edit?usp=sharing"
                    target="_blank"
                    className="bg-orange-400 text-white px-4 py-3 cursor-pointer rounded-xl font-bold text-md transition-all duration-300 transform hover:scale-105 shadow-xl"
                  >
                    Schedules & Results
                  </Link>
                </div>
              </div>
            </div>
            {/* Left Side - Image */}
            <div className="order-2 lg:order-1 animate-fade-in">
              {/* <div className="relative flex justify-center">
                <div className="absolute -top-8 -left-8 w-40 h-40 bg-gradient-to-br from-orange-400 to-pink-500 opacity-30 rounded-full blur-2xl -z-10"></div>
                <div className="relative bg-white/5 backdrop-blur-md rounded-3xl p-8 border border-white/10 shadow-2xl">
                  <Image
                    src="/images/Olympiad2025Logo-01.png"
                    alt="Gulshan Club Olympiad 2025"
                    width={400}
                    height={400}
                    className="w-full h-auto max-w-xs sm:max-w-md mx-auto object-contain drop-shadow-2xl"
                  />
                </div>
              </div> */}
              <iframe
                width="560"
                height="415"
                src="https://www.youtube.com/embed/kOOHGg8DMdY?si=z1NU1404_DYQf5iE"
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              ></iframe>
              <div className="flex gap-4 justify-center mt-6">
                {/* Facebook Icon */}
                <a
                  href="https://www.facebook.com/GulshanClubOympiad"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 gap-2 justify-center  rounded-full bg-white/10  transition-all"
                  aria-label="Gulshan Club Facebook"
                >
                  <svg
                    width="24"
                    height="24"
                    fill="currentColor"
                    className="text-blue-600"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M22.675 0H1.326C.593 0 0 .594 0 1.326V22.67c0 .73.593 1.324 1.326 1.324H12.82v-9.845H9.692v-3.834h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.797.143v3.24l-1.92.001c-1.504 0-1.796.715-1.796 1.763v2.313h3.59l-.467 3.834h-3.123V24h6.116C23.406 24 24 23.406 24 22.674V1.326C24 .594 23.406 0 22.675 0" />
                  </svg>
                  <p className="text-white text-sm font-medium">Facebook</p>
                </a>
                {/* YouTube Icon */}
                <a
                  href="https://www.youtube.com/@GulshanClubLtd"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 gap-2 justify-center rounded-full bg-white/10  transition-all"
                  aria-label="Gulshan Club YouTube"
                >
                  <svg
                    width="24"
                    height="24"
                    fill="currentColor"
                    className="text-red-600"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M23.498 6.186a2.975 2.975 0 0 0-2.093-2.104C19.044 3.5 12 3.5 12 3.5s-7.044 0-9.405.582A2.975 2.975 0 0 0 .502 6.186C0 8.545 0 12 0 12s0 3.455.502 5.814a2.976 2.976 0 0 0 2.093 2.104C4.956 20.5 12 20.5 12 20.5s7.044 0 9.405-.582a2.975 2.975 0 0 0 2.093-2.104C24 15.455 24 12 24 12s0-3.455-.502-5.814ZM9.545 15.568V8.432l6.363 3.568-6.363 3.568Z" />
                  </svg>
                  <p className="text-white text-sm font-medium">YouTube</p>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce z-20">
          <div className="w-7 h-12 border-2 border-white/40 rounded-full flex justify-center items-start bg-white/5 shadow-lg">
            <div className="w-1 h-4 bg-gradient-to-b from-yellow-400 to-pink-500 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
