'use client';

import { useState, type FormEvent } from 'react';
import Image from 'next/image';
import { api, ApiError } from '@/lib/registration/client';

interface ClubLoginModalProps {
  club: { name: string; slug: string; logo: string };
  onSuccess: () => void;
  onClose?: () => void;
}

export default function ClubLoginModal({ club, onSuccess, onClose }: ClubLoginModalProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await api('/api/registration/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug: club.slug, username, password }),
      });
      onSuccess();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Login failed');
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
      <form
        onSubmit={handleSubmit}
        onClick={(e) => e.stopPropagation()}
        className="bg-neutral-900 border border-white/15 rounded-3xl w-full max-w-sm shadow-2xl overflow-hidden"
      >
        <div className="bg-gradient-to-r from-orange-500 to-pink-500 px-6 py-6 text-center relative">
          {onClose && (
            <button type="button" onClick={onClose} className="absolute top-3 right-3 p-1.5 rounded-lg text-white/80 hover:bg-white/20" aria-label="Close">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
          <div className="w-20 h-20 mx-auto rounded-2xl bg-white p-2 mb-3">
            <Image src={club.logo} alt={club.name} width={80} height={80} className="w-full h-full object-contain" />
          </div>
          <h2 className="text-lg font-bold text-white leading-tight">{club.name}</h2>
          <p className="text-white/80 text-xs mt-1">Club registration login</p>
        </div>

        <div className="p-6 space-y-4">
          {error && <div className="bg-red-500/15 border border-red-500/40 text-red-300 text-sm rounded-xl px-4 py-3">{error}</div>}
          <div>
            <label className="block text-sm text-gray-300 mb-1.5">Username</label>
            <input
              autoFocus
              required
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-1.5">Password</label>
            <div className="relative">
              <input
                required
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 pr-16 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <button type="button" onClick={() => setShowPassword((s) => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-white">
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-500 to-pink-500 text-white font-semibold hover:from-orange-600 hover:to-pink-600 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
            Login & Register Players
          </button>
          <p className="text-center text-xs text-gray-500">Don&apos;t have the login? Contact the Olympiad organisers.</p>
        </div>
      </form>
    </div>
  );
}
