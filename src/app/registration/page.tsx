'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEvent } from '@/contexts/EventContext';
import { useClubs } from '@/hooks/useClubs';
import ClubLoginModal from '@/components/registration/ClubLoginModal';

type ClubCard = { name: string; slug: string; logo: string };

const STEPS = [
  { icon: '🏛️', title: 'Select your club', text: 'Find your club in the list below.' },
  { icon: '🔐', title: 'Log in', text: 'Use the username & password given by the organisers.' },
  { icon: '📝', title: 'Register players', text: 'Add, edit or remove players any time before the deadline.' },
];

function formatDate(date: string) {
  return new Date(`${date}T00:00:00`).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
}

const RegistrationPage = () => {
  const router = useRouter();
  const { currentEvent, eventLabel } = useEvent();
  const { clubs, loading } = useClubs();
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<ClubCard | null>(null);

  const deadline = currentEvent?.registration_deadline ?? null;
  const isOpen = !deadline || new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Dhaka' }).format(new Date()) <= deadline;

  const visibleClubs = useMemo(
    () =>
      clubs
        .filter((c) => c.status === 'active')
        .filter((c) => c.name.toLowerCase().includes(search.toLowerCase())),
    [clubs, search]
  );

  return (
    <div className="min-h-screen bg-neutral-900">
      <main>
        <section className="relative bg-gradient-to-br from-neutral-900 via-orange-950 to-neutral-800 py-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-20 left-10 w-40 h-40 bg-gradient-to-tr from-orange-500 to-pink-500 opacity-20 rounded-full blur-3xl" />
            <div className="absolute bottom-10 right-10 w-56 h-56 bg-gradient-to-br from-yellow-400 to-red-500 opacity-10 rounded-full blur-3xl" />
          </div>

          <div className="relative max-w-5xl mx-auto text-center">
            <div
              className={`inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium border mb-6 ${
                isOpen ? 'bg-green-500/15 text-green-300 border-green-500/30' : 'bg-red-500/15 text-red-300 border-red-500/30'
              }`}
            >
              <span className={`w-2.5 h-2.5 rounded-full animate-pulse ${isOpen ? 'bg-green-400' : 'bg-red-400'}`} />
              {isOpen ? 'Registration Open' : 'Registration Closed'}
              {deadline && <span className="text-white/70">· {isOpen ? 'closes' : 'closed'} {formatDate(deadline)}</span>}
            </div>

            <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">Club Player Registration</h1>
            <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto">
              {isOpen
                ? `Register your club's players and team managers for ${eventLabel}.`
                : `Registration for ${eventLabel} is closed. Clubs can still log in to view their registered players.`}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-10 text-left">
              {STEPS.map((s, i) => (
                <div key={s.title} className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">{s.icon}</span>
                    <span className="text-xs font-bold text-orange-400">STEP {i + 1}</span>
                  </div>
                  <h3 className="text-white font-semibold">{s.title}</h3>
                  <p className="text-gray-400 text-sm mt-1">{s.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-14 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Select Your Club</h2>
                <p className="text-gray-400 mt-1">Click your club to log in.</p>
              </div>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search club..."
                className="w-full sm:w-72 px-4 py-2.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div key={i} className="h-44 rounded-2xl bg-white/5 animate-pulse" />
                ))}
              </div>
            ) : visibleClubs.length === 0 ? (
              <p className="text-center text-gray-400 py-16">No clubs found.</p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {visibleClubs.map((club) => (
                  <button
                    key={club.id}
                    onClick={() => setSelected({ name: club.name, slug: club.slug, logo: club.logo })}
                    className="group bg-white/5 hover:bg-white/10 border border-white/10 hover:border-orange-400/60 rounded-2xl p-5 flex flex-col items-center text-center transition-all hover:-translate-y-1"
                  >
                    <div className="w-20 h-20 rounded-xl bg-white p-2 mb-3">
                      <Image src={club.logo} alt={club.name} width={80} height={80} className="w-full h-full object-contain" />
                    </div>
                    <span className="text-white text-sm font-semibold leading-tight">{club.name}</span>
                    <span className="mt-3 text-xs text-orange-400 opacity-80 group-hover:opacity-100">Login →</span>
                  </button>
                ))}
              </div>
            )}

            <div className="mt-14 text-center text-gray-400 text-sm">
              Need help or your club&apos;s login?{' '}
              <Link href="/contact-us" className="text-orange-400 hover:text-orange-300 font-medium">
                Contact the organisers
              </Link>
            </div>
          </div>
        </section>
      </main>

      {selected && (
        <ClubLoginModal
          club={selected}
          onClose={() => setSelected(null)}
          onSuccess={() => router.push(`/registration/${selected.slug}`)}
        />
      )}
    </div>
  );
};

export default RegistrationPage;
