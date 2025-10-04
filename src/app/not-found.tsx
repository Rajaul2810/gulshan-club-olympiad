'use client';

import React from 'react';
import Link from 'next/link';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-neutral-900 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="relative max-w-4xl mx-auto text-center">
        {/* Background Elements */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-tr from-orange-500 to-pink-500 opacity-20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-40 h-40 bg-gradient-to-br from-yellow-400 to-orange-500 opacity-15 rounded-full blur-3xl animate-bounce"></div>
          <div className="absolute top-1/2 left-1/2 w-24 h-24 bg-gradient-to-tl from-blue-400 to-cyan-400 opacity-10 rounded-full blur-2xl animate-ping"></div>
        </div>

        {/* Main Content */}
        <div className="relative">
          {/* 404 Number */}
          <div className="mb-8">
            <h1 className="text-8xl sm:text-9xl lg:text-[12rem] font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-500 leading-none tracking-tight">
              404
            </h1>
          </div>

          {/* Error Message */}
          <div className="mb-12">
            <div className="inline-flex items-center gap-2 bg-orange-500/20 text-orange-300 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
              Page Not Found
            </div>
            
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-6 tracking-tight">
              Oops! Something went wrong
            </h2>
            
            <p className="text-xl sm:text-2xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
              The page you&apos;re looking for doesn&apos;t exist or has been moved. 
              Let&apos;s get you back on track to Olympiad 2025!
            </p>
          </div>

          {/* Navigation Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {/* Home */}
            <Link href="/" className="group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-pink-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                <div className="relative bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-2xl group-hover:shadow-3xl transition-all duration-500 group-hover:scale-105">
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">Home</h3>
                  <p className="text-gray-400 text-sm">Back to main page</p>
                </div>
              </div>
            </Link>

            {/* Fixtures */}
            <Link href="/fixtures" className="group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                <div className="relative bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-2xl group-hover:shadow-3xl transition-all duration-500 group-hover:scale-105">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">Fixtures</h3>
                  <p className="text-gray-400 text-sm">View competition schedule</p>
                </div>
              </div>
            </Link>

            {/* Clubs */}
            <Link href="/club" className="group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                <div className="relative bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-2xl group-hover:shadow-3xl transition-all duration-500 group-hover:scale-105">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">Clubs</h3>
                  <p className="text-gray-400 text-sm">Participating clubs</p>
                </div>
              </div>
            </Link>

            {/* Media */}
            <Link href="/media" className="group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                <div className="relative bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-2xl group-hover:shadow-3xl transition-all duration-500 group-hover:scale-105">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">Media</h3>
                  <p className="text-gray-400 text-sm">Photos, videos & news</p>
                </div>
              </div>
            </Link>

            {/* About */}
            <Link href="/about" className="group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                <div className="relative bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-2xl group-hover:shadow-3xl transition-all duration-500 group-hover:scale-105">
                  <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">About</h3>
                  <p className="text-gray-400 text-sm">Learn about us</p>
                </div>
              </div>
            </Link>

            {/* Gallery */}
            <Link href="/gallery" className="group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-pink-500/20 to-rose-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                <div className="relative bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-2xl group-hover:shadow-3xl transition-all duration-500 group-hover:scale-105">
                  <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">Gallery</h3>
                  <p className="text-gray-400 text-sm">Event photos</p>
                </div>
              </div>
            </Link>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/" className="bg-gradient-to-r from-orange-500 to-pink-500 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-orange-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 shadow-xl">
              Go Home
            </Link>
            <button 
              onClick={() => window.history.back()} 
              className="border-2 border-white text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white hover:text-neutral-900 transition-all duration-300 transform hover:scale-105"
            >
              Go Back
            </button>
          </div>

          {/* Help Text */}
          <div className="mt-12">
            <p className="text-gray-400 text-sm">
              Need help? Contact us at{' '}
              <a 
                href="mailto:olympiad@gulshanclub.com" 
                className="text-orange-400 hover:text-orange-300 transition-colors duration-200"
              >
                olympiad@gulshanclub.com
              </a>
            </p>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-20 right-20 opacity-20 animate-float">
          <div className="text-4xl">🏆</div>
        </div>
        <div className="absolute bottom-20 left-20 opacity-20 animate-float-delay">
          <div className="text-4xl">⚽</div>
        </div>
        <div className="absolute top-1/2 right-10 opacity-20 animate-float-delay-2">
          <div className="text-3xl">🎾</div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
