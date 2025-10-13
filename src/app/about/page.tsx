"use client";

import React from "react";

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-neutral-900">
      <main className="">
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
                About Us
              </div>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold text-white mb-6 tracking-tight">
              <span className="block">Gulshan Club</span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-500 text-3xl sm:text-4xl lg:text-5xl mt-2">
                Olympiad 2025
              </span>
            </h1>

            <p className="text-xl sm:text-2xl text-gray-200 max-w-3xl mx-auto leading-relaxed mb-12">
              Discover the legacy, mission, and vision behind Bangladesh&apos;s
              premier sports competition. Learn about Gulshan Club&apos;s
              commitment to excellence and community spirit.
            </p>
          </div>
        </section>

        {/* About Content */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-neutral-900">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
              {/* About Text */}
              <div className="space-y-8">
                <div>
                  <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-6 tracking-tight">
                    Our Story
                  </h2>
                  <div className="w-24 h-1 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full mb-8"></div>
                </div>

                <div className="space-y-6 text-lg text-gray-300 leading-relaxed">
                  <p>
                    Gulshan Club Limited has been at the forefront of promoting
                    sports excellence and community spirit in Bangladesh for
                    decades. Established as one of the premier social clubs in
                    Dhaka, we have consistently championed the values of
                    sportsmanship, unity, and healthy competition.
                  </p>

                  <p>
                    The Gulshan Club Olympiad, now in its 5th edition,
                    represents our unwavering commitment to bringing together
                    diverse communities through the universal language of
                    sports. What began as a bold initiative in 2019 has evolved
                    into one of the most anticipated sporting events in
                    Bangladesh&apos;s social calendar.
                  </p>

                  <p>
                    This year, we are proud to host 21 esteemed clubs, 23 teams,
                    and over 1,000 athletes competing across 17 sports in 32
                    categories. The Olympiad is more than just a
                    competition—it&apos;s a celebration of friendship,
                    excellence, and the indomitable spirit of Bangladeshi
                    sports.
                  </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-6 pt-8">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-orange-400 mb-2">
                      5th
                    </div>
                    <div className="text-white text-sm">Edition</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-pink-400 mb-2">
                      21
                    </div>
                    <div className="text-white text-sm">Clubs</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-400 mb-2">
                      1000+
                    </div>
                    <div className="text-white text-sm">Athletes</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-400 mb-2">
                      17
                    </div>
                    <div className="text-white text-sm">Sports</div>
                  </div>
                </div>
              </div>

              {/* Image/Visual */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-pink-500/20 rounded-3xl blur-3xl"></div>
                <div className="relative bg-white/5 backdrop-blur-md rounded-3xl p-8 border border-white/10 shadow-xl">
                  <div className="aspect-square bg-gradient-to-br from-white/20 to-white/10 rounded-2xl flex items-center justify-center border border-white/20">
                    <div className="text-center">
                      <div className="text-6xl mb-4">🏆</div>
                      <h3 className="text-2xl font-bold text-white mb-2">
                        Excellence in Sports
                      </h3>
                      <p className="text-gray-300">Since 1978</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Mission & Vision */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-pink-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                <div className="relative bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10 shadow-xl group-hover:shadow-2xl transition-all duration-500 group-hover:scale-105">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
                      <svg
                        className="w-8 h-8 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 10V3L4 14h7v7l9-11h-7z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-4">
                      Our Mission
                    </h3>
                    <p className="text-gray-300 leading-relaxed">
                      To foster sports excellence, build lasting friendships,
                      and strengthen community bonds through competitive yet
                      friendly sporting events that celebrate the spirit of
                      unity and achievement.
                    </p>
                  </div>
                </div>
              </div>

              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                <div className="relative bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10 shadow-xl group-hover:shadow-2xl transition-all duration-500 group-hover:scale-105">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-6">
                      <svg
                        className="w-8 h-8 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-4">
                      Our Vision
                    </h3>
                    <p className="text-gray-300 leading-relaxed">
                      To become the leading platform for inter-club sports
                      competitions in Bangladesh, inspiring future generations
                      and creating a legacy of sportsmanship that transcends
                      boundaries.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-white/5 backdrop-blur-md rounded-3xl p-8 border border-white/10 shadow-xl mb-20">
              <div className="text-center mb-12">
                <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4 tracking-tight">
                  Contact Information
                </h2>
                <div className="w-24 h-1 bg-gradient-to-r from-orange-500 to-pink-500 mx-auto rounded-full mb-6"></div>
                <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                  Get in touch with us for more information about Olympiad 2025
                  and Gulshan Club activities.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* Office Address */}
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg
                      className="w-8 h-8 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4">
                    Office Address
                  </h3>
                  <div className="text-gray-300 leading-relaxed">
                    <p className="font-semibold text-orange-400">
                      Gulshan Club Limited
                    </p>
                    <p>House 12, Road 86</p>
                    <p>Gulshan 2, Dhaka 1212</p>
                    <p>Bangladesh</p>
                  </div>
                </div>

                {/* Contact Details */}
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg
                      className="w-8 h-8 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4">
                    Contact Details
                  </h3>
                  <div className="text-gray-300 leading-relaxed space-y-2">
                    <p>
                      <span className="text-orange-400">Phone:</span>{" "}
                      +880-2-988-1234
                    </p>
                    <p>
                      <span className="text-orange-400">Fax:</span>{" "}
                      +880-2-988-1235
                    </p>
                    <p>
                      <span className="text-orange-400">Email:</span>{" "}
                      olympiad@gulshanclub.com
                    </p>
                    <p>
                      <span className="text-orange-400">Website:</span>{" "}
                      www.gulshanclub.com
                    </p>
                  </div>
                </div>

                {/* Office Hours */}
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg
                      className="w-8 h-8 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4">
                    Office Hours
                  </h3>
                  <div className="text-gray-300 leading-relaxed space-y-2">
                    <p>
                      <span className="text-orange-400">Monday - Friday:</span>{" "}
                      9:00 AM - 6:00 PM
                    </p>
                    <p>
                      <span className="text-orange-400">Saturday:</span> 9:00 AM
                      - 4:00 PM
                    </p>
                    <p>
                      <span className="text-orange-400">Sunday:</span> Closed
                    </p>
                    <p>
                      <span className="text-orange-400">Emergency:</span> 24/7
                      Available
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Map Section */}
            <div className="bg-white/5 backdrop-blur-md rounded-3xl p-8 border border-white/10 shadow-xl mb-20">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-extrabold text-white mb-4 tracking-tight">
                  Find Us
                </h2>
                <div className="w-24 h-1 bg-gradient-to-r from-orange-500 to-pink-500 mx-auto rounded-full mb-6"></div>
              </div>

              <div className="relative">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3650.680800537164!2d90.410825!3d23.7943784!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755c70853ef61af%3A0xedc5fc0644f6f05e!2sGulshan%20Club%20Limited!5e0!3m2!1sen!2sbd!4v1759615244002!5m2!1sen!2sbd"
                  width="100%"
                  height="400"
                  style={{ border: "0" }}       
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </div>
          </div>
        </section>

        {/* Message Component */}
        {/* <Message /> */}
      </main>
    </div>
  );
};

export default AboutPage;
