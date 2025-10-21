"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useClubs } from "@/hooks/useClubs";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { clubs, loading } = useClubs();

  const navItems = [
    { name: "Home", href: "/" },
    { name: "Fixtures", href: "/fixtures" },
    { name: "Photo Gallery", href: "/photo-gallery" },
    { name: "Press", href: "/press" },
    { name: "Contact Us", href: "/contact-us" },
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsRegistrationOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="bg-neutral-950 sticky top-0 z-50 border-b-2 border-white/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex space-x-2 items-center">
            <Link href="/" className="flex space-x-2">
              <Image
                src="/images/brand-white.png"
                alt="Gulshan Club Logo"
                width={70}
                height={70}
                className="object-contain"
              />
            </Link>
            <Link href="/" className="flex  space-x-2">
              <Image
                src="/images/Olympiad2025Logo-01.png"
                alt="Gulshan Club Logo"
                width={80}
                height={80}
                className="w-16 h-16 object-contain"
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-gray-200 hover:text-violet-700 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 hover:bg-violet-50"
                >
                  {item.name}
                </Link>
              ))}

              {/* Registration Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsRegistrationOpen(!isRegistrationOpen)}
                  className="text-white bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 px-4 py-2 rounded-md text-sm font-semibold transition-all duration-200 flex items-center gap-2"
                >
                  Registration
                  <svg
                    className={`w-4 h-4 transition-transform duration-200 ${
                      isRegistrationOpen ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                {isRegistrationOpen && (
                  <div className="absolute right-0 mt-2 w-96 bg-neutral-900 border border-white/20 rounded-2xl shadow-2xl overflow-hidden z-50 backdrop-blur-xl">
                    <div className="p-4 bg-gradient-to-r from-orange-500 to-pink-500">
                      <h3 className="text-white font-bold text-lg">
                        Select Your Club
                      </h3>
                      <p className="text-white/90 text-sm">
                        Choose a club to participate
                      </p>
                    </div>

                    <div className="max-h-96 overflow-y-auto custom-scrollbar">
                      <div className="p-2">
                        {loading ? (
                          <div className="flex justify-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-400"></div>
                          </div>
                        ) : clubs.length > 0 ? (
                          clubs.map((club) => (
                            <Link
                              key={club.id}
                              href={"/registration"}
                              onClick={() => setIsRegistrationOpen(false)}
                              className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/10 transition-all duration-200 group"
                            >
                              <div className="flex-shrink-0 w-12 h-12 bg-white rounded-lg p-1 flex items-center justify-center">
                                <Image
                                  src={club.logo}
                                  alt={club.name}
                                  width={48}
                                  height={48}
                                  className="object-contain max-w-full max-h-full"
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-white text-sm font-medium group-hover:text-orange-400 transition-colors truncate">
                                  {club.name}
                                </p>
                              </div>
                              <svg
                                className="w-4 h-4 text-gray-400 group-hover:text-orange-400 transition-colors"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M9 5l7 7-7 7"
                                />
                              </svg>
                            </Link>
                          ))
                        ) : (
                          <div className="text-center py-8">
                            <p className="text-gray-400 text-sm">
                              No clubs available
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-violet-700 hover:bg-violet-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-violet-500"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {!isMenuOpen ? (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              ) : (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-neutral-900 border-t border-white/20">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-200 hover:text-orange-400 block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 hover:bg-white/10"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}

            {/* Mobile Registration Section */}
            <div className="pt-4 pb-2">
              <button
                onClick={() => setIsRegistrationOpen(!isRegistrationOpen)}
                className="w-full text-white bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 px-4 py-3 rounded-lg text-base font-semibold transition-all duration-200 flex items-center justify-between"
              >
                Registration
                <svg
                  className={`w-5 h-5 transition-transform duration-200 ${
                    isRegistrationOpen ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {/* Mobile Clubs List */}
              {isRegistrationOpen && (
                <div className="mt-2 max-h-80 overflow-y-auto bg-neutral-800 rounded-lg p-2">
                  {loading ? (
                    <div className="flex justify-center py-8">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-400"></div>
                    </div>
                  ) : clubs.length > 0 ? (
                    clubs.map((club) => (
                      <Link
                        key={club.id}
                        href={"/registration"}
                        onClick={() => {
                          setIsRegistrationOpen(false);
                          setIsMenuOpen(false);
                        }}
                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/10 transition-all duration-200"
                      >
                        <div className="flex-shrink-0 w-10 h-10 bg-white rounded-lg p-1 flex items-center justify-center">
                          <Image
                            src={club.logo}
                            alt={club.name}
                            width={40}
                            height={40}
                            className="object-contain max-w-full max-h-full"
                          />
                        </div>
                        <p className="text-white text-sm font-medium flex-1">
                          {club.name}
                        </p>
                      </Link>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-400 text-sm">
                        No clubs available
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
