'use client';

import Link from 'next/link';
import { useEvent } from '@/contexts/EventContext';
import { rulesForYear } from '@/data/rules';
import RulesBook from '@/components/RulesBook';

const HIGHLIGHTS = [
  { icon: '📘', title: 'Read like a book', text: 'Turn pages by dragging a corner, swiping, or using the arrow keys.' },
  { icon: '⬇️', title: 'Download anytime', text: 'Save the full brochure as a PDF to read offline or print.' },
  { icon: '🏅', title: 'Every sport covered', text: 'Eligibility, team sizes, formats and scoring for each event.' },
];

export default function RulesPage() {
  const { year: selectedYear } = useEvent();
  const { year, rules } = rulesForYear(selectedYear);

  return (
    <div className="min-h-screen bg-neutral-900">
      <section className="relative bg-gradient-to-br from-neutral-900 via-orange-950 to-neutral-800 py-14 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-10 left-10 w-40 h-40 bg-gradient-to-tr from-orange-500 to-pink-500 opacity-20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-10 w-56 h-56 bg-gradient-to-br from-yellow-400 to-red-500 opacity-10 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-5xl mx-auto text-center">
          <span className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-orange-300 px-4 py-1.5 rounded-full text-sm font-semibold mb-5">
            <span className="w-2 h-2 bg-orange-400 rounded-full" />
            Gulshan Club Olympiad {year}
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">Rules &amp; Regulations</h1>
          <div className="w-24 h-1 bg-gradient-to-r from-orange-500 to-pink-500 mx-auto rounded-full mt-5 mb-6" />
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            The official rules brochure for all clubs, athletes and team managers. Please read it carefully before registering your players.
          </p>
          {year !== selectedYear && (
            <p className="mt-4 text-sm text-amber-300">The {selectedYear} brochure is not available, showing the {year} rules.</p>
          )}
        </div>
      </section>

      <section className="px-2 sm:px-6 lg:px-8 py-10">
        <div className="max-w-6xl mx-auto">
          {rules ? (
            <RulesBook key={rules.file} file={rules.file} title={rules.title} />
          ) : (
            <p className="text-center text-gray-400 py-20">The rules brochure will be published soon.</p>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-10">
            {HIGHLIGHTS.map((h) => (
              <div key={h.title} className="bg-white/5 border border-white/10 rounded-2xl p-5">
                <div className="text-2xl mb-2">{h.icon}</div>
                <h3 className="text-white font-semibold">{h.title}</h3>
                <p className="text-gray-400 text-sm mt-1">{h.text}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center text-gray-400 text-sm">
            Questions about the rules?{' '}
            <Link href="/contact-us" className="text-orange-400 hover:text-orange-300 font-medium">
              Contact the organisers
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
