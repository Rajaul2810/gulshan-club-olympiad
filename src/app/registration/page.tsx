'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const RegistrationPage = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    // Registration deadline was set to a past date (expired)
    const deadlineDate = new Date("2024-12-31T23:59:59").getTime();

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = deadlineDate - now;

      if (distance > 0) {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const isExpired = timeLeft.days === 0 && timeLeft.hours === 0 && timeLeft.minutes === 0 && timeLeft.seconds === 0;

  return (
    <div className="min-h-screen bg-neutral-900">
      <main>
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-neutral-900 via-red-900 to-neutral-800 py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
          {/* Background Elements */}
          <div className="absolute inset-0">
            <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-tr from-red-500 to-orange-500 opacity-20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-20 right-10 w-40 h-40 bg-gradient-to-br from-yellow-400 to-red-500 opacity-15 rounded-full blur-3xl animate-bounce"></div>
            <div className="absolute top-1/2 left-1/2 w-24 h-24 bg-gradient-to-tl from-red-400 to-pink-400 opacity-10 rounded-full blur-2xl animate-ping"></div>
          </div>

          <div className="relative z-10 max-w-7xl mx-auto text-center">
            {/* Status Badge */}
            <div className="mb-8">
              <div className="inline-flex items-center gap-2 bg-red-500/20 text-red-300 px-6 py-3 rounded-full text-lg font-medium border border-red-500/30">
                <div className="w-3 h-3 bg-red-400 rounded-full animate-pulse"></div>
                Registration Closed
              </div>
            </div>

            <Image 
              src="/images/heroLogo-01.png"
              alt="Registration Closed"
              width={200}
              height={200}
              className="mx-auto mb-8 w-1/2 h-1/2 object-contain"
            />

            <div className="w-24 h-1 bg-gradient-to-r from-red-500 to-orange-500 mx-auto rounded-full mb-8"></div>

            <p className="text-xl sm:text-2xl text-gray-200 max-w-3xl mx-auto leading-relaxed mb-12">
              {isExpired 
                ? 'Registration deadline has passed. Thank you for your interest in Olympiad 2025!'
                : 'Registration is closing soon. Don\'t miss your chance to participate!'
              }
            </p>

            {/* Countdown Timer or Expired Message */}
            {isExpired ? (
              <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-8 max-w-2xl mx-auto">
                <div className="text-6xl mb-4">⏰</div>
                <h2 className="text-2xl font-bold text-red-300 mb-2">Registration Closed</h2>
                <p className="text-gray-300">The registration deadline has expired. We look forward to seeing you at the next Olympiad!</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 max-w-2xl mx-auto mb-12">
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-6 border border-white/20">
                  <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-red-400 mb-2">
                    {timeLeft.days}
                  </div>
                  <div className="text-white text-sm font-medium">Days</div>
                </div>
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-6 border border-white/20">
                  <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-orange-400 mb-2">
                    {timeLeft.hours}
                  </div>
                  <div className="text-white text-sm font-medium">Hours</div>
                </div>
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-6 border border-white/20">
                  <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-yellow-400 mb-2">
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
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/club"
                className="border-2 border-white text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white hover:text-neutral-900 transition-all duration-300 transform hover:scale-105"
              >
                View Participating Clubs
              </Link>
              <Link
                href="/fixtures"
                className="bg-gradient-to-r from-orange-500 to-pink-500 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-orange-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105"
              >
                View Fixtures
              </Link>
            </div>
          </div>
        </section>

        {/* Information Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-neutral-900">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4 tracking-tight">
                What&apos;s next?
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-orange-500 to-pink-500 mx-auto rounded-full mb-6"></div>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                While registration is closed, you can still stay updated with all the exciting events
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Fixtures Card */}
              <div className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10 hover:border-orange-400/50 transition-all duration-300 group">
                <div className="text-4xl mb-4">📅</div>
                <h3 className="text-xl font-bold text-white mb-4">View Fixtures</h3>
                <p className="text-gray-300 mb-6">
                  Check out the complete schedule of matches across all sports categories
                </p>
                <Link
                  href="/fixtures"
                  className="inline-flex items-center gap-2 text-orange-400 hover:text-orange-300 font-semibold transition-colors"
                >
                  View Fixtures
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>

              {/* Clubs Card */}
              <div className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10 hover:border-orange-400/50 transition-all duration-300 group">
                <div className="text-4xl mb-4">🏆</div>
                <h3 className="text-xl font-bold text-white mb-4">Participating Clubs</h3>
                <p className="text-gray-300 mb-6">
                  Discover all the clubs participating in Olympiad 2025
                </p>
                <Link
                  href="/club"
                  className="inline-flex items-center gap-2 text-orange-400 hover:text-orange-300 font-semibold transition-colors"
                >
                  View Clubs
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>

              {/* Media Card */}
              <div className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10 hover:border-orange-400/50 transition-all duration-300 group">
                <div className="text-4xl mb-4">📸</div>
                <h3 className="text-xl font-bold text-white mb-4">Photo Gallery</h3>
                <p className="text-gray-300 mb-6">
                  Browse photos and videos from the exciting competitions
                </p>
                <Link
                  href="/photo-gallery"
                  className="inline-flex items-center gap-2 text-orange-400 hover:text-orange-300 font-semibold transition-colors"
                >
                  View Gallery
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-neutral-800 to-neutral-900">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-6 tracking-tight">
              Need More Information?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              For any questions about Olympiad 2025, feel free to contact us
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact-us"
                className="bg-gradient-to-r from-orange-500 to-pink-500 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-orange-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105"
              >
                Contact Us
              </Link>
              <Link
                href="/"
                className="border-2 border-white text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white hover:text-neutral-900 transition-all duration-300 transform hover:scale-105"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default RegistrationPage;