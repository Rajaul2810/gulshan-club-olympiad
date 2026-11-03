"use client";

import Link from "next/link";
import Image from "next/image";
import { useEvent } from "@/contexts/EventContext";
import { logosForYear } from "@/data/branding";
import { rulesForYear } from "@/data/rules";

const EXPLORE_LINKS = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Clubs", href: "/club" },
  { name: "Fixtures", href: "/fixtures" },
  { name: "Photo Gallery", href: "/photo-gallery" },
  { name: "Press", href: "/press" },
];

const SOCIALS = [
  {
    name: "Facebook",
    href: "https://www.facebook.com/GulshanClubOympiad",
    icon: "M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.99 3.66 9.13 8.44 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.78-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99C18.34 21.13 22 16.99 22 12z",
  },
  {
    name: "YouTube",
    href: "https://www.youtube.com/@GulshanClubLtd",
    icon: "M23.5 6.2a3 3 0 00-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 00.5 6.2 31 31 0 000 12a31 31 0 00.5 5.8 3 3 0 002.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 002.1-2.1A31 31 0 0024 12a31 31 0 00-.5-5.8zM9.6 15.6V8.4l6.2 3.6-6.2 3.6z",
  },
];

const linkClass = "text-gray-400 hover:text-orange-400 transition-colors duration-200";

function FooterHeading({ children }: { children: React.ReactNode }) {
  return <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">{children}</h3>;
}

function ContactRow({ icon, children }: { icon: string; children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-3">
      <span className="mt-0.5 flex-shrink-0 w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-orange-400">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon} />
        </svg>
      </span>
      <div className="text-sm text-gray-400 leading-relaxed">{children}</div>
    </li>
  );
}

const Footer = () => {
  const { year, eventLabel } = useEvent();
  const logo = logosForYear(year);
  const { rules } = rulesForYear(year);

  const olympiadLinks = [
    { name: "Player Registration", href: "/registration" },
    { name: "Rules & Regulations", href: "/rules_and_regulations" },
    ...(rules ? [{ name: "Download Rules (PDF)", href: rules.file, download: true }] : []),
    { name: "Download Fixtures (PDF)", href: "/Fixture.pdf", download: true },
    { name: "Contact Us", href: "/contact-us" },
  ];

  return (
    <footer className="relative bg-neutral-950 text-white overflow-hidden">
      <div className="h-1 bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500" />
      <div className="absolute -top-24 right-0 w-72 h-72 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 -left-20 w-72 h-72 bg-pink-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10">
          {/* Brand */}
          <div className="lg:col-span-4">
            <Link href="/" className="inline-flex items-center gap-3">
              <Image src="/images/brand-white.png" alt="Gulshan Club" width={56} height={56} className="object-contain" />
              <Image key={logo.badge} src={logo.badge} alt={`Gulshan Club ${eventLabel}`} width={56} height={56} className="w-14 h-14 object-contain" />
            </Link>
            <p className="mt-5 text-sm text-gray-400 leading-relaxed max-w-sm">
              The Inter-Club Sports Carnival bringing the social clubs of Bangladesh together to compete, connect and celebrate.
            </p>
            <div className="mt-6 flex gap-3">
              {SOCIALS.map((s) => (
                <a
                  key={s.name}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.name}
                  className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-300 hover:text-white hover:bg-gradient-to-br hover:from-orange-500 hover:to-pink-500 hover:border-transparent transition-all duration-300"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d={s.icon} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Explore */}
          <div className="lg:col-span-2">
            <FooterHeading>Explore</FooterHeading>
            <ul className="space-y-2.5 text-sm">
              {EXPLORE_LINKS.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className={linkClass}>
                    {l.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Olympiad */}
          <div className="lg:col-span-3">
            <FooterHeading>Olympiad {year}</FooterHeading>
            <ul className="space-y-2.5 text-sm">
              {olympiadLinks.map((l) => (
                <li key={l.name}>
                  {"download" in l ? (
                    <a href={l.href} download className={`${linkClass} inline-flex items-center gap-1.5`}>
                      {l.name}
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                    </a>
                  ) : (
                    <Link href={l.href} className={linkClass}>
                      {l.name}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="lg:col-span-3">
            <FooterHeading>Get in Touch</FooterHeading>
            <ul className="space-y-4">
              <ContactRow icon="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z">
                <a href="mailto:olympiad@gulshanclub.com" className="hover:text-orange-400 transition-colors">
                  olympiad@gulshanclub.com
                </a>
              </ContactRow>
              <ContactRow icon="M3 5a2 2 0 012-2h3.28a1 1 0 01.95.68l1.5 4.49a1 1 0 01-.5 1.21l-2.26 1.13a11.04 11.04 0 005.52 5.52l1.13-2.26a1 1 0 011.21-.5l4.49 1.5a1 1 0 01.68.95V19a2 2 0 01-2 2h-1C9.72 21 3 14.28 3 6V5z">
                <a href="tel:16717" className="hover:text-orange-400 transition-colors">
                  Hotline: 16717
                </a>
              </ContactRow>
              <ContactRow icon="M17.66 16.66L13.41 20.9a2 2 0 01-2.83 0l-4.24-4.24a8 8 0 1111.32 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z">
                Gulshan Club Limited
                <br />
                House 12, Road 86, Gulshan 2, Dhaka 1212
              </ContactRow>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="relative border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm">
          <p className="text-gray-500 text-center sm:text-left">
            © {year} Gulshan Club {eventLabel}. All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            <Link href="/admin" className="text-gray-500 hover:text-orange-400 transition-colors">
              Admin Login
            </Link>
            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="inline-flex items-center gap-1.5 text-gray-400 hover:text-white transition-colors"
              aria-label="Back to top"
            >
              Back to top
              <span className="w-7 h-7 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
              </span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
