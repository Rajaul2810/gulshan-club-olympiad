'use client';

import { useState, FormEvent } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { useResults } from '@/hooks/useResults';
import { useClubs } from '@/hooks/useClubs';
import { sportsCategories } from '@/components/SportsCategory';
import { LoadingSpinner, LoadingOverlay } from '@/components/ui/LoadingSpinner';
import { ErrorMessage, SuccessMessage } from '@/components/ui/ErrorMessage';
import Image from 'next/image';

const AdminResultsPage = () => {
  const { results, loading, error, addResult, deleteResult } = useResults();
  const { clubs } = useClubs();
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedSport, setSelectedSport] = useState('');
  const [winnerId, setWinnerId] = useState('');
  const [winnerType, setWinnerType] = useState('');
  const [notes, setNotes] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  const [filterSport, setFilterSport] = useState('all');

  // Group results by sport
  const resultsBySport = results.reduce((acc, result) => {
    if (!acc[result.sport]) {
      acc[result.sport] = [];
    }
    acc[result.sport].push(result);
    return acc;
  }, {} as Record<string, typeof results>);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitLoading(true);
    setSubmitError(null);
    setSubmitSuccess(null);

    try {
      if (!selectedSport || !winnerId) {
        throw new Error('Please fill in all required fields');
      }

      const { error: addError } = await addResult({
        sport: selectedSport,
        winner_id: winnerId,
        winner_type: winnerType || null,
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

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this result?')) return;

    setDeleteLoading(id);
    const { error: delError } = await deleteResult(id);

    if (delError) {
      alert(`Failed to delete: ${delError}`);
    }
    setDeleteLoading(null);
  };

  const resetForm = () => {
    setSelectedSport('');
    setWinnerId('');
    setWinnerType('');
    setNotes('');
    setSubmitError(null);
    setSubmitSuccess(null);
  };

  // const filteredResults = results.filter((result) => {
  //   if (filterSport === 'all') return true;
  //   return result.sport === filterSport;
  // });


  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Results Management</h1>
            <p className="text-gray-400">Add match results with winner club</p>
          </div>
          
          <button
            onClick={() => setIsAddModalOpen(true)}
            disabled={loading || clubs.length < 1}
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

        {clubs.length < 1 && (
          <div className="bg-yellow-500/20 border border-yellow-500/50 rounded-xl p-4">
            <p className="text-yellow-300 text-sm">
              ℹ️ You need at least 1 club to add results. Please add clubs first.
            </p>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white/5 backdrop-blur-md rounded-xl p-4 border border-white/10">
            <p className="text-gray-400 text-sm mb-1">Total Results</p>
            <p className="text-3xl font-bold text-white">
              {loading ? '...' : results.length}
            </p>
          </div>
          <div className="bg-white/5 backdrop-blur-md rounded-xl p-4 border border-white/10">
            <p className="text-gray-400 text-sm mb-1">Sports Categories</p>
            <p className="text-3xl font-bold text-blue-400">
              {loading ? '...' : Object.keys(resultsBySport).length}
            </p>
          </div>
          <div className="bg-white/5 backdrop-blur-md rounded-xl p-4 border border-white/10">
            <p className="text-gray-400 text-sm mb-1">Latest Result</p>
            <p className="text-lg font-bold text-green-400">
              {loading ? '...' : results.length > 0 ? new Date(results[0].created_at).toLocaleDateString() : 'None'}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10">
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => setFilterSport('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                filterSport === 'all'
                  ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white'
                  : 'bg-white/10 text-gray-400 hover:bg-white/20'
              }`}
            >
              All Sports
            </button>
            {Object.keys(resultsBySport).map((sport) => (
              <button
                key={sport}
                onClick={() => setFilterSport(sport)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  filterSport === sport
                    ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white'
                    : 'bg-white/10 text-gray-400 hover:bg-white/20'
                }`}
              >
                {sportsCategories.find(s => s.name === sport)?.icon || '🏆'} {sport}
              </button>
            ))}
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
          <div className="space-y-6">
            {Object.entries(resultsBySport).map(([sport, sportResults]) => (
              <div key={sport} className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10">
                <h3 className="text-white font-bold text-xl mb-4 flex items-center gap-2">
                  {sportsCategories.find(s => s.name === sport)?.icon || '🏆'} {sport}
                  <span className="text-gray-400 text-sm font-normal">({sportResults.length} results)</span>
                </h3>
                
                <div className="space-y-4">
                  {sportResults.map((result) => (
                    <div
                      key={result.id}
                      className="relative bg-white/10 rounded-xl p-4 border border-white/20 hover:border-white/30 transition-all"
                    >
                      {deleteLoading === result.id && <LoadingOverlay message="Deleting..." />}
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          {/* Winner */}
                          <div className="flex items-center gap-2">
                            <span className="text-yellow-400 text-xl">🏆</span>
                            <div className="flex items-center gap-2">
                              {result.winner?.logo && (
                                <Image
                                  width={32}
                                  height={32}
                                  src={result.winner.logo} 
                                  alt={result.winner.name}
                                  className="w-8 h-8 rounded-full object-cover"
                                />
                              )}
                              <span className="text-white font-semibold">{result.winner?.name || 'Unknown'}</span>
                            </div>
                          </div>
                          
                          {/* Winner Type */}
                          {result.winner_type && (
                            <div className="flex items-center gap-2">
                              <span className="text-orange-400 text-sm font-medium bg-orange-500/20 px-3 py-1 rounded-full">
                                {result.winner_type}
                              </span>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-3">
                          {result.notes && (
                            <p className="text-gray-400 text-sm italic max-w-xs truncate">{result.notes}</p>
                          )}
                          
                          <div className="text-gray-400 text-xs">
                            {new Date(result.created_at).toLocaleDateString()}
                          </div>
                          
                          <button
                            onClick={() => handleDelete(result.id)}
                            disabled={deleteLoading === result.id}
                            className="px-3 py-1 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors text-sm disabled:opacity-50"
                          >
                            {deleteLoading === result.id ? <LoadingSpinner size="sm" /> : 'Delete'}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && results.length === 0 && (
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

                {/* Sport Category */}
                <div>
                  <label className="block text-white font-medium mb-2">Sport Category *</label>
                  <select
                    value={selectedSport}
                    onChange={(e) => setSelectedSport(e.target.value)}
                    required
                    disabled={submitLoading}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-orange-400 transition-all disabled:opacity-50"
                  >
                    <option value="" className="bg-neutral-900">Select sport</option>
                    {sportsCategories.map((sport, index) => (
                      <option key={index} value={sport.name} className="bg-neutral-900">
                        {sport.icon} {sport.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Winner Selection */}
                <div>
                  <label className="block text-white font-medium mb-2">Winner Club *</label>
                  <select
                    value={winnerId}
                    onChange={(e) => setWinnerId(e.target.value)}
                    required
                    disabled={submitLoading}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-orange-400 transition-all disabled:opacity-50"
                  >
                    <option value="" className="bg-neutral-900">Select winner</option>
                    {clubs.map((club) => (
                      <option key={club.id} value={club.id} className="bg-neutral-900">
                        {club.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Winner Type */}
                <div>
                  <label className="block text-white font-medium mb-2">Winner Type</label>
                  <input
                    type="text"
                    value={winnerType}
                    onChange={(e) => setWinnerType(e.target.value)}
                    disabled={submitLoading}
                    placeholder="e.g., Champion, Runner-up, First Place"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-orange-400 transition-all disabled:opacity-50"
                  />
                </div>

                {/* Match Preview */}
                {winnerId && selectedSport && (
                  <div className="bg-gradient-to-r from-orange-500/20 to-pink-500/20 rounded-xl p-4 border border-orange-400/30">
                    <p className="text-white font-medium text-center mb-2">
                      🏆 {clubs.find(c => c.id === winnerId)?.name}
                      {winnerType && ` - ${winnerType}`}
                    </p>
                    <p className="text-gray-400 text-sm text-center">{selectedSport}</p>
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
                      This will add a result showing the winner club and winner type for the selected sport.
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
                    disabled={submitLoading || !selectedSport || !winnerId}
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

