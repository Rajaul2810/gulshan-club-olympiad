'use client';

import { useState, FormEvent } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { useEvent } from '@/contexts/EventContext';
import { ErrorMessage, SuccessMessage } from '@/components/ui/ErrorMessage';

export default function AdminEventsPage() {
  const {
    events,
    year,
    selectedEvent,
    isFallback,
    loading,
    createEvent,
    setCurrentEvent,
    setSelectedYear,
  } = useEvent();

  const [newYear, setNewYear] = useState(new Date().getFullYear() + 1);
  const [makeCurrent, setMakeCurrent] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleCreate = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitLoading(true);
    setError(null);
    setSuccess(null);

    const { error: createError } = await createEvent(newYear, makeCurrent);
    if (createError) {
      setError(createError);
    } else {
      setSuccess(`Olympiad ${newYear} created successfully.`);
      setNewYear(newYear + 1);
    }
    setSubmitLoading(false);
  };

  const handleSetCurrent = async (eventYear: number) => {
    if (!confirm(`Make Olympiad ${eventYear} the live/current event?`)) return;
    setError(null);
    setSuccess(null);
    const { error: setErrorMsg } = await setCurrentEvent(eventYear);
    if (setErrorMsg) {
      setError(setErrorMsg);
    } else {
      setSuccess(`Olympiad ${eventYear} is now the current event.`);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Events / Years</h1>
          <p className="text-gray-400">
            Create a year once, then manage fixtures, results, media, and press under that year.
          </p>
        </div>

        {isFallback && (
          <div className="rounded-xl border border-amber-500/40 bg-amber-500/10 p-4 text-amber-200 text-sm">
            Events table not found yet. Run <code className="font-mono">EVENTS_MIGRATION.sql</code> in
            the Supabase SQL editor, then refresh. Until then the year switcher uses a local fallback
            and cannot save new years.
          </div>
        )}

        {error && <ErrorMessage message={error} />}
        {success && <SuccessMessage message={success} />}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Create next year</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-300 mb-2">Year</label>
                <input
                  type="number"
                  min={2019}
                  max={2100}
                  value={newYear}
                  onChange={(e) => setNewYear(Number(e.target.value))}
                  className="w-full rounded-lg bg-neutral-900 border border-white/20 px-4 py-3 text-white"
                  required
                />
              </div>
              <label className="flex items-center gap-3 text-sm text-gray-300">
                <input
                  type="checkbox"
                  checked={makeCurrent}
                  onChange={(e) => setMakeCurrent(e.target.checked)}
                  className="rounded border-white/20"
                />
                Set as current live event
              </label>
              <button
                type="submit"
                disabled={submitLoading || isFallback}
                className="w-full rounded-xl bg-gradient-to-r from-orange-500 to-pink-500 px-4 py-3 font-semibold text-white disabled:opacity-50"
              >
                {submitLoading ? 'Creating...' : `Create Olympiad ${newYear}`}
              </button>
            </form>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-white mb-2">Currently managing</h2>
            <p className="text-3xl font-bold text-orange-400 mb-6">
              {loading ? '...' : selectedEvent?.name || year}
            </p>
            <p className="text-sm text-gray-400">
              Use the year switcher in the admin header to change which year fixtures, results,
              media, and press are loaded and saved into.
            </p>
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-white/10">
            <h2 className="text-lg font-semibold text-white">All events</h2>
          </div>
          <div className="divide-y divide-white/10">
            {loading ? (
              <div className="p-6 text-gray-400">Loading events...</div>
            ) : (
              events.map((event) => (
                <div
                  key={event.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-6 py-4"
                >
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="text-white font-semibold text-lg">{event.name}</h3>
                      {event.is_current && (
                        <span className="rounded bg-orange-500/20 text-orange-300 text-xs px-2 py-1">
                          Current
                        </span>
                      )}
                      {event.year === year && (
                        <span className="rounded bg-white/10 text-gray-300 text-xs px-2 py-1">
                          Selected
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-400 mt-1 capitalize">Status: {event.status}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedYear(event.year)}
                      className="rounded-lg bg-white/10 hover:bg-white/20 px-4 py-2 text-sm text-white"
                    >
                      Manage
                    </button>
                    {!event.is_current && !isFallback && (
                      <button
                        type="button"
                        onClick={() => handleSetCurrent(event.year)}
                        className="rounded-lg bg-orange-500/20 hover:bg-orange-500/30 px-4 py-2 text-sm text-orange-300"
                      >
                        Set current
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
