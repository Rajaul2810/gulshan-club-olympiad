'use client';

import { useState, FormEvent } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { useResults } from '@/hooks/useResults';
import { useFixtures } from '@/hooks/useFixtures';
import { useClubs } from '@/hooks/useClubs';
import { LoadingSpinner, LoadingOverlay } from '@/components/ui/LoadingSpinner';
import { ErrorMessage, SuccessMessage } from '@/components/ui/ErrorMessage';

const AdminResultsPage = () => {
  const { results, loading, error, addResult, deleteResult } = useResults();
  const { fixtures, loading: fixturesLoading } = useFixtures();
  const { clubs } = useClubs();
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedFixture, setSelectedFixture] = useState('');
  const [team1Score, setTeam1Score] = useState('');
  const [team2Score, setTeam2Score] = useState('');
  const [notes, setNotes] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState('all');

  // Get only scheduled or ongoing fixtures (not completed or cancelled)
  const availableFixtures = fixtures.filter(
    (f) => f.status === 'scheduled' || f.status === 'ongoing'
  );

  // Get fixture details
  const selectedFixtureData = fixtures.find((f) => f.id === selectedFixture);
  const team1 = clubs.find((c) => c.id === selectedFixtureData?.team1_id);
  const team2 = clubs.find((c) => c.id === selectedFixtureData?.team2_id);

  // Calculate winner based on scores
  const getWinnerId = () => {
    const score1 = parseInt(team1Score);
    const score2 = parseInt(team2Score);
    
    if (isNaN(score1) || isNaN(score2)) return null;
    
    if (score1 > score2) return selectedFixtureData?.team1_id || null;
    if (score2 > score1) return selectedFixtureData?.team2_id || null;
    return null; // Draw
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitLoading(true);
    setSubmitError(null);
    setSubmitSuccess(null);

    try {
      if (!selectedFixture) {
        throw new Error('Please select a fixture');
      }

      const score1 = parseInt(team1Score);
      const score2 = parseInt(team2Score);

      if (isNaN(score1) || isNaN(score2)) {
        throw new Error('Please enter valid scores');
      }

      if (score1 < 0 || score2 < 0) {
        throw new Error('Scores cannot be negative');
      }

      const winnerId = getWinnerId();

      const { error: addError } = await addResult({
        fixture_id: selectedFixture,
        team1_score: score1,
        team2_score: score2,
        winner_id: winnerId,
        notes: notes || null,
      });

      if (addError) {
        throw new Error(addError);
      }

      setSubmitSuccess('Result added successfully!');
      setTimeout(() => {
        setIsAddModalOpen(false);
        resetForm();
      }, 1500);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Failed to add result');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDelete = async (id: string, fixtureId: string) => {
    if (!confirm('Are you sure you want to delete this result? The fixture will be marked as scheduled again.')) return;

    setDeleteLoading(id);
    const { error: delError } = await deleteResult(id, fixtureId);

    if (delError) {
      alert(`Failed to delete: ${delError}`);
    }
    setDeleteLoading(null);
  };

  const resetForm = () => {
    setSelectedFixture('');
    setTeam1Score('');
    setTeam2Score('');
    setNotes('');
    setSubmitError(null);
    setSubmitSuccess(null);
  };

  const filteredResults = results.filter((result) => {
    if (filterStatus === 'all') return true;
    if (filterStatus === 'with-winner') return result.winner_id !== null;
    if (filterStatus === 'draw') return result.winner_id === null;
    return true;
  });


  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Results Management</h1>
            <p className="text-gray-400">Manage match results and update fixture status</p>
          </div>
          
          <button
            onClick={() => setIsAddModalOpen(true)}
            disabled={loading || availableFixtures.length === 0}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white font-semibold rounded-xl hover:from-orange-600 hover:to-pink-600 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Result
          </button>
        </div>

        {/* Global Error */}
        {error && <ErrorMessage message={error} />}

        {availableFixtures.length === 0 && !fixturesLoading && (
          <div className="bg-yellow-500/20 border border-yellow-500/50 rounded-xl p-4">
            <p className="text-yellow-300 text-sm">
              ℹ️ No fixtures available for results. All fixtures are either completed or cancelled.
            </p>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="bg-white/5 backdrop-blur-md rounded-xl p-4 border border-white/10">
            <p className="text-gray-400 text-sm mb-1">Total Results</p>
            <p className="text-3xl font-bold text-white">
              {loading ? '...' : results.length}
            </p>
          </div>
          <div className="bg-white/5 backdrop-blur-md rounded-xl p-4 border border-white/10">
            <p className="text-gray-400 text-sm mb-1">With Winner</p>
            <p className="text-3xl font-bold text-green-400">
              {loading ? '...' : results.filter(r => r.winner_id).length}
            </p>
          </div>
          <div className="bg-white/5 backdrop-blur-md rounded-xl p-4 border border-white/10">
            <p className="text-gray-400 text-sm mb-1">Draws</p>
            <p className="text-3xl font-bold text-gray-400">
              {loading ? '...' : results.filter(r => !r.winner_id).length}
            </p>
          </div>
          <div className="bg-white/5 backdrop-blur-md rounded-xl p-4 border border-white/10">
            <p className="text-gray-400 text-sm mb-1">Pending</p>
            <p className="text-3xl font-bold text-blue-400">
              {fixturesLoading ? '...' : availableFixtures.length}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10">
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                filterStatus === 'all'
                  ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white'
                  : 'bg-white/10 text-gray-400 hover:bg-white/20'
              }`}
            >
              All Results
            </button>
            <button
              onClick={() => setFilterStatus('with-winner')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                filterStatus === 'with-winner'
                  ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white'
                  : 'bg-white/10 text-gray-400 hover:bg-white/20'
              }`}
            >
              With Winner
            </button>
            <button
              onClick={() => setFilterStatus('draw')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                filterStatus === 'draw'
                  ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white'
                  : 'bg-white/10 text-gray-400 hover:bg-white/20'
              }`}
            >
              Draws
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        )}

        {/* Results List */}
        {!loading && (
          <div className="space-y-4">
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {filteredResults.map((result: any) => {
              const fixture = result.fixture;
              const team1Name = fixture?.team1?.[0]?.name || 'Unknown Team';
              const team2Name = fixture?.team2?.[0]?.name || 'Unknown Team';
              const winnerName = result.winner?.[0]?.name;

              return (  
                <div
                  key={result.id}
                  className="relative bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all"
                >
                  {deleteLoading === result.id && <LoadingOverlay message="Deleting..." />}

                  <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                    {/* Date & Sport */}
                    <div className="lg:w-48">
                      <p className="text-orange-400 font-bold text-lg mb-1">
                        {fixture?.date ? new Date(fixture.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        }) : 'N/A'}
                      </p>
                      <p className="text-white text-sm">{fixture?.sport || 'Unknown Sport'}</p>
                      <p className="text-gray-400 text-xs mt-1">📍 {fixture?.venue || 'TBA'}</p>
                    </div>

                    {/* Scores */}
                    <div className="flex-1 flex items-center justify-center gap-4">
                      <div className={`text-center flex-1 ${result.winner_id === fixture?.team1_id ? 'scale-105' : ''}`}>
                        <p className={`font-bold text-lg mb-1 ${result.winner_id === fixture?.team1_id ? 'text-orange-400' : 'text-white'}`}>
                          {team1Name}
                        </p>
                        <p className="text-4xl font-bold text-white">{result.team1_score}</p>
                      </div>
                      
                      <div className="text-2xl font-bold text-gray-500">-</div>
                      
                      <div className={`text-center flex-1 ${result.winner_id === fixture?.team2_id ? 'scale-105' : ''}`}>
                        <p className={`font-bold text-lg mb-1 ${result.winner_id === fixture?.team2_id ? 'text-orange-400' : 'text-white'}`}>
                          {team2Name}
                        </p>
                        <p className="text-4xl font-bold text-white">{result.team2_score}</p>
                      </div>
                    </div>

                    {/* Winner Badge & Actions */}
                    <div className="lg:w-56 text-center lg:text-right space-y-3">
                      {winnerName ? (
                        <div className="flex flex-col items-center lg:items-end gap-2">
                          <span className="text-yellow-400 text-2xl">🏆</span>
                          <span className="text-white font-semibold text-sm">{winnerName}</span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center lg:items-end gap-2">
                          <span className="text-gray-400 text-2xl">🤝</span>
                          <span className="text-gray-300 font-semibold text-sm">Draw</span>
                        </div>
                      )}

                      {result.notes && (
                        <p className="text-gray-400 text-xs italic">{result.notes}</p>
                      )}
                      
                      {/* Actions */}
                      <div className="flex gap-2 justify-center lg:justify-end">
                        <button
                          onClick={() => handleDelete(result.id, result.fixture_id)}
                          disabled={deleteLoading === result.id}
                          className="px-3 py-1 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors text-sm disabled:opacity-50"
                        >
                          {deleteLoading === result.id ? <LoadingSpinner size="sm" /> : 'Delete'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredResults.length === 0 && (
          <div className="text-center py-12 bg-white/5 rounded-2xl">
            <p className="text-gray-400 text-lg">No results found</p>
            <p className="text-gray-500 text-sm mt-2">Add your first match result to get started</p>
          </div>
        )}

        {/* Add Result Modal */}
        {isAddModalOpen && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-neutral-900 rounded-2xl border border-white/20 w-full max-w-2xl max-h-[90vh] overflow-y-auto custom-scrollbar">
              {/* Modal Header */}
              <div className="sticky top-0 bg-gradient-to-r from-orange-500 to-pink-500 p-6 flex items-center justify-between z-10">
                <h2 className="text-2xl font-bold text-white">Add Match Result</h2>
                <button
                  onClick={() => {
                    setIsAddModalOpen(false);
                    resetForm();
                  }}
                  disabled={submitLoading}
                  className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors disabled:opacity-50"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Modal Content */}
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {submitError && <ErrorMessage message={submitError} />}
                {submitSuccess && <SuccessMessage message={submitSuccess} />}

                {/* Select Fixture */}
                <div>
                  <label className="block text-white font-medium mb-2">Select Fixture *</label>
                  <select
                    value={selectedFixture}
                    onChange={(e) => setSelectedFixture(e.target.value)}
                    required
                    disabled={submitLoading || fixturesLoading}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-orange-400 transition-all disabled:opacity-50"
                  >
                    <option value="" className="bg-neutral-900">Select a fixture</option>
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    {availableFixtures.map((fixture: any) => {
                      const t1 = clubs.find(c => c.id === fixture.team1_id);
                      const t2 = clubs.find(c => c.id === fixture.team2_id);
                      return (
                        <option key={fixture.id} value={fixture.id} className="bg-neutral-900">
                          {fixture.sport} - {t1?.name || 'Team 1'} vs {t2?.name || 'Team 2'} ({new Date(fixture.date).toLocaleDateString()})
                        </option>
                      );
                    })}
                  </select>
                </div>

                {/* Match Preview */}
                {selectedFixtureData && (
                  <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <p className="text-gray-400 text-sm mb-2">Match Details:</p>
                    <div className="flex items-center justify-between gap-4">
                      <div className="text-center flex-1">
                        <p className="text-white font-bold">{team1?.name || 'Team 1'}</p>
                      </div>
                      <div className="text-gray-500 font-bold">VS</div>
                      <div className="text-center flex-1">
                        <p className="text-white font-bold">{team2?.name || 'Team 2'}</p>
                      </div>
                    </div>
                    <p className="text-gray-400 text-xs mt-2 text-center">
                      {selectedFixtureData.sport} • {new Date(selectedFixtureData.date).toLocaleDateString()}
                    </p>
                  </div>
                )}

                {/* Scores */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-white font-medium mb-2">
                      {team1?.name || 'Team 1'} Score *
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={team1Score}
                      onChange={(e) => setTeam1Score(e.target.value)}
                      required
                      disabled={submitLoading || !selectedFixture}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-orange-400 transition-all disabled:opacity-50"
                      placeholder="0"
                    />
                  </div>

                  <div>
                    <label className="block text-white font-medium mb-2">
                      {team2?.name || 'Team 2'} Score *
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={team2Score}
                      onChange={(e) => setTeam2Score(e.target.value)}
                      required
                      disabled={submitLoading || !selectedFixture}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-orange-400 transition-all disabled:opacity-50"
                      placeholder="0"
                    />
                  </div>
                </div>

                {/* Winner Preview */}
                {team1Score && team2Score && selectedFixture && (
                  <div className="bg-gradient-to-r from-orange-500/20 to-pink-500/20 rounded-xl p-4 border border-orange-400/30">
                    <p className="text-white font-medium text-center">
                      {parseInt(team1Score) > parseInt(team2Score) && (
                        <>🏆 Winner: {team1?.name}</>
                      )}
                      {parseInt(team2Score) > parseInt(team1Score) && (
                        <>🏆 Winner: {team2?.name}</>
                      )}
                      {parseInt(team1Score) === parseInt(team2Score) && (
                        <>🤝 Match Draw</>
                      )}
                    </p>
                  </div>
                )}

                {/* Notes */}
                <div>
                  <label className="block text-white font-medium mb-2">Additional Notes</label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                    disabled={submitLoading}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-orange-400 transition-all resize-none disabled:opacity-50"
                    placeholder="Any special notes about the match (optional)"
                  ></textarea>
                </div>

                {/* Info */}
                <div className="bg-blue-500/20 border border-blue-500/50 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-blue-300 text-sm">
                      Adding a result will automatically mark the fixture as &quot;Completed&quot; and update it in real-time.
                    </p>
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddModalOpen(false);
                      resetForm();
                    }}
                    disabled={submitLoading}
                    className="flex-1 px-6 py-3 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-colors font-semibold disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitLoading || !selectedFixture || !team1Score || !team2Score}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-xl hover:from-orange-600 hover:to-pink-600 transition-all font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {submitLoading && <LoadingSpinner size="sm" />}
                    {submitLoading ? 'Adding Result...' : 'Add Result'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminResultsPage;

