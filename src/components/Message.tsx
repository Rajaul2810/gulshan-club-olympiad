"use client";

import { useState } from "react";
import Image from "next/image";
import { useEvent } from "@/contexts/EventContext";
import { messagesForYear, type LeaderMessage } from "@/data/messages";

const QuoteIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
  </svg>
);

function MessageCard({ msg, year, reverse }: { msg: LeaderMessage; year: number; reverse: boolean }) {
  const [expanded, setExpanded] = useState(false);
  const [first, ...rest] = msg.paragraphs;

  return (
    <article className="relative group">
      <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-pink-500/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500" />

      <div className="relative bg-white/10 backdrop-blur-md rounded-3xl p-6 sm:p-8 lg:p-12 border border-white/20 shadow-2xl overflow-hidden">
        <QuoteIcon className="absolute -top-2 right-6 w-28 h-28 text-white/5 pointer-events-none" />

        <div className={`flex flex-col gap-8 lg:gap-12 items-center lg:items-start ${reverse ? "lg:flex-row-reverse" : "lg:flex-row"}`}>
          {/* Portrait */}
          <div className="flex-shrink-0 flex flex-col items-center text-center lg:sticky lg:top-24">
            <div className="relative">
              <div className="absolute -inset-3 bg-gradient-to-r from-orange-500 to-pink-500 rounded-3xl opacity-30 blur-lg group-hover:opacity-50 transition-opacity duration-500" />
              <Image
                src={msg.image}
                alt={msg.name}
                width={224}
                height={224}
                className="relative rounded-2xl border-4 border-white/30 shadow-2xl object-cover object-top w-44 h-44 sm:w-52 sm:h-52 lg:w-56 lg:h-56 bg-neutral-700"
                priority
              />
            </div>
            <p className="mt-5 text-white font-bold text-lg">{msg.name}</p>
            <p className="text-orange-300 text-sm max-w-[14rem]">{msg.designation}</p>
          </div>

          {/* Message */}
          <div className="flex-1 min-w-0 text-center lg:text-left">
            <span className="inline-block text-xs font-semibold uppercase tracking-widest text-orange-300/90 mb-2">
              Olympiad {year}
            </span>
            <h3 className="text-2xl lg:text-3xl font-bold text-white">{msg.title}</h3>
            <div className="w-16 h-1 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full mt-3 mb-6 mx-auto lg:mx-0" />

            {msg.greeting && <p className="text-lg lg:text-xl font-semibold text-orange-200 mb-4">{msg.greeting}</p>}

            <div className="text-gray-200 leading-relaxed text-base lg:text-lg space-y-4">
              <p>{first}</p>
              {expanded && rest.map((p) => <p key={p.slice(0, 40)}>{p}</p>)}
            </div>

            {expanded && (
              <blockquote className="mt-6 flex gap-3 items-start text-left bg-gradient-to-r from-orange-500/15 to-pink-500/10 border-l-4 border-orange-400 rounded-r-xl px-5 py-4">
                <QuoteIcon className="w-5 h-5 text-orange-400 flex-shrink-0 mt-1" />
                <p className="text-white font-semibold text-base lg:text-lg">{msg.closing}</p>
              </blockquote>
            )}

            <div className="mt-6 flex justify-center lg:justify-start">
              <button
                onClick={() => setExpanded((v) => !v)}
                aria-expanded={expanded}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:from-pink-500 hover:to-orange-500 transition-all duration-300 hover:scale-105 shadow-lg"
              >
                {expanded ? "Show Less" : "Read Full Message"}
                <svg className={`w-4 h-4 transition-transform duration-300 ${expanded ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

const MessageSection = () => {
  const { year: selectedYear } = useEvent();
  const { year, messages } = messagesForYear(selectedYear);

  if (messages.length === 0) return null;

  return (
    <section className="relative bg-neutral-800 py-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-tr from-orange-500 to-pink-500 opacity-20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-gradient-to-br from-yellow-400 to-orange-500 opacity-15 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 w-24 h-24 bg-gradient-to-tl from-blue-400 to-cyan-400 opacity-10 rounded-full blur-2xl -translate-x-1/2 -translate-y-1/2" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-orange-300 px-4 py-1.5 rounded-full text-sm font-semibold mb-4">
            <span className="w-2 h-2 bg-orange-400 rounded-full" />
            Gulshan Club Olympiad {year}
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">Leadership Messages</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-orange-500 to-pink-500 mx-auto rounded-full mt-5" />
        </div>

        <div key={year} className="grid gap-12 lg:gap-16">
          {messages.map((msg, i) => (
            <MessageCard key={msg.name} msg={msg} year={year} reverse={i % 2 === 1} />
          ))}
        </div>

        <div className="text-center mt-16">
          <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-md rounded-full px-8 py-4 border border-white/20">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
            <span className="text-white font-semibold">Join us in celebrating the spirit of sportsmanship</span>
            <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default MessageSection;
