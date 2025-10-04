'use client';
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const sportsShapes = [
  {
    className:
      'absolute top-10 left-10 w-32 h-32 bg-gradient-to-tr from-yellow-400 via-orange-500 to-pink-500 opacity-30 rounded-full blur-2xl rotate-12',
  },
  {
    className:
      'absolute bottom-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-400 via-green-400 to-cyan-400 opacity-20 rounded-full blur-3xl translate-x-1/3 translate-y-1/3',
  },
  {
    className:
      'absolute top-1/2 left-1/2 w-24 h-24 bg-gradient-to-tl from-pink-400 via-yellow-300 to-orange-400 opacity-20 rounded-full blur-2xl -translate-x-1/2 -translate-y-1/2',
  },
  {
    className:
      'absolute top-1/4 right-1/4 w-16 h-16 bg-gradient-to-br from-green-400 to-blue-400 opacity-30 rounded-full blur-xl',
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Image */}
            <div className="order-2 lg:order-1 animate-fade-in">
              <div className="relative flex justify-center">
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
              </div>
            </div>

            {/* Right Side - Text and Stats */}
            <div className="order-1 lg:order-2 text-center lg:text-left">
              {/* Main Heading */}
              <div className="mb-8 animate-slide-up">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-4 tracking-tight drop-shadow-lg">
                  <span className="block">Gulshan Club</span>
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-500 text-3xl sm:text-4xl lg:text-5xl mt-2">
                    Olympiad 2025
                  </span>
                </h1>
                <p className="text-lg sm:text-xl text-gray-200/90 leading-relaxed max-w-xl mx-auto lg:mx-0">
                  Where Champions Are Born &bull; Experience the Ultimate Sports Festival
                </p>
              </div>

              {/* Sports Icons */}
              <div className="flex flex-wrap justify-center lg:justify-start gap-6 mb-8 animate-fade-in-delay">
                <div className="flex flex-col items-center group">
                  <div className="w-14 h-14 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center mb-2 group-hover:scale-105 transition-all duration-300 shadow-lg">
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <span className="text-white text-sm font-semibold">Athletics</span>
                </div>
                <div className="flex flex-col items-center group">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-xl flex items-center justify-center mb-2 group-hover:scale-105 transition-all duration-300 shadow-lg">
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <span className="text-white text-sm font-semibold">Swimming</span>
                </div>
                <div className="flex flex-col items-center group">
                  <div className="w-14 h-14 bg-gradient-to-br from-green-400 to-lime-400 rounded-xl flex items-center justify-center mb-2 group-hover:scale-105 transition-all duration-300 shadow-lg">
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <span className="text-white text-sm font-semibold">Tennis</span>
                </div>
                <div className="flex flex-col items-center group">
                  <div className="w-14 h-14 bg-gradient-to-br from-pink-500 to-yellow-400 rounded-xl flex items-center justify-center mb-2 group-hover:scale-105 transition-all duration-300 shadow-lg">
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <span className="text-white text-sm font-semibold">Team Sports</span>
                </div>
              </div>

              {/* Stats Section */}
              <div className="grid grid-cols-2 gap-6 mb-8 animate-fade-in-delay-2">
                <div className="text-center lg:text-left">
                  <div className="text-3xl sm:text-4xl font-extrabold text-yellow-400 mb-1 drop-shadow">30+</div>
                  <div className="text-white text-sm font-medium">Sports Events</div>
                </div>
                <div className="text-center lg:text-left">
                  <div className="text-3xl sm:text-4xl font-extrabold text-pink-400 mb-1 drop-shadow">1000+</div>
                  <div className="text-white text-sm font-medium">Participants</div>
                </div>
              </div>

              {/* Call to Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 animate-slide-up-delay justify-center lg:justify-start">
                <button onClick={() => router.push('/fixtures')} className="bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-500 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-pink-500 hover:to-yellow-400 transition-all duration-300 transform hover:scale-105 shadow-xl">
                  View Fixtures
                </button>
                <Link href="http://olympiad2025.gulshanclub.com/myweb01/defaultgcl" target="_blank" className="bg-neutral-900 border-2 border-white/20 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white hover:text-neutral-900 transition-all duration-300 transform hover:scale-105 shadow-xl">
                  Register Now
                </Link>
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